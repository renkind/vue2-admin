const path = require("path");
const { DefinePlugin } = require("webpack");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin"); // 代码压缩
const ESLintPlugin = require("eslint-webpack-plugin");
const FileManagerPlugin = require("filemanager-webpack-plugin");
const isProd = process.env.NODE_ENV === "production";
const appConfig = require("./src/config/app");

function resolve(dir) {
	return path.join(__dirname, dir);
}
function getYMDHMS(timestamp) {
	let time = new Date(timestamp);
	let year = time.getFullYear();
	const month = (time.getMonth() + 1).toString().padStart(2, "0");
	const date = time.getDate().toString().padStart(2, "0");
	const hours = time.getHours().toString().padStart(2, "0");
	const minute = time.getMinutes().toString().padStart(2, "0");
	const second = time.getSeconds().toString().padStart(2, "0");

	return year + month + date + hours + minute + second;
}
console.log(1, "_" + getYMDHMS(Date.parse(new Date())));
const vueConfig = {
	publicPath: isProd ? "/" : "/", // 静态资源前缀
	outputDir: "dist", // paperless-backend
	productionSourceMap: process.env.NODE_ENV !== "production", // 生产禁止显示源代码
	lintOnSave: process.env.NODE_ENV !== "production", // 保存校验
	css: {
		loaderOptions: {
			sass: {
				sassOptions: { outputStyle: "expanded" }
			}
		}
	},
	// configureWebpack
	configureWebpack: (config) => {
		// 如果是生产环境
		if (isProd) {
			// 代码压缩
			config.plugins.push(
				new UglifyJsPlugin({
					uglifyOptions: {
						warnings: false,
						compress: {
							drop_debugger: true,
							drop_console: true,
							pure_funcs: ["console.log"]
						}
					},
					sourceMap: false,
					parallel: true
				})
			);

			//打包成zip
			config.plugins.push(
				new FileManagerPlugin({
					events: {
						onEnd: {
							archive: [
								{
									source: "./dist",
									destination: "./dist/dist.zip"
								}
							]
						}
					}
				})
			);
		} else {
			config.devtool = "source-map";
			// 增加eslint校验;
			config.plugins.push(
				new ESLintPlugin({
					context: "./src",
					extensions: ["js", "vue"]
				})
			);
		}
		// 定义全局变量 打包时间和版本号
		config.plugins.push(
			new DefinePlugin({
				VERSION: appConfig.appVersion,
				BUILDDATE: appConfig.buindDate
			})
		);
	},

	// chainWebpack
	chainWebpack: (config) => {
		config.resolve.alias.set("@", resolve("src"));
		config.module.rule("svg").exclude.add(resolve("src/assets/icons")).end();
		config.module
			.rule("icons")
			.test(/\.svg$/)
			.include.add(resolve("src/assets/icons"))
			.end()
			.use("svg-sprite-loader")
			.loader("svg-sprite-loader")
			.options({
				symbolId: "icon-[name]"
			})
			.end();

		config.plugin("html").tap((args) => {
			args[0].title = appConfig.appTitle;
			args[0]["buildDate"] = appConfig.appVersion;
			args[0]["version"] = appConfig.buindDate;
			return args;
		});
	},
	// devServer
	devServer: {
		host: "0.0.0.0",
		port: "9001",
		overlay: {
			warnings: true,
			errors: true
		},
		proxy: {
			"/zsplcs": {
				target: "http://192.168.115.13:9988/",
				// target: "http://9jq9ng.natappfree.cc/",
				ws: true,
				changeOrigin: true
				// pathRewrite: {
				// 	["^" + "/zsplcs"]: "/"
				// }
			}
		}
	}
};
console.log(1, "_" + getYMDHMS(Date.parse(new Date())));
module.exports = vueConfig;
