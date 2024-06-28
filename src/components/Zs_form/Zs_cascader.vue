<template>
	<el-cascader
		ref="el-cascader"
		v-model="data"
		:options="dataOptions"
		size="small"
		collapse-tags
		checkStrictly
		:props="options.props"
		:show-all-levels="true"
		filterable
		@change="getId"
	>
	</el-cascader>
</template>

<script>
// eslint-disable-next-line
/* eslint-disable */
export default {
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
			dataOptions: {
				checkStrictly: true,
				expandTrigger: "hover",
				value: "id",
				label: "name"
			},
			ref: null,
			data: []
		};
	},
	created() {
		const { asyncData, request, data } = this.options;
		if (asyncData) {
			request()
				.then((res) => {
					console.log("res.data", res.data);
					this.dataOptions = res.data;
				})
				.catch((err) => {
					this.$message.error(err);
				});
		} else {
			this.dataOptions = data;
		}
	},
	mounted() {
		this.getRefs();
	},
	methods: {
		getId(val) {
			console.log(val, "0," + String(val));
			localStorage.setItem("postClassIfyId", "0," + String(val));
		},
		// 抛出upload组件ref
		getRefs() {
			this.$emit("getRef", { type: "zs-cascader", domRef: this.$refs["el-cascader"] });
		}
	}
};
</script>

<style lang="scss" scoped></style>
