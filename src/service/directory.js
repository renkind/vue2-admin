/* eslint-disable */
import apis from "@/config/api";
import request from "@/utils/request";

// 获取用户菜单
export function getRouters() {
	return request({
		url: apis.common.getRouters,
		method: "get"
	});
}
// 新增菜单
export function addMenu(data) {
	return request({
		url: apis.directory.add,
		method: "post",
		data: data
	});
}
// 修改菜单
export function updateMenu(data) {
	return request({
		url: apis.directory.update,
		method: "put",
		data: data
	});
}
// 查询菜单列表
export function listMenu(query) {
	return request({
		url: apis.directory.list,
		method: "get",
		params: query
	});
}
// 查询菜单详细
export function getMenu(menuId) {
	return request({
		url: `${apis.directory.detail}/${menuId}`,
		method: "get"
	});
}
// 删除菜单
export function delMenu(menuId) {
	return request({
		url: `${apis.directory.del}/${menuId}`,
		method: "delete"
	});
}
// 获取事项列表
export function getEventList(data) {
	return request({
		url: apis.event.allList,
		method: "get",
		params: data
	});
}
// 获取事项树形列表
export function getEventTreeList(data) {
	return request({
		url: apis.event.treeList,
		method: "get",
		params: data
	});
}
// 撤回
export function cancel(data) {
	return request({
		url: apis.directory.cancel,
		method: "put",
		data
	});
}
// 批量上下架
export function batchFrame(data) {
	return request({
		url: apis.directory.batchFrame,
		method: "put",
		data
	});
}
// 更新缓存
export function refreshCache() {
	return request({
		url: apis.directory.refreshCache,
		method: "get"
	});
}
