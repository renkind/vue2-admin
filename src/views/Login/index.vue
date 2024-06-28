<template>
	<div class="login">
		<p class="title">
			{{ appTitle }}
		</p>
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form">
			<p style="font-size: 24px; font-weight: bold; margin-bottom: 32px">{{ "登录" }}</p>
			<el-form-item prop="username">
				<el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="登录账号">
					<svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"></svg-icon>
				</el-input>
			</el-form-item>
			<el-form-item prop="password">
				<el-input
					v-model="loginForm.password"
					type="password"
					auto-complete="off"
					placeholder="登录密码"
					@keyup.enter.native="handleLogin"
				>
					<svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"></svg-icon>
				</el-input>
			</el-form-item>
			<!-- <el-form-item prop="code" v-if="captchaOnOff">
				<el-input
					v-model="loginForm.code"
					auto-complete="off"
					placeholder="验证码"
					style="width: 75%"
					@keyup.enter.native="handleLogin"
				>
					<svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"></svg-icon>
				</el-input>
				<div class="login-code">
					<img :src="codeUrl" @click="getCode" class="login-code-img" />
				</div>
			</el-form-item> -->
			<el-form-item style="width: 100%">
				<el-button
					:loading="loading"
					size="medium"
					type="primary"
					style="width: 100%; height: 60px; border-radius: 30px"
					@click.native.prevent="handleLogin"
				>
					<span style="font-size: 16px" v-if="!loading">登&nbsp;&nbsp;录</span>
					<span style="font-size: 16px" v-else>登 录 中...</span>
				</el-button>
			</el-form-item>
			<el-form-item style="width: 100%">
				<el-checkbox v-model="loginForm.rememberMe" style="margin: 0px 0px 0px 24px">记住密码</el-checkbox>
				<div style="font-size: 14px; text-align: right; height: 40px; float: right; display: flex; color: #1684fc">
					忘记密码请联系管理员
				</div>
			</el-form-item>
		</el-form>
		<!--  底部  -->
		<div class="el-login-footer">
			<span>Copyright © {{ footText }}&nbsp;&nbsp;</span>
			<span
				><a href="http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=41010502003436"
					>豫公网安备41061102000325号&nbsp;&nbsp;</a
				></span
			>
			<span><a href="https://beian.miit.gov.cn/#/Integrated/index">豫ICP备2022026417号</a></span>
		</div>
	</div>
</template>

<script>
import Cookies from "js-cookie";
import { mapActions } from "vuex";
import { getCodeImg } from "@/service/login";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import appConfig from "@/config/app";
// import router from "@/router";
export default {
	name: "Login",
	data() {
		return {
			appTitle: appConfig.appTitle,
			footText: appConfig.footText,
			codeUrl: "",
			loginForm: {
				username: "",
				password: "",
				rememberMe: false,
				code: "",
				uuid: ""
			},
			loginRules: {
				username: [{ required: true, trigger: "blur", message: "请输入您的账号" }],
				password: [{ required: true, trigger: "blur", message: "请输入您的密码" }]
				// code: [{ required: true, trigger: "change", message: "请输入验证码" }]
			},
			loading: false,
			// 验证码开关
			captchaOnOff: false,
			// 注册开关
			register: false,
			redirect: undefined
		};
	},
	watch: {
		// $route: {
		// 	handler: function (route) {
		// 		this.redirect = route.query && route.query.redirect;
		// 	},
		// 	immediate: true
		// }
	},
	created() {
		this.getCode();
		this.getCookie();
		localStorage.clear();
		console.log(this.loginForm);
	},
	// computed:{
	// },
	methods: {
		...mapActions("app", ["Login"]),
		async getCode() {
			const res = await getCodeImg();
			console.log("resres", res);
			if (res.code === 200) {
				this.captchaOnOff = res.captchaOnOff === undefined ? true : res.data.captchaOnOff;
				if (this.captchaOnOff) {
					this.codeUrl = `data:image/gif;base64,${res.data.img}`;
					this.loginForm.uuid = res.data.uuid;
				}
			} else {
				this.$message.error("获取验证码失败");
			}
		},
		getCookie() {
			const username = Cookies.get("username");
			const password = Cookies.get("password");
			const rememberMe = Cookies.get("rememberMe");
			this.loginForm = {
				username: username === undefined ? this.loginForm.username : username,
				password: password === undefined ? this.loginForm.password : decrypt(password), // 对密码解密
				rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
			};
		},

		handleLogin() {
			this.$refs.loginForm.validate((valid) => {
				if (valid) {
					this.loading = true;
					if (this.loginForm.rememberMe) {
						Cookies.set("username", this.loginForm.username, { expires: 30 });
						Cookies.set("password", encrypt(this.loginForm.password), {
							// 对存在cookie里的密码加密
							expires: 30
						});
						Cookies.set("rememberMe", this.loginForm.rememberMe, {
							expires: 30
						});
					} else {
						Cookies.remove("username");
						Cookies.remove("password");
						Cookies.remove("rememberMe");
					}

					// 登陆
					this.Login({
						data: this.loginForm,
						router: this.$router
					}).catch((err) => {
						// console.log("errerrerrerr", err);
						this.$message.error(err);
						this.getCode();
					});
					this.loading = false;
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.login {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
	// background-image: url("../../assets/loginBg.jpg");
	background-size: cover;
}

.title {
	margin-bottom: 120px;
	text-align: center;
	color: #101010 100%;
	font-size: 48px;
	font-weight: bold;
	line-height: 70px;
}

.login-form {
	width: 440px;
	.el-form-item {
		margin-bottom: 40px;
	}
	.el-input {
		line-height: 60px;
		::v-deep .el-input__inner {
			border-radius: 30px;
			height: 60px;
			padding-left: 69px;
		}
		.input-icon {
			height: 20px;
			width: 20px;
			margin-left: 30px;
			margin-top: 20px;
		}
	}
}

.login-tip {
	font-size: 13px;
	text-align: center;
	color: #bfbfbf;
}

.login-code {
	width: 23%;
	height: 60px;
	float: right;
	display: flex;
	justify-content: flex-end;
	align-items: center;
}

.el-login-footer {
	height: 40px;
	line-height: 40px;
	position: fixed;
	bottom: 0;
	width: 100%;
	text-align: center;
	color: #fff;
	font-family: Arial;
	font-size: 12px;
	letter-spacing: 1px;
}

.login-code-img {
	height: 36px;
}
</style>
