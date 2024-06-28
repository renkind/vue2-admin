<template>
	<el-switch
		v-model="model[dataname]"
		v-if="list.length > 0"
		:active-color="activeColor"
		:active-text="list[1].label"
		:active-value="list[1].value"
		:inactive-color="defultColor"
		:inactive-text="list[0].label"
		:inactive-value="list[0].value"
	>
	</el-switch>
</template>

<script>
export default {
	name: "Zs_switch",
	props: {
		/* 表单对象 */
		model: {
			required: true
		},
		/* 表单item */
		dataname: {
			required: true,
			type: String
		},
		/* 表单配置 */
		options: {
			required: true
		}
	},
	data() {
		return {
			list: [],
			activeColor: "",
			defultColor: ""
		};
	},
	created() {
		const { data, activeColor, defultColor } = this.options;
		this.list = data;
		this.activeColor = activeColor || "#1890ff";
		this.defultColor = defultColor || "#ddd";
	},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
