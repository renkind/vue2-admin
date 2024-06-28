<template>
	<div class="app-container">
		<el-row :gutter="20">
			<!--部门数据-->
			<el-col :span="4" :xs="24">
				<div class="head-container">
					<el-input
						v-model="deptName"
						placeholder="请输入部门名称"
						clearable
						size="small"
						prefix-icon="el-icon-search"
						style="margin-bottom: 20px"
					/>
				</div>
				<div class="head-container">
					<el-tree
						:data="deptOptions"
						:props="defaultProps"
						:expand-on-click-node="false"
						:filter-node-method="filterNode"
						ref="tree"
						default-expand-all
						@node-click="handleNodeClick"
					/>
				</div>
			</el-col>
			<el-col :span="20" :xs="24">
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
					@reset="reset"
				>
					<template v-slot:frameFlag="{ scope }">
						<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
					</template>

					<template v-slot:status="{ scope }">
						<el-switch
							v-model="scope.status"
							active-value="0"
							inactive-value="1"
							@change="handleStatusChange(scope)"
						></el-switch>
					</template>
					<template v-slot:deptName="{ scope }">
						<span v-if="scope.dept">{{ scope.dept.deptName }} </span></template
					>
					<template v-slot:deptId="{ scope }">
						<dict-tag :options="dict.type.app_city" :value="scope.deptId" />
					</template>
					<template v-slot:roleName="{ scope }">
						<dict-tag :options="dict.type.meeting_role" :value="scope.personRole" />
					</template>
					<template v-slot:tool="{ scope }">
						<el-button type="text" size="small" @click="editClick(scope)">编辑</el-button>
						<el-button @click="handleDelete(scope)" type="text" size="small">删除</el-button>
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
			</el-col>
		</el-row>
	</div>
</template>
<script>
import TablePage from "@/components/Zs_table";
import { formSearchParams, tableColumns, buttonList } from "./config.js";
import { treeselect } from "@/service/dept";
import { listUser, changeUserStatus, delUser } from "@/service/user";
export default {
	name: "noticeManage",
	dicts: ["meeting_status", "app_approval_status", "app_city", "meeting_role"],
	components: {
		TablePage
	},
	data() {
		return {
			total: 0,
			listData: [],
			// 部门名称
			deptName: undefined,
			defaultProps: {
				children: "children",
				label: "label"
			},
			deptOptions: [],
			listLoading: false,
			columns: tableColumns,
			button: buttonList(this.toAdd, this.handleDelete),
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				deptId: ""
			},
			checkIds: [],
			searchParams: formSearchParams
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
		this.getTreeselect();
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
			this.listData = [];
			// console.log(this.queryParams);
			const params = {
				pageNo: this.queryParams.pageNo,
				pageSize: this.queryParams.pageSize,
				deptId: this.queryParams.deptId,
				nickName: this.queryParams.name,
				status: this.queryParams.meeting_status,
				userType: "01",
				params: {
					beginTime:
						this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[0] : "",
					endTime:
						this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[1] : ""
				}
			};
			const res = await listUser(params);
			if (res.code === 200) {
				this.listData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				this.deptOptions = response.data; // 截取河南省数据，直接暴露子级
			});
		},
		// 筛选节点
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		// 节点单击事件
		handleNodeClick(data) {
			this.queryParams.deptId = data.id;
			this.queryParams.pageNo = 1;
			this.handleQuery();
		},
		/** 删除按钮操作 */
		handleDelete(row) {
			const userIds = row.userId || this.checkIds;
			this.$msgbox
				.confirm("是否确认删除?")
				.then(() => delUser(userIds))
				.then(() => {
					// const totalPage = Math.ceil((this.total - 1) / this.queryParams.pageSize);
					// const currentPage = this.queryParams.pageNo > totalPage ? totalPage : this.queryParams.pageNo;
					// this.queryParams.pageNo = currentPage < 1 ? 1 : currentPage;
					this.getList();
					this.$message.success("删除成功");
				})
				.catch(() => {});
		},

		// 用户状态修改
		handleStatusChange(row) {
			const text = row.status === "0" ? "启用" : "停用";
			this.$msgbox
				.confirm(`确认要 ${text} ${row.userName} 用户吗`)
				.then(() => changeUserStatus(row.userId, row.status))
				.then(() => {
					this.$message.success(`${text}成功`);
					this.getList();
				})
				.catch(() => {
					row.status = row.status === "0" ? "1" : "0";
				});
		},
		// 表单提交
		submit(params) {
			this.queryParams = {
				...this.queryParams,
				pageNo: 1,
				pageSize: 10,
				...params.searchFormData
			};
			this.getList();
		},
		reset() {
			this.queryParams.deptId = "";
		},
		// 复选框操作
		handleSelectionChange(selection) {
			this.checkIds = selection.map((item) => item.userId);
			console.log(this.checkIds);
		},
		// 添加
		toAdd() {
			this.$router.push("/memberManage/memberManage/edit");
		},
		// 编辑
		editClick(row) {
			this.$router.push(`/memberManage/memberManage/edit/${row.userId}`);
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
</style>
