<template>
	<div class="app-container">
		<el-tabs @tab-click="changeTab" type="border-card">
			<el-tab-pane label="APK">
				<div>
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
						<!-- <template v-slot:tool="{ scope }">
				<el-button type="text" size="small" @click="downloadClick(scope)">下载</el-button>
			</template> -->
						<template v-slot:button="{ scope }">
								<!-- v-for="(row, index) in button" -->
								<!-- :key="index" -->
							<el-button
								v-hasPermi="['system:dict:upgradeApk']"
								plain
								size="small"
								:type="button[0].type || 'primary'"
								:disabled="button[0].batchBtn && scope.length === 0"
								@click="button[0].click(scope)"
								>{{ button[0].label }}</el-button
							>
						</template>
					</TablePage>
				</div>
			</el-tab-pane>
			<el-tab-pane label="前端资源包">
				<div>
					<TablePage
						:listData="resourceList"
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
						<!-- <template v-slot:tool="{ scope }">
				<el-button type="text" size="small" @click="downloadClick(scope)">下载</el-button>
			</template> -->
						<template v-slot:button="{ scope }">
								<!-- v-for="(row, index) in button" -->
								<!-- :key="index" -->
							<el-button
								v-hasPermi="['system:dict:upgradeResource']"
								plain
								size="small"
								:type="button[1].type || 'primary'"
								:disabled="button[1].batchBtn && scope.length === 0"
								@click="button[1].click(scope)"
								>{{ button[1].label }}</el-button
							>
						</template>
					</TablePage>
				</div>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>
<script>
import TablePage from "@/components/Zs_table";
import { formSearchParams, tableColumns, buttonList } from "./config.js";
import { upgrade } from "@/service/upgrade";

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
			resourceList: [],
			listLoading: false,
			columns: tableColumns,
			button: buttonList(this.add),
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				deptId: ""
			},
			searchParams: formSearchParams,
			checkIds: [],
			fileType: "1",
			pageNum: 1,
			pageSize: 10
		};
	},
	watch: {},
	created() {
		this.getList();
	},
	methods: {
		/** 搜索按钮操作 */
		handleQuery() {
			this.queryParams.pageNo = 1;
			this.getList();
			this.getResourceList();
		},
		// 获取APK列表
		async getList() {
			this.listLoading = true;
			// console.log(this.queryParams);
			// const params = {
			// 	pageNo: this.queryParams.pageNo,
			// 	pageSize: this.queryParams.pageSize,
			// 	deptId: this.queryParams.deptId,
			// 	userName: this.queryParams.name,
			// 	userType: "01",
			// 	params: {
			// 		beginTime:
			// 			this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[0] : "",
			// 		endTime:
			// 			this.queryParams.createTime && this.queryParams.createTime.length > 0 ? this.queryParams.createTime[1] : ""
			// 	}
			// };
			const data = {
				pageNo: this.pageNum,
				pageSize: this.pageSize
			};
			const res = await upgrade(data, "1");
			console.log(res, "fileTypefileTypefileTypefileType");
			if (res.code === 200) {
				this.listData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			// 排序
			this.listData = res.data.list.map((item, index) => ({
				...item,
				index: index + 1
			}));
			this.listLoading = false;
		},

		// 切换tab事件
		changeTab(tab, event) {
			console.log(tab, event);
			if (tab.index === "0") {
				this.getList();
			} else if (tab.index === "1") {
				// 网络请求2
				this.getResourceList();
			}
		},

		// 获取前端资源包列表
		async getResourceList() {
			this.listLoading = true;
			const data = {
				pageNo: this.pageNum,
				pageSize: this.pageSize
			};
			const res = await upgrade(data, "2");
			console.log(res, "fileTypefileTypefileTypefileType");
			if (res.code === 200) {
				this.resourceList = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			// 排序
			this.resourceList = res.data.list.map((item, index) => ({
				...item,
				index: index + 1
			}));
			this.listLoading = false;
		},

		// 点击新建跳转
		add(fileType) {
			// this.$router.push("/addVersionManage");
			this.$router.push({
				path: "/addVersionManage",
				query: {
					fileType
				}
			});
		},
		downloadClick(row) {},

		handleSelectionChange(selection) {
			console.log(selection);
			this.checkIds = selection.map((item) => item.id);
			console.log(this.checkIds);
		},

		submit() {
			console.log("submitsubmitsubmit");
		}
	}
};
</script>
<style lang="scss" scoped>
</style>
