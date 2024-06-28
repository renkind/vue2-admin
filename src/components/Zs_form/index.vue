<template>
	<el-row :gutter="24">
		<el-col :span="20">
			<el-form
				:inline="inline"
				:model="formModal"
				:class="inline ? 'rowClass' : 'columnClass'"
				ref="zsform"
				:rules="rules"
				:label-width="`${labelWidth}px`"
			>
				<!-- <el-row>
					<el-col v-for="(row, index) in items" :key="index" :span="6">
						<el-form-item :label="row.label" :prop="row.name">
						todo slot form表单的model无法拿到插糟的值
							<template v-if="row.type === 'slot'">
								<slot :name="row.name" :scope="formModal"></slot>
							</template>
							<Zscomponents v-else :item="row" :model="formModal" @cretarRef="submitRefs" />
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-form-item :label="row.label" :prop="row.name" v-for="(row, index) in items" :key="index">
					<!-- todo slot form表单的model无法拿到插糟的值 -->
					<template v-if="row.type === 'slot'">
						<slot :name="row.name" :scope="formModal"></slot>
					</template>
					<Zscomponents v-else :item="row" :model="formModal" @cretarRef="submitRefs" />
				</el-form-item>
			</el-form>
		</el-col>
		<el-col :span="4" v-if="inline">
			<div style="float: right">
				<el-button type="primary" size="small" icon="el-icon-search" @click="search">搜索</el-button>
				<el-button size="small" icon="el-icon-refresh" @click="resetForm">重置</el-button>
			</div>
		</el-col>
	</el-row>
</template>

<script>
import Zscomponents from "./component";
export default {
	name: "Zs_form",
	components: {
		Zscomponents
	},
	props: {
		items: {
			default: [],
			type: Array,
			required: true
		},
		inline: {
			default: false,
			type: Boolean,
			required: false
		},
		initData: {
			required: false
		},
		labelWidth: {
			required: false,
			default: 100
		},
		isValid: {
			required: false,
			default: false,
			type: Boolean
		},
		columnNum: {
			required: false,
			default: 4,
			type: Number
		}
	},
	data() {
		return {
			formModal: {},
			rules: {},
			domRefs: {} // form表单里面具体某个空间的ref
		};
	},
	created() {
		if (this.initData) {
			this.formModal = JSON.parse(JSON.stringify(this.initData));
		}
		this.createdRules(); // 给每一个空间增加校验规则
	},
	mounted() {
		this.createdRef(); // 抛出ref
	},
	methods: {
		// 处理form表单里面 具体某个控件的ref
		submitRefs({ type, domRef }) {
			this.domRefs[type] = domRef;
		},
		// 获取form表单里面空间的ref集合
		getFormControlsRefs() {
			return this.domRefs;
		},
		// 获取formData
		getFormData() {
			return this.formModal;
		},
		// 给控件增加校验
		createdRules() {
			this.items.forEach((row) => {
				this.rules[row.name] = row.rules;
			});
		},
		// 抛出ref
		createdRef() {
			this.$emit("createRef", this.$refs["zsform"]);
		},
		// 自定义特殊处理一些值
		updateSubmitData() {
			for (let i = 0; i < this.items.length; i += 1) {
				const { option, type, name } = this.items[i];
				if (option && option.special) {
					switch (type) {
						case "zs-cascader":
							this.getCascaderLastValue(this.domRefs[type], name);
							break;
						default:
							return;
					}
				}
			}
		},
		// cascader组件只获取最后一个节点的值
		getCascaderLastValue(ref, name) {
			const submitValue = [];
			const data = ref.getCheckedNodes();
			console.log("dasdsadas", data);
			data.forEach((row) => {
				if (row.data.type === 2) {
					submitValue.push(row.data.id);
				}
			});
			this.formModal[name] = submitValue;
		},
		// 提交
		async search() {
			await this.updateSubmitData();
			if (this.isValid) {
				this.$refs["zsform"].validate((valid) => {
					if (valid) {
						this.$emit("formSubmit", this.formModal);
					}
				});
			} else {
				this.$emit("formSubmit", this.formModal);
			}
		},
		// 表单重置
		resetForm() {
			// this.$refs["zsform"].resetFields();
			this.formModal = JSON.parse(JSON.stringify(this.initData || {}));
			// 清除cascader复选框的值
			this.domRefs["zs-cascader"] && this.domRefs["zs-cascader"].handleClear();
			this.$emit("formReset", this.formModal);
			this.search();
		},

		// 计算表单一行展示几列
		checkSpan() {
			return Math.ceil(24 / this.columnNum);
		}
	}
};
</script>

<style lang="scss" scoped>
/*列展示样式 */
.columnClass {
	width: 800px;
}
</style>
