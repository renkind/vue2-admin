<template>
	<div class="content">
		<div class="title">欢迎使用{{ appTitle }}！</div>
		<div class="subTitle">WELCOME</div>
		<div class="line"></div>
	</div>
</template>
<script>
import appConfig from "@/config/app/index.js";
export default {
	name: "Home",
	data() {
		return {
			appTitle: appConfig.appTitle
		};
	},
	created() {},
	mounted() {},
	activated() {},
	methods: {}
};
</script>
<style lang="scss" scoped>
.content {
	height: 1000px;
	background-color: rgb(240, 242, 247, 1);
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	.title {
		height: 40px;
		font-size: 28px;
		text-align: left;
		font-weight: 500;
		color: rgba(22, 132, 252, 1);
	}

	.subTitle {
		margin-top: 28px;
		height: 145px;
		font-size: 100px;
		text-align: left;
		font-weight: 700;
		color: rgba(22, 132, 252, 1);
	}
	.line {
		height: 3px;
		width: 588px;
		background-color: rgba(22, 132, 252, 1);
	}
}
</style>
