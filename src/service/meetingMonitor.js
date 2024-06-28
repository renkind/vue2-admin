import apis from "@/config/api";
import request from "@/utils/request";

// 按文件查看会议监控信息
export function listResource(query) {
	return request({
		url: apis.monitor.listResource,
		method: "get",
		params: query
	});
}
// 获取进行中会议详情
export function info(data) {
	return request({
		url: apis.monitor.info,
		method: "get"
	});
}
// 按人员查看会议监控信息
export function listPerson(id, data) {
	return request({
		url: `${apis.monitor.listPerson}/${id}`,
		method: "post",
		data
	});
}
// 按人员获取详情页
export function detailPerson(meetinigId, uid) {
	return request({
		url: `${apis.monitor.detailPerson}/${meetinigId}/${uid}`,
		method: "get"
	});
}
// 按文件获取详情页
export function detailResource(data) {
	return request({
		url: `${apis.monitor.detailResource}`,
		method: "post",
		data
	});
}

// 推送
export function pushFile(data) {
	return request({
		url: `${apis.monitor.pushFile}`,
		method: "post",
		data
	});
}
