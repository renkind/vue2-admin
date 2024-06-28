<template>
	<div class="edit-continer">
		<div class="content">
			<ZsTopButton>
				<el-button type="primary" @click="submit">提交</el-button>
				<el-button type="success" @click="save">保存</el-button>
				<el-button @click="cancel">返回</el-button>
			</ZsTopButton>
			<el-form ref="dialogForm" :model="dialogForm" :rules="rules" label-width="100px" style="margin-top: 10px">
				<el-form-item label="通知名称" prop="name">
					<el-input v-model="dialogForm.name" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="通知内容" prop="content">
					<editor-bar v-model="dialogForm.content" @change="getEditor" ref="weditor"></editor-bar>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>
<script>
import EditorBar from "@/components/QuillEditor";
import ZsTopButton from "@/components/Zs_topButton";
import { getNotice, addNotice } from "@/service/meeting";
export default {
	components: {
		ZsTopButton,
		EditorBar
	},
	data() {
		return {
			dialogForm: {},
			rules: {
				name: [{ required: true, message: "请输入通知名称", trigger: "blur" }],
				content: [{ required: true, message: "请输入通知内容", trigger: "blur" }]
			} // 校验规则
		};
	},
	mounted() {
		const judge = this.$route.params.id;
		if (judge) {
			console.log("修改");
			this.getNotice();
		} else {
			console.log("新增");
		}
	},
	methods: {
		async postData(approvalStatus) {
			if (!this.dialogForm.name) {
				this.$message.warning("请完善通知名称");
				return;
			}
			if (!this.dialogForm.content) {
				this.$message.warning("请完善通知内容");
				return;
			}
			const params = {
				id: this.$route.params.id,
				name: this.dialogForm.name,
				content: this.dialogForm.content,
				deptId: JSON.parse(window.localStorage.getItem("user")).deptId,
				approvalStatus
			};
			const res = await addNotice(params);
			if (res.code === 200) {
				// if (approvalStatus === "1") {
				this.$message.success(res.msg);
				this.$router.back();
				// }
				// if (approvalStatus === "0") {
				// 	this.$message.success(res.msg);
				// }
			} else {
				this.$message.error(res.msg);
			}
		},
		submit() {
			console.log(this.dialogForm.content);
			this.postData("1");
		},
		save() {
			console.log(this.dialogForm.content);
			this.postData("0");
		},
		async getNotice() {
			const { id } = this.$route.params;
			const res = await getNotice(id);
			if (res.code === 200) {
				this.dialogForm = res.data;
				// 数据回显调用此方法
				this.editorEcor();
				console.log(this.dialogForm.content);
			} else {
				this.$message.error(res.msg);
			}
		},
		editorEcor() {
			this.$refs.weditor.setText(this.dialogForm.content);
		},
		// 获取富文本内容
		getEditor(value) {
			console.log("富文本内容获取", value);
			this.dialogForm.content = value;
		},
		// 返回
		cancel() {
			this.$router.back();
		}
	}
};
</script>
<style lang="scss" scoped>
.content {
	flex-direction: column;
	align-items: center;
}
</style>
