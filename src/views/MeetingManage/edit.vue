<template>
	<div class="edit-continer">
		<div class="content">
			<ZsTopButton>
				<el-button type="primary" @click="submit">提交</el-button>
				<el-button @click="cancel">返回</el-button>
			</ZsTopButton>
			<el-form ref="formParams" :model="formParams" :rules="rules" label-width="100px" style="margin-top: 10px">
				<el-form-item label="帐号" prop="userName">
					<el-input v-model="formParams.userName" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="用户名" prop="nickName">
					<el-input v-model="formParams.nickName" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="单位" prop="deptId">
					<el-cascader
						v-model="formParams.deptId"
						:options="deptOptions"
						filterable
						:props="{ expandTrigger: 'hover', value: 'id', checkStrictly: true }"
					></el-cascader>
				</el-form-item>
				<el-form-item label="角色" prop="role">
					<el-select v-model="formParams.role" clearable placeholder="请选择">
						<el-option v-for="item in roleOptions" :key="item.roleId" :label="item.roleName" :value="item.roleId">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="职务" prop="office">
					<el-input v-model="formParams.office" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="用户状态" prop="status">
					<el-switch v-model="formParams.status" active-value="0" inactive-value="1" active-color="#13ce66">
					</el-switch>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import ZsTopButton from "@/components/Zs_topButton";
import { getDicts } from "@/service/dict/data";
import { treeselect } from "@/service/dept";
import { getUser, addUser, updateUser } from "@/service/user";

export default {
	components: {
		ZsTopButton
	},
	data() {
		return {
			formParams: {
				status: "0"
			},
			deptOptions: [],
			roleOptions: [],
			isCreate: true,
			rules: {
				userName: [{ required: true, message: "帐号不能为空", trigger: "blur" }],
				nickName: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
				deptId: [{ required: true, message: "单位不能为空", trigger: "change" }],
				role: [{ required: true, message: "角色不能为空", trigger: "change" }],
				office: [{ required: true, message: "职务不能为空", trigger: "blur" }]
			} // 校验规则
		};
	},
	mounted() {
		const judge = this.$route.params.id;
		this.getRoles();
		// this.getDicts("meeting_role");
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
		submit(approvalStatus) {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid) {
					if (this.isCreate) {
						const params = {
							nickName: this.formParams.nickName,
							userName: this.formParams.userName,
							// password: gm4().encrypt("Abcd1234!"),
							content: this.formParams.content,
							office: this.formParams.office,
							status: this.formParams.status,
							roleIds: [this.formParams.role],
							deptId: this.formParams.deptId.slice(-1) * 1,
							userType: "01"
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
							...this.formParams,
							nickName: this.formParams.nickName,
							userName: this.formParams.userName,
							content: this.formParams.content,
							office: this.formParams.office,
							status: this.formParams.status,
							roleIds: [this.formParams.role],
							deptId: this.formParams.deptId.slice(-1) * 1,
							userType: "01"
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
					return false;
				}
			});
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				this.deptOptions = response.data;
				this.getCascaderValue(this.formParams.deptId, this.deptOptions);
			});
		},
		/** 查询角色 */
		getRoles() {
			getUser().then((response) => {
				this.roleOptions = response.roles;
			});
		},
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
					...params,
					userName: params.userName,
					nickName: params.nickName,
					role: params.roleIds[0],
					office: params.office
				};
				this.getTreeselect();
			} else {
				this.$message.error(res.msg);
			}
		},
		getCascaderValue(id, arr, parentList) {
			console.log(id, arr, parentList);
			const idArr = parentList ?? [];
			/* 递归寻找id 并返回级联回显格式 */
			for (const i in arr) {
				console.log(i);
				if (arr[i].id * 1 === id * 1) {
					idArr.push(arr[i].id);
				} else {
					if (arr[i].children && arr[i].children.length > 0) {
						idArr.push(arr[i].id);
						this.getCascaderValue(id, arr[i].children, idArr);
						break;
					}
				}
			}
			this.formParams.deptId = idArr ?? [];
			console.log(this.formParams.deptId);
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
}
</style>
