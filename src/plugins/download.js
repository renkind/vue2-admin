/* eslint-disable func-names */
/* eslint-disable prefer-template */
/* eslint-disable quote-props */
import axios from "axios";
import { Message } from "element-ui";
import { saveAs } from "file-saver";
import { getToken } from "@/utils/auth";
import errorCode from "@/utils/errorCode";
import { blobValidate } from "@/utils";
import request from "@/utils/request";
import jsonRequest from "@/utils/jsonRequest";

import appConfig from "@/config/app";
import apis from "@/config/api";

const isProd = process.env.NODE_ENV === "production";
export default {
	preview(resource) {
		return request({
			url: "/app/file/getRedFile",
			method: "get",
			params: { fileName: resource }
		});
	},
	getJson(url) {
		return jsonRequest({
			url: isProd ? decodeURI(apis.common.imgUrl + url) : decodeURI(url),
			method: "get"
		});
	},
	resource(resource) {
		const url = `${appConfig.baseUrl}${appConfig.pathRewrite}/common/download/resource?resource=${encodeURI(resource)}`;
		axios({
			method: "get",
			url,
			responseType: "blob",
			headers: { Authorization: `Bearer ${getToken()}` }
		}).then(async (res) => {
			const isLogin = await blobValidate(res.data);
			if (isLogin) {
				const blob = new Blob([res.data]);
				this.saveAs(blob, decodeURI(res.headers["download-filename"]));
			} else {
				this.printErrMsg(res.data);
			}
		});
	},
	zip(data) {
		request({
			url: "/app/file/download",
			method: "put",
			data: { "fileName": data.fileName },
			// eslint-disable-next-line no-shadow
			transformRequest: [function (data, headers) {
				let ret = "";
				for (const it in data) {
					ret += encodeURIComponent(it) + "=" + encodeURIComponent(data[it]) + "&";
				}
				return ret;
			}],
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			responseType: "blob"
		}).then(async (res) => {
			const isAvailible = await blobValidate(res.data);
			if (isAvailible) {
				const blob = new Blob([res], { type: "application/zip" });
				this.saveAs(blob, "name");
			} else {
				this.printErrMsg(res.data);
			}
		});
	},
	saveAs(text, name, opts) {
		saveAs(text, name, opts);
	},
	async printErrMsg(data) {
		const resText = await data.text();
		const rspObj = JSON.parse(resText);
		const errMsg = errorCode[rspObj.code] || rspObj.msg || errorCode["default"];
		Message.error(errMsg);
	}
};
