<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
			<el-form-item label="菜单名称" prop="menuName">
				<el-input
					v-model="queryParams.menuName"
					placeholder="请输入菜单名称"
					clearable
					size="small"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="菜单状态" clearable size="small">
					<el-option
						v-for="dict in dict.type.sys_normal_disable"
						:key="dict.value"
						:label="dict.label"
						:value="dict.value"
					/>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button
					type="primary"
					icon="el-icon-search"
					v-hasPermi="['system:menu:query']"
					size="mini"
					@click="handleQuery"
					>搜索</el-button
				>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>

		<el-row :gutter="10" class="m-b-10">
			<el-col :span="1.5">
				<el-button
					type="primary"
					plain
					icon="el-icon-plus"
					size="mini"
					@click="handleAdd"
					v-hasPermi="['system:menu:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table
			v-if="refreshTable"
			v-loading="loading"
			:data="menuList"
			row-key="menuId"
			:default-expand-all="isExpandAll"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="160"></el-table-column>
			<el-table-column prop="icon" label="图标" align="center" width="100">
				<template slot-scope="scope">
					<svg-icon :icon-class="scope.row.icon" />
				</template>
			</el-table-column>
			<el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
			<el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
			<el-table-column prop="status" label="状态" width="80">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime">
				<template slot-scope="scope">
					<span>{{ day().format(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<!-- v-hasPermi="['system:menu:edit']" -->
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="text"
						icon="el-icon-edit"
						v-hasPermi="['system:menu:edit']"
						@click="handleUpdate(scope.row)"
						>修改</el-button
					>
					<!-- v-hasPermi="['system:menu:add']" -->
					<el-button
						size="mini"
						type="text"
						icon="el-icon-plus"
						v-hasPermi="['system:menu:add']"
						@click="handleAdd(scope.row)"
						>新增</el-button
					>
					<!-- v-hasPermi="['system:menu:remove']" -->
					<el-button
						size="mini"
						type="text"
						icon="el-icon-delete"
						v-hasPermi="['system:menu:remove']"
						@click="handleDelete(scope.row)"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加或修改菜单对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="100px">
				<el-row>
					<el-col :span="24">
						<el-form-item label="上级菜单">
							<treeselect
								v-model="form.parentId"
								:options="menuOptions"
								:normalizer="normalizer"
								:show-count="true"
								placeholder="选择上级菜单"
							/>
						</el-form-item>
					</el-col>
					<el-col :span="24">
						<el-form-item label="菜单类型" prop="menuType">
							<el-radio-group v-model="form.menuType">
								<el-radio label="M">目录</el-radio>
								<el-radio label="C">菜单</el-radio>
								<el-radio label="F">按钮</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="24" v-if="form.menuType !== 'F'">
						<el-form-item label="菜单图标" prop="icon">
							<el-popover placement="bottom-start" width="460" trigger="click" @show="$refs['iconSelect'].reset()">
								<IconSelect ref="iconSelect" @selected="selected" />
								<el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>
									<svg-icon
										v-if="form.icon"
										slot="prefix"
										:icon-class="form.icon"
										class="el-input__icon"
										style="height: 32px; width: 16px"
									/>
									<i v-else slot="prefix" class="el-icon-search el-input__icon" />
								</el-input>
							</el-popover>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="菜单名称" prop="menuName">
							<el-input v-model="form.menuName" placeholder="请输入菜单名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="显示排序" prop="orderNum">
							<el-input-number :min="1" :max="9999" v-model="form.orderNum" controls-position="right" />
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType !== 'F'">
						<el-form-item>
							<span slot="label">
								<el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								是否外链
							</span>
							<el-radio-group v-model="form.frame">
								<el-radio label="0">是</el-radio>
								<el-radio label="1">否</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType !== 'F'">
						<el-form-item prop="path">
							<span slot="label">
								<el-tooltip
									content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
									placement="top"
								>
									<i class="el-icon-question"></i>
								</el-tooltip>
								路由地址
							</span>
							<el-input v-model="form.path" placeholder="请输入路由地址" />
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item prop="component">
							<span slot="label">
								<el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								组件路径
							</span>
							<el-input v-model="form.component" placeholder="请输入组件路径" />
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType !== 'M'">
						<el-form-item>
							<el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
							<span slot="label">
								<el-tooltip
									content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
									placement="top"
								>
									<i class="el-icon-question"></i>
								</el-tooltip>
								权限字符
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item>
							<el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
							<span slot="label">
								<el-tooltip content="访问路由的默认传递参数，如：`{'id': 1, 'name': 'ry}`" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								路由参数
							</span>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType == 'C'">
						<el-form-item>
							<span slot="label">
								<el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								是否缓存
							</span>
							<el-radio-group v-model="form.cache">
								<el-radio label="0">缓存</el-radio>
								<el-radio label="1">不缓存</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType !== 'F'">
						<el-form-item>
							<span slot="label">
								<el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								显示状态
							</span>
							<el-radio-group v-model="form.visible">
								<el-radio v-for="dict in dict.type.sys_show_hide" :key="dict.value" :label="dict.value">{{
									dict.label
								}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
					<el-col :span="12" v-if="form.menuType !== 'F'">
						<el-form-item>
							<span slot="label">
								<el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
									<i class="el-icon-question"></i>
								</el-tooltip>
								菜单状态
							</span>
							<el-radio-group v-model="form.status">
								<el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
									dict.label
								}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* eslint-disable */
import Treeselect from "@riophae/vue-treeselect";
import IconSelect from "@/components/IconSelect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import { listMenu, getMenu, delMenu, addMenu, updateMenu } from "@/service/menus";
export default {
	name: "Menu",
	dicts: ["sys_show_hide", "sys_normal_disable"],
	components: { Treeselect, IconSelect },
	data() {
		return {
			// 遮罩层
			loading: true,
			// 显示搜索条件
			showSearch: true,
			// 菜单表格树数据
			menuList: [],
			// 菜单树选项
			menuOptions: [],
			// 弹出层标题
			title: "",
			// 是否显示弹出层
			open: false,
			// 是否展开，默认全部折叠
			isExpandAll: false,
			// 重新渲染表格状态
			refreshTable: true,
			// 查询参数
			queryParams: {
				menuName: undefined,
				visible: undefined
			},
			// 表单参数
			form: {},
			// 表单校验
			rules: {
				menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
				orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
				path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
			}
		};
	},
	created() {
		this.getList();
	},
	methods: {
		// 选择图标
		selected(name) {
			this.form.icon = name;
		},
		/** 查询菜单列表 */
		async getList() {
			this.loading = true;
			const res = await listMenu(this.queryParams);
			if (res.code === 200) {
				this.menuList = this.handleTree(res.data, "menuId");
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		/** 转换菜单数据结构 */
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.menuId,
				label: node.menuName,
				children: node.children
			};
		},
		/** 查询菜单下拉树结构 */
		getTreeselect() {
			listMenu().then((response) => {
				this.menuOptions = [];
				const menu = { menuId: 0, menuName: "主类目", children: [] };
				menu.children = this.handleTree(response.data, "menuId");
				this.menuOptions.push(menu);
			});
		},
		// 取消按钮
		cancel() {
			this.open = false;
			this.reset();
		},
		// 表单重置
		reset() {
			this.form = {
				menuId: undefined,
				parentId: 0,
				menuName: undefined,
				icon: undefined,
				menuType: "M",
				orderNum: undefined,
				frame: "1",
				cache: "0",
				visible: "0",
				status: "0"
			};
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			// this.resetForm("queryForm");
			// this.$refs["queryForm"].resetFields();
			this.queryParams = {};
			this.handleQuery();
		},
		/** 新增按钮操作 */
		handleAdd(row) {
			this.reset();
			this.getTreeselect();
			if (row != null && row.menuId) {
				this.form.parentId = row.menuId;
			} else {
				this.form.parentId = 0;
			}
			// this.$refs["form"].resetFields();
			this.open = true;
			this.title = "添加菜单";
		},
		/** 展开/折叠操作 */
		toggleExpandAll() {
			this.refreshTable = false;
			this.isExpandAll = !this.isExpandAll;
			this.$nextTick(() => {
				this.refreshTable = true;
			});
		},
		/** 修改按钮操作 */
		async handleUpdate(row) {
			// this.reset();
			this.getTreeselect();
			const res = await getMenu(row.menuId);
			if (res.code === 200) {
				this.form = res.data;
				this.open = true;
				this.title = "修改菜单";
			} else {
				this.$message.error(res.msg);
			}
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate(async (valid) => {
				if (valid) {
					if (this.form.menuId !== undefined) {
						const res = await updateMenu(this.form);
						if (res.code === 200) {
							this.$message.success("修改成功");
							this.open = false;
							this.getList();
						} else {
							this.$message.error(res.msg);
						}
					} else {
						const res = await addMenu(this.form);
						if (res.code === 200) {
							this.$message.success("新增成功");
							this.open = false;
							this.getList();
						} else {
							this.$message.error(res.msg);
						}
					}
				}
			});
		},
		/** 删除按钮操作 */
		handleDelete(row) {
			this.$confirm(`是否确认删除名称为${row.menuName}的数据项？`, {
				beforeClose: async (action, instance, done) => {
					if (action === "confirm") {
						const res = await delMenu(row.menuId);
						if (res.code === 200) {
							// const totalPage = Math.ceil((this.total - 1) / this.queryParams.pageSize);
							// const currentPage = this.queryParams.pageNo > totalPage ? totalPage : this.queryParams.pageNo;
							// this.queryParams.pageNo = currentPage < 1 ? 1 : currentPage;
							this.getList();
							this.$message.success("删除成功");
						} else {
							this.$message.error(res.msg);
						}
						done();
					} else {
						done();
					}
				}
			});
			// this.$modal
			// 	.confirm(`是否确认删除名称为 + ${row.menuName} + 的数据项？`)
			// 	.then(() => {
			// 		return delMenu(row.menuId);
			// 	})
			// 	.then(() => {
			// 		this.getList();
			// 		this.$message.success("删除成功");
			// 	})
			// 	.catch(() => {});
		}
	}
};
</script>
