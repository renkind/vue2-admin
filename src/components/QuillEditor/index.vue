<template>
	<div :class="prefixCls">
		<div ref="editor" class="editor-wrapper"></div>
	</div>
</template>

<script>
/* eslint-disable */
import WEditor from "wangeditor";
import apis from "@/config/api";
import { uploadImage } from "@/service/image";

export default {
	name: "WangEditor",
	props: {
		prefixCls: {
			type: String,
			default: "my-editor"
		},
		value: {
			type: String,
			default: ""
		},
		isClear: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			editor: null,
			editorContent: null
		};
	},
	watch: {
		isClear(val) {
			//   触发清除文本域内容
			if (val) {
				this.editor.txt.clear();
				this.editorContent = null;
			}
		}
	},
	mounted() {
		this.initEditor();
	},
	methods: {
		getText() {
			this.editor.txt.text();
		},
		setText(val) {
			this.editor.txt.html(val);
		},
		//富文本禁用编辑
		ifDisable() {
			this.editor.disable();
		},
		initEditor() {
			this.editor = new WEditor(this.$refs.editor);
			// this.editor.config.uploadImgShowBase64 = true; //   base 64 存储图片
			this.editor.config.showLinkImg = true; //  关闭通过图片地址添加图片
			this.editor.config.showLinkImgAlt = false; // 网络图片alt
			this.editor.config.showLinkImgHref = false; // 网络图片超链接
			// this.editor.config.uploadImgServer = "http://192.168.252.151:9969/wxyy/upload"; // 本地上传图片 需配置上传图片服务器地址
			// this.editor.config.uploadImgHeaders = {}; //   自定义 header"Content-Type": "application/x-www-form-urlencoded"
			//this.editor.config.uploadFileName = "file"; //   后端接受上传文件的参数名
			// this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024; //   将图片大小限制为 2M
			this.editor.config.uploadImgMaxLength = 1; //   限制一次最多上传 3 张图片
			// this.editor.config.uploadImgTimeout = 3 * 60 * 1000; //   设置超时时间
			// 自定义图片上传
			// this.editor.config.linkImgCheck = async function (imgSrc, insertImgFn, alt, href) {
			// 	console.log(imgSrc);
			// 	//insertImgFn(imgSrc);
			// 	//const res = await uploadImage(imgSrc);
			// 	//console.log("网络图片", res);

			// 	return true;
			// };
			// this.editor.config.linkImgCallback = async function (src) {
			// 	//console.log("图片 src ", src);
			// 	const res = await uploadImage(src);
			// 	// console.log(res.data.url);
			// };
			this.editor.config.customUploadImg = async function (resultFiles, insertImgFn) {
				console.log(resultFiles, insertImgFn, "上传")
				const res = await uploadImage(resultFiles[0]);
				//console.log("图片", resultFiles);
				if (res.code === 200) {
					//console.log("12313213213", res);
					const imgUrl = `${apis.common.imgUrl}${res.data.url}`
					insertImgFn(imgUrl);
				} else {
					// console.log(res);
				}
			};
			//   配置菜单 可根据文档进行添加
			this.editor.config.menus = [
				"head", //   标题
				"bold", //   粗体
				"fontSize", //   字号
				"fontName", //   字体
				"italic", //   斜体
				"indent", // 缩进
				"lineHeight", // 行高
				"underline", //   下划线
				"strikeThrough", //   删除线
				"foreColor", //   文字颜色
				"backColor", //   背景颜色
				"link", //   插入链接
				"list", //   列表
				"justify", //   对齐方式
				"image", //   插入图片
				"undo", //   撤销
				"redo", //   重复
				"table" //   表格
				//   'quote', //   引用
				//"emoticon", //   表情
				//   'video', //   插入视频
				//   'code', //   插入代码
				//   'fullscreen' //   全屏
			];
			this.editor.config.lineHeights = ["1", "1.15", "1.25", "1.5", "2", "2.5", "3"];
			//   创建富文本编辑器
			this.editor.config.onchange = (html) => {
				let str = html;
				console.log("html", html);
				console.log("str", str);
				//str = str.replace(/\bm.*?;/, "width:300px"); //  更改插入到富文本里图片的宽度
				console.log("str--11", str);
				this.editorContent = str;
				this.$emit("change", this.editorContent); //   将内容同步到父组件中
			};
			this.editor.config.height = 500;
			this.editor.config.zIndex = 2; //   配置富文本的权重 不然会覆盖其他组件
			// this.editor.config.lineHeights = 1;
			console.log(this.editor);
			this.editor.create();
		}
	}
};
</script>

<style scoped>
.editor-wrapper {
	text-align: left;
}
.el-form-item__content {
	line-height: 1;
}
.w-e-text p,
.w-e-text h1,
.w-e-text h2,
.w-e-text h3,
.w-e-text h4,
.w-e-text h5,
.w-e-text table,
.w-e-text pre {
	margin: 0;
	line-height: 1;
}
.w-e-text-container p {
	margin: 0;
	font-size: 14px !important;
}
.w-e-text-container .placeholder {
	font-size: 14px;
	line-height: 1;
	top: 4px;
}
</style>
