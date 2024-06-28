<template>
	<el-radio-group v-model="value" @change="onChange">
		<el-radio v-for="city in list" :label="city[options.valueKey]" :key="city.dictValue">{{
			city[options.labelKey]
		}}</el-radio>
	</el-radio-group>
</template>

<script>
export default {
	name: "Zs_radio",
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
			value: ""
		};
	},
	watch: {
		// eslint-disable-next-line
		value: function (value) {
			this.model[this.dataname] = value;
		}
	},
	created() {
		/* 没有初始值时给定默认值为空数组 */
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
	methods: {
		// 出发回调
		onChange() {
			this.options.onchange && this.options.onchange(this.value);
		}
	}
};
</script>

<style lang="scss" scoped></style>
