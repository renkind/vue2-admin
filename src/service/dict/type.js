import request from "@/utils/request";
import apis from "@/config/api";
// 查询字典类型列表
export function listType(query) {
	return request({
		url: apis.dict.listType,
		method: "get",
		params: query
	});
}

// 查询字典类型详细
export function getType(dictId) {
	return request({
		url: `${apis.dict.getType}/${dictId}`,
		method: "get"
	});
}

// 新增字典类型
export function addType(data) {
	return request({
		url: apis.dict.addType,
		method: "post",
		data
	});
}

// 修改字典类型
export function updateType(data) {
	return request({
		url: apis.dict.updateType,
		method: "put",
		data
	});
}

// 删除字典类型
export function delType(dictId) {
	return request({
		url: `${apis.dict.delType}/${dictId}`,
		method: "delete"
	});
}

// 刷新字典缓存
export function refreshCache() {
	return request({
		url: apis.dict.refreshCache,
		method: "delete"
	});
}

// 获取字典选择框列表
export function optionselect() {
	return request({
		url: apis.dict.optionselect,
		method: "get"
	});
}
