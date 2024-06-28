<template>
	<fragment>
		<el-input
			v-if="item.type === 'text'"
			:placeholder="item.option.placeholder"
			v-model="model[item.name]"
			:style="`width:${item.option.width}px`"
			size="small"
		></el-input>
		<template v-else-if="item.type === 'zs-select'">
			<Zsselect :options="item.option" :model="model" :dataname="item.name" />
		</template>
		<el-date-picker
			v-else-if="item.type === 'datepicker'"
			v-model="model[item.name]"
			type="daterange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			size="small"
			value-format="yyyy-MM-dd"
		>
		</el-date-picker>
		<el-date-picker
			v-else-if="item.type === 'datetimerange'"
			v-model="model[item.name]"
			type="datetimerange"
			range-separator="至"
			start-placeholder="开始日期"
			end-placeholder="结束日期"
			size="small"
			value-format="yyyy-MM-dd HH:mm:ss"
		>
		</el-date-picker>
		<template v-else-if="item.type === 'zs-checkbox'">
			<Zscheckbox :options="item.option" :model="model" :dataname="item.name" />
		</template>
		<template v-else-if="item.type === 'zs-radio'">
			<Zsradio :options="item.option" :model="model" :dataname="item.name" />
		</template>
		<template v-else-if="item.type === 'zs-switch'">
			<Zsswitch :options="item.option" :model="model" :dataname="item.name" />
		</template>
		<template v-else-if="item.type === 'zs-imageupload'">
			<ZsimageUpload
				:action="item.option.action"
				:isList="item.option.isList"
				:accept="item.option.accept"
				@getRef="getRef"
				@updateFileList="(filelist) => updateValue(filelist, item.name)"
				:options="item.option"
			/>
		</template>
		<template v-else-if="item.type === 'zs-cascader'">
			<Zscascader :model="model" :options="item.option" :dataname="item.name" @getRef="getRef" />
		</template>
		<template v-else-if="item.type === 'treeselect'">
			<treeselect
				v-model="model[item.name]"
				:options="item.option.deptOptions"
				:show-count="true"
				:placeholder="item.option.placeholder"
				style="width: 240px; height: 32px; line-height: 32px; font-size: 13px"
			/>
		</template>
		<template v-else>
			<div style="color: red">未找到相关控件</div>
		</template>
	</fragment>
</template>

<script>
import { Input } from "element-ui";
import Treeselect from "@riophae/vue-treeselect";
import Zsselect from "./Zs_select.vue";
import ZsimageUpload from "./Zs_imageUpload.vue";
import Zscheckbox from "./Zs_checkbox.vue";
import Zsradio from "./Zs_radio.vue";
import Zsswitch from "./Zs_switch.vue";
import Zscascader from "./Zs_cascader";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
export default {
	name: "Zs_components",
	components: {
		Input,
		Zsselect,
		ZsimageUpload,
		Zscheckbox,
		Zsradio,
		Zsswitch,
		Treeselect,
		Zscascader
	},
	props: {
		item: {
			default: {},
			type: Object,
			required: true
		},
		model: {
			default: {},
			type: Object,
			required: true
		}
	},
	methods: {
		// 获取组件的ref
		getRef({ type, domRef }) {
			this.$emit("cretarRef", { type, domRef });
		},
		// 自定义控件需要返回的值
		updateValue(value, name) {
			this.model[name] = value;
		}
	}
};
</script>
<style lang="scss" scoped></style>
