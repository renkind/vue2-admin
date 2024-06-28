/* eslint-disable */
import apis from "@/config/api";
import request from "@/utils/request";

// 头部综合数据
export function getDataSumup() {
	return request({
		url: apis.homePage.dataSumup,
		method: "get"
	});
}
// 折线图数据
export function getChartsData(data) {
	return request({
		url: apis.homePage.chartsData,
		method: "get",
		params: data
	});
}
// 待审核视频数据
export function getViewReview(data) {
	return request({
		url: apis.homePage.viewReview,
		//url: `${apis.homePage.viewReview}/${data}`,
		method: "get",
		params: data
	});
}
