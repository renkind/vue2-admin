<template>
	<div>
		<el-form-item label="背景图选择" prop="" label-width="200px" v-if="type != 'B'">
			<el-radio-group v-model="formModal.type" @change="imageListModal = false">
				<el-radio :label="item.value" v-for="item in selectOption" :key="item.value">{{ item.label }}</el-radio>
			</el-radio-group>
      <span style="font-size: 12px; color: #999; margin-left: 30px" v-if="formModal.type == 2 && type === 'A'">请上传375*120尺寸图片</span>
      <span style="font-size: 12px; color: #999; margin-left: 30px" v-if="formModal.type == 2 && type === 'C'">请上传375*300尺寸图片</span>
		</el-form-item>
		<el-form-item label="" v-show="formModal.type == 1 && type != 'B'" label-width="200px">
			<el-button type="primary" plain @click="imageListModal = true"> 选择背景图片 </el-button>
			<ImageSelectModal
				:dialogVisible="imageListModal"
				@closeModal="imageListModal = false"
				@updateSelectImg="selectImgCallBack"
				:maxnum=1
			/>
		</el-form-item>
		<el-form-item label="" v-if="formModal.type == 2 && type != 'B'" label-width="200px">
			<ZsImageupload :maxFile="1" :isList="false" @updateFileList="uploadCallback" :maxKb="300" />
		</el-form-item>
		<el-form-item label="背景图预览" label-width="200px" v-if="type != 'B' && formModal.bgUrl">
			<ZsImg imgStyle="height: 100px" :src="formModal.bgUrl"></ZsImg>
		</el-form-item>
		<el-form-item label="是否点击背景图跳转" prop="" v-if="type != 'B' && formModal.bgUrl">
			<el-radio-group v-model="formModal.needJump">
				<el-radio :label="item.value" v-for="item in jump_options" :key="item.value">{{ item.label }}</el-radio>
			</el-radio-group>
		</el-form-item>
		<el-form-item label="背景图跳转地址" prop="" v-if="type != 'B' && formModal.needJump && formModal.bgUrl">
			<el-input v-model="formModal.jumpUrl" clearable></el-input>
		</el-form-item>
		<el-form-item label="模板填充" prop="name" label-width="100px" class="jName"> </el-form-item>
		<el-form-item label="" prop="" label-width="0" v-if="type === 'C'">
      <div v-for="(el, index) in groupInfo" :key="index" class="type-c-wtype-c-wraprap" >
        <i class="el-icon-delete remove-group" @click="removeGroup(index)" v-show="groupInfo.length > 1 && !disabled"></i>
			<span>左侧内容</span>
			<content-config
				:templateInfo="el"
				:disabled="disabled"
				:theme="type"
				:isAdd=true
				ref="contentConfig"
			/>
			<span>右侧内容</span>
			<div v-for="(i, index) in el" :key="index">
				<content-config
					:templateInfo="i.templateInfo"
					:disabled="disabled"
					:theme="type"
					:maxNum=4
					ref="contentConfig"
				/>
			</div>
      </div>
			<el-button
				type="primary"
				style="display: block; width: 100%; margin-top: 20px"
				plain
				v-if="!disabled"
				@click="addTypeC"
			>
				新增
			</el-button>
		</el-form-item>
		<el-form-item label="" prop="" label-width="0" v-else>
			<content-config :templateInfo="templateInfo" :disabled="disabled" :theme="type" ref="contentConfig" />
		</el-form-item>
	</div>
</template>

<script>
import ZsImageupload from "@/components/Zs_form/Zs_imageUpload";
import ImageSelectModal from "@/components/ImageSelectModal";
import ContentConfig from "./contentConfig";

export default {
	data() {
		return {
			formModal: {
				type: 1, // 背景图选择方式
				needJump: false, // 点击是否跳转
				bgUrl: "" // 背景图片
			},
			imageListModal: false,

      groupInfo: [
        [
          {
            templateInfo: [
              {
                template_type: "0", // 模板类型 事项-聚合页-外链
                template_type_name: "matter",
                selectCoverType: 1, // 选择图片方式
                selectMarkType: 1, // 选择图片方式
                sort: null, // 排序
                describe: "", // 描述
                cover: "", // 图片
                coverId: "", // 资源图片id
                externalUrl: "", // 外链地址
                orderNum: 1,
                externalName: "",
                marks: [], // 角标
                type: "0" // 选择方式
              }
            ],
            template_type: "0", // 模板类型 事项-聚合页-外链
            template_type_name: "matter",
            selectCoverType: 1, // 选择图片方式
            selectMarkType: 1, // 选择图片方式
            sort: null, // 排序
            describe: "", // 描述
            cover: "", // 图片
            coverId: "", // 资源图片id
            externalUrl: "", // 外链地址
            externalName: "",
            orderNum: 1,
            marks: [], // 角标
            type: "0" // 选择方式
          }
        ]
      ],
			templateInfo: [
				{
					template_type: "0", // 模板类型 事项-聚合页-外链
					selectCoverType: 1, // 选择图片方式
					selectMarkType: 1, // 选择图片方式
					sort: null, // 排序
					describe: "", // 描述
					cover: "", // 图片
					coverId: "", // 资源图片id
					externalUrl: "", // 外链地址
          externalName: "",
          orderNum: 1,
					marks: [], // 角标
					type: "0" // 选择方式
				}
			],
			eventList: [],
			aggregateList: [],
			selectOption: [
				{
					value: 1,
					label: "选择"
				},
				{
					value: 2,
					label: "上传"
				}
			],
			jump_options: [
				{
					value: true,
					label: "是"
				},
				{
					value: false,
					label: "否"
				}
			]
		};
	},
	props: {
		type: {
			type: String,
			required: true
		},
		jsonStr: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false,
			default: false
		}
	},
	components: {
		ZsImageupload,
		ImageSelectModal,
		ContentConfig
	},
	mounted() {
		this.$nextTick(() => {
			console.log(this.jsonStr, "this.jsonStr");
			if (this.jsonStr) {
				const jsonInfo = JSON.parse(this.jsonStr);
				this.formModal = jsonInfo.formModal;
        if (this.type === "C") {
          this.groupInfo = jsonInfo.templateInfo;
        } else {
          this.templateInfo = jsonInfo.templateInfo;
        }
			}
		});
	},
	methods: {
		reset() {
			this.formModal = {
				type: 1, // 背景图选择方式
				needJump: false, // 点击是否跳转
				bgUrl: "" // 背景图片
			};
      this.groupInfo = [
        [
          {
            templateInfo: [
              {
                template_type: "0", // 模板类型 事项-聚合页-外链
                template_type_name: "matter",
                selectCoverType: 1, // 选择图片方式
                selectMarkType: 1, // 选择图片方式
                sort: null, // 排序
                describe: "", // 描述
                cover: "", // 图片
                coverId: "", // 资源图片id
                externalUrl: "", // 外链地址
                externalName: "",
                orderNum: 1,
                marks: [], // 角标
                type: "0" // 选择方式
              }
            ],
            template_type: "0", // 模板类型 事项-聚合页-外链
            template_type_name: "matter",
            selectCoverType: 1, // 选择图片方式
            selectMarkType: 1, // 选择图片方式
            sort: null, // 排序
            describe: "", // 描述
            cover: "", // 图片
            coverId: "", // 资源图片id
            externalUrl: "", // 外链地址
            externalName: "",
            orderNum: 1,
            marks: [], // 角标
            type: "0" // 选择方式
          }
        ]
      ];
			this.templateInfo = [
				{
					template_type: "0", // 模板类型 事项-聚合页-外链
          template_type_name: "matter",
					selectCoverType: 1, // 选择图片方式
					selectMarkType: 1, // 选择图片方式
					sort: null, // 排序
					describe: "", // 描述
					cover: "", // 图片
					coverId: "", // 资源图片id
					externalUrl: "", // 外链地址
          externalName: "",
          orderNum: 1,
					marks: [], // 角标
					type: "0" // 选择方式
				}
			];
			this.$refs["contentConfig"].changeView(); // 关闭所有弹框
		},
		getJsonStr() {
      let templateInfoArr = this.templateInfo;
      if (this.type === "C") {
        templateInfoArr = this.groupInfo;
      }
			const returnInfo = {
				formModal: this.formModal,
				templateInfo: templateInfoArr
			};
			console.log(returnInfo);
			return returnInfo;
		},
    removeGroup(idx) {
      if (this.groupInfo.length > 1) {
        this.groupInfo.splice(idx, 1);
      }
    },
		remove(idx) {
			if (this.templateInfo.length > 1) {
				this.templateInfo.splice(idx, 1);
			}
		},
		addView() {
			this.templateInfo.push({ type: 1 });
		},
		addTypeC() {
			this.groupInfo.push([{
				templateInfo: [
					{
						template_type: "0",
						selectCoverType: 1,
						selectMarkType: 1,
						sort: null,
						describe: "",
						cover: "",
						coverId: "",
            orderNum: 1,
						externalUrl: "",
            externalName: "",
						marks: [],
						type: "0"
					}
				],
				template_type: "0",
				selectCoverType: 1,
				selectMarkType: 1,
				sort: null,
				describe: "",
				cover: "",
				coverId: "",
        orderNum: 1,
				externalUrl: "",
        externalName: "",
				marks: [],
				type: "0"
			}]);
		},
		uploadCallback(e) {
			console.log(e);
			if (e) {
				this.$set(this.formModal, "bgUrl", e[0].rurl);
			}
		},
		selectImgCallBack(e) {
			console.log(e);
			if (e) {
				this.$set(this.formModal, "bgUrl", e[0].pictureUrl);
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.singleView {
	display: flex;
	width: 100%;
	.describe {
		margin-top: 20px;
	}
}
.el-form-item__content >>> .el-select {
	display: block !important;
}
.el-form-item {
	width: 50%;
}
.type-c-wrap {
	padding: 20px;
	border: 2px solid #999;
	margin-bottom: 10px;
}
.type-c-wtype-c-wraprap {
  border: 1px solid #999999;
  padding: 10px;
  position: relative;
  margin-bottom: 10px;
}
.type-c-wtype-c-wraprap .remove-group {
  position: absolute;
  right: -20px;
  top: 10px;

}
.jName{
  margin: 20px 20px;
  padding: 5px 20px;
  line-height: 50px;
  min-height: 50px;
}
</style>
