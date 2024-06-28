import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";

// 获取用户列表
export function holeList(data) {
	return request({
		url: apis.meetinLogManage.list,
		method: "get",
		params: data
	});
}

// 弹框会议内容
export function ContentList(id) {
	return request({
		url: `${apis.meetinLogManage.meetContentList}/${id}`,
		method: "get"
	});
}

// 删除归档会议列表会议
export function deleted(id) {
	return request({
		url: `${apis.meetinLogManage.deleted}/${id}`,
		method: "delete"
	});
}

// 弹框内 销毁
export function Destroy(data) {
	return request({
		url: apis.meetinLogManage.archiveDestroy,
		method: "post",
		data
	});
}

// 弹框内 归档
export function archive(id) {
	return request({
		url: `${apis.meetinLogManage.archiving}/${id}`,
		method: "put"
	});
}

// 弹框内 导出
export function exportMeeting(id) {
	return request({
		url: `${apis.meetinLogManage.exportMeeting}/${id}`,
		method: "post",
		responseType: "blob"
		// headers: {
		// 	"Content-Type": "application/json;charset=UTF-8"
		// }
	});
}

// 跳转进会议详情页
export function Comments(id) {
	return request({
		url: `${apis.meetinLogManage.meetingList}/${id}`,
		method: "get"
	});
}

// // 会议详情页表格
// export function tableList(data, id) {
// 	return request({
// 		url: `${apis.meetinLogManage.tableList}/${id}`,
// 		method: "get",
// 		params: data
// 	});
// }

// 会议详情页表格
export function meetingPersonList(data) {
	return request({
		url: apis.meetinLogManage.meetingPersonList,
		method: "get",
		params: data
	});
}

// 获取用户
export function getUser(userId) {
	return request({
		url: `${apis.user.getUser}/${parseStrEmpty(userId)}`,
		method: "get"
	});
}

// 获取预览地址
export function priview(url) {
	return request({
		url: `${apis.meetinLogManage.priview}?url=${url}`,
		method: "get"
	});
}

// 获取预览地址
export function meetPreview(data) {
	return request({
		url: apis.meetinLogManage.meetPreview,
		method: "get",
		params: data,
		responseType: "blob"
	});
}
