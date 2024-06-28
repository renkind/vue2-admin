import Vue from "vue";
import Vuex from "vuex";
import getters from "@/store/getters";

Vue.use(Vuex);

const modulesFiles = require.context("./modules", true, /.js$/);
const modules = modulesFiles.keys().reduce((module, modulePath) => {
	const moduleName = modulePath.replace(/^.\/(.*)\.js/, "$1");
	const value = modulesFiles(modulePath);
	module[moduleName] = value.default;
	return module;
}, {});
export default new Vuex.Store({
	modules,
	getters
});
