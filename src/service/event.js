/* eslint-disable */
import request from "@/utils/request";
import apis from "@/config/api";

// 查询列表
export function getList(data) {
	return request({
		url: apis.event.list,
		method: "get",
		params: data
	});
}
// 查询全部列表
export function getAllList(data) {
	return request({
		url: apis.event.allList,
		method: "get",
		params: data
	});
}
// 添加事项
export function add(data) {
	return request({
		url: apis.event.add,
		method: "post",
		data
	});
}
// 批量下架
export function batchFrame(data) {
	return request({
		url: apis.event.batchFrame,
		method: "put",
		data
	});
}
// 获取事项详情
export function detail(id) {
	return request({
		url: `${apis.event.detail}/${id}`,
		method: "get"
	});
}
// 更新事项
export function updateEvent(data) {
	return request({
		url: `${apis.event.updateEvent}`,
		method: "put",
		data
	});
}

// 撤回
export function cancel(data) {
	return request({
		url: apis.event.cancel,
		method: "put",
		data
	});
}
// 删除
export function del(ids) {
	return request({
		url: `${apis.event.del}/${ids}`,
		method: "delete"
	});
}
// 导出
export function exportData(data) {
	return request({
		url: apis.event.exportData,
		method: "get",
		params: data,
		responseType: "blob"
	});
}
// 更新缓存
export function refreshCache() {
	return request({
		url: apis.event.refreshCache,
		method: "get"
	});
}
