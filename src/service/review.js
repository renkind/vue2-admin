import apis from "@/config/api";
import request from "@/utils/request";
// 获取模板列表
export function reviewList(data) {
	return request({
		url: apis.review.list,
		method: "get",
		params: data
	});
}
// 获取模板列表
export function reviewPageList(data) {
	return request({
		url: apis.review.pageList,
		method: "get",
		params: data
	});
}
// 修改状态
export function changeStatus(data) {
	return request({
		url: apis.review.changeStatus,
		method: "PUT",
		data
	});
}
// 查询模板
export function pageList(data) {
	return request({
		url: apis.review.pageList,
		method: "get",
		params: data
	});
}
// 新增应用
export function addApp(data) {
	return request({
		url: apis.review.addApp,
		method: "post",
		data
	});
}
