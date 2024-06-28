// 会议过程管理
<template>
	<div class="app-container process">
		<!-- 内容板块 -->
		<div class="content">
			<p class="title">会议信息</p>
			<div class="meetMessage">
				<el-descriptions title="">
					<el-descriptions-item label="会议名称">{{ listData.name }}</el-descriptions-item>
				</el-descriptions>

				<el-descriptions title="">
					<el-descriptions-item label="会议类型">{{ listData.meetTypeName }}</el-descriptions-item>
					<el-descriptions-item label="会议日期">{{ listData.meetingDate }}</el-descriptions-item>
					<el-descriptions-item label="会议时间">{{
						listData.startTime + "-" + listData.endTime
					}}</el-descriptions-item>
					<el-descriptions-item label="会议主持">{{ listData.speakerName }}</el-descriptions-item>
					<el-descriptions-item label="会议地点">{{ listData.address }}</el-descriptions-item>
				</el-descriptions>

				<el-descriptions title="">
					<el-descriptions-item label="会议简介">{{ listData.briefIntroduction }}</el-descriptions-item>
				</el-descriptions>
			</div>

			<div class="resident">
				<el-card class="box-card">
					<p class="residentPerson">常驻参会人员</p>
					<ul>
						<li>
							<p>常驻出席领导:</p>
							<p style="text-indent: 1em; margin: 4px 0; line-height: 20px">{{ joinPersonName }}</p>
						</li>
						<li v-if="askForLeave.join_leaveList">
							<p>请假:</p>
							<p v-for="item in askForLeave.join_leaveList" :key="item.id" style="text-indent: 1em; margin: 4px 0">
								{{ item.person }}({{ item.reason }})
							</p>
						</li>
						<li>
							<p>常驻列席领导:</p>
							<p style="text-indent: 1em; margin: 4px 0; line-height: 20px">{{ attendPersonName }}</p>
						</li>
						<li v-if="askForLeave.attend_leaveList">
							<p>请假:</p>
							<p v-for="item in askForLeave.attend_leaveList" :key="item.id" style="text-indent: 1em; margin: 4px 0">
								{{ item.person }}({{ item.reason }})
							</p>
						</li>
						<!-- <li>
							<p class="residentPerson">会议请假名单</p>
							<el-table border :data="formParams.leaveList">
								<el-table-column align="center" type="index" label="序号" width="190"></el-table-column>
								<el-table-column align="center" prop="person" label="请假人员"></el-table-column>
								<el-table-column align="center" prop="reason" label="请假事由"> </el-table-column>
							</el-table>
						</li> -->
					</ul>
				</el-card>
			</div>

			<!-- 议题内容板块 -->
			<div class="items">
				<el-card class="summary" v-if="summaryReouceList.length != 0">
					<div class="item">
						<ul>
							<li style="font-weight: 600">
								<p>摘编材料名称:</p>
								<p style="text-indent: 1em" v-for="item in summaryReouceList" :key="item.id">{{ item.name }}</p>
							</li>
						</ul>
					</div>
				</el-card>
				<el-card class="box-card">
					<div class="item" v-for="(item, index) in detailData.meetingTopicList" :key="index">
						<div class="item_Top">
							<div class="meetStatus">
								<p>议题{{ index + 1 }}</p>
							</div>
						</div>
						<ul>
							<li>
								<p>议题名称:</p>
								<p style="text-indent: 1em">{{ item.topicContent }}</p>
							</li>
							<li>
								<p>汇报人:</p>
								<p style="text-indent: 1em">
									<span v-for="i in item.mcList" style="display: inline-bolck; margin-right: 10px" :key="i.userId">{{
										i.dept.deptName + i.office + " " + i.nickName + (i.remark ? `(${i.remark})` : "")
									}}</span>
								</p>
							</li>
							<!-- <li>
								<p>参会领导:</p>
								<p v-for="i in item.meetingPersonJoinList" :key="i.id" style="text-indent: 1em">
									{{ (i.personDept ? i.personDept : "") + (i.office ? i.office : "") + " " + i.personName }}
								</p>
							</li> -->
							<li>
								<p>列席人员:</p>
								<p
									v-for="(i, index) in item.meetingPersonAttendList"
									:key="index"
									style="text-indent: 1em; margin: 4px 0"
								>
									{{ i.personDept }}{{ i.office }} {{ i.personName + (i.remark ? `(${i.remark})` : "") }}
								</p>
							</li>
							<li>
								<p>请假:</p>
								<p
									v-for="(item, index) in item.meetingPersonAttendListLeave"
									:key="index"
									style="text-indent: 1em; margin: 4px 0"
								>
									{{ item.personDept }}{{ item.office }} {{ item.personName }}({{ item.leaveNote }})
								</p>
							</li>
							<li style="display: block">
								<p>会议材料:</p>
								<p v-for="i in item.meetingResourceList" :key="i.id">
									{{ i.name }}
									<span v-if="i.classification && i.classification === '0'" style="display: inline-block; margin: 0 6px"
										>密级：机密</span
									>
									<span
										v-else-if="i.classification && i.classification === '1'"
										style="display: inline-block; margin: 0 6px"
										>密级：秘密</span
									>
									<span
										v-else-if="i.classification && i.classification === '2'"
										style="display: inline-block; margin: 0 6px"
										>密级：内部</span
									>
									<span v-else style="display: inline-block; margin: 0 6px">XX</span>
									<span v-if="i.term">保密时间：{{ i.term }}</span>
								</p>
							</li>
						</ul>
						<!-- 循环子议题 拿到议题名称 -->
						<div v-for="ele in item.childTopicList" :key="ele.id">
							<div>
								<!-- v-for="i in item.meetingResourceList" :key="i.id" -->
								<!-- <div v-for="(j, index) in meetingResourceList.childTopicMcList" :key="index"> -->
								<ul>
									<li>
										<p>子议题名称:</p>
										<p>{{ ele.topicContent }}</p>
									</li>
									<li>
										<p>关联汇报人:</p>
										<!-- meetingResourceList  -->
										<p style="margin: 0 10px">
											{{ getResourceName(ele.meetingResourceList, "nickName") }}
										</p>
									</li>
									<li>
										<p>关联汇报材料:</p>
										<p style="margin: 0 10px">{{ getResourceName(ele.meetingResourceList, "material") }}</p>
									</li>
									<li>
										<p>关联列席领导:</p>
										<!-- meetingResourceList  -->
										<p style="margin: 0 10px" v-for="(x, index) in ele.childTopicAttendList" :key="index">
											{{ x.nickName }} {{ x.dept.deptName }}{{ x.office }}
										</p>
									</li>
									<li>
										<p>关联请假:</p>
										<p style="margin: 0 10px" v-for="(x, index) in ele.childTopicLeaveList" :key="index">
											{{ x.nickName }} {{ x.dept.deptName }}{{ x.office }}
										</p>
									</li>
								</ul>
							</div>
							<!-- </div> -->
						</div>
					</div>
				</el-card>
			</div>

			<!-- 增加临时议题弹出框 -->
			<el-dialog title="收货地址" :visible.sync="dialogFormVisible">
				<el-form :model="form">
					<el-form-item label="议题顺序" :label-width="formLabelWidth">
						<el-select v-model="form.region" placeholder="请选择活动区域">
							<!-- <el-option label="区域一" value="shanghai"></el-option>
							<el-option label="区域二" value="beijing"></el-option> -->
						</el-select>
					</el-form-item>
					<el-form-item label="议题名称" :label-width="formLabelWidth">
						<el-input autocomplete="off" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="汇报人" :label-width="formLabelWidth">
						<el-select multiple placeholder="请选择">
							<!-- <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option> -->
						</el-select>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
				</div>
			</el-dialog>
		</div>
	</div>
</template>
<script>
import { processList, changeStatus, changeMeetStatus } from "@/service/process";
import { detailMeeting } from "@/service/meeting";
import { listUser } from "@/service/user";
export default {
	name: "noticeManage",
	dicts: ["frame_flag", "app_approval_status", "app_city"],
	data() {
		return {
			listData: [],
			detailData: {},
			formParams: {
				name: "",
				type: "",
				compere: "",
				date: "",
				time: "",
				place: "",
				content: "",
				psw: "",
				attend: [],
				present: [],
				leave: [],
				leaveList: []
			},
			total: 0,
			listLoading: false,
			current: "",
			currentTopic: null, // 添加一个变量用于存储当前议题信息
			dialogFormVisible: false,
			form: {},
			formLabelWidth: "120px",
			memberOptions: [],
			joinPersonName: "",
			attendPersonName: "",
			askForLeave: {},
			leavePersonnelList: [],
			meetingPersonAttendList: [],
			memberList: [],
			childTopicList: [],
			childTopicMcList: [],
			resourceName: "",
			summaryList: [],
			summaryReouceList: []
		};
	},
	created() {
		this.getList();
		this.listMember();
		if (this.$route.params.id) {
			this.getDetail();
		}
	},
	mounted() {},
	methods: {
		// 获取列表
		async getList() {
			this.listLoading = true;
			const res = await processList(this.$route.params.id);
			if (res.code === 200) {
				this.listData = res.data;
				// this.listData.createTime = res.data.createTime.slice(0, 10);
				console.log(this.listData, "speakerspeakerspeakerspeakerspeaker");
				// 记录当前进行中的议题
				this.currentTopic = this.listData.meetingTopicList.find((item) => item.state === "1");

				// 会议状态判断
				if (this.listData.meetingState === "0") {
					this.listData.meetingState = "未开始";
				} else if (this.listData.meetingState === "1") {
					this.listData.meetingState = "进行中";
				} else if (this.listData.meetingState === "2") {
					this.listData.meetingState = "已结束";
				}

				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},

		async listMember() {
			const params = {
				pageNo: 1,
				pageSize: 500,
				userType: "01"
			};
			const res = await listUser(params);
			if (res.code === 200) {
				this.memberOptions = res.data.list;
			} else {
				this.$message.error(res.msg);
			}
		},

		// 处理子仪题内容数据
		getResourceName(data, type) {
			// console.log(data, "000000000000000000000000000");
			let name = "";
			const nameList = [];
			data.forEach((e, i) => {
				console.log(e, "meetingResourceList");
				if (type === "material") {
					// 抽取材料名称
					if (e.name) name += `${e.name}，`;
				} else {
					// 抽取 汇报人
					e.childTopicMcList.forEach((item) => {
						nameList.push(`${item.nickName} ${item.dept.deptName}${item.office}`);
						name = [...new Set(nameList)].join();
					});
				}
			});
			return name;
		},

		async getDetail() {
			const { id } = this.$route.params;
			const res = await detailMeeting(id);
			if (res.code === 200) {
				const params = res.data;
				this.detailData = res.data;
				// console.log(params.password, "passwordpasswordpassword");

				this.formParams = {
					name: params.name,
					type: params.meetType,
					compere: params.speaker * 1,
					date: params.meetingDate,
					time: [params.startTime, params.endTime],
					place: params.address,
					content: params.briefIntroduction,
					psw: params.password,
					present: params.joinPerson ? params.joinPerson.split(",") : [], // 参会
					attend: params.attendPerson ? params.attendPerson.split(",") : [], // 列席
					leaveList: params.leavePerson ? JSON.parse(params.leavePerson) : [], // 请假
					meetingPersonList: params.meetingPersonList || []
				};
				this.askForLeave = this.formParams.leaveList;
				// console.log(this.askForLeave, "askForLeave");
				// console.log(params.meetingTopicList, "params.meetingTopicList");
				// params.meetingTopicList.forEach((ele, index) => {
				// 	// console.log(ele, "params.meetingTopicList");
				// 	this.childTopicList = ele.childTopicList;
				// 	if (ele.childTopicList) {
				// 		ele.childTopicList.forEach((e, i) => {
				// 			e.meetingResourceList.forEach((x, y) => {
				// 				this.resourceName = x.name;
				// 				this.childTopicMcList = x.childTopicMcList;
				// 				// console.log(x, "this.childMeetingResourceList");
				// 			});
				// 		});
				// 	}
				// });

				// 议题列席 请假去重
				// params.meetingTopicList.forEach((ele, index) => {
				// 	ele.personAttendList = [];
				// 	ele.leavePersonnelList = [];
				// 	ele.meetingPersonAttendList.forEach((e, i) => {
				// 		// console.log(e, e.leave, "e");
				// 		if (e.leave === "1") {
				// 			ele.leavePersonnelList.push(`${e.personDept}${e.office}${e.personName}(${e.leaveNote})`);
				// 			// console.log(this.leavePersonnelList, "leavePersonnelleavePersonnel");
				// 		} else {
				// 			ele.personAttendList.push(`${e.personDept}${e.office}${e.personName}`);
				// 		}
				// 	});
				// });

				const summaryList = [];
				this.detailData.meetingTopicList.forEach((ele, index) => {
					// 摘出 extType为“1”的  重要论述摘编列为单独数组
					console.log(ele.extType, "extTypeextTypeextType");
					if (ele.extType === "1") {
						summaryList.push(ele);
					}
					this.summaryList = summaryList;
					console.log(summaryList, "summaryList");

					this.summaryList.forEach((e, ind) => {
						// console.log(e, "summaryListsummaryListsummaryList");
						this.summaryReouceList = e.meetingResourceList;
					});

					ele.meetingResourceList.forEach((e, i) => {
						// console.log(e, "formatName");
						if (e.classification === "0") {
							e.classification = "机密";
						} else if (e.classification === "1") {
							e.classification = "秘密";
						} else if (e.classification === "2") {
							e.classification = "内部";
						}
					});
				});
				// 过滤掉 extType为“1”的  重要论述摘编  留下普通议题
				this.detailData.meetingTopicList = this.detailData.meetingTopicList.filter((item) => item.extType === "0");
				this.joinPersonName = "";
				this.attendPersonName = "";
				// 常驻出席领导
				this.formParams.present.forEach((item) => {
					this.memberOptions.forEach((ele, index) => {
						// console.log(this.memberOptions, "ele");
						if (ele.userId === Number(item)) {
							this.joinPersonName += `${ele.dept.deptName}${ele.office} ${ele.nickName}${
								ele.remark ? `(${ele.remark})` : ""
							} ，`;
						}
					});
				});
				console.log(this.joinPersonName);

				// 常驻列席领导
				this.formParams.attend.forEach((item) => {
					// console.log(item);
					this.memberOptions.forEach((ele, index) => {
						// console.log(this.memberOptions, "ele");
						if (ele.userId === Number(item)) {
							this.attendPersonName += `${ele.dept.deptName}${ele.office} ${ele.nickName}${
								ele.remark ? `(${ele.remark})` : ""
							}，`;
						}
					});
				});
				// this.memberOptions.forEach((ele, index) => {
				// 	this.formParams.attend.forEach((item) => {
				// 		// console.log(item);
				// 		if (ele.userId === Number(item)) {
				// 			this.attendPersonName += `${ele.dept.deptName}${ele.office} ${ele.nickName}，`;
				// 		}
				// 	});
				// });
				// console.log(this.joinPersonName, "joinPersonName");
				this.topicListData = params.meetingTopicList.map((x) => {
					const present = [];
					const attend = [];
					let mcArr = x.mc.split(",");
					for (const i of x.meetingPersonList) {
						if (i.personType === "1") {
							present.push(i.userId * 1);
						} else if (i.personType === "2") {
							attend.push(i.userId * 1);
						}
					}
					mcArr = mcArr.map((j) => j * 1);
					return {
						topicContent: x.topicContent,
						meetingResourceList: x.meetingResourceList,
						present,
						attend,
						mcArr,
						meetingPersonList: []
					};
				});
				// console.log(this.topicListData, "topicListDatatopicListDatatopicListDatatopicListData");
			} else {
				this.$message.error(res.msg);
			}
		},

		// 议题状态变更
		async updateStatus(state, id) {
			const res = await changeStatus(state, id);
			console.log(res, "resresres");
			if (res.code === 200) {
				// console.log(1111);
				this.getList();
			}
		},

		// 会议状态变更
		async updateMeetStatus(state, id) {
			const res = await changeMeetStatus(state, id);
			console.log(res, "resresres");
			if (res.code === 200) {
				// console.log(1111);
				this.getList();
			}
		},

		// 启动会议
		sTartMeeting() {
			const meetingState = {
				meetingState: "1"
			};
			this.updateMeetStatus(meetingState, this.listData.id);
		},

		// 结束会议
		endMeeting() {
			const meetingState = {
				meetingState: "2"
			};
			this.updateMeetStatus(meetingState, this.listData.id);
		},

		// 上一议题
		toLast() {
			this.listData.meetingTopicList.forEach((ele, index) => {
				const state = {
					state: "2",
					sort: ele.sort
				};
				const stat = {
					state: "1",
					sort: ele.sort - 1
				};
				let nextIndex = 0;
				if (ele.state === "1") {
					this.updateStatus(state, ele.id);
					if (index > 0) {
						nextIndex = index - 1;
						this.updateStatus(stat, this.listData.meetingTopicList[nextIndex].id);
					} else {
						this.$confirm("没有更多议题了，请选择结束会议", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						});
					}
				}
			});
		},

		// 下一议题
		async toNext() {
			this.listData.meetingTopicList.forEach((ele, index) => {
				const state = {
					state: "2",
					sort: ele.sort
				};
				const stat = {
					state: "1",
					sort: ele.sort + 1
				};
				let nextIndex = 0;
				if (ele.state === "1") {
					this.updateStatus(state, ele.id);
					if (index < this.listData.meetingTopicList.length - 1) {
						nextIndex = index + 1;
						// console.log(this.listData.meetingTopicList[nextIndex], "0000000000");
						this.updateStatus(stat, this.listData.meetingTopicList[nextIndex].id);
					} else {
						this.$confirm("没有更多议题了，请选择结束会议", "提示", {
							confirmButtonText: "确定",
							cancelButtonText: "取消",
							type: "warning"
						});
					}
				}
			});
		},

		// 结束当前议题
		endYt() {
			this.toNext();
		}

		// 刷新缓存
		// async refreshCache() {
		// 	const res = await refreshCache();
		// 	if (res.code === 200) {
		// 		this.$message.success("刷新成功");
		// 	} else {
		// 		this.$message.error(res.msg);
		// 	}
		// }
	}
};
</script>
<style lang="scss" scoped>
.rejectColor {
	color: red;
}

.el-card {
	color: #606266;
}

.passColor {
	color: limegreen;
}

.process {
	background-color: #f2f2f2;
	width: 100%;
	height: 100vh;
	min-width: 1200px;

	.mettingStatus {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		background-color: #fff;
		height: 100px;

		.Issues {
			width: 30%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			p {
				font-size: 18px;
			}
		}
	}

	.content {
		width: 100%;
		min-height: 900px;
		max-height: 1200px;
		overflow: scroll;
		background-color: #fff;
		margin-top: 20px;
		position: relative;

		.title {
			position: absolute;
			top: 20px;
			left: 20px;
			font-size: 14px;
			font-weight: 600;
		}

		.meetMessage {
			width: 100%;
			align-items: center;
			justify-content: space-around;
			position: absolute;
			top: 60px;
			padding-left: 30px;

			p {
				font-size: 14px;
			}
		}

		.resident {
			display: block;
			width: 80%;
			margin: 220px 0 0 20px;

			.residentPerson {
				font-size: 14px;
				font-weight: 600;
				margin: 20px 0;
			}

			ul {
				// margin-left: 30px;

				li {
					display: flex;
					flex-wrap: wrap;
					align-items: center;
					margin: 20px;

					p {
						font-size: 14px;
					}
				}
			}
		}

		.items {
			position: absolute;
			// top: 220px;
			top: 600px;
			// margin: 50px 0 0 0;
			left: 20px;
			width: 80%;
			min-height: 900px;
			padding-bottom: 220px;

			.summary {
				margin-bottom: 30px;
			}

			.item {
				padding-top: 20px;
				height: auto;

				.item_Top {
					display: flex;
					align-items: center;
					justify-content: space-between;
					border: 1px solid #f2f2f2;
					background-color: #f2f2f2;
					padding: 10px;

					.meetStatus {
						width: 25%;
						display: flex;
						align-items: center;
						justify-content: space-around;

						p {
							font-size: 14px;
							font-weight: 600;
						}

						.ing {
							width: 88px;
							height: 34px;
							line-height: 12px;
							text-align: center;
						}
					}
				}

				ul {
					li {
						display: flex;
						align-items: center;
						flex-wrap: wrap;
						margin: 20px;

						p {
							font-size: 14px;
							padding: 5px 0;
						}
					}
				}
			}
		}
	}
}
</style>
