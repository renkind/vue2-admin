<template>
	<div class="edit-continer">
		<div class="content">
			<el-form
				ref="formParams"
				:model="formParams"
				:rules="rules"
				label-width="100px"
				style="margin-top: 10px; width: 50%"
			>
				<el-form-item label="帐号" prop="userName">
					<el-input v-model="formParams.userName" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="nickName">
					<el-input v-model="formParams.nickName" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="单位" prop="deptId" class="dept">
					<el-cascader
						v-model="formParams.deptId"
						:options="deptOptions"
						:props="{ expandTrigger: 'hover', value: 'id', checkStrictly: true }"
						clearable
						show-all-levels
					></el-cascader>
				</el-form-item>
				<el-form-item label="参会角色" prop="role">
					<el-select v-model="formParams.role" clearable placeholder="请选择">
						<el-option v-for="item in roleOptions" :key="item.roleId" :label="item.dictLabel" :value="item.dictValue">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="职务" prop="office">
					<el-input v-model="formParams.office" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="主持工作" prop="job">
					<el-input v-model="formParams.job" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="formParams.remark" placeholder="说明参会人员请假以外的特殊情况" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="用户状态" prop="status">
					<el-switch v-model="formParams.status" active-value="0" inactive-value="1" active-color="#13ce66">
					</el-switch>
				</el-form-item>
			</el-form>
			<ZsBotButton>
				<el-button type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">返回</el-button>
			</ZsBotButton>
		</div>
	</div>
</template>
<script>
import ZsBotButton from "@/components/Zs_bottomButton";
import { getDicts } from "@/service/dict/data";
import { treeselect } from "@/service/dept";
import { getUser, addUser, updateUser } from "@/service/user";

export default {
	components: {
		ZsBotButton
	},
	data() {
		return {
			formParams: {
				status: "0",
				office: "" // 初始化为空
			},
			officeError: "",
			deptOptions: [],
			roleOptions: [],
			isCreate: true,
			rules: {
				userName: [{ required: true, message: "帐号不能为空", trigger: "blur" }],
				nickName: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
				deptId: [{ required: true, message: "单位不能为空", trigger: "change" }],
				role: [{ required: true, message: "参会角色不能为空", trigger: "change" }],
				office: [{ required: true, message: "职务不能为空", trigger: "blur" }]
			} // 校验规则
		};
	},
	mounted() {
		const judge = this.$route.params.id;
		// this.getRoles();
		this.getDicts("meeting_role");
		if (judge) {
			console.log("修改");
			this.getDetail();
			this.isCreate = false;
		} else {
			this.isCreate = true;
			this.getTreeselect();
			console.log("新增");
		}
	},
	methods: {
		// 处理用户输入，只允许输入中文和限制长度
		isChinese(text) {
			return /^[\u4e00-\u9fa5-\u3001]+$/g.test(text);
		},
		submit(approvalStatus) {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid && this.isChinese(this.formParams.office)) {
					if (this.isCreate) {
						const params = {
							nickName: this.formParams.nickName,
							userName: this.formParams.userName,
							content: this.formParams.content,
							office: this.formParams.office,
							status: this.formParams.status,
							personRole: this.formParams.role,
							deptId: this.formParams.deptId.slice(-1) * 1,
							userType: "01",
							mcWork: this.formParams.job,
							remark: this.formParams.remark
						};
						const res = await addUser(params);
						if (res.code === 200) {
							this.$message.success(res.msg);
							this.$router.back();
						} else {
							this.$message.error(res.msg);
						}
					} else {
						const params = {
							userId: this.formParams.userId,
							nickName: this.formParams.nickName,
							userName: this.formParams.userName,
							content: this.formParams.content,
							office: this.formParams.office,
							status: this.formParams.status,
							personRole: this.formParams.role,
							deptId: this.formParams.deptId.slice(-1) * 1,
							userType: "01",
							mcWork: this.formParams.job,
							remark: this.formParams.remark
						};
						const res = await updateUser(params);
						if (res.code === 200) {
							this.$message.success(res.msg);
							this.$router.back();
						} else {
							this.$message.error(res.msg);
						}
					}
				} else {
					this.$message.error("职务只允许输入中文");
					return false;
				}
			});
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				this.deptOptions = response.data;
				console.log(this.deptOptions, "this.deptOptionsthis.deptOptions");
				if (!this.isCreate) {
					this.getCascaderValue(this.formParams.deptId_read, this.deptOptions, []);
				}
			});
		},
		// /** 查询角色 */
		// getRoles() {
		// 	getUser().then((response) => {
		// 		this.roleOptions = response.roles;
		// 	});
		// },
		// 获取角色字典内容
		getDicts(dict) {
			getDicts(dict).then((response) => {
				this.roleOptions = response.data;
				console.log(this.roleOptions);
			});
		},
		async getDetail() {
			const { id } = this.$route.params;
			const res = await getUser(id);
			if (res.code === 200) {
				const params = res.data;
				this.formParams = {
					userId: params.userId,
					userName: params.userName,
					nickName: params.nickName,
					role: params.personRole,
					office: params.office,
					status: params.status,
					deptId_read: params.deptId,
					job: params.mcWork,
					remark: params.remark
				};
				this.getTreeselect();
			} else {
				this.$message.error(res.msg);
			}
		},
		/* 递归寻找id 并返回级联回显格式 */
		getCascaderValue(id, obj, parentList) {
			const idArr = parentList ?? [];
			for (const i in obj) {
				if (obj[i].id * 1 === id * 1) {
					idArr.push(obj[i].id);
					console.log(idArr);
					this.$set(this.formParams, "deptId", idArr);
					break;
				} else {
					console.log(obj[i].id);
					if (obj[i].children && obj[i].children.length > 0) {
						const parentIds = idArr.concat([obj[i].id]);
						this.getCascaderValue(id, obj[i].children, parentIds);
					}
				}
			}
		},
		// 返回
		cancel() {
			this.$router.back();
		}
	}
};
</script>
<style lang="scss" scoped>
.content {
	flex-direction: column;
	align-items: center;

	// .dept {
	// 	width: 748px !important;
	// }
	::v-deep .el-input__inner {
		width: 748px !important;
	}
}
</style>
