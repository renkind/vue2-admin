/* eslint-disable */
import request from "@/utils/request";
import apis from "@/config/api";

// 查询列表
export function getList(data) {
	return request({
		url: apis.header.list,
		method: "get",
		params: data
	});
}
// 删除
export function del(ids) {
	return request({
		url: `${apis.header.del}/${ids}`,
		method: "delete"
	});
}
// 新增
export function add(data) {
	return request({
		url: apis.header.add,
		method: "post",
		data
	});
}

// 编辑
export function edit(data) {
	return request({
		url: apis.header.edit,
		method: "put",
		data
	});
}

// 详情
export function detail(ids) {
	return request({
		url: `${apis.header.detail}/${ids}`,
		method: "get"
	});
}

// 批量上下架
export function batchFrame(data) {
	return request({
		url: apis.header.batchFrame,
		method: "put",
		data
	});
}
// 撤回
export function cancel(data) {
	return request({
		url: apis.header.cancel,
		method: "put",
		data
	});
}
// 更新缓存
export function refreshCache() {
	return request({
		url: apis.header.refreshCache,
		method: "get"
	});
}