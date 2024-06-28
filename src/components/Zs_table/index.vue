<template>
	<div>
		<!-- 筛选组件 -->
		<div class="form-container">
			<ZsForm
				:inline="true"
				:items="searchParams"
				:initData="initData"
				@formSubmit="handleQuery"
				@formReset="handleReset"
				ref="queryForm"
			/>
		</div>
		<!-- 操作栏 批量操作按钮,添加按钮 -->
		<div class="toolsBox">
			<!-- todo -->
			<slot name="button" :scope="selectionRow"></slot>
		</div>
		<!-- 切换列表风格组件 listStyle==2 时可用 -->
		<div style="height: 10px">
			<el-radio-group
				v-model="tableType"
				v-if="listStyle === 2"
				@change="changeTableType"
				style="float: right"
				size="mini"
			>
				<el-radio-button label="1"><i class="el-icon-notebook-2"></i></el-radio-button>
				<el-radio-button label="2"><i class="el-icon-menu"></i></el-radio-button>
			</el-radio-group>
		</div>

		<!-- 表格组件 -->
		<div v-show="tableType === 1">
			<el-table
				v-loading="listLoading"
				border
				:data="listData"
				@selection-change="handleSelectionChange"
				:row-key="rowKey"
				style="width: 100%"
				ref="commonTable"
			>
				<el-table-column type="selection" v-if="showBatch" width="50" />
				<el-table-column type="index" label="序号" align="center" v-if="showIndex" width="50">
					<template slot-scope="scope">
						{{ (pageNo - 1) * pageSize + scope.$index + 1 }}
					</template>
				</el-table-column>
				<el-table-column label="" width="50" v-if="showRadio" fixed="left" align="center">
					<template slot-scope="scope">
						<el-radio class="radio" @change="updateRadioValue" :label="scope.$index" v-model="selectionRadioRow"
							>&nbsp;</el-radio
						>
					</template>
				</el-table-column>
				<template v-for="(col, index) in columns">
					<el-table-column
						:label="col.label"
						:fixed="col.fixed"
						:width="col.width"
						:prop="col.dataIndex"
						:key="index"
						:show-overflow-tooltip="true"
						align="center"
					>
						<template slot-scope="scope">
							<!-- 根据需求添加效果 返回的slot可以优化.自己来吧. -->
							<slot v-if="col.slotName" :scope="scope.row" :name="col.slotName" />
							<div v-else>
								<span>{{ scope.row[col.dataIndex] }}</span>
							</div>
						</template>
					</el-table-column>
					<!-- <el-table-column v-else :key="index" >
						<slot :name="col.slotName" slot-scope="scope" v-if="col.slotName"></slot>
					</el-table-column> -->
				</template>
			</el-table>
		</div>
		<!-- 平铺组件 -->
		<div class="flex-table" v-if="tableType === 2">
			<template v-show="listData.length > 0">
				<div v-for="(item, index) in listData" class="singleView" :key="index">
					<i class="el-icon-edit editor" @click="$emit('edit', item)"></i>
					<ZsImg imgStyle="width: 100%; height: 180px" :src="item[flexColumns.imgUrl]"></ZsImg>
					<div class="infos">
						<!-- 暂时用不到选中功能 -->
						<!-- <el-checkbox @change="handleSelectionClick(item)" class="checkboxs"></el-checkbox> -->
						<span>{{
							item[flexColumns.name].length > 15
								? `${item[flexColumns.name].substring(0, 15)}..`
								: item[flexColumns.name]
						}}</span>
					</div>
				</div>
			</template>
			<div v-show="listData.length === 0" style="text-algin: center; width: 100%">
				<el-empty description="暂无素材"></el-empty>
			</div>
		</div>
		<!-- 分页组件 -->
		<div class="page-container">
			<el-pagination
				@size-change="handlePageSet"
				@current-change="handelePage"
				:current-page.sync="page"
				:page-sizes="[10, 20, 30, 40, 50]"
				:page-size.sync="size"
				layout="total, sizes, prev, pager, next, jumper"
				:total="totalCount"
				:page.sync="pageNo"
				:limit.sync="pageSize"
				@pagination="handlePageSet"
			/>
		</div>
	</div>
</template>
<script>
import Sortable from "sortablejs";
import ZsForm from "@/components/Zs_form";

export default {
	name: "ZsTable",
	components: { ZsForm, Sortable },
	data() {
		return {
			vFormData: {},
			page: this.pageNo,
			tableType: null,
			size: this.pageSize,
			selectionRow: [], // 选中的复选框值
			selectionRadioRow: "" // 选中的单选框值
		};
	},
	watch: {
		listStyle: {
			handler: (newVal, oldVal) => {
				if (this) {
					this.resetSelection();
				}
			},
			deep: true
		},
		listData: {
			handler: (newVal, oldVal) => {
				if (this) {
					this.resetSelection();
				}
			},
			deep: true
		}
	},
	props: {
		// tableRowKey
		rowKey: {
			required: false,
			type: String,
			default: "id"
		},
		// 是否展示表格上部分按钮
		showTopButton: {
			required: false,
			type: Boolean,
			default: true
		},
		// 当前分页页码
		pageNo: {
			required: false,
			type: Number,
			default: 1
		},
		pageSize: {
			required: false,
			type: Number,
			default: 10
		},
		/* 数据总数量 */
		totalCount: {
			required: true,
			type: Number,
			default: 0
		},
		/*	是否显示搜索按钮  */
		showSearch: {
			required: false,
			type: Boolean,
			default: true
		},
		/*	是否显示序号  */
		showIndex: {
			required: false,
			type: Boolean,
			default: false
		},
		/*	筛选栏设置  */
		searchParams: {
			required: true,
			type: Array
		},
		/*	筛选栏默认参数  */
		initData: {
			required: false,
			type: Object,
			default: () => ({})
		},
		/*	列表字段设置  */
		columns: {
			required: true,
			type: Array
		},
		/*	平铺列表字段设置  */
		flexColumns: {
			required: false,
			type: Object
		},
		/*	是否显示批量操作按钮  */
		showBatch: {
			required: false,
			type: Boolean,
			default: false
		},
		/*	列表loading显示  */
		listLoading: {
			required: false,
			type: Boolean,
			default: false
		},
		/*	列表数据  */
		listData: {
			default: () => [],
			required: true,
			type: Array
		},
		/* 是否单选 */
		showRadio: {
			required: false,
			default: false,
			type: Boolean
		},
		/* 列表展示风格 */
		listStyle: {
			required: false,
			default: 1,
			type: Number
		},
		/* 是否允许拖拽 */
		dragTable: {
			required: false,
			default: false,
			type: Boolean
		},
		/* 拖拽方式 1：替换， 2：插入 */
		dragType: {
			required: false,
			default: 1,
			type: Number
		}
	},
	mounted() {
		// this.handleQuery();
		console.log(".....", this.columns);
		console.log(".....", this.listData);
		this.tableType = this.listStyle * 1;
		this.resetSelection();
		if (this.dragTable) {
			this.initSortable();
		}
	},
	methods: {
		// 创建sortable实例
		initSortable() {
			// 获取表格row的父节点
			const ele = this.$refs["commonTable"].$el.querySelector(".el-table__body > tbody");
			let virtualList = [];
			console.log(virtualList);
			let oldIndex;
			let newIndex;
			let new_virtualList;
			// 创建拖拽实例
			const sortable = Sortable.create(ele, {
				sort: true, // boolean 定义是否列表单元是否可以在列表容器内进行拖拽排序
				delay: 20, // 20毫秒后捕获hover对象
				handle: ".el-table__row", // 指定拖拽目标，点击此目标才可拖拽元素(此例中设置操作按钮拖拽)
				filter: ".disabled", // 指定不可拖动的类名（el-table中可通过row-class-name设置行的class）
				dragClass: "dragClass", // 设置拖拽样式类名
				ghostClass: "ghostClass", // 设置拖拽停靠样式类名
				chosenClass: "chosenClass", // 设置选中样式类名
				onChoose: (e) => {
					if (this.dragType === 1) {
						// 记录原始虚拟数组
						virtualList = sortable.toArray();
						oldIndex = e.oldIndex * 1;
						console.log(sortable.toArray());
					}
				},
				onChange: (e) => {
					if (this.dragType === 1) {
						new_virtualList = sortable.toArray();
						let sliceStr;
						let appendStr;
						// 新老虚拟数组对比，找出生成的id替换  保证整体顺序不变
						for (const i of virtualList) {
							for (const j of new_virtualList) {
								if (!new_virtualList.includes(i)) {
									sliceStr = i;
								}
								if (!virtualList.includes(j)) {
									appendStr = j;
								}
							}
						}
						for (const i in virtualList) {
							if (sliceStr === virtualList[i]) {
								virtualList[i] = appendStr;
							}
						}
						console.log(virtualList);
						// 检测到虚拟数组变化时，阻止且记录下标
						newIndex = e.newIndex * 1;
						sortable.sort(virtualList);
					}
				},
				// 结束拖动事件
				onEnd: (e) => {
					if (this.dragType === 1) {
						if (oldIndex === undefined || newIndex === undefined) {
							return;
						}
						// 在结束拖动时处理数据交换
						const oldObj = JSON.parse(JSON.stringify(this.listData[oldIndex]));
						const newObj = JSON.parse(JSON.stringify(this.listData[newIndex]));
						this.$confirm(
							`确定交换 "${this.listData[oldIndex].name}" 和 "${this.listData[newIndex].name}" 的顺序吗`,
							"提示",
							{
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							}
						)
							.then(() => {
								this.listData.splice(oldIndex, 1, newObj);
								this.listData.splice(newIndex, 1, oldObj);
								console.log("结束拖动", `拖动前索引${oldIndex}---拖动后索引${newIndex}`);
								this.$emit("drop", this.listData[oldIndex], this.listData[newIndex]);
							})
							.catch(() => {});
					} else {
						this.$confirm(
							`确定交换 "${this.listData[e.oldIndex].name}" 和 "${this.listData[e.newIndex].name}" 的顺序吗`,
							"提示",
							{
								confirmButtonText: "确定",
								cancelButtonText: "取消",
								type: "warning"
							}
						)
							.then(() => {
								console.log("结束拖动", `拖动前索引${e.oldIndex}---拖动后索引${e.newIndex}`);
								this.$emit("drop", this.listData[e.oldIndex], this.listData[e.newIndex]);
							})
							.catch(() => {});
					}
				}
			});
			console.log(sortable);
		},
		// 拖拽完成回调
		dragComplate() {},
		/** 取消选中 */
		resetSelection() {
			if (this && this.selectionRow) {
				this.selectionRow = [];
			}
			this.$refs["commonTable"].clearSelection();
			this.selectionRadioRow = "";
		},
		/** 获取组件相关参数 */
		getAllParam() {
			const parObj = {
				showSearch: this.showSearch,
				searchParams: { ...this.searchParams },
				columns: { ...this.columns },
				// pageParams: { ...this.pageParams },
				listLoading: this.listLoading,
				listData: { ...this.listData },
				ajaxbody: this.$refs.queryForm.getFormData(),
				searchRef: this.$refs["queryForm"],
				formRef: this.$refs["queryForm"]
			};
			return parObj;
		},
		/** 搜索按钮操作 */
		handleQuery(params) {
			this.page = 1;
			this.size = 10;
			this.$emit("query", {
				searchFormData: { pageNo: 1, pageSize: 10, ...params }
			});
		},
		/** 重置按钮操作 */
		handleReset(params) {
			this.page = 1;
			this.size = 10;
			this.$emit("reset", {
				searchFormData: { pageNo: 1, pageSize: 10, ...params }
			});
		},
		/** 分页操作 */
		handlePageSet(size) {
			this.$emit("query", {
				searchFormData: { pageNo: this.page, pageSize: size, ...this.$refs["queryForm"].formModal }
			});
		},
		// 分页方法
		handelePage(page) {
			this.$emit("query", {
				searchFormData: { pageNo: page, pageSize: this.size, ...this.$refs["queryForm"].formModal }
			});
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			this.selectionRow = selection;
			console.log(this.selectionRow);
			this.$emit("selectionRow", selection);
		},
		// 平铺列表选中数据
		handleSelectionClick(row) {
			const selectionIds = this.selectionRow.map((x) => x.id);
			if (selectionIds.includes(row.id)) {
				this.selectionRow.splice(selectionIds.indexOf(row.id), 1);
			} else {
				this.selectionRow.push(row);
			}
			this.$emit("selectionRow", this.selectionRow);
		},
		// 单选框的值
		updateRadioValue(row) {
			// 获取单选选中的数据
			const selectRow = this.listData[row];
			this.handleSelectionChange([selectRow]);
		},
		// 变更列表类型 (listStyle==2才可用)
		changeTableType(e) {
			console.log(e);
			this.tableType = e * 1;
			this.resetSelection();
		}
	}
};
</script>
<style lang="scss" scoped>
@import "@/style/table.scss";

.page-container {
	text-align: right;
	margin-top: 10px;
}
.form-container {
	// margin-bottom: 10px;
}
.toolsBox {
	display: flex;
	// margin-bottom: 20px;
	min-height: 20px;
}
.flex-table {
	width: 100%;
	padding: 20px;
	.singleView {
		position: relative;
		width: 19%;
		max-width: 300px;
		height: 210px;
		border-radius: 8px;
		margin-right: 1%;
		background: #eee;
		box-shadow: 2px 2px 5px #ccc;
		display: inline-block;
		flex-direction: column;
		overflow: hidden;
		margin-bottom: 20px;
	}
	.infos {
		width: 100%;
		height: 30px;
		line-height: 30px;
		text-align: center;
		.checkboxs {
			float: left;
			margin-left: 5px;
		}
		span {
			color: #666;
			font-size: 15px;
			margin-right: 10px;
		}
	}
	.editor {
		display: none;
		position: absolute;
		font-size: 16px;
		color: #999;
		right: 5px;
		top: 5px;
		z-index: 2;
		cursor: pointer;
	}
	.singleView:hover .editor {
		display: block;
	}
}
// 拖拽
.dragClass {
	background: rgba($color: #41c21a, $alpha: 0.5) !important;
}
// 停靠
.ghostClass {
	background: rgba($color: #6cacf5, $alpha: 0.5) !important;
}
// 选择
.chosenClass:hover > td {
	background: rgba($color: #f56c6c, $alpha: 0.5) !important;
}
</style>
