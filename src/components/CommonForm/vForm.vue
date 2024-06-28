<template>
	<div :class="formSettings.length == 1 ? 'v-form--single' : 'v-form--multiple'" class="v-form">
		<!-- {{formData}} -->
		<!-- <pre>{{formModel}}</pre> -->
		<!-- <pre>{{uploadCallbacks}}</pre> -->
		<el-form
			v-if="formModel"
			ref="vForm"
			:inline="isInline"
			:model="formModel"
			:rules="formRules"
			:label-width="labelWidth"
			:size="size"
		>
			<div v-for="(section, sectionIndex) in formSettings" :key="sectionIndex" class="form-section">
				<h3 class="section-label">{{ section.label }}</h3>
				<div v-if="!section.slot" class="section-content">
					<el-form-item
						v-for="(item, index) in section.items"
						v-show="!item.hidden"
						:key="index"
						:label="item.label"
						:prop="item.name"
					>
						<!-- 文字输入 -->
						<!--
              append: 文本框后置内容
            -->
						<template v-if="item.type == 'text'">
							<el-input
								v-model.trim="formModel[item.name]"
								:placeholder="item.placeholder"
								:disabled="item.disabled"
								:maxlength="item.maxlength"
								:show-word-limit="item.showWordLimit"
							>
								<template v-if="item.append" slot="append">{{ item.append }}</template>
							</el-input>
						</template>
						<!-- 车牌号 -->
						<template v-if="item.type == 'carNumber'">
							<el-input v-model="formModel[item.name]" :placeholder="item.placeholder" :disabled="item.disabled">
								<el-select
									slot="prepend"
									v-model="formModel[item.name + '_carNumber']"
									placeholder="请选择"
									style="width: 60px"
								>
									<el-option
										v-for="(province, pIndex) in provinceList"
										:label="province"
										:value="province"
										:key="pIndex"
									/>
								</el-select>
							</el-input>
						</template>
						<!-- 密码 -->
						<template v-else-if="item.type == 'password'">
							<el-input
								v-model="formModel[item.name]"
								:placeholder="item.placeholder"
								:disabled="item.disabled"
								type="password"
							/>
						</template>
						<!-- 数字类型 -->
						<!--
              controls: 是否显示增减按钮
              min: 最小值
              max: 最大值
              disabled: 是否禁用
              append: 文本框后置内容
            -->
						<template v-else-if="item.type == 'number'">
							<el-input-number
								v-model="formModel[item.name]"
								:placeholder="item.placeholder"
								:controls="!!item.controls"
								:min="item.min"
								:max="item.max"
								:label="item.label"
								:disabled="item.disabled"
								:class="{ 'number-with-append': item.append }"
							>
								<template v-if="item.append" slot="append">{{ item.append }}</template>
							</el-input-number>
							<span v-if="item.describe" style="margin-left: 5px">{{ item.describe }}</span>
						</template>
						<!-- 下拉选择 -->
						<template v-else-if="item.type == 'select'">
							<el-select
								v-model="formModel[item.name]"
								:placeholder="item.placeholder"
								:clearable="true"
								:disabled="item.disabled"
								:multiple="!!item.multiple"
								:filterable="item.filterable"
								@change="item.events && item.events.change ? $emit(item.events.change, formModel[item.name]) : null"
							>
								<template v-if="item.options">
									<el-option
										v-for="(optionItem, optionIndex) in item.options"
										:key="optionIndex"
										:label="optionItem.label"
										:value="optionItem.value"
									/>
								</template>
								<template v-else>
									<el-option label="是" value="1" />
									<el-option label="否" value="0" />
								</template>
							</el-select>
						</template>
						<!-- switch开关 -->
						<template v-else-if="item.type == 'switch'">
							<el-switch
								v-model="formModel[item.name]"
								:active-text="item.activeText"
								:inactive-text="item.inactiveText"
								:active-color="item.activeColor"
								:inactive-color="item.inactiveColor"
								:active-value="item.activeValue"
								:inactive-value="item.inactiveValue"
								@change="item.events && item.events.change ? $emit(item.events.change, formModel[item.name]) : null"
							/>
						</template>
						<!-- 级联选择器 -->
						<template v-else-if="item.type == 'cascader'">
							<el-cascader
								change-on-select
								:options="item.options"
								v-model="formModel[item.name]"
								:clearable="true"
								:props="item.props"
								expand-trigger="hover"
							/>
						</template>
						<!-- 时间日期范围选择 -->
						<template v-else-if="item.type == 'datetimerange'">
							<el-date-picker
								v-model="formModel[item.name]"
								:disabled="item.disabled"
								:default-time="item.defaultTime"
								type="datetimerange"
								align="right"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							/>
						</template>
						<!-- 日期范围选择 -->
						<template v-else-if="item.type == 'daterange'">
							<el-date-picker
								v-model="formModel[item.name]"
								:disabled="item.disabled"
								type="daterange"
								align="right"
								range-separator="至"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
							/>
							<!-- <el-date-picker
                v-model="formModel[item.name]"
                :default-time="item.defaultTime"
                type="datetimerange"
                align="right"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />-->
						</template>
						<!-- 日期范围选择 -->

						<!-- 日期选择 -->
						<template v-else-if="item.type == 'date'">
							<el-date-picker
								v-model="formModel[item.name]"
								:placeholder="item.placeholder || '选择日期'"
								type="date"
								value-format="yyyy-MM-dd"
							/>
						</template>
						<!-- 日期和时间选择 -->
						<template v-else-if="item.type == 'datetime'">
							<el-date-picker
								v-model="formModel[item.name]"
								:disabled="item.disabled"
								:placeholder="item.placeholder || '选择日期'"
								type="datetime"
								value-format="yyyy-MM-dd HH:mm:ss"
							/>
						</template>
						<!-- 时间范围选择 -->
						<template v-else-if="item.type == 'timerange'">
							<el-time-picker
								v-model="formModel[item.name]"
								:disabled="item.disabled"
								:placeholder="item.placeholder || '选择时间范围'"
								is-range
								range-separator="至"
								start-placeholder="开始时间"
								end-placeholder="结束时间"
							/>
						</template>
						<!-- 时间选择 -->
						<template v-else-if="item.type == 'time'">
							<el-time-picker
								v-model="formModel[item.name]"
								:disabled="item.disabled"
								:placeholder="item.placeholder || '选择时间'"
							/>
							<el-date-picker
								v-model="formModel[item.name]"
								:placeholder="item.placeholder || '选择日期'"
								:clearable="item.clearable"
								type="datetime"
							/>
						</template>

						<!-- 单选 -->
						<template v-else-if="item.type == 'radio'">
							<el-radio-group
								v-model="formModel[item.name]"
								@change="item.events && item.events.change ? $emit(item.events.change, formModel[item.name]) : null"
							>
								<el-radio
									v-for="(radioItem, radioIndex) in item.options"
									:disabled="item.disabled"
									:key="radioIndex"
									:label="radioItem.value"
									>{{ radioItem.label }}</el-radio
								>
							</el-radio-group>
						</template>
						<!-- 多选 -->
						<template v-else-if="item.type == 'checkbox'">
							<el-checkbox-group
								v-model="formModel[item.name]"
								:min="item.min"
								:max="item.max"
								@change="item.events && item.events.change ? $emit(item.events.change, formModel[item.name]) : null"
							>
								<el-checkbox
									v-for="(checkItem, checkIndex) in item.options"
									:key="checkIndex"
									:label="checkItem.value"
									:disabled="checkItem.disabled"
									>{{ checkItem.label }}</el-checkbox
								>
							</el-checkbox-group>
						</template>
						<!-- 文本域 -->
						<template v-else-if="item.type == 'textarea'">
							<el-input
								:autosize="{ minRows: 4, maxRows: 8 }"
								:placeholder="item.placeholder || '请输入内容'"
								:disabled="item.disabled"
								:maxlength="item.maxlength"
								v-model="formModel[item.name]"
								:show-word-limit="item.showWordLimit"
								type="textarea"
							/>
							<span class="textarea-words" v-if="item.showWords">{{ formModel[item.name].length }}</span>
							<!-- <el-input
                :autosize="{ minRows: 2, maxRows: 4}"
                :placeholder="item.placeholder || '请输入内容'"
                :maxlength="item.maxlength"
                v-model="formModel[item.name]"
                type="textarea"
              />-->
						</template>

						<!-- slot自定义内容 -->
						<template v-else-if="item.type == 'slot'">
							<slot :name="item.name" :model="formModel" />
						</template>
					</el-form-item>
				</div>
				<div v-else class="section-content">
					<slot :name="section.slot" :model="formModel" />
				</div>
			</div>
			<el-form-item class="btn-container" v-if="showButton">
				<el-button :loading="btnLoading" class="save-btn" type="primary" @click="onSave" size="mini">{{
					submitName
				}}</el-button>
				<el-button v-if="showReset" class="cancel-btn" @click="resetFields" size="mini">重置</el-button>
				<el-button v-if="showCancel" class="cancel-btn" @click="onCancel" size="mini">取消</el-button>
				<el-button v-if="showReturn" class="cancel-btn" @click="onReturn" size="mini">返回</el-button>
			</el-form-item>
			<slot name="bottom-slot" />
		</el-form>
	</div>
</template>
<script>
/*
  formSettings为必填配置项，配置格式如下：
  [{
    label: 'xxx', //；表单区块名
    items: [{
      label: 'xx', // 表单项名
      name: 'xxx', // 字段名
      type: 'xx', // 表单类型（text, select, date, radio, checkbox, cascader, daterange, textarea, img, file, slot...）
      options: [{ // select、radio、checkbox等的选择内容
        label: '...',
        value: '...'
      }]
      value: xx, // 默认值
      valueType: 'xxx', // 值类型，number/string/date/array...
      rule: [{
        validator: validatePass, trigger: 'blur'
      }],
      events: {
        change: 'emitName' // 事件发生时emit指定名的事件
      },
      required: Boolean, // 是否为必填项
      hidden: Boolean, // 是否隐藏该项，隐藏项不会发送数据
      limit: Number, //上传文件时的最大上传限制
      tip: String, // 上传文件时的文字tip
    }]

  }]

  formData为选填项，如传入formDate，则表单会有默认值，格式如下：
  {
    key: value,
    key: value
  }

  slot示例:
  <template slot="location" slot-scope="scope">
    <el-input placeholder="" v-model="scope.model.location">
      <el-button slot="append" icon="el-icon-search"></el-button>
    </el-input>
  </template>
   */

export default {
	name: "VForm",
	props: {
		formSettings: {
			type: Array,
			required: true
		},
		formData: {
			type: Object,
			default: () => {}
		},
		showButton: {
			type: Boolean,
			default: true
		},
		showCancel: {
			type: Boolean,
			default: false
		},
		showReset: {
			type: Boolean,
			default: false
		},
		labelWidth: {
			type: String,
			default: "135px"
		},
		size: {
			type: String,
			default: "small"
		},
		btnLoading: {
			type: Boolean,
			default: false
		},
		submitName: {
			type: String,
			default: "保存"
		},
		showReturn: {
			type: Boolean,
			default: false
		},
		showPreview: {
			type: Boolean,
			default: false
		},
		isInline: {
			type: Boolean,
			default: false
		}
	},
	data() {
		return {
			dataOptions: {
				shortcuts: [
					{
						text: "最近一周",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近一个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
							picker.$emit("pick", [start, end]);
						}
					},
					{
						text: "最近三个月",
						onClick(picker) {
							const end = new Date();
							const start = new Date();
							start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
							picker.$emit("pick", [start, end]);
						}
					}
				]
			},
			formModel: null,
			formRules: null,
			flatFormSettings: null,
			uploadCallbacks: {},
			removeCallbacks: {},
			beforeUploadCallbacks: {},
			defineHttpRequest: {},

			upToken: null,
			isUploading: false
		};
	},
	watch: {
		formSettings() {
			this.updateForm();
		},
		formData() {
			this.updateForm();
		}
	},
	mounted() {
		this.updateForm();
	},

	methods: {
		// 更新表单校验规则
		updateRule() {
			const tmpRules = {};
			this.formSettings.forEach((settingItem) => {
				settingItem.items.forEach((item) => {
					if (!item.hidden && item.required) {
						let ruleMsg = "请输入";
						if (item.type === "radio" || item.type === "checkbox" || item.type === "select") {
							ruleMsg = "请选择";
						}
						if (item.type === "img" || item.type === "file") {
							ruleMsg = "请上传";
						}
						tmpRules[item.name] = [
							{
								required: true,
								message: item.defineMessage ? ruleMsg + item.defineMessage : ruleMsg + item.label, // 自定义校验提示
								trigger: "change"
							}
						];
						// if (item.type == 'date') {
						//   tmpRules[item.name][0].type = 'date'
						// }
						if (item.type === "number") {
							tmpRules[item.name][0].type = "number";
							tmpRules[item.name][0].trigger = "blur";
						}
						if (item.type === "carNumber") {
							tmpRules[item.name][0].trigger = "blur";
						}
						if (item.type === "date") {
							tmpRules[item.name][0].type = "date";
						}
						if (item.type === "daterange") {
							tmpRules[item.name][0].type = "array";
						}
						if (item.type === "datetimerange") {
							tmpRules[item.name][0].type = "array";
						}
						if (this.formModel[item.name] && this.formModel[item.name].push) {
							tmpRules[item.name][0].type = "array";
						}
						if (item.valueType) {
							tmpRules[item.name][0].type = item.valueType;
						}
					}
					if (!item.hidden && item.rule) {
						tmpRules[item.name] = item.rule;
					}
				});
			});
			this.formRules = tmpRules;
			this.$nextTick(() => {
				this.clearValidate();
			});
		},
		// 更新整个表单
		updateForm(formData) {
			if (this.formSettings) {
				if (!formData) {
					formData = {
						...this.formData
					};
				}
				const tmpModel = {};
				const tmpUploadCallback = {};
				const tmpRemoveCallback = {};
				const tmpBeforeUploadCallback = {};
				const tempHttpRequest = {};
				this.flatFormSettings = {};
				this.formSettings.forEach((settingItem) => {
					settingItem.items.forEach((item) => {
						this.flatFormSettings[item.name] = item;
						if (item.hasTextInput) {
							if (!this.imgUploadText) {
								this.imgUploadText = {};
							}
							if (formData) {
								if (formData[`${item.name}UploadText`]) {
									this.imgUploadText[item.name] = formData[`${item.name}UploadText`];
								} else if (formData[item.name]) {
									this.imgUploadText[item.name] = new Array(formData[item.name].length).fill("");
								} else {
									this.imgUploadText[item.name] = [];
								}
							} else {
								this.imgUploadText[item.name] = [];
							}
						}
						if (formData && formData[item.name] !== undefined) {
							if ((item.type === "date" || item.type === "time") && !Number.isNaN(formData[item.name])) {
								if (String(formData[item.name]).length === 10) {
									tmpModel[item.name] = new Date(formData[item.name] * 1000);
								} else {
									tmpModel[item.name] = new Date(+formData[item.name]);
								}
							} else if (item.type === "switch") {
								if (item.trueValue !== undefined) {
									tmpModel[item.name] = formData[item.name] === item.trueValue;
								} else {
									tmpModel[item.name] = formData[item.name];
								}
							} else if (
								(item.type === "daterange" || item.type === "timerange" || item.type === "datetimerange") &&
								!Number.isNaN(formData[item.name][0])
							) {
								if (String(formData[item.name][0]).length === 10) {
									tmpModel[item.name] = [
										new Date(formData[item.name][0] * 1000),
										new Date(formData[item.name][1] * 1000)
									];
								} else {
									tmpModel[item.name] = [new Date(+formData[item.name][0]), new Date(+formData[item.name][1])];
								}
							} else {
								tmpModel[item.name] = formData[item.name];
							}
						} else {
							if (Object.prototype.hasOwnProperty.call(item, "value")) {
								tmpModel[item.name] = item.value;
							} else if (item.type === "checkbox") {
								tmpModel[item.name] = [];
							} else if (item.type === "switch") {
								tmpModel[item.name] = false;
							} else if (item.type === "radio") {
								const index = item.options.findIndex((i) => i.default);
								if (index > -1) {
									tmpModel[item.name] = item.options[index].value;
								}
							} else if (item.type === "cascader") {
								tmpModel[item.name] = [];
							} else if (
								item.type === "img" ||
								item.type === "file" ||
								item.type === "audio" ||
								item.type === "video" ||
								item.type === "simpleVideo"
							) {
								tmpModel[item.name] = [];
							} else if (item.type === "slot") {
								tmpModel[item.name] = item.value || "";
							} else if (item.type === "carNumber") {
								tmpModel[item.name] = item.value || "";
								tmpModel[`${item.name}_carNumber`] = item.default || "";
							} else if (item.type === "number") {
								tmpModel[item.name] = undefined;
							} else {
								tmpModel[item.name] = "";
							}
						}

						if (
							item.type === "img" ||
							item.type === "file" ||
							item.type === "audio" ||
							item.type === "video" ||
							item.type === "simpleVideo"
						) {
							tmpUploadCallback[item.name] = (response, file, fileList) => {
								this.handleUploadFile(item.name, response, file, fileList);
							};
							tmpRemoveCallback[item.name] = (file, fileList) => {
								this.handleRemoveFile(item.name, file, fileList);
								this.$emit("removeFile");
							};
							tmpBeforeUploadCallback[item.name] = (file) => {
								this.handleBeforeUploadFile(item.name, file, item);
							};
							tempHttpRequest[item.name] = (file) => {
								this.defineRequest(item.name, file);
							};
						}
					});
				});
				this.formModel = tmpModel;
				this.uploadCallbacks = tmpUploadCallback;
				this.removeCallbacks = tmpRemoveCallback;
				this.beforeUploadCallbacks = tmpBeforeUploadCallback;
				this.defineHttpRequest = tempHttpRequest;
				console.log(this.formModel, "this.formModel");
				this.updateRule();
			}
		},

		// 获取表单数据
		getFormData() {
			const data = { ...this.formModel };
			if (this.flatFormSettings) {
				Object.keys(this.flatFormSettings).forEach((item) => {
					const formItem = this.flatFormSettings[item];
					if (formItem.unixTime) {
						if (formItem.type === "date" || formItem.type === "time") {
							data[formItem.name] = Math.round(data[formItem.name] / 1000);
						} else if (
							(formItem.type === "daterange" || formItem.type === "timerange" || formItem.type === "datetimerange") &&
							data[formItem.name]
						) {
							data[formItem.name] = data[formItem.name].map((i) => Math.round(i / 1000));
						}
					}
					if (formItem.type === "carNumber") {
						data[formItem.name] = (data[`${formItem.name}_carNumber`] + data[formItem.name]).toUpperCase();
						delete data[`${formItem.name}_carNumber`];
					}
					if (formItem.type === "img" && formItem.hasTextInput) {
						data[`${formItem.name}UploadText`] = this.imgUploadText[formItem.name];
					}
				});
			}
			return data;
		},
		// 点击保存按钮回调
		onSave() {
			this.$refs.vForm
				.validate()
				.then(() => {
					this.$emit("save", this.getFormData());
				})
				.catch(() => {
					this.$emit("error");
					this.$nextTick(() => {
						this.$el.querySelector(".el-form-item.is-error").scrollIntoView();
					});
				});
		},
		// 点击返回
		onReturn() {
			this.$emit("onReturn");
		},
		// 修改某一项的值
		setData(name, value) {
			if (!name || this.formModel[name] === undefined) {
				return;
			}
			if (this.flatFormSettings[name].type === "img") {
				if (value && value.map && typeof value[0] === "string") {
					value = value.map((item) => ({
						name: item.split("/").pop(),
						url: item
					}));
				}
			}
			this.formModel[name] = value;
		},
		// 获取某一项的值
		getData(name) {
			if (name) {
				if (this.flatFormSettings[name].type === "carNumber") {
					return this.formModel[`${name}_carNumber`] + this.formModel[name];
				}
				return this.formModel[name];
			}
			let ret;
			this.$refs.vForm
				.validate((valid) => {
					if (valid) {
						ret = this.getFormData();
					}
				})
				.catch(() => {});
			return ret;
		},
		// 异步获取某一项的值（在表单校验通过的时候resolve）
		getDataAsync(name) {
			return new Promise((resolve, reject) => {
				if (name) {
					resolve(this.formModel[name]);
				}
				this.$refs.vForm
					.validate()
					.then(() => {
						resolve(this.getFormData());
					})
					.catch((err) => {
						reject(err);
					});
			});
		},
		// 点击取消按钮回调
		onCancel() {
			this.$emit("cancel");
			this.resetFields();
		},
		// 重置表单数据
		resetFields() {
			this.$refs.vForm && this.$refs.vForm.resetFields();
		},
		// 清空表单校验
		clearValidate() {
			this.$refs.vForm && this.$refs.vForm.clearValidate();
		},
		// 重置数据并清空校验
		clearForm() {
			this.resetFields();
			this.clearValidate();
		},
		// 修改checkbox和select的options内容
		setItemOptions(name, options) {
			const item = this.flatFormSettings[name];
			if (!item) {
				throw new Error("没有找到该表单项");
			}
			item.options = options;
		},
		// 设置封面
		setCover(val) {
			console.log(val);
		}
	}
};
</script>
<style lang="scss">
.v-form {
	.save-btn {
		margin-bottom: 30px;
	}
	.el-input__count {
		.el-input__count-inner {
			height: 29px !important;
		}
	}
	.textarea-words {
		color: #909399;
		position: absolute;
		font-size: 12px;
		bottom: 5px;
		right: 10px;
	}
	.imageHandel {
		margin-top: 85px;
		margin-bottom: 16px;
		margin-left: 109px;
		width: 100%;
		height: 32px;
		position: relative;
		.handelBtn {
			position: absolute;
			right: 34px;
			top: -73px;
			display: flex;
			flex-direction: column;
			height: 74px;
			align-items: center;
		}
	}
	// max-width: 800px;
	label {
		font-weight: normal;
	}
	&.v-form--multiple {
		padding-left: 68px;
		padding-right: 68px;
	}
	&.v-form--single {
		padding-right: 10px;
	}
	.form-section {
		margin-bottom: 20px;
		overflow: hidden;
		// border-bottom: 1px solid #e8e8e8;
		// padding-bottom: 20px;
		h3 {
			margin-bottom: 20px;
			font-size: 16px;
		}
	}
	.el-form-item__label {
		text-align: left;
	}
	.el-form-item__content {
		margin-right: 10px;
		> .el-select,
		> .el-cascader,
		> .el-date-editor {
			display: block;
			width: 100%;
		}
		.el-date-editor > * {
			vertical-align: top;
		}
	}
	.el-checkbox-group .el-checkbox {
		margin-left: 0;
		margin-right: 30px;
	}
	.upload-img.has-text-input {
		.upload-tip-container {
			position: relative;
			.upload-text-container {
				position: absolute;
				top: 100%;
				width: 100%;
				.el-input {
					margin-top: 94px;
					margin-bottom: 16px;
				}
			}
		}
		.el-upload-list {
			> li {
				margin-bottom: 50px;
				margin-top: 0;
			}
		}
	}
	.number-with-append {
		.el-input {
			display: inline-table;
		}
	}
	.btn-container {
		width: 100%;
		text-align: right;
	}
}
</style>
