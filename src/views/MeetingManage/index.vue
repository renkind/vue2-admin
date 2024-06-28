<template>
	<div class="app-container">
		<TablePage
			:listData="listData"
			:listLoading="listLoading"
			:columns="columns"
			:searchParams="searchParams"
			:pageNo="queryParams.pageNo"
			:pageSize="queryParams.pageSize"
			:totalCount="total"
			:showBatch="true"
			@selectionRow="handleSelectionChange"
			@query="submit"
		>
			<template v-slot:frameFlag="{ scope }">
				<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
			</template>

			<!-- 0:未开始1:会议中2:结束3已归档4已取消5草稿 -->

			<template v-slot:status="{ scope }">
				<span v-if="scope.meetingState == 5" style="color: #ff2222">草稿</span>
				<span v-else-if="scope.meetingState == 0" style="color: #ccc">未开始</span>
				<span v-else-if="scope.meetingState == 1" style="color: blue">进行中</span>
				<span v-else-if="scope.meetingState == 2" style="color: green">已结束</span>
				<span v-else-if="scope.meetingState == 3" style="color: orange">已归档</span>
				<span v-else style="color: #333">已取消</span>
			</template>

			<template v-slot:time="{ scope }">
				{{ scope.meetingDate + " " + scope.startTime + "-" + scope.endTime }}
			</template>
			<template v-slot:createTime="{ scope }">
				{{ scope.createTime | formatDate("yyyy-MM-dd hh:mm:ss") }}
			</template>

			<template v-slot:tool="{ scope }">
				<el-button type="text" size="small" v-hasPermi="['meeting:user:view']" @click="toDetail(scope)">查看</el-button>
				<el-button
					type="text"
					size="small"
					v-hasPermi="['meeting:user:push']"
					v-if="scope.meetingState == 0"
					@click="handlePush(scope)"
					>推送信息</el-button
				>
				<el-button
					type="text"
					size="small"
					v-hasPermi="['meeting:user:publish']"
					v-if="scope.meetingState == 5"
					@click="publishClick(scope)"
					>发布</el-button
				>
				<el-button
					type="text"
					size="small"
					v-hasPermi="['meeting:user:pigeonhole']"
					v-if="scope.meetingState == 2"
					@click="toLog(scope)"
					>归档</el-button
				>
				<el-button
					type="text"
					size="small"
					v-hasPermi="['meeting:user:control']"
					v-if="scope.meetingState == 0 || scope.meetingState == 1"
					@click="toControl(scope)"
					>会议控制</el-button
				>
				<el-button
					type="text"
					size="small"
					v-if="scope.meetingState == 5 || scope.meetingState == 0"
					v-hasPermi="['meeting:user:edit']"
					@click="editClick(scope)"
					>编辑</el-button
				>
				<el-button @click="copyClick(scope)" v-hasPermi="['meeting:meetingmanage:add']" type="text" size="small"
					>复制</el-button
				>
				<el-button
					@click="handleDelete(scope)"
					v-hasPermi="['meeting:meetingmanage:delete']"
					v-if="scope.meetingState == 5"
					type="text"
					size="small"
					>删除</el-button
				>
			</template>
			<template v-slot:button="{ scope }">
				<el-button
					v-for="(rows, index) in button"
					v-hasPermi="[rows.permissions]"
					:key="index"
					plain
					size="small"
					:type="rows.type || 'primary'"
					:disabled="rows.batchBtn && scope.length === 0"
					@click="rows.click(scope)"
					>{{ rows.label }}</el-button
				>
			</template>
		</TablePage>

		<!-- 归档弹框 -->
		<el-dialog title="会议归档" :visible.sync="isShow">
			<div class="toll">
				<el-button @click="toArchive(meetingId)" type="primary">归档</el-button>
				<!-- <el-button @click="exportData(meetingId)" type="warning">导出</el-button> -->
				<!-- <el-button @click="toDestory(meetingId)" type="danger">销毁</el-button> -->
			</div>

			<!-- <p>会议内容</p>
			<el-table :data="meetContent" border>
				<el-table-column align="center" prop="value" label="会议类型"></el-table-column>
				<el-table-column align="center" prop="meetingNum" label="数量"></el-table-column>
				<el-table-column align="center" prop="state" label="状态">

				</el-table-column>
			</el-table> -->
			<p>会议批注</p>
			<el-table :data="mergedArray" border>
				<el-table-column align="center" property="name" label="领导批注" width="150"></el-table-column>
				<!-- <el-table-column align="center" property="name" label="设备号" width="200"></el-table-column> -->
				<el-table-column align="center" property="num" label="文件数"></el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						{{ annotationsState }}
					</template>
				</el-table-column>
			</el-table>

			<div slot="footer" class="dialog-footer">
				<el-button @click="isShow = false" type="primary">确 定</el-button>
				<el-button @click="isShow = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import TablePage from "@/components/Zs_table";
import { formSearchParams, tableColumns, buttonList } from "./config.js";
import { listMeeting, delMeeting, publishMeeting, pushFile, copyMeeting } from "@/service/meeting";
import { ContentList, Destroy, archive, exportMeeting } from "@/service/pigeonhole";

export default {
	name: "noticeManage",
	dicts: ["frame_flag", "app_approval_status", "app_city"],
	components: {
		TablePage
	},
	data() {
		return {
			total: 0,
			listData: [],
			listLoading: false,
			columns: tableColumns,
			button: buttonList(this.toAdd, this.handleDelete),
			queryParams: {
				pageNo: 1,
				pageSize: 10
			},
			sourceNum: "",
			// sourceState: "",
			contentList: [],
			diaList: {},
			checkIds: [],
			searchParams: formSearchParams,
			isShow: false, // 归档弹框显示
			meetContent: [], // 弹框会议内容
			mergedArray: [], // 弹框会议批注,
			meetingId: "",
			meetingState: "",
			annotationsState: ""
		};
	},
	watch: {
		// 根据名称筛选部门树
		deptName(val) {
			this.$refs.tree.filter(val);
		}
	},
	created() {
		this.getList();
		// this.getContentList();
	},
	methods: {
		/** 搜索按钮操作 */
		handleQuery() {
			this.queryParams.pageNo = 1;
			this.getList();
		},
		// 获取列表
		async getList() {
			this.listLoading = true;
			console.log(this.queryParams);
			const params = {
				pageNo: this.queryParams.pageNo,
				pageSize: this.queryParams.pageSize,
				name: this.queryParams.name,
				// userType: "01",
				meetingState: "0,1,2,4,5", // 0:未开始1:会议中2:结束3已归档4已取消5草稿
				startTime:
					this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[0] : "",
				endTime:
					this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[1] : ""
			};
			const res = await listMeeting(params);
			console.log(res, "contentList");
			if (res.code === 200) {
				this.listData = res.data.list;
				this.listData.forEach((ele, index) => {
					this.meetingState = ele.meetingState;
					if (this.meetingState === "") {
						this.meetingState = "已归档";
					} else {
						this.meetingState = "未归档";
					}
				});
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},

		// 会议状态变更
		// async updateMeetStatus(state, id) {
		// 	const res = await changeMeetStatus(state, id);
		// 	console.log(res, "resresres");
		// 	if (res.code === 200) {
		// 		// console.log(1111);
		// 		this.getList();
		// 	}
		// },

		// 弹框会议内容接口
		async getContentList(id) {
			const res = await ContentList(id);
			console.log(res, "image.pngimage.pngimage.pngimage.png");
			if (res.code === 200) {
				this.diaList = res.data;

				// 先清空 meetContent 数组
				this.meetContent = [];

				this.sourceNum = res.data.meetingInfoNum;
				this.contentList = res.data.appMeetingResourceList;
				this.mergedArray = res.data.personAnnotationList;
				// this.contentList.forEach((ele, index) => {
				// 	this.sourceState = ele.state;
				// });
				// console.log(this.contentList[0].state, " res.data.appMeetingResourceList");s
				// 会议内容状态处理
				if (this.contentList[0].state === "1") {
					this.contentList[0].state = "未归档";
				} else {
					this.contentList[0].state = "已归档";
				}

				// // 会议批注状态处理
				// this.mergedArray.forEach((ele, index) => {
				// 	if (ele.state === "1") {
				// 		ele.state = "已归档";
				// 	} else if (ele.state === "0") {
				// 		ele.state = "未归档";
				// 	}
				// });

				// 添加会议信息数据
				this.meetContent.push({
					value: "会议信息",
					id: 1,
					meetingNum: this.diaList.meetingInfoNum,
					state: this.meetingState
				});

				// 添加会议材料数据
				this.meetContent.push({
					value: "会议材料",
					id: 2,
					meetingNum: this.diaList.meetingResourceNum,
					state: this.contentList[0].state
				});
			}
		},

		/** 发布按钮操作 */
		publishClick(row) {
			const { id } = row;
			this.$msgbox
				.confirm("是否确认发布?")
				.then(() => publishMeeting(id))
				.then((res) => {
					// console.log(res, "2222222");
					this.getList();
					if (res.code === 200) {
						this.$message.success("发布成功");
					} else {
						this.$message.error("当前有正在进行的会议，请先结束此会议!");
					}
				})
				.catch(() => {});
		},

		// 批量删除
		// batchDelete() {
		// 	console.log("!1111111");
		// 	// delMeeting(this.checkIds)
		// },

		/** 复制会议按钮操作 */
		copyClick(row) {
			this.$msgbox
				.confirm("是否确认复制会议?")
				.then(() => copyMeeting(row.id))
				.then((res) => {
					this.getList();
					if (res.code === 200) {
						this.$message.success("复制会议信息成功");
					} else {
						this.$message.error("复制会议信息失败");
					}
				})
				.catch(() => {});
		},

		/** 删除按钮操作 */
		handleDelete(row) {
			const ids = row.id || this.checkIds;
			this.$msgbox
				.confirm("是否确认删除?")
				.then(() => delMeeting(ids))
				.then(() => {
					// const totalPage = Math.ceil((this.total - 1) / this.queryParams.pageSize);
					// const currentPage = this.queryParams.pageNo > totalPage ? totalPage : this.queryParams.pageNo;
					// this.queryParams.pageNo = currentPage < 1 ? 1 : currentPage;
					this.getList();
					this.$message.success("删除成功");
				})
				.catch(() => {});
		},

		// 表单提交
		submit(params) {
			this.queryParams = {
				pageNo: 1,
				pageSize: 10,
				...params.searchFormData
			};
			this.getList();
		},
		// 复选框操作
		handleSelectionChange(selection) {
			this.checkIds = selection.map((item) => item.id);
			console.log(this.checkIds, "image.pngimage.png");
		},
		// 详情
		toDetail(row) {
			this.$router.push(`/meetingManage/meetingManage/detail/${row.id}`);
		},
		// 添加
		toAdd() {
			this.$router.push("/createMeeting/createMeeting/");
		},
		// 进入会议过程
		toControl(row) {
			this.$router.push(`/meetingProgressManage/meetingProgressManage/${row.id}`);
			// const meetingState = {
			// 	meetingState: "1"
			// };
			// this.updateMeetStatus(meetingState, row.id);
		},

		// 弹框内 归档接口
		async archive(id) {
			const res = await archive(id);
			console.log(res, "-----------------");
			if (res.code === 200) {
				this.$nextTick(() => {
					this.annotationsState = "已归档";
				});
				setTimeout(() => {
					this.$confirm("已归档成功", "提示", {
						confirmButtonText: "确定",
						cancelButtonText: "取消",
						type: "warning"
					});
				});
			}
			this.getList();
		},

		// 弹框内 导出接口
		async export(id) {
			const res = await exportMeeting(id);
			console.log(res, "//////////////////");
			// const res = await exportData({ deptId });
			if (res) {
				const blob = new Blob([res]);
				const reader = new FileReader();
				reader.readAsDataURL(blob);
				reader.onload = (e) => {
					const a = document.createElement("a");
					a.download = "归档文件.zip";
					a.href = e.target.result;
					document.body.appendChild(a);
					a.click();
					document.body.removeChild(a);
				};
			} else {
				this.$message.error("导出失败");
			}
			// downloadBlobFile(res);
		},

		// 弹框内 销毁接口
		async destory(id) {
			const data = {
				meetingId: id,
				type: 4
			};
			const res = await Destroy(data);
			if (res.code === 200) {
				this.$confirm("销毁成功", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning"
				});
			}
		},

		// 推送会议信息
		handlePush(row) {
			this.$msgbox
				.confirm("是否确认推送?")
				.then(() => pushFile(row.id))
				.then(() => {
					this.$message.success("推送成功");
				})
				.catch(() => {});
		},

		// 会议归档
		toLog(row) {
			this.meetingId = row.id;
			this.isShow = true;
			this.annotationsState = "未归档";
			this.getContentList(row.id);
			// this.getList();
		},
		// 点击归档按钮
		async toArchive(id) {
			await this.archive(id);
			// 更新会议信息状态
			const meetingInfoIndex = this.meetContent.findIndex((item) => item.id === 1);
			if (meetingInfoIndex !== -1) {
				this.meetContent[meetingInfoIndex].state = "已归档";
			}

			// 更新会议材料状态
			const meetingResourceIndex = this.meetContent.findIndex((item) => item.id === 2);
			if (meetingResourceIndex !== -1) {
				this.meetContent[meetingResourceIndex].state = "已归档";
			}

			// // 更新会议批注状态
			// this.mergedArray.forEach((item) => {
			// 	if (item.state === "未归档") {
			// 		item.state = "已归档";
			// 	}
			// });

			// 关闭弹框
			// this.isShow = false;
		},

		exportData(id) {
			this.export(id);
		},

		// 点击销毁按钮
		toDestory(id) {
			this.destory(id);
		},

		// 编辑
		editClick(row) {
			console.log(row);
			this.$router.push(`/createMeeting/createMeeting/${row.id}`);
		}
	}
};
</script>
<style lang="scss" scoped>
.rejectColor {
	color: red;
}

.passColor {
	color: limegreen;
}

.el-dialog {
	position: relative;

	.el-table {
		margin: 10px 0 40px 0;
	}

	.toll {
		// float: right;
		position: absolute;
		top: 40px;
		right: 60px;
	}

	p {
		font-size: 16px;
		margin-bottom: 5px;
	}

	.dialog-footer {
		text-align: center;

		.el-button {
			margin: 0 30px;
		}
	}
}
</style>
