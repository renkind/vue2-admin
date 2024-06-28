<template>
  <div>
    <div v-for="(item,index) in FormData"
      :key="index" class="form">
      <!-- <span class="con">*</span> -->
      <span class="label">{{item.label}}</span>
        <el-input :type="item.type" :value="item.value" class="input" disabled v-if="item.type ==='text'"></el-input>
        <ZsImg :type="item.type" :src="item.src" class="image" alt="" v-if="item.type ==='image'"></ZsImg>
        <!-- <editor-bar :type="item.type" :value="item.value" v-if="item.type === 'editor'"></editor-bar> -->
      </div>
  </div>
</template>
<script>
// import EditorBar from "@/components/QuillEditor";
export default {
  name: "DetailModal",
  // components: { EditorBar },
  props: {
    title: String,
    FormData: Array
  },
  created() {
    // this.editorEcor();
    console.log(FormData);
  },
methods: {
  // editorEcor() {
	// 		this.$refs.weditor.setText(this.FormData[2].value);
	// 	},
  // // 获取富文本内容
	// 	getEditor(value) {
	// 		console.log("富文本内容获取", value);
	// 		this.FormData[2].value = value;
	// 	}
}
};
</script>
<style lang="scss" scoped>
.form{
  display: flex;
}
.label{
  width: 90px;
  color: #606266;
  word-wrap: break-word;
	font-weight: bolder;
  text-align: right;
}
.input{
  padding: 5px 25px;
  width: 500px;
}
.image{
  width: 150px;
  height: 100%;
  margin-left: 25px;
}
</style>
