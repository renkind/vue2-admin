import apis from "@/config/api";
import request from "@/utils/request";

// 终端列表
export function listDevice(query) {
	return request({
		url: apis.meetingDevice.list,
		method: "get",
		params: query
	});
}
// 终端详情
export function detailDevice(id) {
	return request({
		url: `${apis.meetingDevice.detail}/${id}`,
		method: "get"
	});
}
// 添加终端
export function addDevice(data) {
	return request({
		url: apis.meetingDevice.add,
		method: "post",
		data
	});
}
// 编辑终端
export function updateDevice(data) {
	return request({
		url: `${apis.meetingDevice.update}/${data.id}`,
		method: "put",
		data
	});
}
// 删除终端
export function delDevice(id) {
	return request({
		url: `${apis.meetingDevice.del}/${id}`,
		method: "delete"
	});
}
