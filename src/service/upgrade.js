import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";

// 获取用户
export function getUser(userId) {
	return request({
		url: `${apis.user.getUser}/${parseStrEmpty(userId)}`,
		method: "get"
	});
}

// 升级管理列表查询
export function upgrade(data, fileType) {
	return request({
		url: `${apis.upgradeManagement.upgrade}?fileType=${fileType}&pageNo=${data.pageNo}&pageSize=${data.pageSize}`,
		method: "get"
	});
}

// 升级管理发布页面发布新增
export function addAndroid(data) {
	return request({
		url: `${apis.upgradeManagement.addAndroid}`,
		method: "post",
		data
	});
}
