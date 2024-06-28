import { Message } from "element-ui";
import { getRouters } from "@/service/menus";

const menu = {
	namespaced: true,
	state: {
		menus: null
	},
	mutations: {
		UPDATE_MENUS(state, params) {
			state.menus = params;
		}
	},
	actions: {
		// 获取用户所属菜单
		async getRouters({ commit }) {
			const res = await getRouters();
			if (res.code === 200) {
				localStorage.setItem("menus", JSON.stringify(res.data));
				commit("UPDATE_MENUS", res.data);
			} else {
				Message.error(res.msg);
			}
		}
	}
};

export default menu;
