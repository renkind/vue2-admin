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
			<!--用户数据-->
			<el-col :span="20" :xs="24">
				<el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch" label-width="68px">
					<el-form-item label="用户账号" prop="userName">
						<el-input
							v-model="queryParams.userName"
							placeholder="请输入用户账号"
							clearable
							size="small"
							style="width: 240px"
							@keyup.enter.native="handleQuery"
						/>
					</el-form-item>
					<el-form-item label="手机号码" prop="mobile">
						<el-input
							v-model="queryParams.mobile"
							placeholder="请输入手机号码"
							clearable
							size="small"
							style="width: 240px"
							@keyup.enter.native="handleQuery"
						/>
					</el-form-item>
					<el-form-item label="状态" prop="status">
						<el-select v-model="queryParams.status" placeholder="用户状态" clearable size="small" style="width: 240px">
							<el-option
								v-for="dict in dict.type.sys_normal_disable"
								:key="dict.value"
								:label="dict.label"
								:value="dict.value"
							/>
						</el-select>
					</el-form-item>
					<el-form-item label="创建时间">
						<el-date-picker
							v-model="dateRange"
							size="small"
							style="width: 240px"
							value-format="yyyy-MM-dd"
							type="daterange"
							range-separator="-"
							start-placeholder="开始日期"
							end-placeholder="结束日期"
						></el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button
							type="primary"
							icon="el-icon-search"
							size="mini"
							v-hasPermi="['system:user:query']"
							@click="handleQuery"
							>搜索</el-button
						>
						<el-button icon="el-icon-refresh" size="mini" v-hasPermi="['system:user:resetPwd']" @click="resetQuery"
							>重置</el-button
						>
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
							v-hasPermi="['system:user:add']"
							>新增</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="success"
							plain
							icon="el-icon-edit"
							size="mini"
							:disabled="single"
							@click="handleUpdate"
							v-hasPermi="['system:user:edit']"
							>修改</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="danger"
							plain
							icon="el-icon-delete"
							size="mini"
							:disabled="multiple"
							@click="handleDelete"
							v-hasPermi="['system:user:remove']"
							>删除</el-button
						>
					</el-col>
					<!-- <el-col :span="1.5">
						<el-button
							type="info"
							plain
							icon="el-icon-upload2"
							size="mini"
							@click="handleImport"
							v-hasPermi="['system:user:import']"
							>导入</el-button
						>
					</el-col>
					<el-col :span="1.5">
						<el-button
							type="warning"
							plain
							icon="el-icon-download"
							size="mini"
							@click="handleExport"
							v-hasPermi="['system:user:export']"
							>导出</el-button
						>
					</el-col> -->
					<right-toolbar :showSearch.sync="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
				</el-row>

				<el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
					<el-table-column type="selection" width="50" align="center" :selectable="checkSelecTable" />
					<el-table-column label="用户编号" align="center" key="userId" prop="userId" v-if="columns[0].visible" />
					<el-table-column
						label="用户账号"
						align="center"
						key="userName"
						prop="userName"
						v-if="columns[1].visible"
						:show-overflow-tooltip="true"
					/>
					<el-table-column
						label="用户昵称"
						align="center"
						key="nickName"
						prop="nickName"
						v-if="columns[2].visible"
						:show-overflow-tooltip="true"
					/>
					<el-table-column
						label="部门"
						align="center"
						key="deptName"
						prop="dept.deptName"
						v-if="columns[3].visible"
						:show-overflow-tooltip="true"
					/>
					<el-table-column
						label="手机号码"
						align="center"
						key="mobile"
						prop="mobile"
						v-if="columns[4].visible"
						width="120"
					/>
					<el-table-column label="状态" align="center" key="status" v-if="columns[5].visible">
						<template slot-scope="scope" v-if="!scope.row.admin">
							<el-switch
								v-model="scope.row.status"
								active-value="0"
								inactive-value="1"
								@change="handleStatusChange(scope.row)"
							></el-switch>
						</template>
					</el-table-column>
					<el-table-column label="创建时间" align="center" prop="createTime" v-if="columns[6].visible" width="160">
						<template slot-scope="scope">
							<span>{{ day().format(scope.row.createTime) }}</span>
						</template>
					</el-table-column>
					<el-table-column label="操作" align="center" width="160" class-name="small-padding fixed-width">
						<template slot-scope="scope" v-if="!scope.row.admin">
							<el-button
								size="mini"
								type="text"
								icon="el-icon-edit"
								@click="handleUpdate(scope.row)"
								v-hasPermi="['system:user:edit']"
								>修改</el-button
							>
							<el-button
								size="mini"
								type="text"
								icon="el-icon-delete"
								@click="handleDelete(scope.row)"
								v-hasPermi="['system:user:remove']"
								>删除</el-button
							>
							<el-dropdown
								size="mini"
								@command="(command) => handleCommand(command, scope.row)"
								v-hasPermi="['system:user:resetPwd', 'system:user:edit']"
							>
								<span class="el-dropdown-link"> <i class="el-icon-d-arrow-right el-icon--right"></i>更多 </span>
								<el-dropdown-menu slot="dropdown">
									<el-dropdown-item command="handleResetPwd" icon="el-icon-key" v-hasPermi="['system:user:resetPwd']"
										>重置密码</el-dropdown-item
									>
									<el-dropdown-item
										command="handleAuthRole"
										icon="el-icon-circle-check"
										v-hasPermi="['system:user:edit']"
										>分配角色</el-dropdown-item
									>
								</el-dropdown-menu>
							</el-dropdown>
						</template>
					</el-table-column>
				</el-table>

				<pagination
					v-show="total > 0"
					:total="total"
					:page.sync="queryParams.pageNo"
					:limit.sync="queryParams.pageSize"
					@pagination="getList"
				/>
			</el-col>
		</el-row>

		<!-- 添加或修改用户配置对话框 -->
		<el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
			<el-form ref="form" :model="form" :rules="rules" label-width="80px">
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户昵称" prop="nickName">
							<el-input v-model="form.nickName" placeholder="请输入用户昵称" maxlength="30" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="单位" prop="deptId">
							<treeselect
								v-model="form.deptId"
								:options="deptOptionsEdit"
								:show-count="true"
								placeholder="请选择单位"
							/>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="手机号码" prop="mobile">
							<el-input v-model="form.mobile" placeholder="请输入手机号码" maxlength="11" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="邮箱" prop="email">
							<el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item v-if="form.userId == undefined" label="用户账号" prop="userName">
							<el-input v-model="form.userName" placeholder="请输入用户账号" maxlength="30" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item v-if="form.userId == undefined" label="用户密码" prop="password">
							<el-input v-model="form.password" placeholder="请输入用户密码" type="text" maxlength="20" disabled />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="角色" prop="roleIds">
							<el-select v-model="form.roleIds" multiple placeholder="请选择">
								<el-option
									v-for="item in roleOptions"
									:key="item.roleId"
									:label="item.roleName"
									:value="item.roleId"
									:disabled="item.status == 1"
								></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="状态">
							<el-radio-group v-model="form.status">
								<el-radio v-for="dict in dict.type.sys_normal_disable" :key="dict.value" :label="dict.value">{{
									dict.label
								}}</el-radio>
							</el-radio-group>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<!-- <el-form-item label="岗位">
							<el-select v-model="form.postIds" multiple placeholder="请选择">
								<el-option
									v-for="item in postOptions"
									:key="item.postId"
									:label="item.postName"
									:value="item.postId"
									:disabled="item.status == 1"
								></el-option>
							</el-select>
						</el-form-item> -->
					</el-col>
					<el-col :span="12">
						<!-- <el-form-item label="用户性别">
							<el-select v-model="form.sex" placeholder="请选择">
								<el-option
									v-for="dict in dict.type.sys_user_sex"
									:key="dict.value"
									:label="dict.label"
									:value="dict.value"
								></el-option>
							</el-select>
						</el-form-item> -->
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="备注">
							<el-input v-model="form.remark" type="textarea" placeholder="请输入内容"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 用户导入对话框 -->
		<el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body>
			<el-upload
				ref="upload"
				:limit="1"
				accept=".xlsx, .xls"
				:headers="upload.headers"
				:action="upload.url + '?updateSupport=' + upload.updateSupport"
				:disabled="upload.isUploading"
				:on-progress="handleFileUploadProgress"
				:on-success="handleFileSuccess"
				:auto-upload="false"
				drag
			>
				<i class="el-icon-upload"></i>
				<div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
				<div class="el-upload__tip text-center" slot="tip">
					<div class="el-upload__tip" slot="tip">
						<el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的用户数据
					</div>
					<span>仅允许导入xls、xlsx格式文件。</span>
					<el-link
						type="primary"
						:underline="false"
						style="font-size: 12px; vertical-align: baseline"
						@click="importTemplate"
						>下载模板</el-link
					>
				</div>
			</el-upload>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFileForm">确 定</el-button>
				<el-button @click="upload.open = false">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
/* eslint-disable */
import Treeselect from "@riophae/vue-treeselect";
import { listUser, getUser, delUser, addUser, updateUser, resetUserPwd, changeUserStatus } from "@/service/user";
import { getToken } from "@/utils/index";
import { treeselect } from "@/service/dept";
import { gm4 } from "@/utils";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
	name: "User",
	dicts: ["sys_normal_disable", "sys_user_sex"],
	components: { Treeselect },
	data() {
		return {
			// 遮罩层
			loading: true,
			// 选中数组
			ids: [],
			// 非单个禁用
			single: true,
			// 非多个禁用
			multiple: true,
			// 显示搜索条件
			showSearch: true,
			// 总条数
			total: 0,
			// 用户表格数据
			userList: [],
			// 弹出层标题
			title: "",
			// 部门树选项
			deptOptions: undefined,
			// 编辑弹框部门树选项
			deptOptionsEdit: undefined,
			// 是否显示弹出层
			open: false,
			// 部门名称
			deptName: undefined,
			// 默认密码
			initPassword: undefined,
			// 日期范围
			dateRange: [],
			// 岗位选项
			postOptions: [],
			// 角色选项
			roleOptions: [],
			// 表单参数
			form: {},
			defaultProps: {
				children: "children",
				label: "label"
			},
			// 用户导入参数
			upload: {
				// 是否显示弹出层（用户导入）
				open: false,
				// 弹出层标题（用户导入）
				title: "",
				// 是否禁用上传
				isUploading: false,
				// 是否更新已经存在的用户数据
				updateSupport: 0,
				// 设置上传的请求头部
				headers: { Authorization: getToken() },
				// 上传的地址
				url: `${process.env.VUE_APP_BASE_API}/system/user/importData`
			},
			// 查询参数
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				userName: undefined,
				mobile: undefined,
				status: undefined,
				deptId: undefined
			},
			// 列信息
			columns: [
				{ key: 0, label: "用户编号", visible: true },
				{ key: 1, label: "用户账号", visible: true },
				{ key: 2, label: "用户昵称", visible: true },
				{ key: 3, label: "部门", visible: true },
				{ key: 4, label: "手机号码", visible: true },
				{ key: 5, label: "状态", visible: true },
				{ key: 6, label: "创建时间", visible: true }
			],
			// 表单校验
			rules: {
				userName: [
					{ required: true, message: "用户账号不能为空", trigger: "blur" },
					{ min: 2, max: 26, message: "用户账号长度必须介于 2 和 26 之间", trigger: "blur" }
				],
				nickName: [{ required: true, message: "用户昵称不能为空", trigger: "blur" }],
				password: [{ required: true, message: "用户密码不能为空", trigger: "blur" }],
				email: [
					{
						type: "email",
						message: "'请输入正确的邮箱地址",
						trigger: ["blur", "change"]
					}
				],
				mobile: [
					{
						pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
						message: "请输入正确的手机号码",
						trigger: "blur"
					}
				],
				roleIds: [{ required: true, message: "用户角色不能为空", trigger: "blur" }],
				deptId: [{ required: true, message: "单位不能为空", trigger: "blur" }]
			}
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
		this.getConfigKey("sys.user.initPassword").then((response) => {
			this.initPassword = response.msg;
		});
	},
	methods: {
		/** 查询用户列表 */
		async getList() {
			this.loading = true;
			const res = await listUser(this.addDateRange({ ...this.queryParams, userType: "00" }, this.dateRange));
			if (res.code === 200) {
				const { list, totalCount } = res.data;
				this.userList = list;
				this.total = totalCount || 0;
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				// this.deptOptions = response.data[0].children; // 截取河南省数据，直接暴露子级
				this.deptOptions = response.data; // 截取河南省数据，直接暴露子级
				this.deptOptionsEdit = response.data; // 截取河南省数据，直接暴露子级
				console.log(this.deptOptions);
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
			this.handleQuery();
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
		// 取消按钮
		cancel() {
			this.open = false;
			this.reset();
		},
		// 表单重置
		reset(formName) {
			this.form = {
				userId: undefined,
				deptId: undefined,
				userName: undefined,
				nickName: undefined,
				password: undefined,
				mobile: undefined,
				email: undefined,
				sex: undefined,
				status: "0",
				remark: undefined,
				postIds: [],
				roleIds: []
			};
			// this.$refs[formName].resetFields();
		},
		/** 搜索按钮操作 */
		handleQuery() {
			this.queryParams.pageNo = 1;
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.dateRange = [];
			this.$refs["queryForm"].resetFields();
			this.handleQuery();
		},
		// 多选框选中数据
		handleSelectionChange(selection) {
			this.ids = selection.map((item) => item.userId);
			this.single = selection.length !== 1;
			this.multiple = !selection.length;
		},
		// 更多操作触发
		handleCommand(command, row) {
			switch (command) {
				case "handleResetPwd":
					this.handleResetPwd(row);
					break;
				case "handleAuthRole":
					this.handleAuthRole(row);
					break;
				default:
					break;
			}
		},
		/** 新增按钮操作 */
		handleAdd() {
			this.reset("form");
			this.getTreeselect();
			getUser().then((response) => {
				this.postOptions = response.posts;
				this.roleOptions = response.roles;
				this.open = true;
				this.title = "添加用户";
				this.form.password = this.initPassword;
			});
		},
		/** 修改按钮操作 */
		handleUpdate(row) {
			this.reset("form");
			this.getTreeselect();
			const userId = row.userId || this.ids;
			getUser(userId).then((response) => {
				this.form = response.data;
				console.log(this.form);
				this.postOptions = response.posts;
				this.roleOptions = response.roles;
				this.form.postIds = response.postIds;
				this.form.roleIds = response.roleIds;
				this.open = true;
				this.title = "修改用户";
				this.form.password = "";
			});
		},
		/** 重置密码按钮操作 */
		handleResetPwd(row) {
			this.$prompt(`请输入 ${row.userName} 的新密码`, "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				closeOnClickModal: false,
				inputPattern: /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#@!~%^&*])[a-zA-Z\d#@!~%^&*]{8,16}/,
				inputErrorMessage: "密码必须包含大小写字母,数字,包含特殊字符(8-16)位"
			})
				.then(({ value }) => {
					resetUserPwd(row.userId, gm4().encrypt(value)).then((response) => {
						this.$message.success("修改成功");
					});
				})
				.catch(() => {});
		},
		/** 分配角色操作 */
		handleAuthRole(row) {
			console.log(row.userId);
			// this.$router.push(`/system/user-auth/role/${userId}`);
			this.$router.push("/system/userauth/" + row.userId);
		},
		/** 提交按钮 */
		submitForm() {
			this.$refs["form"].validate(async (valid) => {
				if (valid) {
					if (this.form.userId !== undefined) {
						console.log("this.form", this.form);
						const res = await updateUser(this.form);
						console.log("res", res);
						if (res.code === 200) {
							this.$message.success("修改成功");
							this.open = false;
							this.getList();
						} else {
							this.$message.error(res.msg);
						}
					} else {
						// 密码加密
						let obj = {
							...this.form,
							userType: "00"
						};
						obj.password = gm4().encrypt(this.form.password);
						const res = await addUser(obj);
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
			const userIds = row.userId || this.ids;
			this.$msgbox
				.confirm(`是否确认删除用户编号为 ${userIds} 的数据项`)
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
		/** 导出按钮操作 */
		handleExport() {
			this.download(
				"system/user/export",
				{
					...this.queryParams
				},
				`user_${new Date().getTime()}.xlsx`
			);
		},
		/** 导入按钮操作 */
		handleImport() {
			this.upload.title = "用户导入";
			this.upload.open = true;
		},
		/** 下载模板操作 */
		importTemplate() {
			this.download("system/user/importTemplate", {}, `user_template_${new Date().getTime()}.xlsx`);
		},
		// 文件上传中处理
		handleFileUploadProgress(event, file, fileList) {
			this.upload.isUploading = true;
		},
		// 文件上传成功处理
		handleFileSuccess(response, file, fileList) {
			this.upload.open = false;
			this.upload.isUploading = false;
			this.$refs.upload.clearFiles();
			this.$alert(
				`<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>
					${response.msg}
					</div>`,
				"导入结果",
				{ dangerouslyUseHTMLString: true }
			);
			this.getList();
		},
		// 提交上传文件
		submitFileForm() {
			this.$refs.upload.submit();
		},
		// 禁止选择超级管理员
		checkSelecTable(row) {
			return !row.admin;
		}
	}
};
</script>
