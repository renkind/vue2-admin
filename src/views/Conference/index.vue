// 仿造会议过程管理页面
<template>
	<div class="app-container process" id="aa">
		<!-- 顶部状态 -->
		<div class="mettingStatus" v-show="meetingInfos !== 'null' || listData.meetingState === '未开始'">
			<div class="Issues">
				<div style="display: flex">
					<p>会议状态:</p>
					<p style="text-indent: 1em">{{ listData.meetingState }}</p>
				</div>

				<div style="display: flex">
					<p>当前议题:</p>
					<p style="text-indent: 1em" v-if="currentTopic">议题{{ currenting }}: {{ currentTopic.topicContent }}</p>
					<p style="text-indent: 1em" v-else>当前无正在进行的议题</p>
				</div>
			</div>

			<div style="">
				<div style="display: flex">
					<!-- <el-button @click="dialogForm" type="primary">增加临时议题</el-button> -->
					<el-button
						type="primary"
						v-show="listData.meetingState === '未开始' || listData.meetingState === '已结束'"
						@click="startMeeting"
						>启动会议</el-button
					>
					<el-button type="primary" v-hasPermi="['meeting:MeetingProgressManage:last']" @click="toLast"
						>上一议题</el-button
					>
					<el-button type="primary" v-hasPermi="['meeting:MeetingProgressManage:next']" @click="toNext"
						>下一议题</el-button
					>
					<el-button type="primary" v-hasPermi="['meeting:MeetingProgressManage:jump']" @click="showJump = true"
						>跳转到议题</el-button
					>
					<!-- <el-button type="primary" @click="toLast">上一议题</el-button>
					<el-button type="primary" @click="toNext">下一议题</el-button>
					<el-button type="primary" @click="showJump = true">跳转到议题</el-button> -->
					<el-button
						type="danger"
						v-hasPermi="['meeting:MeetingProgressManage:ending']"
						v-if="listData.meetingState === '进行中'"
						@click="endMeeting"
						>结束会议</el-button
					>
				</div>
				<div style="display: flex; align-items: center; margin-top: 13px">
					<!-- <el-button type="danger" v-if="listData.meetingState === '进行中'" @click="endMeeting">结束会议</el-button> -->

					<!-- <el-input-number
						v-model="topicIndex"
						style="width: 115px; margin: 0 10px"
						:controls="false"
						placeholder="输入议题编号"
					></el-input-number>
					<el-button style="margin-left: 15px" size="mini" type="primary" @click="jumpToTopic(topicIndex)"
						>跳转</el-button
					> -->
				</div>
			</div>
		</div>

		<el-dialog title="新增临时议题" :visible.sync="isAdd" width="30%">
			<span>是否确定增加临时议题</span>
			<span slot="footer" class="dialog-footer">
				<el-button @click="isAdd = false">取 消</el-button>
				<el-button type="primary" @click="addTopicSure">确 定</el-button>
			</span>
		</el-dialog>

		<!-- 内容板块 -->
		<div class="content" v-show="meetingInfos !== 'null'">
			<p class="title">会议信息</p>
			<div class="meetMessage">
				<div style="display: flex">
					<p>会议名称:</p>
					<p>{{ listData.name }}</p>
				</div>
				<div style="display: flex">
					<p>会议类型:</p>
					<p>{{ listData.meetTypeName }}</p>
				</div>
				<div style="display: flex">
					<p>会议主持:</p>
					<p>{{ listData.speakerName }}</p>
				</div>
				<div style="display: flex">
					<p>会议日期:</p>
					<p>{{ listData.createTime }}</p>
				</div>
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
								<p style="text-indent: 1em" v-for="item in summaryReouceList" @click="openPDF(item)" :key="item.id">
									{{ item.name }}
								</p>
							</li>
						</ul>
					</div>
				</el-card>
				<el-card class="box-card">
					<div
						class="item topic"
						v-for="(item, index) in detailData.meetingTopicList"
						:key="index"
						ref="topicRefs[index]"
					>
						<!-- {{ item }} -->
						<div class="item_Top">
							<div class="meetStatus">
								<p style="font-size: 16px">议题{{ index + 1 }}</p>
								<!-- <el-button class="ing" sizi="mini" v-if="item.state === '0'" type="info" round>未开始</el-button> -->
								<el-button class="ing" sizi="mini" v-if="item.state === '1'" type="primary" round>进行中</el-button>
								<!-- <el-button class="ing" sizi="mini" v-if="item.state === '2'" type="danger" round>已结束</el-button> -->
								<el-button class="ing" sizi="mini" v-if="item.identifying === '1'" type="warning" plain round
									>临时议题</el-button
								>
							</div>
							<!-- <el-button type="primary" v-if="item.state === '1'" @click="endYt">结束议题</el-button> -->
						</div>
						<ul>
							<li>
								<p>议题名称:</p>
								<p style="text-indent: 1em">{{ item.topicContent }}</p>
							</li>
							<li>
								<p>汇报人:</p>
								<p style="text-indent: 1em" v-for="(i, index) in item.mcList" :key="index">
									{{ i.dept.deptName }}{{ i.office }} {{ i.nickName }}
								</p>
							</li>
							<!-- <li>
								<p>参会领导:</p>
								<p v-for="i in item.meetingPersonJoinList" :key="i.id" style="text-indent: 1em; margin: 4px 0">
									{{ i.personDept }}{{ i.office }} {{ i.personName }}
								</p>
							</li> -->
							<li>
								<p>列席人员:</p>
								<p
									v-for="(i, index) in item.meetingPersonAttendList"
									:key="index"
									style="text-indent: 1em; margin: 4px 0"
								>
									{{ i.personDept }}{{ i.office }} {{ i.personName }}
								</p>
							</li>
							<li v-if="item.meetingPersonAttendListLeave">
								<!-- {{ item.meetingPersonAttendListLeave }} -->
								<p>请假:</p>
								<p
									v-for="(i, index) in item.meetingPersonAttendListLeave"
									:key="index"
									style="text-indent: 1em; margin: 4px 0"
								>
									{{ i.personDept }}{{ i.office }} {{ i.personName }}({{ i.leaveNote }})
								</p>
							</li>
							<li>
								<p>会议材料:</p>
								<!-- <p v-for="i in item.meetingResourceList" :key="i.id">{{ i.name }}</p> -->
							</li>
							<!-- {{ item.meetingResourceList}} -->
							<el-table :data="item.meetingResourceList" border>
								<el-table-column align="center" type="index" label="序号" width="190"></el-table-column>
								<el-table-column align="center" label="会议材料">
									<template slot-scope="scope">
										<span @click="openPDF(scope.row)">{{ scope.row.name }}</span>
									</template>
								</el-table-column>
								<el-table-column align="center" prop="classification" label="密级标识"></el-table-column>
								<el-table-column align="center" prop="term" label="保密期限"></el-table-column>
								<!-- <el-table-column align="center" prop="date" label="操作" width="180"></el-table-column> -->
							</el-table>
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
			<el-dialog title="增加临时议题" :visible.sync="dialogFormVisible" width="60%">
				<el-button type="primary" @click="addChild(form)">添加子议题</el-button>
				<!-- <template slot-scope="props"> -->
				<el-form ref="form" :model="form" :rules="rules">
					<el-form-item label="议题顺序" prop="region" :label-width="formLabelWidth">
						<el-select @change="change" v-model="form.region" placeholder="请选择顺序">
							<el-option
								v-for="index in topicOrderOptions"
								:key="index"
								:label="'议题' + index + '之后'"
								:value="index"
							></el-option>
						</el-select>
					</el-form-item>
					<el-form-item prop="name" label="议题名称" :label-width="formLabelWidth">
						<el-input autocomplete="off" style="width: 80%" v-model="form.name" placeholder="请输入"></el-input>
					</el-form-item>
					<el-form-item label="汇报人" :label-width="formLabelWidth" prop="mc">
						<el-select v-model="form.mc" multiple placeholder="请选择">
							<template v-for="item in memberOptions">
								<el-option
									:key="item.userId"
									v-if="item.dept"
									:label="item.dept.deptName + item.office + ' ' + item.nickName"
									:value="item.userId"
								>
								</el-option>
							</template>
						</el-select>
					</el-form-item>
					<!-- <el-form-item label="出席领导" :label-width="formLabelWidth" prop="attendperson">
						<el-select
							v-model="form.attendperson"
							@change="handleAttendeesChange"
							readonly
							multiple
							placeholder="请选择"
							filterable
							clearable
						>
							<template v-for="item in memberOptions">
								<el-option
									:key="item.userId"
									v-if="item.dept"
									:label="item.dept.deptName + item.office + ' ' + item.nickName"
									:value="item.userId"
								></el-option>
							</template>
						</el-select>

						<el-button size="mini" @click="openSelectModal(1, form)" style="margin-left: 20px">添加人员</el-button>
					</el-form-item> -->

					<el-form-item label="列席领导" :label-width="formLabelWidth" prop="joinPerson">
						<el-select v-model="form.joinPerson" clearable multiple placeholder="请选择" filterable>
							<template v-for="item in memberOptions">
								<el-option
									:key="item.userId"
									v-if="item.dept"
									:disabled="isPersonDisabled(item.userId)"
									:value="item.userId"
									:label="item.dept.deptName + item.office + ' ' + item.nickName"
								>
								</el-option>
							</template>
						</el-select>
						<el-button size="mini" @click="openSelectModal(2, form)" style="margin-left: 20px">添加人员</el-button>
					</el-form-item>
					<el-form-item label="请假" :label-width="formLabelWidth" prop="present">
						<el-select v-model="form.leaveList" clearable multiple placeholder="请选择" filterable>
							<template v-for="item in memberOptions">
								<el-option
									:key="item.userId"
									v-if="item.dept"
									:disabled="isPersonDisabled(item.userId)"
									:value="item.userId"
									:label="item.dept.deptName + item.office + ' ' + item.nickName"
								>
								</el-option>
							</template>
						</el-select>
						<!-- <el-button size="mini" @click="openSelectModal(3, form)" style="margin-left: 20px">添加人员</el-button> -->
					</el-form-item>

					<div style="display: flex; swidth: 30%">
						<p>会议材料：</p>

						<zs-image-upload
							accept="application/pdf"
							ref="mychild"
							:maxKb="1024000"
							:maxFile="100"
							intro="请上传PDF格式文件"
							:fileLists="form.fileLists"
							:isFile="true"
							:ajaxProp="{ mi: formParams.psw }"
							:showList="true"
							@updateFileList="
								(res) => {
									uploadSuccess(form, res);
								}
							"
						></zs-image-upload>
					</div>
					<el-table :data="form.meetingResourceList" border>
						<el-table-column align="center" type="index" label="序号" width="190"></el-table-column>
						<el-table-column align="center" prop="name" label="会议材料"></el-table-column>
						<el-table-column align="center" prop="classification" label="密级标识">
							<template slot-scope="scope">
								<el-select v-model="scope.row.classification" placeholder="请选择">
									<el-option v-for="item in classificationList" :key="item.id" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</template>
						</el-table-column>
						<el-table-column align="center" prop="term" label="保密期限">
							<template slot-scope="scope">
								<el-select v-model="scope.row.term" placeholder="请选择">
									<el-option v-for="item in termList" :key="item.id" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</template>
						</el-table-column>

						<!-- <el-table-column align="center" prop="date" label="操作" width="180"></el-table-column> -->
					</el-table>
					<!-- {{form.childTopicList}} -->
					<!-- {{ form.childTopicList }} -->
					<div v-for="(child, index) in form.childTopicList" :key="index">
						<el-form label-position="left" label-width="100px" style="margin-top: 10px; width: 80%">
							<el-form-item :label="`子议题${index + 1}名称`">
								<el-input v-model="child.topicContent" class="beforeBtn" />
								<el-button size="mini" @click="addMc(child)" style="margin-left: 20px">添加汇报人</el-button>
								<el-button
									size="mini"
									type="danger"
									@click="delChild(form.childTopicList, index)"
									style="margin-left: 10px"
									>删除
								</el-button>
							</el-form-item>
							<el-form-item label="关联列席领导">
								<el-select v-model="child.attend" class="beforeBtn" multiple placeholder="请选择" filterable clearable>
									<el-option
										v-for="item in memberOptions"
										:key="`${item.userId}h`"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
									>
										<!-- v-show="form.joinPerson.includes(item.userId) === true" -->
									</el-option>
								</el-select>
							</el-form-item>
							<el-form-item label="关联请假">
								<el-select v-model="child.leave" class="beforeBtn" multiple placeholder="请选择" filterable clearable>
									<el-option
										v-for="item in memberOptions"
										:key="`${item.userId}i`"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
									>
										<!-- v-show="form.leaveList.includes(item.userId) === true" -->
									</el-option>
								</el-select>
							</el-form-item>
							<div v-for="(m, idx) in child.mc" :key="idx">
								<el-form-item :label="`关联汇报人${idx + 1}`" style="color: #999">
									<el-select v-model="m.id" class="beforeBtn" multiple placeholder="请选择" filterable clearable>
										<el-option
											v-for="item in memberOptions"
											:key="`${item.userId}g`"
											:label="
												item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
											"
											:value="item.userId"
										>
											<!-- v-show="form.mcArr.includes(item.userId) === true" -->
										</el-option>
									</el-select>
									<el-button size="mini" type="danger" @click="delMc(child.mc, index)" style="margin-left: 10px"
										>删除
									</el-button>
								</el-form-item>

								<el-form-item :label="`关联材料${idx + 1}`">
									<el-select v-model="m.file" class="beforeBtn" multiple placeholder="请选择" filterable clearable>
										<el-option
											v-for="(item, num) in form.meetingResourceList"
											:key="num"
											:label="item.name"
											:value="item.urlPath"
										>
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-form>
					</div>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button @click="dialogFormVisible = false">取 消</el-button>
					<el-button type="primary" @click="submitIssues">确 定</el-button>
				</div>
			</el-dialog>

			<el-dialog title="选择人员" :visible.sync="showSelectModal" width="96%">
				<el-tabs v-model="selectTab" @tab-click="tabClick">
					<el-tab-pane label="按组织结构选择" name="0">
						<el-row :gutter="20">
							<!--部门数据-->
							<el-col :span="4" :xs="24">
								<div class="head-container">
									<el-input
										v-model="deptName"
										placeholder="请输入部门名称"
										clearable
										size="small"
										prefix-icon="el-icon-search"
										style="margin-bottom: 20px"
									/>
								</div>
								<div class="head-container">
									<el-tree
										:data="deptOptions"
										:props="defaultProps"
										:expand-on-click-node="false"
										:filter-node-method="filterNode"
										ref="tree"
										default-expand-all
										@node-click="handleNodeClick"
									/>
								</div>
							</el-col>
							<el-col :span="20" :xs="24">
								<TablePage
									:listData="personListData"
									:listLoading="listLoading"
									:columns="columns"
									:searchParams="searchParams"
									:pageNo="queryParams.pageNo"
									:pageSize="queryParams.pageSize"
									:totalCount="total"
									:showBatch="true"
									@selectionRow="getSelected"
									@query="handleQuery"
									ref="selectTable"
								>
									<template v-slot:frameFlag="{ scope }">
										<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
									</template>
									<template v-slot:roleName="{ scope }">
										<dict-tag :options="dict.type.meeting_role" :value="scope.personRole" />
										<!-- <dict-tag :options="dict.type.meeting_role" :value="scope.personRole" /> -->
									</template>
									<template v-slot:deptName="{ scope }">
										{{ scope.dept.deptName }}
									</template>
									<template v-slot:deptId="{ scope }">
										<dict-tag :options="dict.type.app_city" :value="scope.deptId" />
									</template>
								</TablePage>
							</el-col>
						</el-row>
					</el-tab-pane>
				</el-tabs>

				<span slot="footer" class="dialog-footer">
					<el-button @click="showSelectModal = false">取 消</el-button>
					<el-button type="primary" @click="fillSelected">添加至人员列表</el-button>
				</span>
			</el-dialog>

			<!-- 预览PDF图片 -->
			<el-dialog title="预览" :visible.sync="showPDF" width="80%">
				<iframe :src="pdfUrl" v-if="pdfUrl" frameborder="0" width="100%" height="900px"></iframe>
				<span slot="footer" class="dialog-footer">
					<!-- <el-button @click="showPDF = false">取 消</el-button> -->
					<el-button type="primary" @click="showPDF = false">关闭</el-button>
				</span>
			</el-dialog>

			<!-- 跳转议题 -->
			<el-dialog title="议题选择" :visible.sync="showJump" width="60%">
				<div
					@click="jumpToTopic(index + 1, topic.topicContent)"
					v-for="(topic, index) in detailData.meetingTopicList"
					:key="index"
					class="selectTopic"
				>
					{{ `${index + 1}.  ${topic.topicContent}` }}
				</div>
			</el-dialog>
		</div>

		<div v-show="meetingInfos === 'null'">
			<el-empty description="暂无会议信息"></el-empty>
		</div>
	</div>
</template>
<script>
import ZsTopButton from "@/components/Zs_topButton";
import { treeselect } from "@/service/dept";
import TablePage from "@/components/Zs_table";
import { listUser } from "@/service/user";
import { getDicts } from "@/service/dict/data";
import ZsImageUpload from "@/components/Zs_form/Zs_imageUpload";
import { addMeeting, detailMeeting, updateMeeting } from "@/service/meeting";
import { processList, changeStatus, changeMeetStatus, Provisional } from "@/service/process";
import { info } from "@/service/meetingMonitor";
// import { ESLint } from "eslint";
export default {
	name: "noticeManage",
	components: {
		ZsTopButton,
		ZsImageUpload,
		TablePage
	},
	dicts: ["frame_flag", "app_approval_status", "app_city"],
	data() {
		return {
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
			listData: {},
			detailData: {},
			personListData: [],
			total: 0,
			listLoading: false,
			current: "",
			currentTopic: null, // 添加一个变量用于存储当前议题信息
			dialogFormVisible: false,
			isTost: false,
			isAdd: false,
			form: {
				name: "",
				attendPerson: [],
				joinPerson: [],
				fileLists: [],
				meetingPersonList: [],
				leave: [],
				leaveList: [],
				childTopicList: [],
				mcArr: "",
				// cc: [], // 文件
				mc: ""
				// optionValue1: "",
				// optionValue2: ""
			},
			classificationList: [
				{
					id: 0,
					value: "0",
					label: "机密"
				},
				{
					id: 1,
					value: "1",
					label: "秘密"
				},
				{
					id: 2,
					value: "2",
					label: "内部"
				},
				{
					id: 3,
					value: "XX",
					label: "XX"
				}
			],
			termList: [
				{
					id: 1,
					value: "10年",
					label: "10年"
				},
				{
					id: 2,
					value: "20年",
					label: "20年"
				},
				{
					id: 3,
					value: "30年",
					label: "30年"
				},
				{
					id: 4,
					value: "40年",
					label: "40年"
				},
				{
					id: 5,
					value: "50年",
					label: "50年"
				},
				{
					id: 6,
					value: "长期",
					label: "长期"
				},
				{
					id: 7,
					value: "XX",
					label: "XX"
				}
			],
			resourceList: [],
			resourceList2: [],
			selectedPeople: [], // 用于存储选中的出席领导人员信息
			selectedAttendees: [], // 用于存储选中的列席领导信息
			defaultProps: {
				children: "children",
				label: "label"
			},
			memberOptions: [],
			formLabelWidth: "120px",
			selectedTopic: null,
			val: null,
			showSelectModal: false,
			selectTab: 0,
			// 部门名称
			deptName: "",
			deptOptions: [],
			selectType: 0,
			topicList: {},
			topicListData: [],
			showPDF: false,
			pdfUrl: "",
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				deptId: ""
			},
			columns: [
				{
					label: "用户名",
					dataIndex: "nickName"
				},
				{
					label: "帐号",
					dataIndex: "userName"
				},
				{
					label: "部门单位",
					dataIndex: "deptName",
					slotName: "deptName"
				},
				{
					label: "职务",
					dataIndex: "office"
				},
				{
					label: "角色",
					dataIndex: "roleName",
					slotName: "roleName"
				},
				{
					label: "创建时间",
					dataIndex: "createTime"
				}
			],
			searchParams: [
				{
					label: "用户名",
					name: "name",
					type: "text",
					option: {
						placeholder: "请输入",
						width: 240
					}
				},
				{
					label: "创建时间",
					name: "createTime",
					type: "datetimerange",
					option: {
						placeholder: "请输入"
					}
				}
			],
			// 表单校验
			rules: {
				region: [{ required: true, message: "请选择议题顺序", trigger: "change" }],
				name: [{ required: true, message: "请填写议题名称", trigger: "blur" }],
				mc: [{ required: true, message: "请选择汇报人", trigger: "blur" }],
				attendPerson: [{ required: true, message: "请选择出席领导", trigger: "change" }],
				joinPerson: [{ required: true, message: "请选择列席领导", trigger: "change" }]
			},
			joinPersonName: [],
			attendPersonName: [],
			askForLeave: [],
			leavePersonnelList: [],
			meetingPersonAttendList: [],
			memberList: [],
			childTopicList: [],
			// childTopicMcList: [],
			resourceName: "",
			meetingResourceList: [],
			summaryList: [],
			summaryReouceList: [],
			topicIndex: undefined, // 存储用户输入的目标议题编号
			currentTopicId: "", // 当前进行中议题ID
			currentTopicSort: 0,
			progressIndex: "",
			showJump: false,
			currenting: "",
			meetingInfos: {},
			meetId: ""
		};
	},
	computed: {
		// 计算属性用于生成议题顺序列表的选项
		topicOrderOptions() {
			// 获取现有议题列表的长度
			const topicListLength = this.topicListData.length;
			// 生成一个从 1 到议题列表长度的整数数组
			return Array.from({ length: topicListLength }, (v, i) => i + 1);
		}
	},
	created() {
        this.fetchData();
		// this.info();
		// this.getList();
		// this.listMember();
		// this.getMeetingDicts();
		// this.getTreeselect();
		// // if (this.meetId) {
		// this.getDetail();
		// // }
	},
	watch: {
		// 根据名称筛选部门树
		deptName(val) {
			this.$refs.tree.filter(val);
		}
	},
	mounted() {
		// this.info();
		if (this.meetId) {
		this.getDetail();
		}
	},
	methods: {
		// 预览
		async openPDF(row) {
			console.log(row);
			if (row.fileUrlPath) {
				this.pdfUrl = row.fileUrlPath;
				this.showPDF = true;
			}
		},

		async fetchData() {
			await this.info(); // 等待info方法完成
			this.getList();
			this.listMember();
			this.getMeetingDicts();
			this.getTreeselect();
            if (this.meetId) {
                this.getDetail();
            }
		},

		// 查看会议信息
		async info() {
			try {
				const res = await info();
				if (res.code === 200) {
					this.meetingInfos = res.data;
					if (this.meetingInfos !== "null" && this.meetingInfos.id) {
						this.meetId = this.meetingInfos.id;
						console.log(this.meetId, "this.meetId");
					}
				} else {
					this.$message.error(res.msg);
				}
			} catch (error) {
				console.error("Error in info:", error);
			}
		},

		// 获取列表
		async getList() {
			this.listLoading = true;
			console.log(this.meetId, "this.meetIdthis.meetIdthis.meetId");
			const res = await processList(this.meetId);
			// console.log(res, "speakerspeakerspeakerspeakerspeaker");
			// console.log(this.listData.meetingTopicList, "this.listData.meetingTopicList.length");
			if (res.code === 200) {
				this.listData = res.data;
				// this.listData.createTime = res.data.createTime.slice(0, 10);
				// 记录当前进行中的议题
				this.currentTopic = this.listData.meetingTopicList.find((item) => item.state === "1");
				if (this.currentTopic) {
					this.currenting = this.currentTopic.sort + 1;
				}
				console.log(this.currenting, "currentTopiccurrentTopic");
				this.listData.meetingTopicList.forEach((ele, index) => {
					// console.log(ele, "eleleleel");
					this.resourceList = ele.meetingResourceList;
					ele.meetingResourceList.forEach((e, i) => {
						// console.log(e, "formatName");
						if (e.classification === "0") {
							e.classification = "机密";
						} else if (e.classification === "1") {
							e.classification = "秘密";
						} else if (e.classification === "2") {
							e.classification = "内部";
						}
						// else {
						// 	e.classification = "";
						// }
					});
				});

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
			this.resetForm();
			this.listLoading = false;
		},

		// 表单重置
		resetForm() {
			this.form = {
				name: "",
				attendPerson: [],
				joinPerson: [],
				fileLists: [],
				meetingPersonList: [],
				meetingResourceList: [],
				mc: "",
				optionValue1: "",
				optionValue2: ""
				// 将其他字段添加在这里，并将其重置为默认值或空值
			};
		},
		// 获取当前进行中议题的ID
		retrieveCurrentTopicId() {
			// console.log(this.detailData.meetingTopicList, "this.detailData.meetingTopicList");
			const currentTopic = this.detailData.meetingTopicList.find((topic) => topic.state === "1");

			if (currentTopic) {
				const currentTopicId = currentTopic.id;
				this.currentTopicId = currentTopicId;
				// console.log("当前议题ID：", this.currentTopicId);
			} else {
				console.log("未找到进行中的议题。");
			}
		},

		// 跳转议题
		jumpToTopic(topic, name) {
			this.$msgbox
				.confirm(`是否确认切换当前议题到 ${name}?`)
				.then((res) => {
					if (topic === this.currentTopicSort) {
						// 用户要跳转到当前进行中的议题，无需执行状态变更操作
						return;
					}
					// 获取用户输入的议题编号
					const topicIndex = Number(topic - 1);
					console.log(topicIndex);
					// 验证用户输入的编号是否有效
					if (!Number.isNaN(topicIndex) && topicIndex >= 0 && topicIndex < this.detailData.meetingTopicList.length) {
						// 获取要跳转的议题的DOM元素
						const targetTopic = document.querySelectorAll(".topic")[topicIndex];
						const targetTopicId = this.detailData.meetingTopicList[topicIndex].id;
						// console.log(`目标议题的ID是: ${targetTopicId}`);
						// console.log("当前议题的ID是:", this.currentTopicId);
						const state = {
							state: "1",
							meetingId: this.$route.params.id
						};
						const stat = {
							state: "2",
							meetingId: this.$route.params.id
						};
						// 将当前议题状态变为结束 将目标议题状态变为进行中
						if (this.currentTopicId && targetTopicId) {
							this.updateStatus(stat, state, this.currentTopicId, targetTopicId);
						}
						this.$forceUpdate();
						this.topicIndex = undefined;
						this.showJump = false;
						if (targetTopic) {
							// 使用滚动到目标议题的位置
							targetTopic.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
							// const comDom = document.getElementsByClassName("app-container"); //当前要定位的DOM元素
							// const offsetTop = comDom?.offsetTop - 300; //元素距离外部盒子顶部的高度（-5是为避免被覆盖物遮挡）
							// const scrollTopDom = document.getElementsByClassName("app-container"); // 滚动元素的父级
							// scrollTopDom.style.marginTop = "300px"; // 设置父元素的滚动条位置
							// document.getElementById("aa").style.marginTop = "125px";
						}
						// this.getDetail();
					} else {
						this.$message.info("无效的议题序号");
					}
				})
				.catch(() => {});
		},

		// 议题状态变更
		async updateStatus(state1, state2, id1, id2) {
			const res = await changeStatus(state1, id1);
			const res2 = await changeStatus(state2, id2);
			console.log(res, res2);
			this.getList();
			this.getDetail();
		},

		// 会议状态变更
		async updateMeetStatus(state, id) {
			const res = await changeMeetStatus(state, id);
			// console.log(res, "resresres");
			if (res.code === 200) {
				// this.$message.success("发布成功");
				this.getList();
				this.getDetail();
			} else {
				this.$message.error("当前有正在进行的会议，请先结束此会议!");
			}
		},

		// 启动会议
		startMeeting() {
			this.$msgbox
				.confirm("是否确认启动会议?")
				.then((res) => {
					const meetingState = {
						meetingState: "1"
					};
					this.updateMeetStatus(meetingState, this.listData.id);
					this.getDetail();
					this.$message.success("会议已启动");
				})
				.catch(() => {});
		},

		// 结束会议
		endMeeting() {
			this.$msgbox
				.confirm("是否确认结束会议?")
				.then((res) => {
					const meetingState = {
						meetingState: "2"
					};
					this.updateMeetStatus(meetingState, this.listData.id);
					this.getList();
					this.$message.success("会议已结束");
					this.isTost = false;
				})
				.catch(() => {});
		},

		// 强制刷新
		refresh() {
			this.startMeeting();
		},

		async submit() {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid) {
					const params = {
						name: this.formParams.name, // 名称
						meetType: this.formParams.type, // 类型
						meetingDate: this.formParams.date, // 日期
						startTime: this.formParams.time[0], // 时间
						endTime: this.formParams.time[1], // 时间
						speaker: this.formParams.compere, // 主持
						address: this.formParams.place, // 地点
						briefIntroduction: this.formParams.content, // 简介
						password: this.formParams.psw, // 密码
						meetingTopicList: this.topicListData,
						joinPerson: this.formParams.present.join(","), // 参会领导
						attendPerson: this.formParams.attend.join(","), // 列席人员
						leavePersonList: JSON.stringify(this.formParams.leaveList) // 请假人员
						// meetingPersonList type 1:参会领导;2:列席领导;3:其他
					};
					params.meetingTopicList.forEach((x) => {
						x.mc = x.mcArr.join(",");

						// 处理常驻出席领导
						params.joinPerson.forEach((leader) => {
							x.meetingPersonList.push({
								userId: leader,
								personType: 1 // 常驻出席领导的 personType 为 1
							});
						});
						// 处理常驻列席领导
						params.attendPerson.forEach((leader) => {
							x.meetingPersonList.push({
								userId: leader,
								personType: 1 // 常驻列席领导的 personType 为 1
							});
						});

						x.present.forEach((i) => {
							console.log(i, "joinPerson");
							x.meetingPersonList.push({
								userId: i,
								personType: 1
							});
						});
						x.attend.forEach((i) => {
							x.meetingPersonList.push({
								userId: i,
								personType: 2
							});
						});
					});
					console.log(params);
					let res;
					if (this.isCreate) {
						res = await addMeeting(params);
					} else {
						params.id = this.$route.params.id;
						res = await updateMeeting(params);
					}
					if (res.code === 200) {
						this.$message.success(res.msg);
						this.$router.back();
					} else {
						this.$message.error(res.msg);
					}
				} else {
					this.$message.error("表单信息不完整，请检查");
					return false;
				}
			});
		},

		// 获取列表
		async getPageList() {
			this.listLoading = true;
			console.log(this.queryParams);
			const params = {
				pageNo: this.queryParams.pageNo,
				pageSize: this.queryParams.pageSize,
				deptId: this.queryParams.deptId,
				status: 0,
				userType: "01"
			};
			const res = await listUser(params);
			console.log(res, "listUserlistUser");
			if (res.code === 200) {
				this.personListData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},

		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
				// console.log(response, "responseresponseresponse");
				this.deptOptions = response.data; // 截取河南省数据，直接暴露子级
			});
		},

		// 筛选节点
		filterNode(value, data) {
			if (!value) return true;
			return data.label.indexOf(value) !== -1;
		},
		// 节点单击事件
		handleNodeClick(data) {
			this.queryParams.deptId = data.id;
			this.handleQuery();
		},

		// tab点击
		tabClick() {},
		/** 搜索按钮操作 */
		handleQuery(params, deptId) {
			console.log(params);
			if (params) {
				this.queryParams = params.searchFormData;
			} else {
				this.$set(this.queryParams, "pageNo", 1);
				this.$set(this.queryParams, "pageSize", 10);
			}
			this.getPageList();
		},

		openSelectModal(sign, row) {
			this.getPageList();
			this.showSelectModal = true;
			this.selectType = sign;
			this.selectTopic = row;
			console.log(sign, row);
			// console.log(this.selectTopic);
		},

		getSelected(val) {
			this.selected = val;
			console.log(this.selected);
		},

		// 将选中的人员添加到相应数组中
		// fillSelected() {
		// 	if (this.selectType === 1) {
		// 		this.form.joinPerson = this.form.joinPerson || []; // 确保 present 是一个数组
		// 		// 合并原有的人员和新添加的人员，并去重
		// 		this.form.joinPerson = Array.from(new Set([...this.form.joinPerson, ...this.selected.map((person) => person.userId)]));
		// 		this.form.attendperson = [...this.form.joinPerson];
		// 	} else if (this.selectType === 2) {
		// 		this.form.attendperson = this.form.attendperson || []; // 确保 attend 是一个数组
		// 		// 合并原有的人员和新添加的人员，并去重
		// 		this.form.attendperson = Array.from(new Set([...this.form.attendperson, ...this.selected.map((person) => person.userId)]));
		// 		this.form.joinPerson = [...this.form.attendperson];
		// 	}
		// 	this.clearTableSelect();
		// 	this.showSelectModal = false;
		// },

		// 填充过滤
		fillSelected() {
			if (this.selectType === 1) {
				// console.log(111111);
				if (!this.form.joinPerson) {
					this.form.joinPerson = [];
				}
				let throwErr = false;
				this.selected.forEach((x) => {
					if (this.form.joinPerson.indexOf(x.userId) === -1) {
						if (this.form.attendPerson.indexOf(x.userId) !== -1) {
							throwErr = true;
						} else {
							this.form.attendPerson.push(x.userId);
						}
					}
				});
				if (throwErr) {
					this.$message.info("已为您过滤重复用户");
				}
			} else if (this.selectType === 2) {
				// console.log("222222");
				if (!this.form.attendPerson) {
					this.form.attendperson = [];
				}
				let throwErr = false;
				this.selected.forEach((x) => {
					if (this.form.attendPerson.indexOf(x.userId) === -1) {
						if (this.form.joinPerson.indexOf(x.userId) !== -1) {
							throwErr = true;
						} else {
							this.form.joinPerson.push(x.userId);
						}
					}
				});
				if (throwErr) {
					this.$message.info("已为您过滤重复用户");
				}
			}
			this.clearTableSelect();
			this.showSelectModal = false;
		},
		handleAttendeesChange() {
			// 检查选中的出席领导是否已存在于列席领导中
			this.form.joinPerson = this.form.joinPerson.filter((personId) => !this.form.attendPerson.includes(personId));
		},
		isPersonDisabled(personId) {
			// 检查人员是否已在出席领导列表中选中
			return this.form.attendPerson.includes(personId);
		},

		clearTableSelect() {
			this.selected = [];
			this.$refs.selectTable.resetSelection();
		},

		changeTopicName(row) {
			this.showUpdateModal = true;
			this.selectTopic = row;
		},

		addTopic() {
			for (const i of this.topicList) {
				if (i.topicContent === this.newTopicName) {
					this.$message.error("议题重复，请修改后重试");
					return;
				}
			}
			this.topicListData.push({
				topicContent: this.newTopicName,
				meetingResourceList: [],
				present: [],
				attend: [],
				mcArr: "",
				meetingPersonList: []
			});
			this.showAddModal = false;
			this.newTopicName = "";
		},

		updateTopic(idx) {
			for (const i of this.topicListData) {
				if (i.topicContent === this.updateTopicName && idx !== i) {
					this.$message.error("议题重复，请修改后重试");
					return;
				}
			}
			this.selectTopic.topicContent = this.updateTopicName;
			this.showUpdateModal = false;
			this.updateTopicName = "";
		},

		delTopic() {
			const names = this.multipleSelection.map((x) => x.name);
			console.log(names);
			for (let i = 0; i < this.topicListData.length; i += 1) {
				console.log(this.topicListData[i].topicContent);

				if (names.indexOf(this.topicListData[i].topicContent) !== -1) {
					this.topicListData.splice(i, 1);
					i -= 1;
				}
			}
			console.log(this.topicListData);
		},

		// 获取会议字典内容
		getMeetingDicts() {
			getDicts("meeting_type").then((response) => {
				this.meetingOptions = response.data;
				// console.log(this.meetingOptions);
			});
		},

		save() {
			console.log(this.formParams.content);
			this.postData("0");
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

		// filterLeavePersonnel() {
		// 	// 使用 JavaScript 的过滤方法筛选出已请假的人员
		// 	this.attendPersonName = this.attendPersonName.filter((name) => {
		// 		return !this.leavePersonnelList.includes(name);
		// 	});
		// },

		addChild(topic) {
			console.log(topic, "topic");
			if (!topic.childTopicList) {
				this.$set(topic, "childTopicList", []);
			}
			console.log(topic);
			topic.childTopicList.push({
				topicContent: `子议题${topic.childTopicList.length + 1}`,
				mc: []
			});
			console.log(topic);
			this.$message.success("添加子议题成功");
		},

		// 子议题添加汇报人
		addMc(topic) {
			if (!topic.mc) {
				this.$set(topic, "mc", []);
			}
			topic.mc.push({
				id: [],
				file: []
			});

			this.$message.success("添加汇报人成功");
		},
		// 删除子议题
		delChild(obj, idx) {
			obj.splice(idx, 1);
		},
		// 删除汇报人
		delMc(obj, idx) {
			obj.splice(idx, 1);
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
			// const { id } = this.$route.params;
			// const { id } = this.meetId;
			// console.log({ id }, "this.$route.params");
			const res = await detailMeeting(this.meetId);
			// console.log(res, "image.pngimage.pngimage.pngimage.pngimage.png");
			if (res.code === 200) {
				// 清空常驻出席领导和常驻列席领导数据
				this.joinPersonName = "";
				this.attendPersonName = "";
				const params = res.data;
				console.log(res.data, "res.data");
				this.detailData = res.data;
				// console.log(params.password, "passwordpasswordpassword");
				this.retrieveCurrentTopicId();

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
				const summaryList = [];
				this.detailData.meetingTopicList.forEach((ele, index) => {
					// 摘出 extType为“1”的  重要论述摘编列为单独数组
					console.log(ele.extType, "extTypeextTypeextType");
					if (ele.state === "1") {
						// 获取到进行中的索引
						this.progressIndex = index;
						// this.currentTopicSort = ele.sort;
					}
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

				// console.log(this.askForLeave, "this.askForLeave");
				// // 议题中列席人员 请假人员去重
				// params.meetingTopicList.forEach((ele, index) => {
				// 	ele.personAttendList = [];
				// 	ele.leavePersonnelList = [];
				// 	if (ele.meetingPersonAttendList) {
				// 		ele.meetingPersonAttendList.forEach((e, i) => {
				// 			// console.log(e, e.leave, "e");
				// 			if (e.leave === "1") {
				// 				ele.leavePersonnelList.push(`${e.personDept}${e.office} ${e.personName} (${e.leaveNote})`);
				// 				// console.log(this.leavePersonnelList, "leavePersonnelleavePersonnel");
				// 			} else {
				// 				ele.personAttendList.push(`${e.personDept}${e.office}${e.personName}`);
				// 			}
				// 		});
				// 	}
				// });

				// 常驻出席领导
				this.formParams.present.forEach((item) => {
					// console.log(item, "joinPersonNamejoinPersonNamejoinPersonNamejoinPersonName");
					this.memberOptions.forEach((ele, index) => {
						// console.log(this.memberOptions, "ele");
						if (ele.userId === Number(item)) {
							this.joinPersonName += `${ele.dept.deptName}${ele.office} ${ele.nickName}，`;
						}
					});
				});
				// 常驻列席领导
				this.formParams.attend.forEach((item) => {
					// console.log(item);
					this.memberOptions.forEach((ele, index) => {
						// console.log(this.memberOptions, "ele");
						if (ele.userId === Number(item)) {
							this.attendPersonName += `${ele.dept.deptName}${ele.office} ${ele.nickName}，`;
						}
					});
				});
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

		// 上一议题
		toLast() {
			this.$msgbox
				.confirm("是否确认切换上一议题?")
				.then(() => {
					// const currentTopic = this.listData.meetingTopicList.find((ele) => ele.sort === this.currentTopicSort);

					if (this.progressIndex > 0 && this.listData.meetingTopicList[this.progressIndex - 1].extType !== "1") {
						// 进行中数据改为结束 -- 2
						const state = {
							state: "2",
							meetingId: this.$route.params.id
							// sort: currentTopic.sort
						};
						// 上一条数据 改为进行中
						const prevState = {
							state: "1",
							meetingId: this.$route.params.id
							// sort: previousTopic.sort
						};
						this.updateStatus(
							state,
							prevState,
							this.listData.meetingTopicList[this.progressIndex].id,
							this.listData.meetingTopicList[this.progressIndex - 1].id
						);

						this.$message.success("切换成功");
						this.getList();
						// console.log(this.currentTopicSort, "this.currentTopicSortthis.currentTopicSortthis.currentTopicSort");
						// if (this.currentTopicSort >= 1) {
						// 	// 切换到上一个议题的排序值
						// 	this.currentTopicSort -= 1;

						// 	// 找到上一个议题，将其状态更改为进行中
						// 	const previousTopic = this.listData.meetingTopicList.find((ele) => ele.sort === this.currentTopicSort);
						// 	if (previousTopic) {
						// 		const prevState = {
						// 			state: "1",
						// 			meetingId: this.$route.params.id
						// 			// sort: previousTopic.sort
						// 		};
						// 		this.updateStatus(prevState, previousTopic.id);
						// 	}
						// }
						// else {
						// 	this.$confirm("没有更多议题了，请选择结束会议", "提示", {
						// 		confirmButtonText: "确定",
						// 		cancelButtonText: "取消",
						// 		type: "warning"
						// 	});
						// }
					} else {
						this.$message.warning("已经是第一个议题");
					}
				})
				.then(() => {
					// this.$message.success("切换成功");
				})
				.catch(() => {});
		},

		// 下一议题
		async toNext() {
			this.$msgbox
				.confirm("是否确认切换下一议题?")
				.then(() => {
					if (
						this.progressIndex < this.listData.meetingTopicList.length - 1 &&
						this.listData.meetingTopicList[this.progressIndex + 1].extType !== "1"
					) {
						// 进行中数据改为结束 -- 2
						const state = {
							state: "2",
							meetingId: this.$route.params.id
							// sort: currentTopic.sort
						};
						// 上一条数据 改为进行中
						const prevState = {
							state: "1",
							meetingId: this.$route.params.id
							// sort: previousTopic.sort
						};
						this.updateStatus(
							state,
							prevState,
							this.listData.meetingTopicList[this.progressIndex].id,
							this.listData.meetingTopicList[this.progressIndex + 1].id
						);

						this.$message.success("切换成功");
					} else {
						this.$message.warning("已经是最后一个议题");
					}
				})
				.then(() => {
					// this.$message.success("切换成功");
				})
				.catch(() => {});
		},

		// 结束当前议题
		endYt() {
			this.toNext();
		},

		// 议题顺序改变
		change(val) {
			this.val = val;
		},

		// 增加议题弹框打开
		dialogForm() {
			// this.dialogFormVisible = true;
			this.isAdd = true;
			this.resetFormAndMaterials();
		},

		addTopicSure() {
			this.dialogFormVisible = true;
			this.isAdd = false;
		},

		// changeclass(val) {
		// 	console.log(val, "changeclasschangeclasschangeclass");
		// },

		// 增加临时议题
		async ProvisionalIssues() {
			const obj = {
				state: 0,
				mc: "",
				meetingPersonList: [],
				meetingResourceList: [],
				topicContent: "",
				present: [],
				grade: 0,
				attend: [],
				classification: "",
				term: "",
				identifying: "1"
			};

			obj.present = this.form.leaveList;
			obj.mc = this.form.mc.join(",");
			obj.topicContent = this.form.name;
			// obj.classification = this.form.optionValue1;
			// obj.term = this.form.optionValue2;
			this.topicList = obj;

			obj.meetingResourceList = this.form.meetingResourceList;
			this.form.attendPerson.forEach((i) => {
				// 检查是否已经存在于 meetingPersonList 中
				const existingPerson = obj.meetingPersonList.find((person) => person.userId === i && person.personType === 1);
				if (!existingPerson) {
					obj.present.push(i);
					obj.meetingPersonList.push({
						userId: i,
						personType: 1
					});
				}
			});

			this.form.joinPerson.forEach((i) => {
				// 检查是否已经存在于 meetingPersonList 中
				const existingPerson = obj.meetingPersonList.find((person) => person.userId === i && person.personType === 2);
				if (!existingPerson) {
					obj.attend.push(i);
					obj.meetingPersonList.push({
						userId: i,
						personType: 2
					});
				}
			});

			console.log(this.topicList, "---");
			const data = this.topicList;
			const res = await Provisional(data, this.$route.params.id, this.val);
			this.getList();
			this.resetFormAndMaterials();
			console.log(res, "changechangechangechangechangechangechangechange");
		},

		// 在新增议题成功后调用此方法来重置表单和上传材料
		resetFormAndMaterials() {
			this.resetForm(); // 重置表单数据
			if (this.$refs["form"]) {
				this.$refs["form"].resetFields();
			}
			// 清空上传材料列表
			this.form.meetingResourceList = [];
			this.resourceList2 = [];
			// 其他重置操作（如果需要的话）
			if (this.$refs.mychild) {
				this.$refs.mychild.clearImgList();
			}
		},

		submitIssues() {
			this.$refs.form.validate((valid) => {
				if (valid) {
					this.ProvisionalIssues();
					this.dialogFormVisible = false;
				}
				this.getList();
				this.getDetail();
			});
		},

		// 	// 打开对话框
		// 	this.dialogFormVisible = true;
		// },

		// 上传会议资料
		uploadSuccess(obj, res) {
			console.log(res);
			res.forEach((x) => {
				x.urlPath = x.url || x.rurl;
			});
			obj.meetingResourceList = [];
			obj.meetingResourceList = res;
			this.$set(obj.meetingResourceList, "classification", "");
			this.$set(obj.meetingResourceList, "term", "");

			console.log(this.form.meetingResourceList, "000000");
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

.passColor {
	color: limegreen;
}

.selectTopic {
	width: 80%;
	padding: 20px;
	margin-top: 20px;
	background: #f2f2f2;
	border-radius: 8px;
}
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
	-webkit-appearance: none;
	margin: 0;
}

.process {
	background-color: #f2f2f2;
	width: 100%;
	height: 100vh;
	// min-width: 1200px;
	// min-width: 1200px;
	position: relative;
	overflow-y: auto;

	.mettingStatus {
		// position: absolute;
		// top: 25px;
		width: 100%;
		// margin-bottom: 30px;
		display: flex;
		align-items: center;
		padding: 0 30px;
		justify-content: space-around;
		background-color: #fff;
		height: 100px;
		overflow: hidden;

		.Issues {
			width: 40%;
			display: flex;
			align-items: center;
			justify-content: space-between;

			p {
				font-size: 16px;
			}
		}
	}

	.el-select {
		width: 80%;
	}

	.content {
		width: 100%;
		height: 1000px;
		min-height: 900px;
		// max-height: 2000px;
		overflow: scroll;
		background-color: #fff;
		margin-top: 40px;
		padding-bottom: 60px;
		// position: absolute;
		// top: 100;

		.title {
			// position: absolute;
			margin-top: 20px;
			margin-left: 20px;
			font-size: 14px;
			font-weight: 600;
		}

		.meetMessage {
			width: 100%;
			display: flex;
			align-items: center;
			justify-content: space-around;
			// position: absolute;
			margin-top: 60px;

			p {
				font-size: 14px;
			}
		}

		.resident {
			// display: block;
			width: 90%;
			margin: 0 auto;
			// height: 500px;
			margin: 100px 0 0 20px;

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
			// position: absolute;
			// top: 460px;
			// // top: 120px;
			// left: 20px;
			margin: 50px 0 0 20px;
			width: 80%;
			// height: 1000px;
			// min-height: 900px;
			// overflow-y: scroll;
			// padding-bottom: 220px;

			.summary {
				margin-bottom: 30px;
			}

			.box-card {
				margin-bottom: 200px;
			}

			.item {
				padding-top: 20px;
				height: auto;
				border: 1px solid #f2f2f2;
				margin-bottom: 20px;

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
						flex-wrap: wrap;
						align-items: center;
						justify-content: space-around;

						p {
							font-size: 14px;
							font-weight: 600;
						}

						.ing {
							width: auto;
							height: 35px;
							line-height: 12px;
							text-align: center !important;
						}
					}
				}

				ul {
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
		}
	}
}
</style>
