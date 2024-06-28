import apis from "@/config/api";
import request from "@/utils/request";

// 会议列表
export function listMeeting(query) {
	return request({
		url: apis.meeting.list,
		method: "get",
		params: query
	});
}
// 会议详情
export function detailMeeting(id) {
	return request({
		url: `${apis.meeting.detail}/${id}`,
		method: "get"
	});
}
// 添加会议
export function addMeeting(data) {
	return request({
		url: apis.meeting.add,
		method: "post",
		data
	});
}
// 编辑会议
export function updateMeeting(data) {
	return request({
		url: `${apis.meeting.update}/${data.id}`,
		method: "put",
		data
	});
}

// 删除会议
export function delMeeting(id) {
	return request({
		url: `${apis.meeting.del}/${id}`,
		method: "delete"
	});
}

// 发布会议
export function publishMeeting(id) {
	return request({
		url: `${apis.meeting.publish}/${id}`,
		method: "get"
	});
}

// 复制会议
export function copyMeeting(id) {
	return request({
		url: `${apis.meeting.copy}/${id}`,
		method: "post"
	});
}

// 推送
export function pushFile(id) {
	return request({
		url: `${apis.meeting.pushFile}/${id}`,
		method: "post"
	});
}

// 添加模板人员
export function addModalMember(query) {
	return request({
		url: apis.memberModal.add,
		method: "post",
		params: query
	});
}

// 删除模板人员
export function delModalMember(id) {
	return request({
		url: `${apis.memberModal.del}/${id}`,
		method: "delete"
	});
}

// 编辑模板人员
export function updateModalMember(data) {
	return request({
		url: apis.memberModal.update,
		method: "put",
		data
	});
}

// 模板人员列表
export function listModalMember(data) {
	return request({
		url: apis.memberModal.list,
		method: "get",
		data
	});
}

// 模板人员详情
export function detailModalMember(data) {
	return request({
		url: apis.memberModal.update,
		method: "get",
		data
	});
}

// 添加会议人员
export function addMember(query) {
	return request({
		url: apis.member.add,
		method: "post",
		params: query
	});
}

// 删除会议人员
export function delMember(id) {
	return request({
		url: `${apis.member.del}/${id}`,
		method: "delete"
	});
}

// 编辑会议人员
export function updateMember(data) {
	return request({
		url: apis.member.update,
		method: "put",
		data
	});
}

// 会议人员列表
export function listMember(data) {
	return request({
		url: apis.member.list,
		method: "get",
		data
	});
}

// 会议人员详情
export function getMember(data) {
	return request({
		url: apis.member.update,
		method: "get",
		data
	});
}

// 删除通知
export function addNotice(noticeId) {
	return request({
		url: `${apis.notice.delNotice}/${noticeId}`,
		method: "delete"
	});
}

// 批量上下架
export function getNotice(data) {
	return request({
		url: apis.notice.batchFrame,
		method: "put",
		data
	});
}

// 撤回
export function batchFrame(data) {
	return request({
		url: apis.notice.cancel,
		method: "put",
		data
	});
}

// 更新缓存
export function cancel() {
	return request({
		url: apis.notice.refreshCache,
		method: "get"
	});
}

// 更新缓存
export function listNotice() {
	return request({
		url: apis.notice.refreshCache,
		method: "get"
	});
}

// 更新缓存
export function refreshCache() {
	return request({
		url: apis.notice.refreshCache,
		method: "get"
	});
}
