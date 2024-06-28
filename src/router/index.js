import Vue from "vue";
import VueRouter from "vue-router";
import { baseRoutes, dynamicRoutes } from "@/config/router";
Vue.use(VueRouter);

const router = new VueRouter({
	mode: "history",
	// mode: "hash",
	base: process.env.BASE_URL,
	routes: baseRoutes.concat(dynamicRoutes)
});

const originalPush = VueRouter.prototype.push;
VueRouter.prototype.push = function push(location, onResolve, onReject) {
	if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject);
	return originalPush.call(this, location).catch((err) => err);
};
export default router;
