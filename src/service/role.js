/* eslint-disable */
import request from "@/utils/request";
import apis from "@/config/api";

// 查询角色列表
export function listRole(query) {
	return request({
		url: apis.role.listRole,
		method: "get",
		params: query
	});
}

// 查询角色详细
export function getRole(roleId) {
	return request({
		url: `${apis.role.getRole}/${roleId}`,
		method: "get"
	});
}

// 新增角色
export function addRole(data) {
	return request({
		url: apis.role.addRole,
		method: "post",
		data: data
	});
}

// 修改角色
export function updateRole(data) {
	return request({
		url: apis.role.updateRole,
		method: "put",
		data: data
	});
}

// 角色数据权限
export function dataScope(data) {
	return request({
		url: apis.role.dataScope,
		method: "put",
		data: data
	});
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
	const data = {
		roleId,
		status
	};
	return request({
		url: apis.role.changeRoleStatus,
		method: "put",
		data: data
	});
}

// 删除角色
export function delRole(roleId) {
	return request({
		url: `${apis.role.delRole}/${roleId}`,
		method: "delete"
	});
}

// 查询角色已授权用户列表
export function allocatedUserList(query) {
	return request({
		url: apis.role.allocatedUserList,
		method: "get",
		params: query
	});
}

// 查询角色未授权用户列表
export function unallocatedUserList(query) {
	return request({
		url: apis.role.unallocatedUserList,
		method: "get",
		params: query
	});
}

// 取消用户授权角色
export function authUserCancel(data) {
	return request({
		url: apis.role.authUserCancel,
		method: "put",
		data: data
	});
}

// 批量取消用户授权角色
export function authUserCancelAll(data) {
	return request({
		url: apis.role.authUserCancelAll,
		method: "put",
		params: data
	});
}

// 授权用户选择
export function authUserSelectAll(data) {
	return request({
		url: apis.role.authUserSelectAll,
		method: "put",
		params: data
	});
}
