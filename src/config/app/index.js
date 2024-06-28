const isProd = process.env.NODE_ENV === "production";
console.log("isProdisProd", isProd);
const appConfig = {
	appVersion: "1.0.1", // 当前版本
	buindDate: JSON.stringify(new Date().toLocaleString()), // 打包时间
	appTitle: "后台管理系统",
	footText: "正数网络技术有限公司",
	baseUrl: isProd ? "/" : "/", // 演示环境
	pathRewrite: "zsplcs" // 接口前缀
};

module.exports = appConfig;
