<template>
	<div class="top-continer">
		<slot></slot>
	</div>
</template>
<script>
export default {};
</script>

<style lang="scss" scoped>
.top-continer {
	// border: 1px solid #d8dce5;
	width: 100%;
	height: 50px;
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	align-items: center;
	padding: 5px;
	border-radius: 2px;
}
</style>
