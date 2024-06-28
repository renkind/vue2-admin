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
			<template v-slot:approvalStatus="{ scope }">
				<div :class="scope.approvalStatus === '3' ? 'passColor' : scope.approvalStatus === '4' ? 'rejectColor' : ''">
					<dict-tag :options="dict.type.app_approval_status" :value="scope.approvalStatus" />
				</div>
			</template>
			<template v-slot:deptId="{ scope }">
				<dict-tag :options="dict.type.app_city" :value="scope.deptId" />
			</template>
			<template v-slot:tool="{ scope }">
				<el-button @click="preview(scope)" type="text" size="small">预览</el-button>
				<el-button
					v-show="scope.approvalStatus === '0' || scope.approvalStatus === '4' || scope.approvalStatus === '5'"
					v-hasPermi="['app:inform:update']"
					type="text"
					size="small"
					@click="editClick(scope)"
					>编辑</el-button
				>
				<el-button @click="detailClick(scope)" v-hasPermi="['app:inform:query']" type="text" size="small"
					>详情</el-button
				>
				<el-button
					@click="recallClick(scope)"
					v-hasPermi="['app:inform:query']"
					type="text"
					size="small"
					v-show="scope.approvalStatus === '1' || scope.approvalStatus === '2'"
					>撤回</el-button
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
	</div>
</template>
<script>
import TablePage from "@/components/Zs_table";
import { formSearchParams, tableColumns, buttonList } from "./config.js";
import { listNotice, cancel, batchFrame, refreshCache } from "@/service/meeting";
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
			button: buttonList(this.addNotice, this.up, this.down, this.refreshCache),
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				deptId: JSON.parse(window.localStorage.getItem("user")).deptId // 归属地市
			},
			checkIds: [],
			searchParams: formSearchParams
		};
	},
	created() {
		this.getList();
	},
	methods: {
		// 上架
		async up(row) {
			const notPass = row.filter((r) => r.approvalStatus !== "3");
			// 判断是都是审批通过的
			const ids = row.filter((r) => r.approvalStatus === "3").map((rr) => rr.id);
			if (notPass.length > 0) {
				this.$message.error("只有审核通过才可以上架");
				return;
			}
			const res = await batchFrame({
				deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
				frameFlag: 1,
				ids
			});
			if (res.code === 200) {
				this.$message.success(res.msg);
				this.getList();
			} else {
				this.$message.error(res.msg);
			}
		},
		// 下架
		async down(row) {
			const notPass = row.filter((r) => r.approvalStatus !== "3");
			// 判断是都是审批通过的
			const ids = row.filter((r) => r.approvalStatus === "3").map((rr) => rr.id);
			if (notPass.length > 0) {
				this.$message.error("只有审核通过才可以下架");
				return;
			}
			const res = await batchFrame({
				deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
				frameFlag: 0,
				ids
			});
			if (res.code === 200) {
				this.$message.success(res.msg);
				this.getList();
			} else {
				this.$message.error(res.msg);
			}
		},
		// 获取列表
		async getList() {
			this.listLoading = true;
			console.log(this.queryParams);
			const params = {
				pageNo: this.queryParams.pageNo,
				pageSize: this.queryParams.pageSize,
				name: this.queryParams.name,
				approvalStatus: this.queryParams.approvalStatus,
				deptId: this.queryParams.deptId,
				content: this.queryParams.content,
				frameFlag: this.queryParams.frameFlag,
				updateBy: this.queryParams.updateBy,
				params: {
					beginTime:
						this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[0] : "",
					endTime:
						this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[1] : ""
				}
			};
			const res = await listNotice(params);
			if (res.code === 200) {
				this.listData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},
		// 表单提交
		submit(params) {
			this.queryParams = {
				pageNo: 1,
				pageSize: 10,
				deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
				...params.searchFormData
			};
			this.getList();
		},
		// 复选框操作
		handleSelectionChange(selection) {
			console.log(selection);
			this.checkIds = selection.map((item) => item.id);
			console.log(this.checkIds);
		},
		// 添加通知
		addNotice() {
			this.$router.push("/contentManage/noticeEdit");
		},
		// 编辑
		async editClick(row) {
			this.$router.push(`/contentManage/noticeEdit/${row.id}`);
		},
		// 详情
		detailClick(row) {
			this.$router.push(`/contentManage/noticeDetail/${row.id}`);
		},
		// 撤回
		async recallClick(row) {
			this.$msgbox.confirm("是否确认撤回选中的数据项").then(async () => {
				console.log(row);
				const ids = row.id;
				const res = await cancel({ id: ids });
				if (res.code === 200) {
					console.log("cancelcancelcancelcancel", res);
					this.getList();
					this.$message.success("撤回成功");
				} else {
					this.$message.error(res.msg);
				}
			});
		},
		// 预览
		preview(row) {
			this.$router.push(`/contentManage/preview/${row.id}/9`);
		},
		// 刷新缓存
		async refreshCache() {
			const res = await refreshCache();
			if (res.code === 200) {
				this.$message.success("刷新成功");
			} else {
				this.$message.error(res.msg);
			}
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
