import Vue from "vue";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import day from "dayjs";
import Fragment from "vue-fragment";
import App from "./App";
import router from "@/router";
import store from "@/store";
import "@/assets/styles/index.scss"; // global css
// 字典数据组件
import DictData from "@/components/DictData";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar";
// 字典标签组件
import DictTag from "@/components/DictTag";
// SVG标签
import SvgIcon from "@/components/SvgIcon";
// 公共标题样式
import Zs_PageTitle from "@/components/Zs_pageTitle";
// 编辑/详情页面头部按钮
import Zs_TopButton from "@/components/Zs_topButton";
// 图片展示
import Zs_Img from "@/components/Zs_img";

import "nprogress/nprogress.css";
import directive from "./directives"; // directive
import "lodash";

import "./style/reset.scss";
import "./permission"; // permission control
import "./assets/icons"; // icon

import { addDateRange, handleTree, selectDictLabel } from "@/utils";
import tab from "@/plugins/tab";
import { getConfigKey } from "@/service/config";
import download from "@/plugins/download";
import { resetForm } from "./utils/ruoyi";
import * as filters from "./utils/filters";

// 注入全局过滤器
Object.keys(filters).forEach((key) => {
	Vue.filter(key, filters[key]);
});
// 全局组件挂载
Vue.component("Pagination", Pagination);
Vue.component("RightToolbar", RightToolbar);
Vue.component("DictTag", DictTag);
Vue.component("svg-icon", SvgIcon);
Vue.component("ZsPageTitle", Zs_PageTitle);
Vue.component("ZsTopButton", Zs_TopButton);
Vue.component("ZsImg", Zs_Img);

// register globally
Vue.use(ElementUI);
Vue.use(Fragment.Plugin);

// 全局方法挂载
Vue.prototype.$store = store;
Vue.prototype.addDateRange = addDateRange;
Vue.prototype.handleTree = handleTree;
Vue.prototype.getConfigKey = getConfigKey;
Vue.prototype.selectDictLabel = selectDictLabel;
Vue.prototype.download = download;
Vue.prototype.day = day;
Vue.prototype.$tab = tab;
Vue.prototype.resetForm = resetForm;
// console.log("BUILDDATE", BUILDDATE);

DictData.install();

Vue.use(directive);
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: (h) => h(App)
}).$mount("#app");
