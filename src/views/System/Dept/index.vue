<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
			<el-form-item label="部门名称" prop="deptName">
				<el-input
					v-model="queryParams.deptName"
					placeholder="请输入部门名称"
					clearable
					size="small"
					@keyup.enter.native="handleQuery"
				/>
			</el-form-item>
			<el-form-item label="状态" prop="status">
				<el-select v-model="queryParams.status" placeholder="部门状态" clearable size="small">
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
					size="mini"
					v-hasPermi="['system:dept:query']"
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
					v-hasPermi="['system:dept:add']"
					>新增</el-button
				>
			</el-col>
			<el-col :span="1.5">
				<el-button type="info" plain icon="el-icon-sort" size="mini" @click="toggleExpandAll">展开/折叠</el-button>
			</el-col>
			<el-col :span="1.5" v-if="userRoles">
				<el-button type="info" plain icon="el-icon-refresh" size="mini" @click="refreshCache">刷新缓存</el-button>
			</el-col>
			<right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
		</el-row>

		<el-table
			v-if="refreshTable"
			v-loading="loading"
			:data="deptList"
			row-key="deptId"
			:default-expand-all="isExpandAll"
			:tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
		>
			<el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
			<el-table-column prop="orderNum" label="排序" width="100"></el-table-column>
			<el-table-column label="创建时间" align="center" prop="createTime" width="200">
				<template slot-scope="scope">
					<span>{{ day().format(scope.row.createTime) }}</span>
				</template>
			</el-table-column>
			<el-table-column prop="leader" label="负责人" width="100"></el-table-column>
			<el-table-column prop="phone" label="联系电话" width="200"></el-table-column>
			<el-table-column prop="status" label="状态" width="100">
				<template slot-scope="scope">
					<dict-tag :options="dict.type.sys_normal_disable" :value="scope.row.status" />
				</template>
			</el-table-column>
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button
						size="mini"
						type="text"
						icon="el-icon-edit"
						@click="handleUpdate(scope.row)"
						v-hasPermi="['system:dept:edit']"
						>修改</el-button
					>
					<el-button
						size="mini"
						type="text"
						icon="el-icon-plus"
						@click="handleAdd(scope.row)"
						v-hasPermi="['system:dept:add']"
						>新增</el-button
					>
					<el-button
						v-if="scope.row.parentId != 0"
						size="mini"
						type="text"
						icon="el-icon-delete"
						@click="handleDelete(scope.row)"
						v-hasPermi="['system:dept:remove']"
						>删除</el-button
					>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加或修改学校对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-row>
					<el-col :span="24" v-if="form.parentId !== 0">
						<el-form-item label="上级部门" prop="parentId">
							<treeselect
								v-model="form.parentId"
								:options="deptOptions"
								:normalizer="normalizer"
								placeholder="选择上级部门"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部门名称" prop="deptName">
							<el-input v-model="form.deptName" placeholder="请输入部门名称" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="显示排序" prop="orderNum">
							<el-input-number :min="1" :max="9999" v-model="form.orderNum" controls-position="right" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="负责人" prop="leader">
							<el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="联系电话" prop="phone">
							<el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="部门状态">
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
import Treeselect from "@riophae/vue-treeselect";
import { listDept, getDept, delDept, addDept, updateDept, listDeptExcludeChild, refreshCache } from "@/service/dept";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
	name: "Dept",
	dicts: ["sys_normal_disable"],
	components: { Treeselect },
	data() {
		return {
			userRoles: true,
			// 遮罩层
			loading: true,
			// 显示搜索条件
			showSearch: true,
			// 表格树数据
			deptList: [],
			// 学校树选项
			deptOptions: [],
			// 弹出层标题
			title: "",
			// 是否显示弹出层
			open: false,
			// 是否展开，默认全部展开
			isExpandAll: true,
			// 重新渲染表格状态
			refreshTable: true,
			// 查询参数
			queryParams: {
				deptName: undefined,
				status: undefined
			},
			// 表单参数
			form: {},
			// 表单校验
			rules: {
				parentId: [{ required: true, message: "上级部门不能为空", trigger: "blur" }],
				deptName: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
				orderNum: [{ required: true, message: "显示排序不能为空", trigger: "blur" }],
				email: [
					{
						type: "email",
						message: "'请输入正确的邮箱地址",
						trigger: ["blur", "change"]
					}
				],
				phone: [
					{
						pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
						message: "请输入正确的手机号码",
						trigger: "blur"
					}
				]
			}
		};
	},
	created() {
		// admin 超级管理员
		// approver 教育局管理员
		// common 学校管理员
		const rolesData = JSON.parse(localStorage.getItem("userRoles"));
		this.userRoles = rolesData.includes("admin") || rolesData.includes("approver");
		this.getList();
		console.log("dict.type.sys_normal_disable", this.dict.type.sys_normal_disable);
	},
	methods: {
		// 刷新缓存
		async refreshCache() {
			const res = await refreshCache();
			if (res.code === 200) {
				this.$message.success(res.msg);
			} else {
				this.$message.error(res.msg);
			}
		},
		/** 查询学校列表 */
		async getList() {
			this.loading = true;
			const res = await listDept(this.queryParams);
			console.log("resres", res);
			if (res.code === 200) {
				this.deptList = this.handleTree(res.data, "deptId");
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		/** 转换学校数据结构 */
		normalizer(node) {
			if (node.children && !node.children.length) {
				delete node.children;
			}
			return {
				id: node.deptId,
				label: node.deptName,
				children: node.children
			};
		},
		// 取消按钮
		cancel() {
			this.open = false;
			this.reset();
		},
		// 表单重置
		reset() {
			this.form = {
				deptId: undefined,
				parentId: undefined,
				deptName: undefined,
				orderNum: undefined,
				leader: undefined,
				phone: undefined,
				email: undefined,
				status: "0"
			};
			// this.$refs["form"].resetFields();
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.$refs["queryForm"].resetFields();
			this.handleQuery();
		},
		/** 新增按钮操作 */
		async handleAdd(row) {
			this.reset();
			if (row !== undefined) {
				this.form.parentId = row.deptId;
			}
			this.open = true;
			this.title = "添加部门";
			const res = await listDept();
			if (res.code === 200) {
				this.deptOptions = this.handleTree(res.data, "deptId");
			} else {
				this.$message.error(res.msg);
			}
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
			this.reset();
			const res = await getDept(row.deptId);
			if (res.code === 200) {
				const { status } = res.data;
				this.form = {
					...res.data,
					status: status.toString()
				};
				this.open = true;
				this.title = "修改部门";
			} else {
				this.$message.error(res.msg);
			}
			listDeptExcludeChild(row.deptId)
				.then((response) => {
					this.deptOptions = this.handleTree(response.data, "deptId");
				})
				.catch((err) => this.$message.error(err));
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate(async (valid) => {
				if (valid) {
					if (this.form.deptId !== undefined) {
						const res = await updateDept(this.form);
						if (res.code === 200) {
							this.$message.success("修改成功");
							this.open = false;
							this.getList();
						} else {
							this.$message.error(res.msg);
						}
					} else {
						const res = await addDept(this.form);
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
			this.$confirm(`是否确认删除名称为${row.deptName} 的数据项？`, {
				beforeClose: async (action, instance, done) => {
					if (action === "confirm") {
						const res = await delDept(row.deptId);
						if (res.code === 200) {
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
		}
	}
};
</script>
