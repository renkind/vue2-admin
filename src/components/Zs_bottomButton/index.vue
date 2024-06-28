<template>
	<div class="bottom-continer">
		<slot></slot>
	</div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.bottom-continer {
	// border: 1px solid #d8dce5;
	width: 100%;
	height: 50px;
	margin: 30px 0;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	padding: 5px;
	border-radius: 2px;
}
</style>
