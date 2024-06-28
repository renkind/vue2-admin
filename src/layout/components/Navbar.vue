<template>
	<div class="navbar">
		<hamburger
			id="hamburger-container"
			:is-active="sidebar.opened"
			class="hamburger-container"
			@toggleClick="toggleSideBar"
		/>
		<breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
		<top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

		<div class="right-menu">
			<el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
				<div class="avatar-wrapper">
					<img :src="avatar" class="user-avatar" />
					<i class="el-icon-caret-bottom" />
				</div>
				<el-dropdown-menu slot="dropdown">
					<el-dropdown-item divided @click.native="resetPasswordFN">
						<span>修改密码</span>
					</el-dropdown-item>
					<el-dropdown-item divided @click.native="logout">
						<span>退出登录</span>
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
		<span class="right-menu" style="float: right; display: inline-block; margin-right: 60px"
			>欢迎您，{{ username }}</span
		>
		<!-- 用户导入对话框 -->
		<el-dialog
			title="修改密码"
			:visible.sync="showModal"
			width="450px"
			append-to-body
			:show-close="false"
			:close-on-click-modal="false"
		>
			<el-form ref="resetPassword" :model="resetPassword" :rules="resetPasswordRules" class="login-form">
				<el-form-item prop="oldPassword">
					<el-input
						v-model="resetPassword.oldPassword"
						auto-complete="off"
						placeholder="旧密码"
						:type="oldPasswordtype ? 'password' : 'text'"
					>
						<svg-icon
							:iconClass="oldPasswordtype ? 'eye' : 'eye-open'"
							slot="append"
							@click="updateOldPassword"
						></svg-icon>
					</el-input>
				</el-form-item>
				<el-form-item prop="password1">
					<el-input
						v-model="resetPassword.password1"
						auto-complete="off"
						placeholder="新密码"
						:type="inputType1 ? 'password' : 'text'"
					>
						<svg-icon :iconClass="inputType1 ? 'eye' : 'eye-open'" slot="append" @click="updateNewP1"></svg-icon>
					</el-input>
				</el-form-item>
				<el-form-item prop="password2">
					<el-input
						v-model="resetPassword.password2"
						auto-complete="off"
						placeholder="确认新密码"
						:type="inputType2 ? 'password' : 'text'"
					>
						<svg-icon :iconClass="inputType2 ? 'eye' : 'eye-open'" slot="append" @click="updateNewP2"></svg-icon>
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitFileForm">确 定</el-button>
				<el-button @click="cancel">取 消</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
import { mapState } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import TopNav from "@/components/TopNav";
import Hamburger from "@/components/Hamburger";
import Screenfull from "@/components/Screenfull";
import SizeSelect from "@/components/SizeSelect";
import RuoYiGit from "@/components/RuoYi/Git";
import RuoYiDoc from "@/components/RuoYi/Doc";
import avatar from "@/assets/images/profile.jpg";
import { updatePassword } from "@/service/profile";
import { gm4 } from "@/utils";

export default {
	components: {
		Breadcrumb,
		TopNav,
		Hamburger,
		Screenfull,
		SizeSelect,
		RuoYiGit,
		RuoYiDoc
	},
	data() {
		const checkPassword1 = (rule, value, callback) => {
			const regex = /^(?!.*\s)(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W_]).{8,16}$/;
			const reg = new RegExp(regex);
			if (!value) {
				return callback(new Error("密码不能为空"));
			} else if (value.length < 6) {
				return callback(new Error("密码长度不能小于6位"));
			} else if (!reg.test(value)) {
				return callback(new Error("密码必须包含大小写字母,数字,包含特殊字符(8-16)位"));
			} else {
				callback();
			}
		};
		const checkPassword2 = (rule, value, callback) => {
			if (!value) {
				return callback(new Error("密码不能为空"));
			} else if (value !== this.resetPassword.password1) {
				return callback(new Error("两次输入的密码不一致"));
			} else {
				callback();
			}
		};
		return {
			avatar,
			username: JSON.parse(localStorage.getItem("user")).nickName
				? JSON.parse(localStorage.getItem("user")).nickName
				: "",
			showModal: false,
			inputType1: true,
			inputType2: true,
			oldPasswordtype: true,
			resetPassword: {
				password1: "",
				password2: "",
				oldPassword: ""
			},
			resetPasswordRules: {
				oldPassword: [{ required: true, trigger: "blur", message: "旧密码不能为空" }],
				password1: [{ required: true, trigger: "blur", validator: checkPassword1 }],
				password2: [{ required: true, trigger: "blur", validator: checkPassword2 }]
			}
		};
	},
	created() {
		console.log("avataravatar", this.avatar);
		console.log("avataravatar", this.device);
	},
	computed: {
		...mapState("app", ["sidebar", "device"]),
		setting: {
			get() {
				return this.$store.state.settings.showSettings;
			},
			set(val) {
				this.$store.dispatch("settings/changeSetting", {
					key: "showSettings",
					value: val
				});
			}
		},
		topNav: {
			get() {
				return this.$store.state.settings.topNav;
			}
		}
	},
	methods: {
		// 旧密码
		updateOldPassword() {
			this.oldPasswordtype = !this.oldPasswordtype;
		},
		// 密码1
		updateNewP1() {
			this.inputType1 = !this.inputType1;
		},
		// 密码2
		updateNewP2() {
			this.inputType2 = !this.inputType2;
		},
		// 确认
		submitFileForm() {
			this.$refs["resetPassword"].validate(async (valid) => {
				if (valid) {
					console.log("this.resetPassword", this.resetPassword);
					const submitForm = {
						oldPassword: gm4().encrypt(this.resetPassword.oldPassword),
						newPassword: gm4().encrypt(this.resetPassword.password2)
					};
					const res = await updatePassword(submitForm);
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.cancel();
						this.$store.dispatch("app/LogOut").then(() => {
							// location.href = "/index";
							// to do 退出
							window.location.href = `/login?redirect=${window.location.pathname}`;
						});
					} else {
						this.$message.error(res.msg);
					}
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		// 取消
		cancel() {
			this.$refs["resetPassword"].resetFields();
			this.showModal = false;
		},
		// 修改密码
		resetPasswordFN() {
			this.showModal = true;
		},
		toggleSideBar() {
			this.$store.dispatch("app/toggleSideBar");
		},
		async logout() {
			this.$confirm("确定注销并退出系统吗？", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.$store.dispatch("app/LogOut").then(() => {
						window.location.href = "/login";
					});
				})
				.catch(() => {});
		}
	}
};
</script>

<style lang="scss" scoped>
.navbar {
	height: 50px;
	overflow: hidden;
	position: relative;
	background: #fff;
	box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

	.hamburger-container {
		line-height: 46px;
		height: 100%;
		float: left;
		cursor: pointer;
		transition: background 0.3s;
		-webkit-tap-highlight-color: transparent;

		&:hover {
			background: rgba(0, 0, 0, 0.025);
		}
	}

	.breadcrumb-container {
		float: left;
	}

	.topmenu-container {
		position: absolute;
		left: 50px;
	}

	.errLog-container {
		display: inline-block;
		vertical-align: top;
	}

	.right-menu {
		float: right;
		height: 100%;
		line-height: 50px;

		&:focus {
			outline: none;
		}

		.right-menu-item {
			display: inline-block;
			padding: 0 8px;
			height: 100%;
			font-size: 18px;
			color: #5a5e66;
			vertical-align: text-bottom;

			&.hover-effect {
				cursor: pointer;
				transition: background 0.3s;

				&:hover {
					background: rgba(0, 0, 0, 0.025);
				}
			}
		}

		.avatar-container {
			margin-right: 30px;

			.avatar-wrapper {
				margin-top: 5px;
				position: relative;

				.user-avatar {
					cursor: pointer;
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

				.el-icon-caret-bottom {
					cursor: pointer;
					position: absolute;
					right: -20px;
					top: 25px;
					font-size: 12px;
				}
			}
		}
	}
}
</style>
