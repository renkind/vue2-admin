<template>
	<el-checkbox-group v-model="model[dataname]">
		<el-checkbox v-for="city in list" :label="city[options.valueKey]" :key="city.dictValue">{{
			city[options.labelKey]
		}}</el-checkbox>
	</el-checkbox-group>
</template>

<script>
export default {
	name: "Zs_checkbox",
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
		if (!this.model[this.dataname]) {
			this.$set(this.model, this.dataname, []);
		}
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
