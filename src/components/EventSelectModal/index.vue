<template>
	<el-dialog
		title="事项选择"
		:visible.sync="dialogVisible"
		width="80%"
		custom-class="dialogclass"
		:show-close="false"
		:lock-scroll="false"
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
			:showRadio="true"
			:totalCount="total"
			@selectionRow="handleSelectionChange"
			@query="submit"
			ref="modalTable"
		>
			<template v-slot:frameFlag="{ scope }">
				<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
			</template>
			<template v-slot:approvalStatus="{ scope }">
				<dict-tag :options="dict.type.app_approval_status" :value="scope.approvalStatus" />
			</template>
			<template v-slot:accessMethod="{ scope }">
				<dict-tag :options="dict.type.app_event_access_method" :value="scope.accessMethod" />
			</template>
			<template v-slot:type="{ scope }">
				<dict-tag :options="dict.type.app_event_type" :value="scope.type" />
			</template>
			<template v-slot:bureau="{ scope }">
				<dict-tag :options="dict.type.app_event_bureau" :value="scope.bureau" />
			</template>
			<template v-slot:primaryClassification="{ scope }">
				<dict-tag :options="dict.type.app_event_primary_classification" :value="scope.primaryClassification" />
			</template>
			<template v-slot:frameType="{ scope }">
				<dict-tag :options="dict.type.app_event_frame_type" :value="scope.frameType" />
			</template>
			<template v-slot:deptId="{ scope }">
				<dict-tag :options="dict.type.app_city" :value="scope.deptId" />
			</template>
			<template v-slot:faceSwiping="{ scope }">
				<dict-tag :options="dict.type.app_event_face_swiping" :value="scope.faceSwiping" />
			</template>
		</TablePage>
		<span slot="footer" class="dialog-footer">
			<el-button @click="closeModal">取 消</el-button>
			<el-button type="primary" @click="save">确 定</el-button>
		</span>
	</el-dialog>
</template>

<script>
import { getList } from "@/service/event";
import TablePage from "@/components/Zs_table";
import { searchParams, tableColumns } from "./config.js";

export default {
	name: "EventSelectModal",
	props: ["dialogVisible"],
	dicts: [
		"app_approval_status",
		"app_event_frame_type",
		"app_city",
		"app_event_primary_classification",
		"app_event_bureau",
		"app_event_face_swiping",
		"app_event_access_method",
		"app_event_type",
		"frame_flag"
	],
	components: {
		TablePage
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
				// deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
				frameFlag: "1" // 默认查询 上架
			},
			selectRow: {} // 选择的当前项
		};
	},
	watch: {
		// eslint-disable-next-line
		dialogVisible: function (e) {
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
	methods: {
		// 确定
		save() {
			this.$emit("updateSelectEnevt", this.selectRow);
			this.$emit("closeModal");
		},
		// 关闭弹窗
		handleClose() {
			this.$emit("closeModal");
		},
		// 取消
		closeModal() {
			this.handleClose();
		},
		// 获取列表
		async getList() {
			const submitParams = {
				...this.queryParams
			};
			const res = await getList(submitParams);
			if (res.code === 200) {
				const { list, totalCount } = res.data;
				this.listData = list;
				this.total = totalCount;
			}
			console.log("res", res);
		},
		// 复选框回调
		handleSelectionChange(row) {
			console.log("handleSelectionChangehandleSelectionChange", row);
			this.selectRow = row[0] && row[0];
		},
		// 点击查询按钮回调
		submit(params) {
			const { searchFormData } = params;
			console.log("submitsubmit", params);
			this.queryParams = Object.assign(this.queryParams, { ...searchFormData });
			this.getList();
		}
	}
};
</script>

<style lang="scss" scoped></style>
