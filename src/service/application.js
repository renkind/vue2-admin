import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";
// 获取应用列表
export function listApplication(data) {
	return request({
		url: apis.application.appList,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}
// 获取应用
export function getApp(appId) {
	return request({
		url: `${apis.application.getApp}/${parseStrEmpty(appId)}`,
		method: "get"
	});
}
// 删除应用
export function delApp(appId) {
	return request({
		url: `${apis.application.delApp}/${appId}`,
		method: "delete"
	});
}
// 添加应用
export function addApp(data) {
	return request({
		url: apis.application.addApp,
		method: "post",
		data
	});
}
// 更新应用
export function updateApp(data) {
	return request({
		url: apis.application.updateApp,
		method: "put",
		data
	});
}

// 发布应用
export function submitApp(data) {
	return request({
		url: apis.application.submitApp,
		method: "post",
		data
	});
}
// 获取应用提交列表
export function submitHistoryList(data) {
	return request({
		url: apis.application.submitHistoryList,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}

// 获取应用发布列表
export function publishHistoryList(data) {
	return request({
		url: apis.application.publishHistoryList,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}
// 获取应用发布列表
export function rollBack(data) {
	return request({
		url: apis.application.rollBack,
		method: "post",
		data
	});
}

// 分页查询应用成员
export function searchMemberList(data) {
	return request({
		url: apis.application.searchMemberList,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}
// 分页查询应用成员
export function showMemberList(appId) {
	return request({
		url: `${apis.application.showMemberList}/${parseStrEmpty(appId)}`,
		method: "get"
	});
}

// 新增成员
export function addMember(data) {
	return request({
		url: apis.application.addMember,
		method: "post",
		data
	});
}

// 删除成员
export function delMember(data) {
	return request({
		url: apis.application.delMember,
		method: "delete",
		data
	});
}

// 修改成员角色
export function updateMember(data) {
	return request({
		url: apis.application.updateMember,
		method: "put",
		data
	});
}

export function addFormwork(data) {
	return request({
		url: apis.review.add,
		method: "post",
		data
	});
}
