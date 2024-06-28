<template>
	<div class="content-box">
		<span class="default-font" :style="styles">{{ name }}</span>
	</div>
</template>
<script>
export default {
	name: "Zs_PageTitle",
	props: {
		name: {
			default: "未配置名称",
			type: String
		},
		styles: {
			default: "",
			type: String
		}
	}
};
</script>
<style lang="scss" scoped>
.content-box {
	line-height: 50px;
	width: auto;
	// margin-left: 50px;
	// margin-top: 30px;
	display: inline-block;
	line-height: 50px;
}
.default-font {
	// font-size: 20px;
	// color: #409eff;
	font-weight: bolder;
}
</style>
