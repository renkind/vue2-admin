import apis from "@/config/api";
import request from "@/utils/request";
// 添加发布记录
export function submitHistory(data) {
	return request({
		url: apis.application.submitHistory,
		method: "post",
		data
	});
}

// 查询应用资源列表-分页
export function getResourceList(data) {
	return request({
		url: apis.resource.list,
		method: "get",
		params: data
	});
}

// 获取应用资源详细信息
export function getResourceDetail(id) {
	return request({
		url: `${apis.resource.detail}/${id}`,
		method: "get"
	});
}

// 新增应用资源
export function addResource(data) {
	return request({
		url: apis.resource.add,
		method: "post",
		data
	});
}

// 删除应用资源
export function delResource(ids) {
	return request({
		url: `${apis.resource.detail}/${ids}`,
		method: "delete"
	});
}

// 修改应用资源
export function updateResource(data) {
	return request({
		url: apis.resource.update,
		method: "put",
		data
	});
}

