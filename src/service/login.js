import apis from "@/config/api";
import request from "@/utils/request";

// 登录
export function login(data) {
	return request({
		url: apis.common.login,
		method: "post",
		data
	});
}
// 图片验证码
export function getCodeImg(data) {
	// _${new Date().getTime()}
	return request({
		url: `${apis.common.captchaImg}?_${new Date().getTime()}`,
		method: "get"
	});
}
// 获取用户信息
export function getUserInfo(data) {
	return request({
		url: apis.common.getInfo,
		method: "get"
	});
}

// 退出方法
export function logout() {
	return request({
		url: apis.common.logout,
		method: "post"
	});
}
