<template>
	<div>
		<svg-icon :iconClass="icon" v-if="icon"></svg-icon>
		<span slot="title" v-if="title">{{ title }}</span>
	</div>
</template>

<script>
// import Vue from "vue";
export default {
	name: "MenuItem",
	// functional: true,
	props: {
		icon: {
			type: String,
			default: ""
		},
		title: {
			type: String,
			default: ""
		}
	}
};
</script>
