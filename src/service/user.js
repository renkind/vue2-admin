import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";
// 获取用户列表
export function listUser(data) {
	return request({
		url: apis.user.listUser,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}
// 获取用户
export function getUser(userId) {
	return request({
		url: `${apis.user.getUser}/${parseStrEmpty(userId)}`,
		method: "get"
	});
}
// 删除用户
export function delUser(userId) {
	return request({
		url: `${apis.user.delUser}/${userId}`,
		method: "delete"
	});
}
// 添加用户
export function addUser(data) {
	return request({
		url: apis.user.addUser,
		method: "post",
		data
	});
}
// 更新用户
export function updateUser(data) {
	return request({
		url: apis.user.updateUser,
		method: "put",
		data
	});
}
// 重制密码
export function resetUserPwd(userId, password) {
	const data = {
		userId,
		password
	};
	return request({
		url: apis.user.resetUserPwd,
		method: "put",
		data
	});
}
// 更新用户状态
export function changeUserStatus(userId, status) {
	const data = {
		userId,
		status
	};
	return request({
		url: apis.user.changeUserStatus,
		method: "put",
		data
	});
}

// 查询用户个人信息
export function getUserProfile() {
	return request({
		url: apis.user.getUserProfile,
		method: "get"
	});
}

// 修改用户个人信息
export function updateUserProfile(data) {
	return request({
		url: apis.user.updateUserProfile,
		method: "put",
		data
	});
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
	const data = {
		oldPassword,
		newPassword
	};
	return request({
		url: apis.user.updateUserPwd,
		method: "put",
		params: data
	});
}

// 用户头像上传
export function uploadAvatar(data) {
	return request({
		url: apis.user.uploadAvatar,
		method: "post",
		data
	});
}

// 查询授权角色
export function getAuthRole(userId) {
	return request({
		url: `${apis.user.getAuthRole}/${userId}`,
		method: "get"
	});
}

// 保存授权角色
export function updateAuthRole(data) {
	return request({
		url: apis.user.updateAuthRole,
		method: "put",
		params: data
	});
}
