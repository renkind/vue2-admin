<template>
	<div class="edit-continer">
		<el-card class="box-card">
			<div class="content">
				<el-form
					ref="formParams"
					:model="formParams"
					:rules="rules"
					label-width="100px"
					style="margin-top: 10px; width: 400px"
				>
					<el-form-item label="版本号" prop="versionCode">
						<el-input v-model="formParams.versionCode" maxlength="50"></el-input>
					</el-form-item>
					<el-form-item label="描述" prop="versionDes">
						<el-input type="textarea" v-model="formParams.versionDes" maxlength="50"></el-input>
					</el-form-item>

					<!-- <MinioUpload :inData="inData" /> -->

					<!-- <zs-image-upload
					accept="application/pdf"
					:maxKb="1024000"
					:maxFile="100"
					:fileLists="fileLists"
					:isFile="true"
					:inData="inData"
					:showList="true"
					@updateFileList="uploadSuccess"
				></zs-image-upload> -->
					<CustomImageUpload
						accept="application/zip, application/apk,application/x-zip-compressed,application/vnd.android.package-archive"
						:maxKb="300 * 1024"
						:maxFile="100"
						:fileLists="fileLists"
						:isFile="true"
						:inData="inData"
						intro="请上传APK/ZIP格式文件"
						:showList="true"
						@updateFileList="uploadSuccess"
					></CustomImageUpload>
				</el-form>
				<ZsTopButton>
					<el-button @click="cancel">取消</el-button>
					<el-button type="primary" @click="submit">发布</el-button>
				</ZsTopButton>
			</div>
		</el-card>
	</div>
</template>
<script>
import ZsTopButton from "@/components/Zs_topButton";
// import ZsImageUpload from "@/components/Zs_form/Zs_imageUpload";
import CustomImageUpload from "./CustomImageUpload.vue";
// import MinioUpload from "@/components/MinioUpload";
import { addAndroid } from "@/service/upgrade";

export default {
	components: {
		ZsTopButton,
		// MinioUpload
		// ZsImageUpload
		CustomImageUpload
	},
	data() {
		return {
			formParams: {
				versionCode: "", // 设置初始值为空字符串
				versionDes: "", // 设置初始值为空字符串
				meetingResourceList: [] // 初始化为空数组
			},
			fileLists: [],
			rules: {
				versionCode: [{ required: true, message: "版本号不能为空", trigger: "blur" }],
				versionDes: [{ required: true, message: "版本描述不能为空", trigger: "blur" }]
			}, // 校验规则
			inData: {
				directory: "android"
			},
			data: ""
		};
	},
	mounted() {},
	methods: {
		uploadSuccess(res) {
			res.forEach((x) => {
				x.urlPath = x.url || x.rurl;
			});
			this.formParams.meetingResourceList = res; // Add the uploaded files to the formParams
		},

		submit(approvalStatus) {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid) {
					const paramsList = {
						name: this.formParams.meetingResourceList[0].name,
						downloadUrl: this.formParams.meetingResourceList[0].rurl,
						upgradeDesc: this.formParams.versionDes,
						version: this.formParams.versionCode,
						miniVersion: this.formParams.versionCode
					};

					const res = await addAndroid(paramsList);
					// console.log(res, "versionCodeversionCodeversionCodeversionCodeversionCodeversionCodeversionCodeversionCode");
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$router.push("/VersionManage");
						// 调用列表页组件的 refreshListData 方法
						this.$router.app.$options.components["VersionManage"].methods.refreshListData();
						// this.$router.back();
					} else {
						this.$message.error(res.msg);
					}
				} else {
					return false;
				}
			});
		},

		// uploadSuccess(obj, res) {
		// 	res.forEach((x) => {
		// 		x.urlPath = x.url || x.rurl;
		// 	});
		// 	obj.meetingResourceList = [];
		// 	obj.meetingResourceList = res;
		// 	console.log(res, "meetingResourceListmeetingResourceList");
		// },

		// 返回
		cancel() {
			this.$router.back();
		}
	}
};
</script>
<style lang="scss" scoped>
.content {
	flex-direction: column;
	align-items: center;
	width: 80%;
	margin: 0 auto;
	margin-top: 50px;
}

.el-form {
	width: 450px !important;
}
</style>
