import apis from "@/config/api";
import request from "@/utils/request";
import { parseStrEmpty } from "@/utils";

// 获取详情
export function getData(id) {
    return request({
        url: `${apis.image.detail}/${parseStrEmpty(id)}`,
        method: "get"
    });
}

// 图表  信息
export function listNotice(data) {
    return request({
        url: apis.meetingStatistic.listNotice,
        method: "get",
        params: data
    });
}
