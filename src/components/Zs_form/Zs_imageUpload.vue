<template>
	<div>
		<el-upload
			:limit="maxFile"
			:show-file-list="showList"
			:on-success="handleSuccess"
			:before-upload="beforeUpload"
			:auto-upload="autoUpload"
			:on-preview="handlePreview"
			:on-change="handleChange"
			:on-remove="handleRemove"
			:on-error="handleError"
			:multiple="multiple"
			:action="action"
			:list-type="isFile ? 'text' : 'picture-card'"
			:accept="accept"
			:maxKb="maxKb"
			:sizePic="sizePic"
			:file-list="fileList"
			:http-request="uploadFN"
			:class="uploadDisabled ? 'uploader disabled' : 'uploader'"
			ref="zsimageupload"
			:disabled="disabled"
			:data="inData"
			:headers="getHeaders()"
		>
			<!-- <img v-if="dialogImageUrl" :src="dialogImageUrl" class="avatar"> -->
			<i class="el-icon-plus uploader-icon" v-show="!isFile"></i>
			<el-button size="small" type="primary" v-show="isFile">上传文件</el-button>
		</el-upload>
		<span class="uploadText" v-show="showText && !isFile"
			>请上传{{ this.accept }}类型文件,推荐尺寸{{ this.sizePic }}像素,文件大小不超过{{ this.maxKb }}KB</span
		>
		<span class="uploadText" v-show="showText && isFile && !intro">请上传{{ this.accept }}类型文件</span>
		<span class="uploadText" v-show="showText && isFile && intro">{{ intro }}</span>
		<el-dialog :visible.sync="dialogVisible">
			<ZsImg width="100%" :src="dialogImageUrl" alt="" />
		</el-dialog>
	</div>
</template>

<script>
import apis from "@/config/api";
import { uploadImage, uploadFileMi, uploadImageBatch } from "@/service/image";
export default {
	name: "Zs_imageUpload",
	data() {
		return {
			fileList: [],
			dialogVisible: false,
			dialogImageUrl: "",
			uploadDisabled: false
		};
	},
	props: {
		// 默认填充文件
		fileLists: {
			required: false,
			default: () => [],
			type: Array
		},
		inData: {
			required: false,
			type: Object,
			default: () => ({})
		},
		// 是否展示底部文字
		showText: {
			required: false,
			default: true,
			type: Boolean
		},
		// 其他配置项
		options: {
			required: false
		},
		// 最大上传个数
		maxFile: {
			default: 1,
			required: false,
			type: Number
		},
		// 是否批量上传图片
		isBatch: {
			default: false,
			required: false,
			type: Boolean
		},
		// 是否是list列表
		showList: {
			default: true,
			required: true,
			type: Boolean
		},
		// 接受文件的上传类型
		accept: {
			default: "image/png, image/jpeg, image/jpg, image/gif, image/webp,application/ofd,application/pdf",
			required: false,
			type: String
		},
		// 是否自动上传
		autoUpload: {
			default: true,
			required: false,
			type: Boolean
		},
		// 请求的url地址
		action: {
			default: "#",
			required: false,
			type: String
		},
		// 是否是文件类型
		isFile: {
			default: false,
			required: false,
			type: Boolean
		},
		// 支持多文件上传
		multiple: {
			default: false,
			required: false,
			type: Boolean
		},
		// 上传文件最大大小 单位kb 字节
		maxKb: {
			default: 300,
			required: false,
			type: Number
		},
		sizePic: {
			default: "608 * 304",
			required: false,
			type: String
		},
		// 是否禁用
		disabled: {
			default: false,
			required: false,
			type: Boolean
		},
		// ajax formdata拼接参数
		ajaxProp: {
			required: false,
			type: Object,
			default: () => ({})
		},
		// 上传说明文字
		intro: {
			default: "",
			required: false,
			type: String
		}
	},

	created() {
		this.getRefs();
		// 如果有初始化数据 进行回显
		this.changeFileView();
		console.log(this.fileLists, "image.pngimage.png");
		console.log(this.fileList, "image.pngimage.pngxxxxxx");
	},
	watch: {
		// eslint-disable-next-line
		options: {
			// 数据变化时执行的逻辑代码
			handler(newVal, oldVal) {
				console.log(newVal.initdata);
				const fileOptions = newVal.initdata;
				fileOptions.forEach((el) => {
					if (el.url.indexOf("http://") !== -1) {
						el.rurl = el.rurl || el.url;
					} else {
						el.rurl = el.rurl || el.url;
						el.url = `${apis.common.imgUrl}${el.url}`;
					}
				});
				this.fileList = fileOptions;
				// this.fileList = newVal.initdata;
				// this.$emit("updateFileList", this.fileList);
				if (this.fileList.length >= this.maxFile) {
					this.uploadDisabled = true;
				} else {
					this.uploadDisabled = false;
				}
			},
			// 开启深度监听
			deep: true
		},
		fileLists: {
			// 数据变化时执行的逻辑代码
			handler(newVal, oldVal) {
				this.changeFileView();
			},
			deep: true
		}
	},
	methods: {
		changeFileView() {
			console.log("changeFileView fileLists", this.fileLists);
			if (this.fileLists && this.fileLists.length > 0) {
				const fileOptions = this.fileLists;
				fileOptions.forEach((el) => {
					if (el.url) {
						if (el.url.indexOf("http://") !== -1) {
							el.rurl = el.rurl || el.url;
						} else {
							el.rurl = el.rurl || el.url;
							el.url = `${apis.common.imgUrl}${el.url}`;
						}
					}
				});
				this.fileList = fileOptions;
				console.log(this.fileList, "this.fileList");
				// this.$emit("updateFileList", this.fileList);
				if (this.fileList.length >= this.maxFile) {
					this.uploadDisabled = true;
				}
			} else {
				this.fileList = [];
			}
		},
		// 抛出upload组件ref
		getRefs() {
			this.$emit("getRef", { type: "zs-imageUpload", domRef: this.$refs["zsimageupload"] });
		},
		// 前端预览展示图片
		getBase64(file) {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file.raw);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		},
		//  上传前
		beforeUpload(file) {
			console.log("beforeUploadbeforeUpload", file);
			// 判断是否超出最大上传数量
			if (this.fileList.length >= this.maxFile) {
				this.$message.error(`超出最大上传${this.maxFile}数量`);
				return false;
			}
			// 判断文件上传类型
			if (!this.accept.includes(file.type)) {
				console.log(this.accept);
				console.log(file);
				this.$message.error(`请上传${this.accept}类型文件`);
				return false;
			}
			const fileSizeKb = Math.ceil(file.size / 1024); // 单位转换为同一单位 字节
			if (fileSizeKb > this.maxKb) {
				this.$message.error(`超出最大上传限制${this.maxKb}KB`);
				return false;
			}
			return true;
		},
		// 文件上传失败的钩子
		handleError(err, file, fileList) {
			console.log("err", err);
			this.$message.error(err.msg);
		},
		// 文件上传成功的钩子
		handleSuccess(response, file, fileList) {
			console.log("response", response);
			console.log("file", file);
			console.log("fileList", fileList);
			if (this.isFile) {
				// const reponseFiles = fileList.map((x) => x.response);
				this.fileList.push({
					name: file.name, // 图片名称
					fileuuid: file.uid, // 图片的uuid，el 自带
					fileUrl: file.url, // 如图片的url
					rurl: response || "未返回url", // 返回的图片url
					response: response || "未返回url", // 返回的图片url
					urlPath: response || file.url, // 文件统一路径标识
					...this.inData
				});
			} else {
				this.fileList.push({
					name: file.name, // 图片名称
					fileuuid: file.uid, // 图片的uuid，el 自带
					fileUrl: file.url, // 如图片的url
					rid: file.response.id, // 返回的图片id
					rurl: file.response.url || "未返回url", // 返回的图片url
					url: `${apis.common.imgUrl}${file.response.url}` || "未返回url", // 返回的图片url
					...this.inData
				});
			}
			console.log(this.fileList);
			this.$emit("updateFileList", this.fileList);
		},
		// 文件上传状态更新的状态
		// uploadChange(file, fileList) {
		// 	console.log("uploadChangeuploadChange", file);
		// 	console.log("uploadChangeuploadChange", fileList);
		// 	// this.fileList = fileList;
		// },
		// 文件上传时的钩子
		// uploadProgress(event, file, fileList) {
		// 	console.log("uploadProgressuploadProgress", file);
		// 	console.log("uploadProgressuploadProgress", fileList);
		// 	// this.list = fileList;
		// },
		// 自定义上传方法

		async uploadFN(params) {
			const { file } = params;
			console.log(this.inData, "newVal, oldValnewVal, oldValnewVal, oldVal");
			// 如果是批量上传
			if (this.isBatch) {
				// todo 批量上传接口对接联调
				const res = await uploadImageBatch(file);
				throw res;
				// if (res.code === 200) {
				// 	params.onSuccess(res.data);
				// } else {
				// 	params.onError(res);
				// }
			} else {
				let res;
				const data = this.inData;
				if (this.isFile) {
					res = await uploadFileMi(file, data, this.ajaxProp);
				} else {
					res = await uploadImage(file);
				}
				if (res.code === 200) {
					params.onSuccess(res.data);
				} else {
					params.onError(res);
				}
			}
		},

		// 获取 headers 参数
		getHeaders() {
			const headers = {};
			headers["directory"] = this.inData.directory;
			// 可以继续添加其他参数，根据后台需要解析的信息来添加键值对
			return headers;
		},

		// 图片预览
		handlePreview(file) {
			if (this.isFile) {
				return;
			}
			this.dialogImageUrl = file.url;
			this.dialogVisible = true;
		},
		// 限制图片
		handleChange(file, fileList) {
			if (fileList.length >= this.maxFile) {
				this.uploadDisabled = true;
			}
		},
		// 图片删除
		handleRemove(file, fileList) {
			console.log("handleRemovehandleRemove", file);
			this.fileList = fileList;
			// 前端伪删除图片
			this.$emit("updateFileList", fileList);
			this.uploadDisabled = false;
		},
		// 清空已上传的图片
		clearImgList() {
			this.fileList = [];
			this.$emit("updateFileList", []);
		}
	}
};
</script>

<style lang="scss" scoped>
.uploader {
	.el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px !important;
		cursor: pointer !important;
		position: relative !important;
		overflow: hidden !important;
	}

	.el-upload:hover {
		border-color: #409eff;
	}

	.uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 148px;
		height: 148px;
		line-height: 148px;
		text-align: center;
	}

	.avatar {
		width: 148px;
		height: 148px;
		display: block;
	}
}

.uploadText {
	font-size: 13px;
	color: #333;
	display: inline-block;
	margin: 10px 0;
}

// .el-upload--picture-card 控制加号部分
.disabled ::v-deep .el-upload--picture-card {
	display: none !important;
}
</style>
