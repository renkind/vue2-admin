<template>
	<div class="app-container">
		<el-form :model="queryParams" ref="queryForm" :inline="true">
			<el-form-item label="应用名称" prop="name">
				<el-input v-model="queryParams.name" placeholder="请输入用户姓名" clearable size="small" style="width: 150px"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="应用标识" prop="applyMark">
				<el-input v-model="queryParams.applyMark" placeholder="请输入应用标识" clearable size="small" style="width: 150px"
					@keyup.enter.native="handleQuery" />
			</el-form-item>
			<el-form-item label="服务类型" prop="serviceType">
				<el-select v-model="queryParams.serviceType" placeholder="所有" clearable size="small">
					<el-option v-for="dict in dict.type.app_service_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item label="应用类型" prop="applyType">
				<el-select v-model="queryParams.applyType" placeholder="所有" clearable size="small">
					<el-option v-for="dict in dict.type.app_apply_type" :key="dict.value" :label="dict.label"
						:value="dict.value" />
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
				<el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
			</el-form-item>
		</el-form>
		<el-row :gutter="10" class="m-b-10" v-show="isAllApplication">
			<el-col :span="1.5">
				<el-button type="primary" icon="el-icon-plus" plain size="mini" @click="handleAdd"
					v-hasPermi="['app:info:add']">添加应用</el-button>
			</el-col>
		</el-row>

		<el-table v-loading="loading" :data="applicationList">
			<el-table-column label="应用名称" align="center" key="applyName" prop="applyName" v-if="columns[0].visible"
				:show-overflow-tooltip="true" />
			<el-table-column label="应用标识" align="center" key="applyMark" prop="applyMark" v-if="columns[1].visible"
				:show-overflow-tooltip="true" />
			<el-table-column label="应用类型" align="center" key="applyType" prop="applyType" :formatter="getApplyypeName"
				v-if="columns[2].visible" :show-overflow-tooltip="true" />
			<el-table-column label="服务类型" align="center" key="serviceType" prop="serviceType"
				:formatter="getServiceTypeName" v-if="columns[3].visible" :show-overflow-tooltip="true" />
			<el-table-column label="创建人" align="center" key="createBy" prop="createBy" v-if="columns[4].visible"
				:show-overflow-tooltip="true" />
			<el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
				<template slot-scope="scope">
					<el-button size="mini" type="text" @click="handleDesign(scope.row)">设计</el-button>
					<el-button size="mini" type="text" @click="handleSubmitHistory(scope.row)">提交记录</el-button>
					<el-button v-if="!scope.row.appMember || (scope.row.appMember && scope.row.appMember.roleType != '2')"
						size="mini" type="text" @click="handlePublish(scope.row.id)">发布</el-button>
					<el-button size="mini" type="text" @click="handlePublishHistory(scope.row)">发布历史</el-button>
					<el-button v-if="!scope.row.appMember || (scope.row.appMember && scope.row.appMember.roleType != '2')"
						size="mini" type="text" @click="handleMemberManage(scope.row.id)">成员管理</el-button>
					<el-button v-if="!scope.row.appMember || (scope.row.appMember && scope.row.appMember.roleType != '2')"
						size="mini" type="text" @click="handleApplicationTemplate(scope.row.id)">申请成为模板</el-button>
					<el-button v-if="!scope.row.appMember || (scope.row.appMember && scope.row.appMember.roleType == '0')"
						size="mini" type="text" @click="handleDelete(scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!-- 添加应用对话框 -->
		<el-dialog :title="title" :visible.sync="addApplyOpen" width="60%" append-to-body>
			<el-form ref="form" :model="form" :rules="rules">
				<el-row>
					<el-col :span="24">
						<el-form-item label="应用名称" prop="applyName">
							<el-input v-model="form.applyName" placeholder="请输入用户昵称" maxlength="30" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="应用标识" prop="applyMark">
							<el-input v-model="form.applyMark" placeholder="请输入应用标识" maxlength="30" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="应用描述" prop="content">
							<el-input v-model="form.content" type="textarea" placeholder="请输入应用描述"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="服务类型" prop="serviceType">
							<el-select v-model="form.serviceType" clearable placeholder="请选择">
								<el-option v-for="dict in dict.type.app_service_type" :key="dict.value" :label="dict.label"
									:value="dict.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="应用类型" prop="applyType">
							<el-select v-model="form.applyType" clearable placeholder="请选择">
								<el-option v-for="dict in dict.type.app_apply_type" :key="dict.value" :label="dict.label"
									:value="dict.value"></el-option>
							</el-select>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="业务单位联系人姓名" prop="contacts">
							<el-input v-model="form.contacts" placeholder="请输入业务单位联系人姓名" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="业务单位联系人手机号" prop="mobile">
							<el-input v-model="form.mobile" placeholder="业务单位联系人手机号" maxlength="11" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div style="color: black;font-size: 700w;">
				已选模板
			</div>
			<div style="width: 100%;display: flex;flex-direction: row;flex-wrap: wrap; 	justify-content: flex-start">
				<div v-for='template in templateList' :key='template.id'
					:class="['showTemplate', { 'templateSelected': form.appFormWorkId == template.id }]"
					@click="handleChooseTemplate(template.id)">

					<el-image fit="cover" :src="`${imagePath}${template.logoUrl}`" :alt="`${template.name}`" style="width: 100%;height: 100%;">
					</el-image>
					<div class="des">{{ template.name }}</div>
				</div>
			</div>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 提交记录对话框 -->
		<el-dialog :title="title" :dialogRow="dialogRow" :visible.sync="submitHistoryOpen" width="80%" append-to-body>
			<el-table v-loading="loading" :data="submitHistoryList">
				<el-table-column label="序号" type="index" align="center">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="提交日期" align="center" prop="createTime" width="180">
					<template slot-scope="scope">
						<span>{{ day().format(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="提交ID" align="center" key="id" prop="id" :show-overflow-tooltip="true" />
				<el-table-column label="版本号" align="center" key="version" prop="version" :show-overflow-tooltip="true" />
				<el-table-column label="描述" align="center" key="content" prop="content" :show-overflow-tooltip="true" />
				<el-table-column label="发布人员" align="center" key="createBy" prop="createBy" :show-overflow-tooltip="true" />
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope"
						v-if="!dialogRow.appMember || (dialogRow.appMember && dialogRow.appMember.roleType == '1')">
						<el-button size="mini" type="text" @click="handleRollback(scope.row)">回滚</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 发布对话框 -->
		<el-dialog :title="title" :visible.sync="publishOpen" width="50%" append-to-body>
			<el-form ref="form" :model="form" :rules="rules">
				<el-row>
					<el-col :span="24">
						<el-form-item label="版本号" prop="version">
							<el-input v-model="form.version" placeholder="请输入版本号" maxlength="30" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="24">
						<el-form-item label="描述" prop="content">
							<el-input v-model="form.content" type="textarea" placeholder="请输入描述"></el-input>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 发布记录对话框 -->
		<el-dialog :title="title" :dialogRow="dialogRow" :visible.sync="publishHistoryOpen" width="80%" append-to-body>
			<el-table v-loading="loading" :data="publishHistoryList">
				<el-table-column label="序号" type="index" align="center">
					<template slot-scope="scope">
						<span>{{ scope.$index + 1 }}</span>
					</template>
				</el-table-column>
				<el-table-column label="提交日期" align="center" prop="createTime" width="180">
					<template slot-scope="scope">
						<span>{{ day().format(scope.row.createTime) }}</span>
					</template>
				</el-table-column>
				<el-table-column label="提交ID" align="center" key="id" prop="id" :show-overflow-tooltip="true" />
				<el-table-column label="版本号" align="center" key="version" prop="version" :show-overflow-tooltip="true" />
				<el-table-column label="描述" align="center" key="content" prop="content" :show-overflow-tooltip="true" />
				<el-table-column label="发布人员" align="center" key="createBy" prop="createBy" :show-overflow-tooltip="true" />
				<el-table-column label="操作" align="center" class-name="small-padding fixed-width">
					<template slot-scope="scope"
						v-if="!dialogRow.appMember || (dialogRow.appMember && dialogRow.appMember.roleType == '1')">
						<el-button size="mini" type="text" @click="handleDownload(scope.row)">下载</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 申请模板对话框 -->
		<el-dialog :title="title" :visible.sync="applyOpen" width="50%" append-to-body>
			<el-form ref="form" :model="form" :rules="rules">
				<el-row>
					<el-form-item label="模板名称" prop="telplateName">
						<el-input v-model="form.telplateName" placeholder="请输入模板名称" maxlength="30" />
					</el-form-item>
				</el-row>
				<el-form-item label="模板logo">
					<ZsimageUpload :action="option.action" :isList="option.isList" :accept="option.accept"
						:file-list="option.initdata" :disabled="formModal.id ? true : false" :maxFile="1"
						@updateFileList="updateFileListCallBak" :options="option" :maxKb="2048" :sizePic="'165 * 165'" />
				</el-form-item>
				<el-row>
					<el-form-item label="申请理由" prop="content">
						<el-input v-model="form.content" type="textarea" placeholder="请输入申请理由"></el-input>
					</el-form-item>
				</el-row>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>

		<!-- 成员管理对话框 -->
		<el-dialog :title="title" :visible.sync="memberManageOpen" width="50%" append-to-body>
			<div style="margin-bottom: 15px;">
				选择要邀请的成员
			</div>
			<el-input v-model="queryParams.memberName" placeholder="搜索成员" clearable size="small" style="width: 100%"
				@input="handleSearchMemberManage" />
			<el-table v-if="resultMemberList != null && resultMemberList.length > 0" :show-header="false"
				v-loading="loading" :data="resultMemberList">
				<el-table-column align="left" key="userName" prop="userName" :show-overflow-tooltip="true" />
				<el-table-column label="" align="right" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-button type="primary" @click="handleAddMember(scope.row)">添加成员</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div style="margin-top: 50px;margin-bottom: 15px;">
				现有用户
			</div>
			<el-table v-loading="loading" :data="memberList">
				<el-table-column :label="`项目成员${memberList.length}人`" align="left" key="sysUser.userName"
					prop="sysUser.userName" :show-overflow-tooltip="true" />
				<el-table-column align="right" class-name="small-padding fixed-width">
					<template slot-scope="scope">
						<el-select @change="handleUpdateMember(scope.row)" v-model="scope.row.roleType" placeholder="研发人员"
							size="small" style="width:100px">
							<el-option v-for="dict in dict.type.sys_role_type" :key="dict.value" :label="dict.label"
								:value="dict.value" />
						</el-select>
						<el-button style="margin-left: 20px;" size="mini" type="text"
							@click="handleDelMember(scope.row)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button type="primary" @click="submitForm">确 定</el-button> -->
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
		<pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
			@pagination="getList" />

	</div>
</template>
<script>
/* eslint-disable */
import Treeselect from "@riophae/vue-treeselect";
import { listApplication, addApp, delApp, updateApp, getApp, submitApp, submitHistoryList, publishHistoryList, rollBack, showMemberList, searchMemberList, addMember, delMember, updateMember, addFormwork } from "@/service/application";
import { reviewPageList } from "@/service/review";
import { getToken } from "@/utils/index";
import ZsimageUpload from "@/components/Zs_form/Zs_imageUpload";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import apis from "@/config/api";

export default {
	name: "User",
	dicts: ["app_service_type", "app_apply_type", "sys_role_type"],
	components: { Treeselect },
	components: {
		ZsimageUpload
	},
	data() {
		return {
			// 遮罩层
			loading: true,
			imagePath: apis.common.imgUrl,
			isAllApplication: !this.$route.meta.isAllApplication,
			// 选中数组
			ids: [],
			// 非单个禁用
			single: true,
			// 非多个禁用
			multiple: true,
			// 总条数
			total: 0,
			// 应用表格数据
			applicationList: [],
			submitHistoryList: [],
			publishHistoryList: [],
			memberList: [],
			resultMemberList: [],
			templateList: [],
			// 弹出层标题
			title: "",
			dialogRow: {},
			// 是否显示弹出层
			addApplyOpen: false,
			publishOpen: false,
			applyOpen: false,
			publishHistoryOpen: false,
			submitHistoryOpen: false,
			memberManageOpen: false,
			// 表单参数
			form: {},
			defaultProps: {
				children: "children",
				label: "label"
			},
			applyTemplateImageUrl: '',
			// 用户导入参数
			upload: {
				// 是否显示弹出层（用户导入）
				addApplyOpen: false,
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
			},
			// 列信息
			columns: [
				{ key: 0, label: "应用名称", visible: true },
				{ key: 1, label: "应用标识", visible: true },
				{ key: 2, label: "应用类型", visible: true },
				{ key: 3, label: "服务类型", visible: true },
				{ key: 4, label: "创建人", visible: true },
				{ key: 5, label: "操作", visible: true },
			],
			// 表单校验
			rules: {

				applyName: [{ required: true, message: "应用名称不能为空", trigger: "blur" }],
				logoUrl: [{ required: true, message: '请上传模板logo', trigger: 'change' }],
				telplateName: [{ required: true, message: "模板名称不能为空", trigger: "blur" }],
				applyMark: [{ required: true, message: "应用标识不能为空", trigger: "blur" }],
				content: [{ required: true, message: "应用描述不能为空", trigger: "blur" }],
				version: [{ required: true, message: "应用版本号不能为空", trigger: "blur" }],
				serviceType: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
				applyType: [{ required: true, message: '请选择活动区域', trigger: 'change' }],
				mobile: [
					{
						required: true,
						pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
						message: "请输入正确的手机号码",
						trigger: "blur"
					}
				],
				contacts: [
					{ required: true, message: "用户姓名不能为空", trigger: "blur" },
					{ min: 2, max: 26, message: "用户姓名长度必须介于 2 和 26 之间", trigger: "blur" }
				],
				// applyType: [{ required: true, message: "应用类型不能为空", trigger: "blur" }],
				// serviceType: [{ required: true, message: "服务类型不能为空", trigger: "blur" }],

			},
			option: {
				isList: true, // 列表展示
				action: "#", // 上传文件的接口地址
				accept: "image/png, image/jpg,image/jpeg", // 接受文件的上传类型
				initdata: []
			},
			formModal: {
				pictureUrl: "", // 图片链接地址
				name: "", // 轮播图名称
				orderNum: "", // 排序
				apiUrl: "", //  外链地址
				id: ""
			},
		};
	},
	watch: {

	},
	created() {
		this.getList();
	},
	methods: {
		getServiceTypeName(row, column) {
			let typeid = row.serviceType;
			let typeLabel;
			for (let i = 0; i < this.dict.type.app_service_type.length; i++) {
				if (typeid == this.dict.type.app_service_type[i].value) {
					typeLabel = this.dict.type.app_service_type[i].label
				}
			}
			return typeLabel;
		},
		getApplyypeName(row, column) {
			let typeid = row.serviceType;
			let typeLabel;
			for (let i = 0; i < this.dict.type.app_apply_type.length; i++) {
				if (typeid == this.dict.type.app_apply_type[i].value) {
					typeLabel = this.dict.type.app_apply_type[i].label
				}
			}
			return typeLabel;
		},
		/** 查询应用列表 */
		async getList() {
			this.loading = true;
			const res = await listApplication(this.queryParams);
			if (res.code === 200) {
				const { list, totalCount } = res.data;
				this.applicationList = list;
				this.total = totalCount || 0;
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		// 取消按钮
		cancel() {
			this.addApplyOpen = false;
			this.publishOpen = false;
			this.applyOpen = false;
			this.publishHistoryOpen = false;
			this.submitHistoryOpen = false;
			this.memberManageOpen = false;
			this.reset();
		},
		// 表单重置
		reset(formName) {
			this.form = {
				userId: undefined,
				applyName: undefined,
				remark: undefined,
				applyType: undefined,
				appFormWorkId: undefined
			};
			// this.$refs[formName].resetFields();
		},
		/** 搜索按钮操作 */
		handleQuery() {
			console.log("res", this.queryParams);
			this.queryParams.pageNo = 1;
			this.getList();
		},
		/** 重置按钮操作 */
		resetQuery() {
			this.$refs["queryForm"].resetFields();
			this.handleQuery();
		},
		/** 新增按钮操作 */
		async handleAdd() {
			this.reset("form");
			let param = {
				"pageNo": 1,
				"pageSize": 100,
			}
			reviewPageList(param).then((res) => {
				this.addApplyOpen = true;
				this.title = "添加应用";
				const { list, totalCount } = res.data;
				this.templateList = list;
			});
		},
		/** 新建应用选择模板 */
		handleChooseTemplate(appFormWorkId) {
			if (this.form.appFormWorkId == appFormWorkId) {
				this.form.appFormWorkId = "";
			} else {
				this.form.appFormWorkId = appFormWorkId;
			}
		},
		/** 提交按钮 */
		submitForm() {
			if (this.addApplyOpen) {
				this.$refs["form"].validate(async (valid) => {
					if (valid) {
						console.log("this.form", this.form);
						// 密码加密
						let obj = {
							...this.form
						};
						const res = await addApp(obj);
						if (res.code === 200) {
							this.$message.success("新增成功");
							this.addApplyOpen = false;
							this.getList();
						} else {
							this.$message.error(res.msg);
						}
					}
				});

			} else if (this.publishOpen) {
				this.$refs["form"].validate(async (valid) => {
					if (valid) {
						console.log("this.form", this.form);
						// 密码加密
						let obj = {
							...this.form
						};
						const res = await submitApp(obj);
						if (res.code === 200) {
							this.$message.success("发布成功");
							this.addApplyOpen = false;
							this.cancel();
						} else {
							this.$message.error(res.msg);
						}
					}
				});
			} else if (this.applyOpen) {
				this.$refs["form"].validate(async (valid) => {
					if (valid) {
						console.log("this.form", this.form);
						console.log(this.form);
						console.log(this.formModal.pictureUrl);
						let param = {
							"name": this.form.telplateName,
							"logoUrl": this.formModal.pictureUrl,
							"appId": this.form.applyId,
							"content": this.form.content,
						};
						console.log(param);
						const res = await addFormwork(param);
						if (res.code === 200) {
							this.$message.success("申请成功");
							this.addApplyOpen = false;
							this.cancel();
						} else {
							this.$message.error(res.msg);
						}
					}
				});
			}
		},

		/** 设计操作 */
		handleDesign(row) {
			const routerUrl = this.$router.resolve({
				path: "/engine",
				query: {
					"id": row.id,
				}
			})
			window.open(routerUrl.href, '_blank')
		},
		/** 提交记录操作 */
		async handleSubmitHistory(row) {
			this.reset("form");
			this.loading = true;
			let param = {
				"pageNo": 1,
				"pageSize": 10,
				"applyId": row.id
			}
			const res = await submitHistoryList(param);
			if (res.code === 200) {
				const { list, totalCount } = res.data;
				this.submitHistoryList = list;
				this.submitHistoryOpen = true;
				this.title = "提交历史";
				this.dialogRow = row;
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		/** 发布 */
		handlePublish(appId) {
			this.reset("form");
			submitHistoryList().then((response) => {
				this.publishOpen = true;
				this.title = "应用发布";
				this.form.applyId = appId;
			});
		},
		/** 发布历史 */
		async handlePublishHistory(row) {
			this.reset("form");
			this.loading = true;
			let param = {
				"pageNo": 1,
				"pageSize": 10,
				"applyId": row.id
			}
			const res = await publishHistoryList(param);
			if (res.code === 200) {
				const { list, totalCount } = res.data;
				this.publishHistoryList = list;
				this.publishHistoryOpen = true;
				this.dialogRow = row;
				this.title = "发布历史";
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},
		/** 成员管理 */
		async handleMemberManage(appId) {
			this.reset("form");
			this.loading = true;
			const res = await showMemberList(appId);
			if (res.code === 200) {
				const list = res.data;
				this.memberList = list;
				this.memberManageOpen = true;
				this.title = "成员管理";
				this.form.applyId = appId;
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},

		async handleSearchMemberManage() {
			this.resultMemberList = [];
			const res = await searchMemberList({
				"mark": this.queryParams.memberName,
			});
			if (res.code === 200) {
				const list = res.data;
				this.resultMemberList = list;
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
		},

		/** 申请成为模板 */
		handleApplicationTemplate(appId) {
			this.reset("form");
			this.applyOpen = true;
			this.title = "申请成为模板";
			this.form.applyId = appId;
		},
		/** 删除按钮操作 */
		handleDelete(row) {
			const applyName = row.applyName;
			this.$msgbox
				.confirm(`是否删除此应用(${applyName})`)
				.then(() => delApp(appId))
				.then(() => {
					this.getList();
					this.$message.success("删除成功");
				})
				.catch(() => { });
		},
		handleDownload(row) {
			console.log(row);
			this.download.zip(
				{
					fileName: row.dataUrl
				}
			);
		},
		handleRollback(row) {
			let param = { "applyId": row.applyId, "version": row.version, "content": row.content, "dataUrl": row.dataUrl };
			rollBack(param).then(() => {
				this.$message.success("回滚成功");
				this.handleSubmitHistory(this.dialogRow);
			})
				.catch(() => { });
		},
		async handleAddMember(row) {
			let obj = {
				"applyId": this.form.applyId,
				"userId": row.userId,
				"roleType": "2"
			};
			const res = await addMember(obj);
			if (res.code === 200) {
				this.$message.success("新增成功");
				this.handleMemberManage(this.form.applyId);
			} else {
				this.$message.error(res.msg);
			}
		},
		async handleDelMember(row) {
			let obj = {
				"applyId": this.form.applyId,
				"id": row.id,
			};
			const res = await delMember(obj);
			if (res.code === 200) {
				this.$message.success("删除成功");
				this.handleMemberManage(this.form.applyId);
			} else {
				this.$message.error(res.msg);
			}
		},
		async handleUpdateMember(row) {
			console.log(row)
			console.log("row")
			let obj = {
				"applyId": this.form.applyId,
				"id": row.id,
				"roleType": row.roleType
			};
			const res = await updateMember(obj);
			if (res.code === 200) {
				this.$message.success("更新成功");
				this.handleMemberManage(this.form.applyId);
			} else {
				this.$message.error(res.msg);
				this.handleMemberManage(this.form.applyId);

			}
		},
		// 图片上传的回调
		updateFileListCallBak(row) {
			if (row.length > 0) {
				this.formModal.pictureUrl = row[0].rurl;
				console.log("row", row[0].url);
			}
		},

	}
};
</script>

<style>
.avatar-uploader .el-upload {
	border: 1px dashed #d9d9d9;
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
}

.avatar-uploader .el-upload:hover {
	border-color: #409EFF;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	line-height: 178px;
	text-align: center;
}

.avatar {
	width: 178px;
	height: 178px;
	display: block;
}

.showTemplate {
	margin-top: 15px;
	width: 20%;
	overflow: hidden;
	display: flex;
	align-items: center;
	border-color: white;
	border-width: 3px;
	border-style: solid;
	aspect-ratio: 1;
	flex-direction: column;
}

.templateSelected {
	border-color: #358FF0;

}
.des {
	width: 18%;
  font-size: 14px;
  position: absolute;
  color: white;
  bottom: 12%;
  text-align: center;
  letter-spacing: 1px;
}
</style>
