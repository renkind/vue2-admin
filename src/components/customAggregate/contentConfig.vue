<template>
	<div>
		<div v-for="(i, index) in templateInfo" :key="index">
			<div class="singleView">
				<i class="el-icon-delete" @click="remove(index)" v-show="!disabled"></i>

				<!--对象格式： { type: "0", eventObj: {}, aggregateObj: {}, linkObj: {}, sort: "", iconId: "", iconUrl: "", angleMarkId: [],angleMarkUrl: [] } -->
				<el-form-item label="" prop="" label-width="150px" v-show="!i.sourceData">
					<div>
						<el-radio-group v-model="i.template_type" @change="changeView">
							<el-radio :label="item.value" v-for="item in type_options" :key="item.value">{{ item.label }}</el-radio>
						</el-radio-group>
					</div>
				</el-form-item>
				<!-- 事项模板控制 -->
				<div v-if="i.template_type === '0'">
					<el-form-item label="" prop="" label-width="150px">
						<el-button type="primary" @click="openEventListModal(index)" size="mini"> 点击选择事项 </el-button>
					</el-form-item>

					<el-form-item label="" style="display: flex" v-if="i.sourceData && i.sourceData.id">
						<div>
							<!-- 事项图片管理 -->
							<el-form-item label="事项信息" label-width="150px">
								<div class="event-content">
									<el-input v-model="i.sourceData.name" class="formItem" placeholder="事项名" disabled></el-input>
									<el-input v-model="i.describe" class="formItem" placeholder="请输入功能描述" clearable></el-input>
									<el-input-number
										class="formItem"
										:min="1"
										:max="9999"
										v-model.number="i.orderNum"
										placeholder="数字越小越靠前"
									></el-input-number>
								</div>
							</el-form-item>
							<!-- 事项图片管理 -->
							<el-form-item label="事项图片" prop="" label-width="150px">
								<el-radio-group v-model="i.selectCoverType" @change="changeView">
									<el-radio :label="item.value" v-for="item in selectOption" :key="item.value">{{
										item.label
									}}</el-radio>
								</el-radio-group>
								<span style="font-size: 12px; color: #999; margin-left: 30px" v-if="i.selectCoverType === 2"
									>请上传42*42尺寸图片</span
								>
							</el-form-item>
							<el-form-item label="" v-show="i.selectCoverType == 1" label-width="150px">
								<el-button type="primary" plain size="mini" @click="openImageListModal(index, 'cover')">
									选择事项图片
								</el-button>
							</el-form-item>
							<el-form-item label="" v-if="i.selectCoverType == 2 && !i.cover" label-width="150px">
								<ZsImageupload
									:isList="true"
									:maxFile="1"
									@updateFileList="(e) => updateFileListEventCallBak(e, i, 'cover')"
									:maxKb="20"
									:showText="true"
								/>
							</el-form-item>
							<el-form-item label="" prop="" label-width="150px" style="margin: 10px 0" v-show="i.cover">
								<ZsImg imgStyle="height: 100px" :src="i.cover"></ZsImg>
								<i class="el-icon-delete delImg" v-show="!disabled" @click="delCover(i)"></i>
							</el-form-item>
							<!-- 角标管理 -->
							<el-form-item label="事项角标" prop="" label-width="150px">
								<el-radio-group v-model="i.selectMarkType" @change="changeView">
									<el-radio :label="item.value" v-for="item in selectOption" :key="item.value">{{
										item.label
									}}</el-radio>
								</el-radio-group>
								<span style="font-size: 12px; color: #999; margin-left: 30px" v-if="i.selectMarkType === 2"
									>请上传14*14尺寸图片</span
								>
							</el-form-item>
							<el-form-item label="" v-show="i.selectMarkType == 1 && i.marks.length < 2" label-width="150px">
								<el-button type="primary" size="mini" plain @click="openImageListModal(index, 'mark')">
									选择角标
								</el-button>
							</el-form-item>
							<el-form-item label="" v-if="i.selectMarkType == 2 && i.marks.length < 1" label-width="150px">
								<ZsImageupload
									:isList="true"
									:maxFile="1"
									@updateFileList="(e) => updateFileListEventCallBak(e, i, 'mark')"
									:maxKb="20"
									:showText="true"
								/>
							</el-form-item>
							<el-form-item label="" prop="" label-width="150px" style="margin: 10px 0" v-show="i.marks.length > 0">
								<div style="display: inline-block" v-for="(c, idx) in i.marks" :key="idx">
									<ZsImg imgStyle="height: 100px" :src="c.pictureUrl"></ZsImg>
									<i class="el-icon-delete delImg" v-show="!disabled" @click="delMark(i, idx)"></i>
								</div>
							</el-form-item>
						</div>
					</el-form-item>
				</div>

				<!-- 聚合页模板控制 -->
				<div v-if="i.template_type === '1'">
					<el-form-item label="" prop="" label-width="150px">
						<el-button type="primary" @click="openJuheyeListModal(index)" size="mini"> 点击选择聚合页 </el-button>
					</el-form-item>

					<el-form-item label="" style="display: flex" v-if="i.sourceData && i.sourceData.id">
						<el-form-item label="聚合页信息" label-width="150px">
							<div class="event-content">
								<el-input v-model="i.sourceData.name" class="formItem" placeholder="事项名" disabled></el-input>
								<el-input v-model="i.describe" class="formItem" placeholder="请输入功能描述" clearable></el-input>
								<el-input-number
									class="formItem"
									:min="1"
									:max="9999"
									v-model.number="i.orderNum"
									placeholder="数字越小越靠前"
								></el-input-number>
							</div>
						</el-form-item>
						<div v-show="theme != 'B'">
							<!-- 聚合页图片管理 -->
							<el-form-item label="聚合页图片" prop="" label-width="150px">
								<el-radio-group v-model="i.selectCoverType" @change="changeView">
									<el-radio :label="item.value" v-for="item in selectOption" :key="item.value">{{
										item.label
									}}</el-radio>
								</el-radio-group>
								<span style="font-size: 12px; color: #999; margin-left: 30px" v-if="i.selectCoverType === 2"
									>请上传42*42尺寸图片</span
								>
							</el-form-item>
							<el-form-item label="" v-show="i.selectCoverType == 1" label-width="150px">
								<el-button type="primary" plain size="mini" @click="openImageListModal(index, 'cover')">
									选择聚合页图片
								</el-button>
							</el-form-item>
							<el-form-item label="" v-if="i.selectCoverType == 2" label-width="150px">
								<ZsImageupload
									:isList="true"
									:maxFile="1"
									@updateFileList="(e) => updateFileListEventCallBak(e, i, 'cover')"
									:maxKb="20"
									:showText="true"
								/>
							</el-form-item>
							<el-form-item label="聚合页图片预览" prop="" label-width="150px" style="margin: 10px 0" v-show="i.cover">
								<ZsImg imgStyle="height: 100px" :src="i.cover"></ZsImg>
								<i class="el-icon-delete delImg" v-show="!disabled" @click="delCover(i)"></i>
							</el-form-item>
							<!-- 角标管理 -->
							<el-form-item label="聚合页角标" prop="" label-width="150px">
								<el-radio-group v-model="i.selectMarkType" @change="changeView">
									<el-radio :label="item.value" v-for="item in selectOption" :key="item.value">{{
										item.label
									}}</el-radio>
								</el-radio-group>
								<span style="font-size: 12px; color: #999; margin-left: 30px" v-if="i.selectMarkType === 2"
									>请上传14*14尺寸图片</span
								>
							</el-form-item>
							<el-form-item label="" v-show="i.selectMarkType == 1 && i.marks.length < 2" label-width="150px">
								<el-button type="primary" size="mini" plain @click="openImageListModal(index, 'mark')">
									选择角标
								</el-button>
							</el-form-item>
							<el-form-item label="" v-if="i.selectMarkType == 2 && i.marks.length < 2" label-width="150px">
								<ZsImageupload
									:isList="true"
									:maxFile="1"
									@updateFileList="(e) => updateFileListEventCallBak(e, i, 'mark')"
									:maxKb="20"
									:showText="true"
								/>
							</el-form-item>
							<el-form-item
								label="角标预览"
								prop=""
								label-width="150px"
								style="margin: 10px 0"
								v-show="i.marks.length > 0"
							>
								<div style="display: inline-block" v-for="(c, idx) in i.marks" :key="idx">
									<ZsImg imgStyle="height: 100px" :src="c.pictureUrl"></ZsImg>
									<i class="el-icon-delete delImg" v-show="!disabled" @click="delMark(i, idx)"></i>
								</div>
							</el-form-item>
						</div>
					</el-form-item>
				</div>
				<!-- 外部链接控制 -->
				<div v-if="i.template_type === '2'">
					<el-form-item label="事项信息" label-width="150px">
						<el-input v-model="i.externalUrl" class="formItem" placeholder="请输入外部链接地址" clearable></el-input>
						<el-input v-model="i.externalName" class="formItem" placeholder="请输入外部链接名称" clearable></el-input>
						<el-input v-model="i.describe" class="formItem" placeholder="请输入功能描述" clearable></el-input>
						<el-input-number
							class="formItem"
							:min="1"
							:max="9999"
							v-model.number="i.orderNum"
							placeholder="数字越小越靠前"
						></el-input-number>
					</el-form-item>
					<div></div>
				</div>
			</div>
		</div>
		<el-form-item label="" v-if="!isAdd">
			<el-button
				type="primary"
				style="display: block; width: 100%; margin-top: 20px"
				plain
				v-if="!disabled"
				@click="addView"
			>
				新增
			</el-button>
		</el-form-item>
		<!-- 角标 -->
		<ImageSelectModal
			:dialogVisible="imageListModal"
			@closeModal="imageListModal = false"
			@updateSelectImg="updateSelectImgCallBak"
		/>
		<!-- 事项弹窗-->
		<EventSelectModal
			:dialogVisible="eventModal"
			@closeModal="eventModal = false"
			@updateSelectEnevt="updateSelectEventCallBak"
		/>
		<!-- 聚合页弹窗 -->
		<AggSelectDialog :dialogVisible="juheyeModal" @closeModal="juheyeModal = false" @updateSelectAgg="updateAgg" />
	</div>
</template>

<script>
import ImageSelectModal from "@/components/ImageSelectModal";
import EventSelectModal from "@/components/EventSelectModal";
import ZsImageupload from "@/components/Zs_form/Zs_imageUpload";
import AggSelectDialog from "@/components/AggregateSelect";

export default {
	components: {
		ImageSelectModal,
		EventSelectModal,
		ZsImageupload,
		AggSelectDialog
	},
	data() {
		return {
			eventList: [],
			aggregateList: [],
			selectOption: [
				{
					value: 1,
					label: "选择"
				},
				{
					value: 2,
					label: "上传"
				}
			],
			type_options: [
				{
					value: "0",
					label: "事项",
					name: "matter"
				},
				{
					value: "1",
					label: "聚合页",
					name: "polymerizationPage"
				},
				{
					value: "2",
					label: "外部链接",
					name: "externalLink"
				}
			],
			activeLine: null, // 当前选中行
			action: "", // 当前操作类型
			imageListModal: false, // 图片选择弹窗
			eventModal: false, // 事项选择弹窗
			juheyeModal: false // 聚合页弹窗
		};
	},
	props: {
		/*
		{
			template_type: "0", // 模板类型 事项-聚合页-外链
			selectCoverType: 1, // 选择图片方式
			selectMarkType: 1, // 选择图片方式
			sort: null, // 排序
			describe: "", // 描述
			cover: "", // 图片
			coverId: "", // 资源图片id
			externalUrl: "", // 外链地址
			marks: [], // 角标
			type: "0" // 选择方式
		}
	*/
		templateInfo: {
			type: Array,
			required: true
		},
		theme: {
			type: String,
			required: true
		},
		disabled: {
			type: Boolean,
			required: false
		},
		isAdd: {
			type: Boolean,
			required: false
		},
		maxNum: {
			type: Number,
			required: false
		}
	},
	mounted() {
		console.log(this.templateInfo, "事物信息");
	},
	methods: {
		delMark(i, index) {
			i.marks.splice(index, 1);
		},
		delCover(i) {
			i.cover = "";
			i.coverId = "";
		},
		changeView() {
			// 关闭所有弹框
			this.imageListModal = false;
			this.eventModal = false;
			this.juheyeModal = false;
		},
		remove(idx) {
			this.$msgbox.confirm("确认要删除这条数据吗?").then(async () => {
				this.templateInfo.splice(idx, 1);
			});
		},
		addView(type) {
			if (this.maxNum && this.templateInfo.length >= this.maxNum) {
				this.$message.error("超出最大限制!");
				return false;
			}
			this.templateInfo.push({
				template_type: "0",
				template_type_name: "matter",
				selectCoverType: 1,
				selectMarkType: 1,
				template_event: {},
				template_aggregate: {},
				template_link: {},
				sort: "",
				describe: "",
				orderNum: 1,
				cover: "",
				coverId: "",
				marks: []
			});
		},

		/* 角标 */
		// 打开角标选择弹窗
		openImageListModal(i, type) {
			this.imageListModal = true;
			this.activeLine = i;
			this.action = type;
		},
		// 角标弹窗确定的回调
		updateSelectImgCallBak(row) {
			if (this.action === "cover") {
				this.templateInfo[this.activeLine].cover = row[0].pictureUrl;
				this.templateInfo[this.activeLine].coverId = row[0].id;
			} else {
				this.templateInfo[this.activeLine].marks = row;
			}
		},
		// 选择素材回调
		updateFileListCallBak(row) {
			console.log(row);
		},

		/* 事项 */
		// 打开事项选择弹窗
		openEventListModal(i) {
			this.eventModal = true;
			this.activeLine = i;
		},
		// 事项弹窗选择回调
		updateSelectEventCallBak(row) {
			this.templateInfo[this.activeLine] = Object.assign(this.templateInfo[this.activeLine], row);
			this.templateInfo[this.activeLine].sourceData = row;
			console.log(this.templateInfo, "事物信息-回调");
		},
		// 上传图片回调
		updateFileListEventCallBak(row, line, type) {
			console.log(row);
			if (type === "cover") {
				line.coverId = row[0].rid;
				line.cover = row[0].rurl;
			} else {
				line.marks.push({
					...row[0],
					id: row[0].rid,
					pictureUrl: row[0].rurl
				});
			}
		},

		/* 聚合页 */
		// 打开聚合页modal
		openJuheyeListModal(i) {
			this.juheyeModal = true;
			this.activeLine = i;
		},
		// 	选中的聚合页回调
		updateAgg(row) {
			this.templateInfo[this.activeLine] = Object.assign(this.templateInfo[this.activeLine], row[0]);
			this.templateInfo[this.activeLine].sourceData = row[0];
			console.log(this.templateInfo);
		},
		// 聚合页图片上传回调
		updateFileListAggCallBak(row) {
			console.log(row);
		}
	}
};
</script>

<style lang="scss" scoped>
.singleView {
	width: 100%;
	background-color: #eee;
	border-radius: 8px;
	padding: 10px;
	margin-bottom: 12px;
	//margin-left: 150px;
	.describe {
		margin-top: 20px;
	}
	.el-icon-delete {
		color: #ff2222;
		margin-top: 10px;
		margin-left: 10px;
		font-size: 20px;
		cursor: pointer;
		float: left;
	}
	.delImg {
		margin-top: 0;
		margin-left: 0;
	}
	.el-image {
		margin-right: 10px;
	}
}
.el-form-item__content >>> .el-select {
	display: block !important;
}
.formItem {
	width: 100%;
	margin: 5px 0;
}
</style>
