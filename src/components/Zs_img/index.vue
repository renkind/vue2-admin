<template>
	<img
		:src="checkURL(src) ? src : `${imgPath}${src}`"
		:width="width"
		:height="height"
		:preview-src-list="previewSrcList"
		:style="imgStyle"
	/>
</template>
<script>
import apis from "@/config/api";
export default {
	name: "Zs_Img",
	props: {
		src: {
			default: "",
			type: String
		},
		previewSrcList: {
			default: () => [],
			type: Array,
			required: false
		},
		imgStyle: {
			default: "",
			type: String,
			required: false
		},
		width: {
			default: "",
			type: String,
			required: false
		},
		height: {
			default: "",
			type: String,
			required: false
		}
	},
	data() {
		return {
			imgPath: apis.common.imgUrl
		};
	},
	methods: {
		checkURL(URL) {
			const str = URL;
			if (str.indexOf("http://") !== -1) {
				return true;
			} else {
				return false;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
</style>
