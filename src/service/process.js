import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";

// 获取列表
export function processList(id) {
	return request({
		url: `${apis.meetingProgress.processList}/${id}`,
		method: "get"
	});
}

// 议题状态变更
export function changeStatus(data, id) {
	return request({
		url: `${apis.meetingProgress.changeStatus}/${id}`,
		method: "post",
        data
	});
}

// 会议状态变更
export function changeMeetStatus(data, id) {
	return request({
		url: `${apis.meetingProgress.changeMeetStatus}/${id}`,
		method: "post",
        data
	});
}

// 增加临时议题
export function Provisional(data, id, sort) {
	return request({
		url: `${apis.meetingProgress.addIssues}/${id}/${sort}`,
		method: "post",
        data
	});
}

// 获取用户
export function getUser(userId) {
	return request({
		url: `${apis.user.getUser}/${parseStrEmpty(userId)}`,
		method: "get"
	});
}
