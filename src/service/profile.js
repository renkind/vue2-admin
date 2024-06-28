import apis from "@/config/api";
import request from "@/utils/request";

// 获取个人信息
export function profile(data) {
	return request({
		url: apis.profile.profile,
		method: "get"
	});
}
// 修改密码
export function updatePassword(data) {
	return request({
		url: apis.profile.updatePassword,
		method: "put",
		data
	});
}
