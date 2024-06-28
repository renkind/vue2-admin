import apis from "@/config/api";
import request from "@/utils/request";

// 查询部门列表
export function listDept(query) {
	return request({
		url: apis.dept.listDept,
		method: "get",
		params: query
	});
}

// 查询部门列表（排除节点）
export function listDeptExcludeChild(deptId) {
	return request({
		url: `${apis.dept.listDeptExcludeChild}/${deptId}`,
		method: "get"
	});
}

// 查询部门详细
export function getDept(deptId) {
	return request({
		url: `${apis.dept.getDept}/${deptId}`,
		method: "get"
	});
}

// 查询部门下拉树结构
export function treeselect() {
	return request({
		url: apis.dept.treeselect,
		method: "get"
	});
}

// 根据角色ID查询部门树结构
export function roleDeptTreeselect(roleId) {
	return request({
		url: `${apis.dept.roleDeptTreeselect}/${roleId}`,
		method: "get"
	});
}

// 新增部门
export function addDept(data) {
	return request({
		url: apis.dept.addDept,
		method: "post",
		data
	});
}

// 修改部门
export function updateDept(data) {
	return request({
		url: apis.dept.updateDept,
		method: "put",
		data
	});
}

// 删除部门
export function delDept(deptId) {
	return request({
		url: `${apis.dept.delDept}/${deptId}`,
		method: "delete"
	});
}

// 获取部门下拉树用户
export function treeselectUser(deptId) {
	const did = JSON.parse(window.localStorage.getItem("user")).deptId ?? "";
	return request({
		url: `${apis.dept.deptUserTree}?deptId=${did}`,
		method: "get"
	});
}
// 刷新缓存
export function refreshCache() {
	return request({
		url: apis.dept.refreshCache,
		method: "get"
	});
}
