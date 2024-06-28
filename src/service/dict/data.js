import request from "@/utils/request";
import apis from "@/config/api";

// 查询字典数据列表
export function listData(query) {
	return request({
		url: apis.dict.listData,
		method: "get",
		params: query
	});
}

// 查询字典数据详细
export function getData(dictCode) {
	return request({
		url: `${apis.dict.getData}/${dictCode}`,
		method: "get"
	});
}

// 根据字典类型查询字典数据信息
export function getDicts(dictType) {
	return request({
		url: `${apis.dict.getDicts}/${dictType}`,
		method: "get"
	});
}

// 新增字典数据
export function addData(data) {
	return request({
		url: apis.dict.addData,
		method: "post",
		data
	});
}

// 修改字典数据
export function updateData(data) {
	return request({
		url: apis.dict.updateData,
		method: "put",
		data
	});
}

// 删除字典数据
export function delData(dictCode) {
	return request({
		url: `${apis.dict.delData}/${dictCode}`,
		method: "delete"
	});
}
