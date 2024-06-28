<template>
	<div class="edit-continer">
		<ZsTopButton>
			<el-button @click="cancel">返回</el-button>
		</ZsTopButton>
		<div class="content" v-loading="loading">
			<el-form ref="formParams" :model="formParams" label-width="100px" style="margin-bottom: 10px">
				<!-- <el-form-item label="通知名称">
					<span>{{ formParams.name }}</span>
				</el-form-item> -->
				<div class="detailStyle">
					<DetailModal :FormData="detailArr" />
				</div>
				<el-form-item label="通知内容" class="jContent">
					<p v-html="formParams.content" class="conClass"></p>
				</el-form-item>
			</el-form>
		</div>
		<div class="base-info-wrap" v-if="activitiesAll.length > 0">
			<el-row class="base-info-title"> 审批轨迹 </el-row>
			<div class="base-info" v-for="(item, index) in activitiesAll" :key="index">
				<el-timeline>
					<el-timeline-item
						v-for="(activity, index) in item.traces"
						:key="index"
						:icon="activity.icon"
						:type="activity.type"
						:color="activity.color"
						:size="activity.size"
					>
						<el-row v-if="!index">
							<el-col :span="8">提交时间: {{ activity.submitTime }}</el-col>
							<el-col :span="8">提交人: {{ activity.createBy }}</el-col>
							<el-col :span="8">名称: {{ activity.name }}</el-col>
						</el-row>
						<el-card v-else>
							<el-row>
								<el-col :span="8">
									审批状态:
									<el-tag
										class="page-tag"
										:type="
											activity.approvalStatus === '3'
												? 'sucesss'
												: activity.approvalStatus === '4'
												? 'danger'
												: 'warning'
										"
									>
										<dict-tag :options="dict.type.app_approval_status" :value="activity.approvalStatus" />
									</el-tag>
								</el-col>
								<el-col :span="8">审批时间: {{ activity.approvalTime }}</el-col>
								<el-col :span="8">第{{ index }}审批人: {{ activity.approver }}</el-col>
							</el-row>
							<el-row class="approvalCon" v-if="activity.approvalComment"
								>驳回原因: {{ activity.approvalComment }}</el-row
							>
						</el-card>
					</el-timeline-item>
				</el-timeline>
			</div>
		</div>
	</div>
</template>

<script>
import { getNotice } from "@/service/meeting";
import ZsTopButton from "@/components/Zs_topButton";
import { getTraces } from "@/service/content";
import DetailModal from "@/components/DetailModal";
export default {
	components: {
		ZsTopButton,
		DetailModal
	},
	dicts: ["app_approval_status"],
	data() {
		return {
			formParams: {},
			loading: false,
			activitiesAll: [],
			detailArr: []
		};
	},
	mounted() {
		this.getNotice();
	},
	methods: {
		async getNotice() {
			this.loading = true;
			const { id } = this.$route.params;
			const res = await getNotice(id);
			if (res.code === 200) {
				this.formParams = res.data;
				this.detailArr = [{ label: "通知名称", value: this.formParams.name, type: "text" }];
				const params = { id: Number(res.data.id), type: "9", approvalStatus: res.data.approvalStatus };
				const res1 = await getTraces(params);
				if (res1.code === 200) {
					this.activitiesAll = res1.data.allTraces || [];
					for (const i in this.activitiesAll) {
						this.activitiesAll[i].traces.unshift({
							submitTime: this.activitiesAll[i].submitTime,
							createBy: this.activitiesAll[i].submitter,
							name: this.activitiesAll[i].name,
							type: "success"
						});
						for (const j in this.activitiesAll[i].traces) {
							if (this.activitiesAll[i].traces[j].approvalStatus === "3") {
								this.activitiesAll[i].traces[j].type = "success";
							}
						}
					}
				} else {
					this.$message.error(res1.msg);
				}
			} else {
				this.$message.error(res.msg);
			}
			this.loading = false;
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
::v-deep table {
	border-collapse: collapse;
}
::v-deep th {
	border: 1px solid black;
}
::v-deep td {
	border: 1px solid black;
}
.detailStyle {
	margin: 20px 20px;
	padding: 5px 20px;
	line-height: 50px;
	min-height: 50px;
	font-size: 22px;
}
.base-info-wrap {
	padding: 5px 25px;
	.base-info-title {
		font-size: 22px;
		font-weight: bolder;
		padding-bottom: 20px;
	}
	.base-info {
		border-top: 2px solid #999;
		padding: 20px 20px;
		.base-info-applicant {
			height: 50px;
			line-height: 50px;
			font-size: 18px;
			// border-bottom: 1px dashed #999;
		}
		.base-info-content {
			padding: 20px 0;
		}
	}
}
.approvalCon {
	margin-top: 20px;
}
.conClass {
	min-height: 50px;
	height: 200px;
	overflow: auto;
	padding-left: 10px;
}
.jContent {
	margin: 20px 20px;
	padding: 5px 20px;
	line-height: 50px;
	min-height: 50px;
}
</style>
