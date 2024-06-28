import apis from "@/config/api";
import request from "@/utils/request";

export function getList(data) {
	return request({
		url: apis.content.list,
		method: "get",
		params: data
	});
}
// 详情
export function detail(id) {
	return request({
		url: `${apis.content.detail}/${id}`,
		method: "get"
	});
}
// 审批
export function approvalData(data) {
	return request({
		url: apis.content.approval,
		method: "put",
		data
	});
}
// 获取历史审批轨迹 getTraces
export function getTraces(data) {
	return request({
		url: apis.content.getTraces,
		method: "get",
		params: data
	});
}
