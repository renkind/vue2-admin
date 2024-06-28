<template>
	<el-select
		v-model="model[dataname]"
		:placeholder="options.placeholder"
		clearable
		filterable
		size="small"
		style="width: 240px"
	>
		<el-option
			v-for="dict in list"
			:key="dict[options.valueKey]"
			:label="dict[options.labelKey]"
			:value="dict[options.valueKey]"
		/>
	</el-select>
</template>

<script>
export default {
	name: "Zs_select",
	props: {
		model: {
			required: true
		},
		dataname: {
			required: true,
			type: String
		},
		options: {
			required: true
		}
	},
	data() {
		return {
			list: []
		};
	},
	created() {
		const { asyncData, request, data } = this.options;
		if (asyncData) {
			request()
				.then((res) => {
					this.list = res.data;
				})
				.catch((err) => {
					this.$message.error(err);
				});
		} else {
			this.list = data;
		}
	},
	methods: {}
};
</script>

<style lang="scss" scoped></style>
