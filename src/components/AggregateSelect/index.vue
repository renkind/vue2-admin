<template>
	<div>
		<el-dialog
			:visible.sync="dialogVisible"
			title="聚合页选择"
			center
			width="70%"
			:before-close="beforeClose"
			:close-on-click-modal="false"
			:close-on-press-escape="false"
		>
			<TablePage
				:listData="listData"
				:listLoading="listLoading"
				:columns="columns"
				:searchParams="searchParams"
				:pageNo="queryParams.pageNo"
				:pageSize="queryParams.pageSize"
				:totalCount="total"
				:showRadio="true"
				@selectionRow="handleSelectionChange"
				@query="submit"
				ref="modalTable"
			>
				<template v-slot:approvalStatus="{ scope }">
					<dict-tag :options="dict.type.app_approval_status" :value="scope.approvalStatus" />
				</template>
				<template v-slot:frameFlag="{ scope }">
					<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
				</template>
				<template v-slot:deptId="{ scope }">
					<dict-tag :options="dict.type.app_city" :value="scope.deptId" />
				</template>
			</TablePage>

			<div slot="footer">
				<el-button @click="closeModal">取消</el-button>
				<el-button type="primary" @click="save">确定</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
import TablePage from "@/components/Zs_table";
import { searchParams, tableColumns } from "./config.js";
import { getList } from "@/service/aggregate";
export default {
	name: "AggSelectDialog",
	components: {
		TablePage
	},
	dicts: ["frame_flag", "app_approval_status", "app_city"],
	props: {
		dialogVisible: {
			require: true,
			type: Boolean,
			default: false
		}
	},
	watch: {
		dialogVisible(e) {
			if (e) {
				this.getList();
				if (this) {
					this.$nextTick(() => {
						this.$refs["modalTable"].resetSelection();
					});
				}
			}
		}
	},
	data() {
		return {
			total: 0,
			listData: [],
			listLoading: false,
			searchParams: searchParams(),
			columns: tableColumns(),
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				approvalStatus: "3",
				frameFlag: "1"
				// deptId: JSON.parse(window.localStorage.getItem("user")).deptId
			},
			checkIds: [],
			checkData: []
		};
	},
	created() {
		this.getList();
	},
	methods: {
		// 获取列表
		async getList() {
			const submitParams = {
				...this.queryParams
			};
			this.listLoading = true;
			const res = await getList(submitParams);
			if (res.code === 200) {
				this.listData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},
		// 搜索
		submit(params) {
			const { searchFormData } = params;
			this.queryParams = Object.assign(this.queryParams, { ...searchFormData });
			this.getList();
		},
		closeModal() {
			this.$emit("closeModal");
		},
		beforeClose() {
			this.closeModal();
		},
		handleSelectionChange(selection) {
			this.checkData = selection;
			this.checkIds = selection.map((item) => item.name);
		},
		save() {
			this.$emit("updateSelectAgg", this.checkData);
			this.$emit("closeModal");
		}
	}
};
</script>
<style lang="scss" scoped></style>
