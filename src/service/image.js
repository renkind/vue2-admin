import apis from "@/config/api";
import request from "@/utils/request";
import appConfig from "@/config/app";
import { parseStrEmpty } from "@/utils";
// 获取列表
export function getList(data) {
	return request({
		url: apis.image.list,
		method: "get",
		params: data,
		headers: {
			"content-type": "application/x-www-form-urlencoded"
		}
	});
}
// 获取详情
export function getData(id) {
	return request({
		url: `${apis.image.detail}/${parseStrEmpty(id)}`,
		method: "get"
	});
}
// 删除
export function delData(ids) {
	return request({
		url: `${apis.image.del}/${ids}`,
		method: "delete"
	});
}
// 添加
export function addData(data) {
	return request({
		url: apis.image.add,
		method: "post",
		data
	});
}
// 更新
export function updateData(data) {
	return request({
		url: apis.image.edit,
		method: "put",
		data
	});
}
// 上传单个文件
export function uploadJson(jsonStr) {
	const formData = new FormData();
	formData.append(
		"file",
		new Blob([JSON.stringify(jsonStr)], {
			type: "text/plain;charset=utf-8"
		}),
		"my_file.json"
	);
	formData.append("fileType", "2");
	return new Promise((resolve, reject) => {
		const xml = new XMLHttpRequest();
		xml.open("post", `${appConfig.baseUrl}${appConfig.pathRewrite}${apis.common.uploadImage}`);
		xml.setRequestHeader("Authorization", `${localStorage.getItem("Authorization")}`);
		xml.responseType = "json";
		xml.send(formData);
		xml.onreadystatechange = () => {
			if (xml.readyState === 4) {
				const responseData = xml.response;
				if (responseData) {
					resolve(responseData);
				} else {
					reject();
				}
				// if (responseData.success) {
				// 	resolve(responseData);
				// } else {
				// 	console.log("responseData", responseData);
				// 	reject();
				// }
			}
		};
	});
}
// 上传单个图片
export function uploadImage(file, options) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("fileType", "0");
	return new Promise((resolve, reject) => {
		const xml = new XMLHttpRequest();
		xml.open("post", `${appConfig.baseUrl}${appConfig.pathRewrite}${apis.common.uploadImage}`);
		xml.setRequestHeader("Authorization", `${localStorage.getItem("Authorization")}`);
		xml.responseType = "json";
		xml.send(formData);
		xml.onreadystatechange = () => {
			if (xml.readyState === 4) {
				const responseData = xml.response;
				if (responseData) {
					resolve(responseData);
				} else {
					reject();
				}
			}
		};
	});
}
// 上传单个文件
export function uploadFile(file, options) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("directory", "android");
	return new Promise((resolve, reject) => {
		const xml = new XMLHttpRequest();
		// xml.timeout = 50000; // 设置超时时间为5秒
		xml.open("post", `${appConfig.baseUrl}${appConfig.pathRewrite}${apis.common.uploadFile}`);
		xml.setRequestHeader("Authorization", `${localStorage.getItem("Authorization")}`);
		xml.responseType = "json";
		xml.send(formData);
		xml.onreadystatechange = () => {
			if (xml.readyState === 4) {
				const responseData = xml.response;
				if (responseData) {
					resolve(responseData);
				} else {
					reject();
				}
			}
		};
	});
}

// 上传单个文件 - 加密
export function uploadFileMi(file, options, prop) {
	const formData = new FormData();
	formData.append("file", file);
	formData.append("directory", "android");
	for (const i in prop) {
		formData.append(i, prop[i]);
	}
	return new Promise((resolve, reject) => {
		const xml = new XMLHttpRequest();
		// xml.timeout = 50000; // 设置超时时间为5秒
		xml.open("post", `${appConfig.baseUrl}${appConfig.pathRewrite}${apis.common.uploadFileMi}`);
		xml.setRequestHeader("Authorization", `${localStorage.getItem("Authorization")}`);
		xml.responseType = "json";
		xml.send(formData);
		xml.onreadystatechange = () => {
			if (xml.readyState === 4) {
				const responseData = xml.response;
				if (responseData) {
					resolve(responseData);
				} else {
					reject();
				}
			}
		};
	});
}

// 上传多个图片
export function uploadImageBatch(filesList, options) {
	const formData = new FormData();
	filesList.foreach((item) => {
		formData.append("multipartFiles", item.originFileObj);
	});
	// formData.append("business", business);
	// formData.append("project", project);
	return new Promise((resolve, reject) => {
		const xml = new XMLHttpRequest();
		xml.open("post", `${appConfig.pathRewrite}${apis.common.uploadImage}`);
		xml.responseType = "json";
		xml.send(formData);
		xml.onreadystatechange = () => {
			if (xml.readyState === 4) {
				const responseData = xml.response;
				if (responseData.success) {
					resolve(responseData);
				} else {
					reject();
				}
			}
		};
	});
}
