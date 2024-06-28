// import { Message } from "element-ui";
import Cookies from "js-cookie";
import { login, getUserInfo, logout } from "@/service/login";
import router from "@/router";
// import { getRouters } from "@/service/menus";
import { removeToken } from "@/utils/auth";

import { gm4 } from "@/utils";
// console.log("gm4", gm4);
const app = {
	namespaced: true,
	state: {
		sidebar: {
			opened: Cookies.get("sidebarStatus") ? !!+Cookies.get("sidebarStatus") : true,
			withoutAnimation: false
		},
		device: "desktop",
		scoped: false,
		userInfo: {},
		roles: [],
		permissions: [],
		menus: [],
		name: "",
		avatar: "",
		token: ""
	},
	mutations: {
		TOGGLE_SIDEBAR: (state) => {
			state.sidebar.opened = !state.sidebar.opened;
			state.sidebar.withoutAnimation = false;
			if (state.sidebar.opened) {
				Cookies.set("sidebarStatus", 1);
			} else {
				Cookies.set("sidebarStatus", 0);
			}
		},
		CHANGE_SCOPED(state) {
			state.scoped = !state.scoped;
		},
		SET_NAME: (state, name) => {
			state.name = name;
		},
		// SET_AVATAR: (state, avatar) => {
		// 	state.avatar = avatar;
		// },
		UPDATE_USERINFO(state, params) {
			state.userInfo = params;
		},
		UPDATE_MENUS(state, params) {
			state.menus = params;
		},
		SET_ROLES(state, roles) {
			state.roles = roles;
		},
		SET_PERMISSIONS(state, permissions) {
			state.permissions = permissions;
		},
		SET_TOKEN(state, token) {
			state.token = token;
		},
		CLOSE_SIDEBAR: (state, withoutAnimation) => {
			Cookies.set("sidebarStatus", 0);
			state.sidebar.opened = false;
			state.sidebar.withoutAnimation = withoutAnimation;
		},
		TOGGLE_DEVICE: (state, device) => {
			state.device = device;
		},
		SET_SIZE: (state, size) => {
			state.size = size;
			Cookies.set("size", size);
		}
	},

	actions: {
		// 登陆获取token
		async Login({ dispatch, commit }, param) {
			const { data } = param;
			const res = await login({
				code: data.code,
				password: gm4().encrypt(data.password),
				username: data.username,
				uuid: data.uuid
			});
			// console.log("LoginLogin", res);
			if (res.code === 200) {
				localStorage.setItem("Authorization", res.data.token);
				console.log(res.data, "res.datares.datares.data");
				router.push("/home");
			} else {
				// todo 优化
				return new Promise((resolved, reject) => {
					reject(res.msg);
				});
			}
		},
		// 获取用户信息
		GetInfo({ commit, state }) {
			return new Promise((resolve, reject) => {
				getUserInfo()
					.then((res) => {
						console.log("resresres", res);
						res.data.roles.forEach((ele, index) => {
							// if (ele === "meeting_controller") {
							// 	router.push("/conference/conference");
							// } else {
							// 	router.push("/home");
							// }
							if (ele === "meeting_controller") {
								// 存储目标路由到 localStorage
								window.localStorage.setItem("targetRoute", "/conference/conference");
							} else {
								// 存储目标路由到 localStorage
								window.localStorage.setItem("targetRoute", "/home");
							}
						});
						const { user, permissions, roles } = res.data;
						console.log("useruser", user);
						if (roles.length > 0) {
							// 验证返回的roles是否是一个非空数组
							commit("SET_ROLES", roles);
							commit("SET_PERMISSIONS", permissions);
						} else {
							commit("SET_ROLES", ["ROLE_DEFAULT"]);
						}
						window.localStorage.setItem("user", JSON.stringify(user));
						window.localStorage.setItem("userRoles", JSON.stringify(res.data.roles));
						commit("UPDATE_USERINFO", user);
						commit("SET_NAME", user.userName);
						// commit("SET_AVATAR", avatar);
						resolve(res);
					})
					.catch((error) => {
						console.log("eerror", error);
						reject(error);
					});
			});
		},
		// 退出系统
		LogOut({ commit, state }) {
			return new Promise((resolve, reject) => {
				logout(state.token)
					.then(() => {
						localStorage.clear();
						commit("SET_TOKEN", "");
						commit("SET_ROLES", []);
						commit("SET_PERMISSIONS", []);
						removeToken();
						resolve();
					})
					.catch((error) => {
						reject(error);
					});
			});
		},
		toggleSideBar({ commit }) {
			commit("TOGGLE_SIDEBAR");
		},
		closeSideBar({ commit }, { withoutAnimation }) {
			commit("CLOSE_SIDEBAR", withoutAnimation);
		},
		toggleDevice({ commit }, device) {
			commit("TOGGLE_DEVICE", device);
		},
		setSize({ commit }, size) {
			commit("SET_SIZE", size);
		}
	}
};

export default app;
