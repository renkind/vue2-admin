import NProgress from "nprogress"; // progress bar
import { Message } from "element-ui";
import router from "./router";
import setDocumentTitle from "@/utils/domUtil";
// import { filterRouters } from "@/utils";
// import { baseRouter } from "@/config/router";
import store from "@/store";

NProgress.configure({
	showSpinner: false
}); // NProgress Configuration
const whiteList = ["/login"]; // no redirect whitelist
router.beforeEach(async (to, from, next) => {
	NProgress.start(); // start progress bar
	// 判断是否有token
	const token = localStorage.getItem("Authorization");
	if (token) {
		to.meta && typeof to.meta.title !== "undefined" && setDocumentTitle(to.meta.title);
		if (to.path === "/login" || to.path === "/") {
			next();
			NProgress.done();
		} else {
			// console.log("store", store);
			if (store.getters.roles.length === 0) {
				// 判断当前用户是否已拉取完user_info信息
				store
					.dispatch("app/GetInfo")
					.then(() => {
						const targetRoute = window.localStorage.getItem("targetRoute");
						console.log(targetRoute, "targetRoutetargetRoutetargetRoute");
						if (targetRoute) {
							console.log(targetRoute, "targetRoute");
							next(targetRoute);
						}
						store.dispatch("permission/GenerateRoutes").then((accessRoutes) => {
							console.log("accessRoutes", accessRoutes);
							// 根据roles权限生成可访问的路由表
							router.addRoutes(accessRoutes); // 动态添加可访问路由表
							next({ ...to, replace: true }); // hack方法 确保addRoutes已完成
						});
					})
					.catch((err) => {
						store.dispatch("app/LogOut").then(() => {
							Message.error(err);
							next({ path: "/" });
						});
					});
			} else {
				next();
			}
		}
		// 没有token
	} else if (whiteList.indexOf(to.path) !== -1) {
		// 在免登录白名单，直接进入
		next();
	} else {
		next(`/login?redirect=${to.fullPath}`); // 否则全部重定向到登录页
		NProgress.done();
	}
});

router.afterEach(() => {
	NProgress.done();
});
