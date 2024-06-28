/* eslint-disable */
import request from "@/utils/request";

// 查询文件是否被存储
export function checkFileUploadedByMd5(url, data) {
	return request({
		url,
		method: "get",
		params: data
	});
}
// 合并文件
export function mergeFile(url, data) {
	return request({
		url,
		method: "post",
		params: data
	});
}
// 获取上传 url 分片
export function getFileUploadUrls(url, data) {
	return request({
		url,
		method: "post",
		data
	});
}
