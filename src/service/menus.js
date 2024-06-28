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
		url: apis.menu.add,
		method: "post",
		data: data
	});
}
// 修改菜单
export function updateMenu(data) {
	return request({
		url: apis.menu.update,
		method: "put",
		data: data
	});
}
// 查询菜单列表
export function listMenu(query) {
	return request({
		url: apis.menu.list,
		method: "get",
		params: query
	});
}
// 查询菜单详细
export function getMenu(menuId) {
	return request({
		url: `${apis.menu.detail}/${menuId}`,
		method: "get"
	});
}
// 删除菜单
export function delMenu(menuId) {
	return request({
		url: `${apis.menu.del}/${menuId}`,
		method: "delete"
	});
}
// 查询菜单下拉树结构
export function treeselect() {
	return request({
		url: apis.menu.treeselect,
		method: "get"
	});
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
	return request({
		url: `${apis.menu.roleTree}/${roleId}`,
		method: "get"
	});
}
