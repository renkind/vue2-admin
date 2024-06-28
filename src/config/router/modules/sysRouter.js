import Layout from "@/layout";
const sysRouter = [
	{
		path: "/system",
		name: "index",
		component: Layout,
		children: [
			{
				path: "/role",
				name: "role",
				permissions: ["system:role:list"],
				meta: {
					title: "角色管理"
				},
				component: () => import("@/views/System/Role")
			},
			{
				path: "/menu",
				name: "menu",
				permissions: ["system:menu:list"],
				meta: {
					title: "菜单设置"
				},
				component: () => import("@/views/System/Menu")
			},
			{
				path: "/system/roleauth/:roleId",
				name: "roleauth",
				hidden: true,
				permissions: ["system:role:edit"],
				meta: { title: "分配用户" },
				component: () => import("@/views/System/Role/authUser")
			},
			{
				path: "/user",
				name: "user",
				permissions: ["system:user:list"],
				meta: {
					title: "用户管理"
				},
				component: () => import("@/views/System/User")
			},
			{
				path: "/system/userauth/:userId",
				name: "userauth",
				hidden: true,
				permissions: ["system:user:edit"],
				meta: { title: "分配角色" },
				component: () => import("@/views/System/User/authUser")
			},
			{
				path: "/dict",
				name: "dict",
				permissions: ["system:dict:list"],
				meta: {
					title: "字典管理"
				},
				component: () => import("@/views/System/Dict")
			},
			{
				path: "/dict-data/:dictId",
				name: "dictdata",
				permissions: ["system:dict:edit"],
				meta: {
					title: "字典数据管理"
				},
				component: () => import("@/views/System/Dict/data")
			},
			{
				path: "/config",
				name: "config",
				permissions: ["system:config:list"],
				meta: {
					title: "参数设置"
				},
				component: () => import("@/views/System/Config")
			},
			{
				path: "/operlog",
				name: "operlog",
				permissions: ["monitor:operlog:list"],
				meta: {
					title: "操作日志"
				},
				component: () => import("@/views/System/Log/Operlog")
			},
			{
				path: "/logininfor",
				name: "logininfor",
				permissions: ["monitor:logininfor:list"],
				meta: {
					title: "登陆日志"
				},
				component: () => import("@/views/System/Log/Logininfor")
			},
			{
				path: "/versionManage",
				name: "VersionManage",
				meta: {
					title: "升级管理"
				},
				component: () => import("@/views/System/VersionManage")
			},
			{
				path: "/addVersionManage",
				name: "AddVersionManage",
				meta: {
					title: "发布"
				},
				component: () => import("@/views/System/VersionManage/add")
			}
		]
	}
];

export default sysRouter;
