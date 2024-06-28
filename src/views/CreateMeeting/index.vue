<template>
	<div class="edit-continer">
		<div class="content">
			<el-steps :active="progressTab" finish-status="success" simple style="margin: 40px 0">
				<el-step title="基本信息"></el-step>
				<el-step title="常驻人员"></el-step>
				<el-step title="会议议题"></el-step>
			</el-steps>

			<!-- 基本信息 -->
			<el-form
				v-show="progressTab === 0"
				ref="formParams"
				:model="formParams"
				:rules="rules"
				label-width="100px"
				style="margin-top: 10px; width: 50%"
			>
				<el-form-item label="会议名称" prop="name">
					<el-input v-model="formParams.name" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="会议类型" prop="type">
					<el-select v-model="formParams.type" clearable placeholder="请选择">
						<el-option
							v-for="item in meetingOptions"
							:key="item.dictValue"
							:label="item.dictLabel"
							:value="item.dictValue"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会议主持" prop="compere">
					<el-select v-model="formParams.compere" placeholder="请选择" filterable>
						<el-option
							v-for="item in memberOptions"
							:key="item.userId"
							:label="item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')"
							:value="item.userId"
						>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会议日期" prop="date">
					<el-date-picker
						v-model="formParams.date"
						align="right"
						type="date"
						placeholder="选择日期"
						value-format="yyyy-MM-dd"
					>
					</el-date-picker>
				</el-form-item>
				<el-form-item label="会议时间" prop="time">
					<el-time-picker
						is-range
						v-model="formParams.time"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						placeholder="选择时间范围"
						value-format="HH:mm"
						format="HH:mm"
					>
					</el-time-picker>
				</el-form-item>
				<!-- <el-form-item label="论述摘编材料">
					<zs-image-upload
						accept="application/pdf"
						:maxKb="1024000"
						:maxFile="1"
						intro="请上传PDF格式文件"
						:fileLists="formParams.extFile"
						:isFile="true"
						:showList="true"
						:ajaxProp="{ mi: formParams.psw }"
						@updateFileList="
							(res) => {
								uploadSuccessful(formParams, res);
							}
						"
					></zs-image-upload>
					@beforeUpload="handleBeforeUpload"
				</el-form-item> -->
				<el-form-item label="管理密码" prop="psw">
					<el-input
						v-model="formParams.psw"
						placeholder="请输出6位数字密码"
						autocomplete="off"
						onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
						@mousewheel.native.prevent
						:maxlength="6"
					></el-input>
				</el-form-item>
				<el-form-item label="会议地点" prop="place">
					<el-input v-model="formParams.place" maxlength="50"></el-input>
				</el-form-item>
				<el-form-item label="会议简介" prop="content">
					<el-input type="textarea" v-model="formParams.content" maxlength="200" rows="5"></el-input>
				</el-form-item>
			</el-form>

			<!-- 常驻人员设置 -->
			<div v-show="progressTab === 1">
				<el-card class="box-card">
					<div>
						<el-form label-position="left" label-width="100px" :model="formParams" style="margin-top: 10px; width: 80%">
							<el-form-item label="常驻出席领导">
								<el-select
									v-model="formParams.join"
									class="beforeBtn"
									multiple
									placeholder="请选择"
									filterable
									clearable
									v-if="showPersonList"
								>
									<el-option
										v-for="(item, index) in memberOptions"
										:key="index"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
										:disabled="
											filterPerson(formParams.attend, item.userId) || filterPerson(formParams.attend_leave, item.userId)
										"
									>
									</el-option>
								</el-select>
								<el-button size="mini" @click="openSelectModal(3, formParams)" style="margin-left: 20px"
									>添加人员</el-button
								>
							</el-form-item>

							<!-- 常驻出席列表 -->
							<el-table :data="formParams.join" border style="width: 100%; margin-bottom: 30px">
								<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
								<el-table-column align="center" prop="person" label="出席领导">
									<template slot-scope="scope">
										{{ getNameById(scope.row) }}
									</template>
								</el-table-column>

								<el-table-column align="center" label="操作">
									<template slot-scope="scope">
										<el-button
											v-if="scope.$index != 0"
											@click="movePersonUp(formParams.join, scope.$index)"
											type="text"
											size="small"
											>上移</el-button
										>
										<el-button
											v-if="scope.$index != formParams.join.length - 1"
											@click="movePersonDown(formParams.join, scope.$index)"
											type="text"
											size="small"
											>下移</el-button
										>
									</template>
								</el-table-column>
							</el-table>

							<el-form-item label="请假人员">
								<el-select
									v-model="formParams.join_leave"
									class="beforeBtn"
									multiple
									placeholder="请选择"
									filterable
									clearable
									@change="changeLeave(1)"
									v-if="showPersonList"
								>
									<el-option
										v-for="item in memberOptions"
										:key="`${item.userId}`"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
										:disabled="
											filterPerson(formParams.attend, item.userId) || filterPerson(formParams.attend_leave, item.userId)
										"
									>
									</el-option>
								</el-select>
								<!-- <el-button size="mini" @click="openSelectModal(5, formParams)" style="margin-left: 20px"
									>添加人员</el-button
								> -->
							</el-form-item>
							<el-table :data="formParams.join_leaveList" border style="width: 100%; margin-bottom: 30px">
								<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
								<el-table-column align="center" prop="person" label="请假人员">
									<template slot-scope="scope">
										{{ scope.row.person }}
									</template>
								</el-table-column>

								<el-table-column align="center" label="请假事由">
									<template slot-scope="scope">
										<el-input v-model="scope.row.reason" placeholder=""></el-input>
									</template>
								</el-table-column>

								<el-table-column align="center" label="操作">
									<template slot-scope="scope">
										<el-button
											v-if="scope.$index != 0"
											@click="movePersonUp(formParams.join_leaveList, scope.$index)"
											type="text"
											size="small"
											>上移</el-button
										>
										<el-button
											v-if="scope.$index != formParams.join_leaveList.length - 1"
											@click="movePersonDown(formParams.join_leaveList, scope.$index)"
											type="text"
											size="small"
											>下移</el-button
										>
									</template>
								</el-table-column>
							</el-table>

							<el-form-item label="常驻列席领导">
								<el-select
									v-model="formParams.attend"
									class="beforeBtn"
									multiple
									placeholder="请选择"
									filterable
									clearable
									v-if="showPersonList"
								>
									<el-option
										v-for="item in memberOptions"
										:key="`${item.userId}`"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
										:disabled="
											filterPerson(formParams.join, item.userId) || filterPerson(formParams.join_leaveList, item.userId)
										"
									>
									</el-option>
								</el-select>
								<el-button size="mini" @click="openSelectModal(4, formParams)" style="margin-left: 20px"
									>添加人员</el-button
								>
							</el-form-item>

							<!-- 常驻列席列表 -->
							<el-table :data="formParams.attend" border style="width: 100%; margin-bottom: 30px">
								<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
								<el-table-column align="center" prop="person" label="列席领导">
									<template slot-scope="scope">
										{{ getNameById(scope.row) }}
									</template>
								</el-table-column>

								<el-table-column align="center" label="操作">
									<template slot-scope="scope">
										<el-button
											v-if="scope.$index != 0"
											@click="movePersonUp(formParams.attend, scope.$index)"
											type="text"
											size="small"
											>上移</el-button
										>
										<el-button
											v-if="scope.$index != formParams.attend.length - 1"
											@click="movePersonDown(formParams.attend, scope.$index)"
											type="text"
											size="small"
											>下移</el-button
										>
									</template>
								</el-table-column>
							</el-table>

							<el-form-item label="请假人员">
								<el-select
									v-model="formParams.attend_leave"
									class="beforeBtn"
									multiple
									placeholder="请选择"
									filterable
									clearable
									@change="changeLeave(2)"
									v-if="showPersonList"
								>
									<el-option
										v-for="item in memberOptions"
										:key="`${item.userId}`"
										:label="
											item.dept.deptName + item.office + ' ' + item.nickName + (item.remark ? `(${item.remark})` : '')
										"
										:value="item.userId"
										:disabled="
											filterPerson(formParams.join, item.userId) || filterPerson(formParams.join_leaveList, item.userId)
										"
									>
									</el-option>
								</el-select>
								<!-- <el-button size="mini" @click="openSelectModal(5, formParams)" style="margin-left: 20px"
									>添加人员</el-button
								> -->
							</el-form-item>
							<el-table :data="formParams.attend_leaveList" border style="width: 100%; margin-bottom: 30px">
								<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
								<el-table-column align="center" prop="person" label="请假人员">
									<template slot-scope="scope">
										{{ scope.row.person }}
									</template>
								</el-table-column>

								<el-table-column align="center" label="请假事由">
									<template slot-scope="scope">
										<el-input v-model="scope.row.reason" placeholder=""></el-input>
									</template>
								</el-table-column>

								<el-table-column align="center" label="操作">
									<template slot-scope="scope">
										<el-button
											v-if="scope.$index != 0"
											@click="movePersonUp(formParams.attend_leaveList, scope.$index)"
											type="text"
											size="small"
											>上移</el-button
										>
										<el-button
											v-if="scope.$index != formParams.attend_leaveList.length - 1"
											@click="movePersonDown(formParams.attend_leaveList, scope.$index)"
											type="text"
											size="small"
											>下移</el-button
										>
									</template>
								</el-table-column>
							</el-table>
						</el-form>
					</div>
				</el-card>
			</div>

			<!-- 议题设置 -->
			<div v-show="progressTab === 2">
				<div class="fixIcon" :class="isFixed ? 'fixed' : ''">
					<el-button type="primary" @click="showAddModal = true">添加议题</el-button>
					<el-button type="danger" @click="delTopic">删除议题</el-button>
				</div>

				<el-card class="box-card">
					<el-table
						:data="topicList"
						:default-expand-all="true"
						@selection-change="handleSelectionChange"
						ref="multipleTable"
						style="width: 100%; background: #eee"
						:row-style="{ background: '#f8f8f9' }"
					>
						<el-table-column type="selection" width="55"> </el-table-column>
						<el-table-column type="expand">
							<template slot-scope="props">
								<el-checkbox
									class="summary"
									v-if="props.row.issuesIndex"
									v-model="props.row.extType"
									@change="handleCheckboxChange(props.row)"
								>
									是否设置为重要论述摘编
								</el-checkbox>
								<el-form
									label-position="left"
									label-width="100px"
									:model="topicParams"
									:rules="topicRules"
									style="margin-top: 10px; width: 80%"
								>
									<div v-show="props.row.extType === false || props.row.extType === 'false'">
										<el-form-item label="汇报人" prop="place">
											<el-select
												class="beforeBtn"
												v-model="props.row.mcArr"
												multiple
												placeholder="请选择"
												filterable
												clearable
												v-if="showPersonList"
											>
												<el-option
													v-for="item in memberOptions"
													:key="`${item.userId}d`"
													:label="
														item.dept.deptName +
														item.office +
														' ' +
														item.nickName +
														(item.remark ? `(${item.remark})` : '')
													"
													:value="item.userId"
												>
												</el-option>
											</el-select>
										</el-form-item>
										<!-- 议题汇报人列表 -->
										<el-table :data="props.row.mcArr" border style="width: 100%; margin-bottom: 30px">
											<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
											<el-table-column align="center" prop="person" label="人员">
												<template slot-scope="scope">
													{{ getNameById(scope.row) }}
												</template>
											</el-table-column>

											<el-table-column align="center" label="操作">
												<template slot-scope="scope">
													<el-button
														v-if="scope.$index != 0"
														@click="movePersonUp(props.row.mcArr, scope.$index)"
														type="text"
														size="small"
														>上移</el-button
													>
													<el-button
														v-if="scope.$index != props.row.mcArr.length - 1"
														@click="movePersonDown(props.row.mcArr, scope.$index)"
														type="text"
														size="small"
														>下移</el-button
													>
												</template>
											</el-table-column>
										</el-table>
										<!-- <el-form-item label="出席领导" prop="join">
									<el-select
										v-model="props.row.join"
										class="beforeBtn"
										multiple
										placeholder="请选择"
										filterable
										clearable
									>
										<el-option
											v-for="item in memberOptions"
											:key="`${item.userId}e`"
											:label="item.dept.deptName + item.office + ' ' + item.nickName"
											:value="item.userId"
											:disabled="filterPerson(props.row.attend, item.userId)"
										>
										</el-option>
									</el-select>
									<el-button size="mini" @click="openSelectModal(1, props.row)" style="margin-left: 20px"
										>添加人员</el-button
									>
								</el-form-item> -->
										<el-form-item label="列席领导" prop="attend">
											<el-select
												v-model="props.row.attend"
												class="beforeBtn"
												clearable
												multiple
												placeholder="请选择"
												filterable
												v-if="showPersonList"
											>
												<el-option
													v-for="item in memberOptions"
													:key="`${item.userId}f`"
													:label="
														item.dept.deptName +
														item.office +
														' ' +
														item.nickName +
														(item.remark ? `(${item.remark})` : '')
													"
													:value="item.userId"
													:disabled="filterPerson(props.row.join, item.userId)"
												>
												</el-option>
											</el-select>
											<el-button size="mini" @click="openSelectModal(2, props.row)" style="margin-left: 20px"
												>添加人员</el-button
											>
										</el-form-item>
										<!-- 议题列席列表 -->
										<el-table :data="props.row.attend" border style="width: 100%; margin-bottom: 30px">
											<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
											<el-table-column align="center" prop="person" label="人员">
												<template slot-scope="scope">
													{{ getNameById(scope.row) }}
												</template>
											</el-table-column>

											<el-table-column align="center" label="操作">
												<template slot-scope="scope">
													<el-button
														v-if="scope.$index != 0"
														@click="movePersonUp(props.row.attend, scope.$index)"
														type="text"
														size="small"
														>上移</el-button
													>
													<el-button
														v-if="scope.$index != props.row.attend.length - 1"
														@click="movePersonDown(props.row.attend, scope.$index)"
														type="text"
														size="small"
														>下移</el-button
													>
												</template>
											</el-table-column>
										</el-table>
										<!-- 议题请假人员 -->
										<el-form-item label="议题请假人员">
											<el-select
												v-model="props.row.leave"
												class="beforeBtn"
												multiple
												placeholder="请选择"
												filterable
												clearable
												@change="changeTopicLeave(props.row)"
												v-if="showPersonList"
											>
												<el-option
													v-for="item in memberOptions"
													:key="`${item.userId}c`"
													:disabled="props.row.mcArr.includes(item.userId) === true"
													:label="
														item.dept.deptName +
														item.office +
														' ' +
														item.nickName +
														(item.remark ? `(${item.remark})` : '')
													"
													:value="item.userId"
												>
												</el-option>
											</el-select>
											<!-- <el-button size="mini" @click="openSelectModal(5, formParams)" style="margin-left: 20px"
										>添加人员</el-button
									> -->
										</el-form-item>
										<el-table :data="props.row.leaveList" border style="width: 100%; margin-bottom: 30px">
											<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
											<el-table-column align="center" prop="person" label="请假人员">
												<template slot-scope="scope">
													{{ scope.row.person }}
												</template>
											</el-table-column>

											<el-table-column align="center" label="请假事由">
												<template slot-scope="scope">
													<el-input v-model="scope.row.reason" placeholder=""></el-input>
												</template>
											</el-table-column>

											<el-table-column align="center" label="操作">
												<template slot-scope="scope">
													<el-button
														v-if="scope.$index != 0"
														@click="movePersonUp(props.row.leaveList, scope.$index)"
														type="text"
														size="small"
														>上移</el-button
													>
													<el-button
														v-if="scope.$index != props.row.leaveList.length - 1"
														@click="movePersonDown(props.row.leaveList, scope.$index)"
														type="text"
														size="small"
														>下移</el-button
													>
												</template>
											</el-table-column>
										</el-table>
									</div>
									<zs-image-upload
										:maxKb="102400"
										accept="application/pdf,.ofd,application/ofd"
										:maxFile="100"
										intro="请上传PDF.OFD格式文件,最大不超过100M"
										:fileLists="props.row.meetingResourceList"
										:isFile="true"
										:showList="true"
										:ajaxProp="{ mi: formParams.psw }"
										@updateFileList="
											(res) => {
												uploadSuccess(props.row, res);
											}
										"
									></zs-image-upload>
								</el-form>
								<!-- 材料密级 -->
								<el-table :data="props.row.meetingResourceList" border style="width: 100%; margin-bottom: 30px">
									<el-table-column align="center" type="index" label="序号" width="180"></el-table-column>
									<el-table-column align="center" prop="name" label="会议材料"></el-table-column>
									<el-table-column align="center" prop="secret_level" label="密级标识">
										<template slot-scope="scope">
											<el-select v-model="scope.row.classification" placeholder="请选择" clearable>
												<el-option v-for="item in secret_level" :key="item.id" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</template>
									</el-table-column>

									<el-table-column align="center" prop="secret_time" label="保密期限">
										<template slot-scope="scope">
											<el-select v-model="scope.row.term" placeholder="请选择" clearable>
												<el-option v-for="item in secret_time" :key="item.id" :label="item.label" :value="item.value">
												</el-option>
											</el-select>
										</template>
									</el-table-column>

									<el-table-column align="center" prop="secret_time" label="排序">
										<template slot-scope="scope">
											<el-input
												v-model="scope.row.sort"
												placeholder="请输入排序数字"
												onkeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode)))"
												clearable
											></el-input>
										</template>
									</el-table-column>
								</el-table>
								<!-- {{props.row.childTopicList}} -->
								<!-- <div v-for="(child, index) in props.row.childTopicList" :key="index">
									<el-form label-position="left" label-width="100px" style="margin-top: 10px; width: 80%">
										<el-form-item :label="`子议题${index + 1}名称`">
											<el-input v-model="child.topicContent" class="beforeBtn" />
											<el-button size="mini" @click="addMc(child)" style="margin-left: 20px">添加汇报人</el-button>
											<el-button
												size="mini"
												type="danger"
												@click="delChild(props.row.childTopicList, index)"
												style="margin-left: 10px"
												>删除
											</el-button>
										</el-form-item>
										<el-form-item label="关联列席领导">
											<el-select
												v-model="child.attend"
												class="beforeBtn"
												multiple
												placeholder="请选择"
												filterable
												clearable
											>
												<el-option
													v-for="item in memberOptions"
													:key="`${item.userId}h`"
													:label="
														item.dept.deptName +
														item.office +
														' ' +
														item.nickName +
														(item.remark ? `(${item.remark})` : '')
													"
													:value="item.userId"
													v-show="props.row.attend.includes(item.userId) === true"
												>
												</el-option>
											</el-select>
										</el-form-item>
										<el-form-item label="关联请假">
											<el-select
												v-model="child.leave"
												class="beforeBtn"
												multiple
												placeholder="请选择"
												filterable
												clearable
											>
												<el-option
													v-for="item in memberOptions"
													:key="`${item.userId}i`"
													:label="
														item.dept.deptName +
														item.office +
														' ' +
														item.nickName +
														(item.remark ? `(${item.remark})` : '')
													"
													:value="item.userId"
													v-show="props.row.leave.includes(item.userId) === true"
												>
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
															item.dept.deptName +
															item.office +
															' ' +
															item.nickName +
															(item.remark ? `(${item.remark})` : '')
														"
														:value="item.userId"
														v-show="props.row.mcArr.includes(item.userId) === true"
													>
													</el-option>
												</el-select>
												<el-button size="mini" type="danger" @click="delMc(child.mc, index)" style="margin-left: 10px"
													>删除
												</el-button>
											</el-form-item>

											<el-form-item :label="`关联材料${idx + 1}`">
												<el-select
													v-model="m.file"
													class="beforeBtn"
													multiple
													placeholder="请选择"
													filterable
													clearable
												>
													<el-option
														v-for="(item, num) in props.row.meetingResourceList"
														:key="num"
														:label="item.name"
														:value="item.urlPath"
													>
													</el-option>
												</el-select>
											</el-form-item>
										</div>
									</el-form>
								</div> -->
							</template>
						</el-table-column>
						<el-table-column label="议题" prop="extType">
							<template slot-scope="scope">
								<span v-show="topicList[0].extType === true"
									>{{ scope.row.extType === true ? "重要论述摘编" : `议题${scope.$index}` }} :{{
										scope.row.topicContent
									}}</span
								>
								<span v-show="topicList[0].extType === false">{{
									`议题${scope.$index + 1}:${scope.row.topicContent}`
								}}</span>
							</template>
						</el-table-column>
						<el-table-column label="" width="400" align="right">
							<template slot-scope="scope">
								<!-- <el-button @click="addChild(scope.row)" type="text" size="small">添加子议题</el-button> -->
								<el-button @click="changeTopicName(scope.row)" type="text" size="small">修改议题名称</el-button>
								<el-button @click="handleCopy(scope.row)" type="text" size="small">复制议题</el-button>
								<el-button @click="handleDelete(scope.$index)" type="text" size="small">删除</el-button>
								<el-button v-if="scope.$index != 0" @click="moveUp(scope.row, scope.$index)" type="text" size="small"
									>上移</el-button
								>
								<el-button
									v-if="scope.$index != topicList.length - 1"
									@click="moveDown(scope.row, scope.$index)"
									type="text"
									size="small"
									>下移</el-button
								>
							</template>
						</el-table-column>
					</el-table>
				</el-card>
			</div>
			<ZsBotButton>
				<!-- <el-button type="primary" v-if="progressTab === 1" @click="saveData">保存</el-button> -->
				<el-button type="primary" v-if="progressTab === 2" @click="submit">提交</el-button>
				<el-button type="success" v-if="progressTab != 0" @click="progressTab -= 1">上一步</el-button>
				<el-button type="success" v-if="progressTab != 2" @click="nextStep">下一步</el-button>
				<el-button @click="cancel">返回</el-button>
			</ZsBotButton>
		</div>

		<!-- 添加议题 -->
		<el-dialog title="添加议题" :visible.sync="showAddModal" width="30%">
			<el-input v-model="newTopicName" maxlength="50"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showAddModal = false">取 消</el-button>
				<el-button type="primary" @click="addTopic">确 定</el-button>
			</span>
		</el-dialog>
		<!-- 添加议题 -->
		<el-dialog title="添加议题" :visible.sync="showUpdateModal" width="30%">
			<el-input v-model="updateTopicName" maxlength="50"></el-input>
			<span slot="footer" class="dialog-footer">
				<el-button @click="showUpdateModal = false">取 消</el-button>
				<el-button type="primary" @click="updateTopic">确 定</el-button>
			</span>
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
								:listData="listData"
								:listLoading="listLoading"
								:columns="columns"
								:searchParams="searchParams"
								:pageNo="queryParams.pageNo"
								:pageSize="queryParams.pageSize"
								:totalCount="total"
								:showBatch="true"
								@selectionRow="getSelected"
								@query="handleQuery"
								@reset="handleReset"
								ref="selectTable"
							>
								<template v-slot:frameFlag="{ scope }">
									<dict-tag :options="dict.type.frame_flag" :value="scope.frameFlag" />
								</template>
								<template v-slot:roleName="{ scope }">
									<dict-tag :options="dict.type.meeting_role" :value="scope.personRole" />
									<dict-tag :options="dict.type.meeting_role" :value="scope.personRole" />
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
	</div>
</template>
<script>
import ZsBotButton from "@/components/Zs_bottomButton";
import ZsImageUpload from "@/components/Zs_form/Zs_imageUpload";
import { getDicts } from "@/service/dict/data";
import { listUser } from "@/service/user";
import { addMeeting, detailMeeting, updateMeeting } from "@/service/meeting";
import { treeselect } from "@/service/dept";
import TablePage from "@/components/Zs_table";

export default {
	components: {
		ZsBotButton,
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
				join: [],
				join_leave: [],
				join_leaveList: [],
				attend_leave: [],
				attend_leaveList: [],
				extType: false,
				extFile: [],
				extFileName: "",
				extFileUrl: ""
			},
			// 创建一个临时的会议数据对象，用于保存选择的内容
			tempMeetingData: {
				name: "",
				type: "",
				compere: "",
				date: "",
				time: "",
				place: "",
				content: "",
				psw: "",
				attend: [],
				join: [],
				leave: [],
				leaveList: []
			},
			isCreate: undefined,
			topicParams: {},
			progressTab: 0,
			showAddModal: false,
			showSelectModal: false,
			memberOptions: [],
			defaultProps: {
				children: "children",
				label: "label"
			},
			deptOptions: [],
			listData: [],
			meetingOptions: [],
			multipleSelection: [],
			// 部门名称
			deptName: undefined,
			checkIds: [],
			selectType: 0, // 选择填充的人员类型
			selectTopic: undefined, // 选择填充的议题
			selected: [],
			topicList: [],
			showUpdateModal: false,
			newTopicName: "",
			updateTopicName: "",
			rules: {
				name: [{ required: true, message: "会议名称不能为空", trigger: "blur" }],
				type: [{ required: true, message: "会议类型不能为空", trigger: "blur" }],
				compere: [{ required: true, message: "会议主持不能为空", trigger: "change" }],
				date: [{ required: true, message: "会议日期不能为空", trigger: "blur" }],
				time: [{ required: true, message: "会议时间不能为空", trigger: "change" }],
				place: [{ required: true, message: "会议地点不能为空", trigger: "blur" }],
				psw: [
					{ required: true, message: "管理密码不能为空", trigger: "blur" },
					{ min: 6, max: 6, message: "密码长度是6位", trigger: "blur" },
					{ validator: this.validatePassword, trigger: "blur" }
				]
			}, // 校验规则
			topicRules: {},
			listLoading: false,
			queryParams: {
				pageNo: 1,
				pageSize: 10,
				deptId: ""
			},
			total: 0,
			selectTab: 0,
			isFixed: false,
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
			secret_level: [
				{
					id: 4,
					value: "XX",
					label: "XX"
				},
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
				}
			],
			secret_time: [
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
			fileCount: 0,
			showPersonList: true,
			issuesIndex: false,
			meetingTopicList: []
		};
	},
	watch: {
		// 根据名称筛选部门树
		deptName(val) {
			this.$refs.tree.filter(val);
		}
	},
	mounted() {
		window.addEventListener("scroll", this.handleScroll);
		console.log(this.$route.params);
		if (this.$route.params.id) {
			console.log("修改");
			this.getDetail();
			this.isCreate = false;
		} else {
			console.log("新增");
			this.isCreate = true;
		}
		this.listMember();
		this.getMeetingDicts();
		this.getTreeselect();
	},
	beforeDestroy() {
		window.removeEventListener("scroll", this.handleScroll);
	},
	methods: {
		handleCheckboxChange(row) {
			console.log(row, "row");
			// 复选框状态变化时更新 extType
			// this.formParams.extType = row.extType ? "1" : "0";
			// row.extType = row.extType === "1" ? "0" : "1";
			console.log(row.extType, "newValuerow.extTyperow.extType");
		},
		// 监听滚动事件
		handleScroll(event) {
			// 在这里处理滚动事件
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
			if (scrollTop > 300 && this.progressTab === 2) {
				this.isFixed = true;
			} else {
				this.isFixed = false;
			}
		},
		// 动态更新请假名单列表
		changeLeave(type) {
			let leaveList = [];
			switch (type) {
				case 1:
					leaveList = this.formParams.join_leave.map((x) => {
						let obj = {};
						for (const i of this.memberOptions) {
							if (i.userId === x) {
								obj = {
									id: i.userId,
									person: `${i.dept.deptName}  ${i.office} ${i.nickName}`,
									reason: ""
								};
								for (const j of this.formParams.join_leaveList) {
									if (j.id === x) {
										obj.reason = j.reason;
									}
								}
								break;
							}
						}
						return obj;
					});
					this.formParams.join_leaveList = leaveList;
					break;
				case 2:
					leaveList = this.formParams.attend_leave.map((x) => {
						let obj = {};
						for (const i of this.memberOptions) {
							if (i.userId === x) {
								obj = {
									id: i.userId,
									person: `${i.dept.deptName}  ${i.office} ${i.nickName}`,
									reason: ""
								};
								for (const j of this.formParams.attend_leaveList) {
									if (j.id === x) {
										obj.reason = j.reason;
									}
								}
								break;
							}
						}
						return obj;
					});
					this.formParams.attend_leaveList = leaveList;
					break;
				default:
					break;
			}
		},
		// 动态更新议题请假名单列表
		changeTopicLeave(row) {
			const leaveList = row.leave.map((x) => {
				let obj = {};
				for (const i of this.memberOptions) {
					if (i.userId === x) {
						obj = {
							id: i.userId,
							person: `${i.dept.deptName}${i.office} ${i.nickName}`,
							reason: ""
						};
						for (const j of row.leaveList) {
							if (j.id === x) {
								obj.reason = j.reason;
							}
						}
						break;
					}
				}
				return obj;
			});
			row.leaveList = leaveList;
		},
		// 校验密码
		validatePassword(rule, value, callback) {
			if (!/^\d+$/.test(value)) {
				callback(new Error("密码必须是数字"));
			} else {
				callback();
			}
		},
		nextStep() {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid) {
					this.isFixed = false;
					this.progressTab += 1;
				} else {
					this.$message.error("表单信息不完整，请检查");
					return false;
				}
			});
		},
		handleCopy(row) {
			console.log(row, "handleCopyhandleCopy");
			const newTopic = JSON.parse(JSON.stringify(row));
			// 删除issuesIndex摘编属性
			delete newTopic.issuesIndex;
			newTopic.topicContent = `${newTopic.topicContent}-副本`;
			this.topicList.push(newTopic);
			this.$message.success("复制议题成功");
		},
		handleDelete(i) {
			// this.topicList.forEach((x, i) => {
			// 	if (x.topicContent === row.topicContent) {
			// 		this.topicList.splice(i, 1);
			// 	}
			// });
			console.log(i);
			this.topicList.splice(i, 1);
			this.$message.success("删除议题成功");
		},
		moveUp(row, i) {
			const valueHolder = JSON.parse(JSON.stringify(row));
			this.$set(this.topicList, i, JSON.parse(JSON.stringify(this.topicList[i - 1])));
			this.$set(this.topicList, i - 1, valueHolder);
			console.log(this.topicList);
		},
		moveDown(row, i) {
			const valueHolder = JSON.parse(JSON.stringify(row));
			this.$set(this.topicList, i, JSON.parse(JSON.stringify(this.topicList[i + 1])));
			this.$set(this.topicList, i + 1, valueHolder);
			console.log(this.topicList);
		},
		movePersonUp(list, i) {
			this.$nextTick(() => {
				const valueHolder = JSON.parse(JSON.stringify(list[i]));
				this.$set(list, i, JSON.parse(JSON.stringify(list[i - 1])));
				this.$set(list, i - 1, valueHolder);
				console.log(list);
				this.showPersonList = false;
				setTimeout(() => {
					this.showPersonList = true;
				});
			});
		},
		movePersonDown(list, i) {
			this.$nextTick(() => {
				const valueHolder = JSON.parse(JSON.stringify(list[i]));
				this.$set(list, i, JSON.parse(JSON.stringify(list[i + 1])));
				this.$set(list, i + 1, valueHolder);
				console.log(list);
				this.showPersonList = false;
				setTimeout(() => {
					this.showPersonList = true;
				});
			});
		},
		getNameById(id) {
			let obj = "";
			for (const i of this.memberOptions) {
				if (i.userId === id) {
					obj = `${i.dept.deptName}${i.office} ${i.nickName}`;
					break;
				}
			}
			return obj;
		},
		// tab点击
		tabClick() {},

		/** 重置按钮操作 */
		handleReset() {
			this.queryParams.deptId = "";
		},

		/** 搜索按钮操作 */
		handleQuery(params) {
			console.log(params);
			// 组件触发则修改传参 页面内触发直接调用
			if (params) {
				this.queryParams = {
					deptId: this.queryParams.deptId,
					...params.searchFormData
				};
			}
			this.getPageList();
		},
		handleSelectionChange(val) {
			this.multipleSelection = val;
			console.log(this.multipleSelection);
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
				userType: "01",
				nickName: this.queryParams.name
			};
			const res = await listUser(params);
			if (res.code === 200) {
				this.listData = res.data.list;
				this.total = res.data.totalCount;
			} else {
				this.$message.error(res.msg);
			}
			this.listLoading = false;
		},
		/** 查询部门下拉树结构 */
		getTreeselect() {
			treeselect().then((response) => {
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
			this.queryParams.pageNo = 1;
			this.handleQuery();
		},
		openSelectModal(sign, row) {
			this.getPageList();
			this.showSelectModal = true;
			this.selectType = sign;
			this.selectTopic = row;
			console.log(this.selectTopic);
		},
		getSelected(val) {
			this.selected = val;
			console.log(this.selected);
		},
		// 对照去重
		filterPerson(arr, id) {
			if (arr.includes(id) === true) {
				return true;
			} else {
				return false;
			}
		},
		// 填充过滤
		fillSelected() {
			console.log(this.selected);
			let throwErr = false;
			switch (this.selectType) {
				case 1:
					if (!this.selectTopic.join) {
						this.selectTopic.join = [];
					}
					this.selected.forEach((x) => {
						if (this.selectTopic.join.indexOf(x.userId) === -1) {
							if (this.selectTopic.attend.indexOf(x.userId) !== -1) {
								throwErr = true;
							} else {
								this.selectTopic.join.push(x.userId);
							}
						}
					});
					break;
				case 2:
					if (!this.selectTopic.attend) {
						this.selectTopic.attend = [];
					}
					this.selected.forEach((x) => {
						if (this.selectTopic.attend.indexOf(x.userId) === -1) {
							if (this.selectTopic.join.indexOf(x.userId) !== -1) {
								throwErr = true;
							} else {
								this.selectTopic.attend.push(x.userId);
							}
						}
					});
					break;
				case 3:
					if (!this.selectTopic.join) {
						this.selectTopic.join = [];
					}
					this.selected.forEach((x) => {
						if (this.selectTopic.join.indexOf(x.userId) === -1) {
							if (this.selectTopic.attend.indexOf(x.userId) !== -1) {
								throwErr = true;
							} else {
								this.selectTopic.join.push(x.userId);
							}
						}
					});
					break;
				case 4:
					if (!this.selectTopic.attend) {
						this.selectTopic.attend = [];
					}
					this.selected.forEach((x) => {
						if (this.selectTopic.attend.indexOf(x.userId) === -1) {
							if (this.selectTopic.join.indexOf(x.userId) !== -1) {
								throwErr = true;
							} else {
								this.selectTopic.attend.push(x.userId);
							}
						}
					});
					break;
				case 5:
					if (!this.selectTopic.leave) {
						this.selectTopic.leave = [];
					}
					this.selected.forEach((x) => {
						if (this.selectTopic.leave.indexOf(x.userId) === -1) {
							this.selectTopic.leave.push(x.userId);
						}
					});
					break;
				default:
					break;
			}
			if (throwErr) {
				this.$message.info("已为您过滤重复用户");
			}
			this.clearTableSelect();
			this.showSelectModal = false;
		},
		clearTableSelect() {
			this.selected = [];
			this.$refs.selectTable.resetSelection();
		},
		changeTopicName(row) {
			this.showUpdateModal = true;
			this.updateTopicName = row.topicContent;
			this.selectTopic = row;
		},
		addTopic() {
			for (const i of this.topicList) {
				if (i.topicContent === this.newTopicName) {
					this.$message.error("议题重复，请修改后重试");
					return;
				}
			}
			this.topicList.push({
				topicContent: this.newTopicName,
				meetingResourceList: [],
				join: [],
				attend: [],
				mcArr: [],
				meetingPersonList: [],
				leave: [],
				leaveList: [],
				childTopicList: [],
				extType: false,
				extFile: [],
				extFileName: "",
				extFileUrl: ""
			});
			this.topicList[0].issuesIndex = true;
			this.showAddModal = false;
			this.newTopicName = "";
		},
		updateTopic(idx) {
			for (const i of this.topicList) {
				if (i.topicContent === this.updateTopicName && idx !== i) {
					this.$message.error("议题重复，请修改后重试");
					return;
				}
			}
			this.selectTopic.topicContent = this.updateTopicName;
			this.showUpdateModal = false;
			this.updateTopicName = "";
		},
		// 添加子议题
		// addChild(topic) {
		// 	console.log(topic, "topic");
		// 	if (!topic.childTopicList) {
		// 		this.$set(topic, "childTopicList", []);
		// 	}
		// 	console.log(topic);
		// 	topic.childTopicList.push({
		// 		topicContent: `子议题${topic.childTopicList.length + 1}`,
		// 		mc: []
		// 	});
		// 	console.log(topic);
		// 	this.$message.success("添加子议题成功");
		// },
		// 子议题添加汇报人
		// addMc(topic) {
		// 	if (!topic.mc) {
		// 		this.$set(topic, "mc", []);
		// 	}
		// 	topic.mc.push({
		// 		id: [],
		// 		file: []
		// 	});

		// 	this.$message.success("添加汇报人成功");
		// },
		// 删除子议题
		// delChild(obj, idx) {
		// 	obj.splice(idx, 1);
		// },
		// 删除汇报人
		// delMc(obj, idx) {
		// 	obj.splice(idx, 1);
		// },
		delTopic() {
			// const names = this.multipleSelection.map((x) => x.name);
			// console.log(names);
			// for (let i = 0; i < this.topicList.length; i += 1) {
			// 	console.log(this.topicList[i].topicContent);

			// 	if (names.indexOf(this.topicList[i].topicContent) !== -1) {
			// 		this.topicList.splice(i, 1);
			// 		i -= 1;
			// 	}
			// }
			// console.log(this.topicList);
			// 首先，检查是否至少选择了一个议题
			if (this.multipleSelection.length === 0) {
				this.$message.warning("请至少选择一个议题");
				return;
			}
			// 获取选中议题的 topicContent，这是用于识别议题的唯一标识
			const selectedTopicContents = this.multipleSelection.map((row) => row.topicContent);

			// 使用 filter 函数来过滤出未被选中的议题
			this.topicList = this.topicList.filter((topic) => !selectedTopicContents.includes(topic.topicContent));

			// 清空多选框的选择
			this.multipleSelection = [];

			this.$message.success("删除议题成功");
		},
		uploadSuccess(obj, res) {
			// console.log(obj, res, "11111111111111111");
			// res.forEach((x) => {
			// 	x.urlPath = x.url || x.rurl;
			// });
			// obj.meetingResourceList = [];
			obj.meetingResourceList = res;
			console.log(obj);
		},
		// handleBeforeUpload(file) {
		// 	console.log(file, "filefilefile");
		// 	// 在这里编写上传前的逻辑
		// 	if (this.formParams.extFile.length >= this.maxFile) {
		// 		// 如果文件数量超过限制，阻止上传并显示提示
		// 		this.$message.info("只能上传一个文件");
		// 		return false; // 阻止上传
		// 	}
		// 	return true; // 允许上传
		// },
		uploadSuccessful(obj, res) {
			obj.extFile = res;
			if (obj.extFile.length > 0) {
				obj.extFile.forEach((ele, index) => {
					console.log(ele, "urlPathurlPathurlPath");
					this.formParams.extFileName = ele.name;
					this.formParams.extFileUrl = ele.urlPath;
				});
			} else {
				this.formParams.extFileName = "";
				this.formParams.extFileUrl = "";
			}
			this.fileCount += this.fileCount + 1;
			if (this.fileCount > 1) {
				this.$message.info("只能上传一个文件");
			}
			console.log(obj.extFile, "extFileextFileextFile");
		},
		// 保存
		saveData() {
			// 获取当前的会议数据
			const currentMeetingData = {
				name: this.formParams.name,
				type: this.formParams.type,
				compere: this.formParams.compere,
				date: this.formParams.date,
				time: this.formParams.time,
				place: this.formParams.place,
				content: this.formParams.content,
				psw: this.formParams.psw,
				attend: this.formParams.attend.slice(), // 使用 slice 复制数组
				join: this.formParams.join.slice(),
				leave: this.formParams.leave.slice(),
				leaveList: this.formParams.leaveList.slice()
				// 其他会议相关的属性
			};

			// 将当前的会议数据保存到 tempMeetingData
			this.tempMeetingData = currentMeetingData;

			// 提示用户保存成功
			this.$message.success("会议内容已保存");
		},
		// 提交
		async submit() {
			this.$refs["formParams"].validate(async (valid) => {
				if (valid) {
					if (this.topicList.length === 0) {
						this.$message.warning("请至少添加一个议题");
						return;
					}
					console.log(this.topicList, "eeeeeeeeeeeeeeee");
					// const extTypeValue = this.formParams.extType ? "1" : "0";
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
						meetingTopicList: this.topicList.map((topic) => ({
							...topic,
							extType: topic.extType === true ? "1" : "0"
						})),
						// meetingTopicList: this.topicList,
						joinPerson: this.formParams.join.join(","), // 参会领导
						attendPerson: this.formParams.attend.join(","), // 列席人员
						// join_leavePerson: JSON.stringify(this.formParams.join_leaveList), // 常驻参会请假人员 todo
						// attend_leavePerson: JSON.stringify(this.formParams.attend_leaveList) // 常驻列席请假人员 todo
						leavePerson: JSON.stringify({
							join_leaveList: this.formParams.join_leaveList,
							attend_leaveList: this.formParams.attend_leaveList
						}), // 请假人员
						extFile: this.formParams.extFile,
						extFileName: this.formParams.extFileName ? this.formParams.extFileName : "",
						extFileUrl: this.formParams.extFileUrl ? this.formParams.extFileUrl : ""
					};

					// 遍历议题 修改参会人员数据结构
					params.meetingTopicList.forEach((x) => {
						x["grade"] = 0;
						x["identifying"] = "0";
						x.mc = x.mcArr.join(",");
						x.meetingPersonList = [];
						console.log(x, "image.pngimage.png");
						// 将常驻人员组装塞入议题下参会领导字段
						x.join = this.formParams.join.concat(this.formParams.attend);
						console.log(x.join, "personTypepersonTypepersonType");
						// 对照,会议下参会人员类型及是否请假
						x.join.forEach((i, idx) => {
							const obj = {
								userId: i,
								personType: 1,
								leave: 0,
								sort: idx
							};
							for (const j of this.formParams.join_leaveList) {
								if (j.id === i) {
									obj.leaveNote = j.reason;
									obj.leave = 1;
								}
							}
							for (const j of this.formParams.attend_leaveList) {
								if (j.id === i) {
									obj.leaveNote = j.reason;
									obj.leave = 1;
								}
							}
							x.meetingPersonList.push(obj);
						});
						// meetingPersonList type 1:参会领导(常驻出席，常驻列席);2:议题列席领导;3:其他、汇报人;4:议题请假;5:常驻出席请假；6：常驻列席请假
						// 插入常驻请假人员
						this.formParams.join_leaveList.forEach((join, joinIdx) => {
							const obj = {
								userId: join.id,
								personType: 5, // 出席
								leave: 1,
								leaveNote: join.reason,
								sort: joinIdx
							};
							x.meetingPersonList.push(obj);
						});
						this.topicList.forEach((topic, i) => {
							console.log(topic, "personTypepersonType");
						});
						this.formParams.attend_leaveList.forEach((attend, attendIdx) => {
							const obj = {
								userId: attend.id,
								personType: 6, // 列席
								leave: 1,
								leaveNote: attend.reason,
								sort: attendIdx
							};
							x.meetingPersonList.push(obj);
						});
						// 向参会人员列表写入议题汇报人
						x.mcArr.forEach((i, n) => {
							const obj = {
								userId: i,
								personType: 3,
								leave: 0,
								sort: n
							};
							x.meetingPersonList.push(obj);
						});
						// 对照,议题下列席人员类型及是否请假 1：请假；0：正常参会
						x.attend.forEach((i, n) => {
							const obj = {
								userId: i,
								personType: 2,
								leave: 0,
								sort: n
							};
							for (const j of x.leaveList) {
								if (j.id === i) {
									obj.leaveNote = j.reason;
									obj.leave = 1;
								}
							}
							x.meetingPersonList.push(obj);
						});
						// 推入议题请假人员
						x.leaveList.forEach((i, n) => {
							const obj = {
								userId: i.id,
								personType: 4,
								leave: 1,
								leaveNote: i.reason,
								sort: n
							};
							x.meetingPersonList.push(obj);
						});

						// 添加文件序号
						x.meetingResourceList.forEach((file, idx) => {
							if (!file.sort) {
								file.sort = idx;
							} else {
								file.sort *= 1;
							}
						});

						// 修改子议题结构
						for (const j of x.childTopicList) {
							const topicMcList = [];
							j.mc.forEach((mc, i) => {
								if (mc.id.length === 0) {
									if (mc.file.length > 0) {
										for (const m of mc.file) {
											let allFileInfo = {
												childTopicMcId: "",
												urlPath: m,
												resourceGroup: i
											};
											for (const file of x.meetingResourceList) {
												if (file.urlPath === m) {
													allFileInfo = {
														...file,
														...allFileInfo
													};
												}
											}
											topicMcList.push(allFileInfo);
										}
									}
								}
								if (mc.file.length === 0) {
									if (mc.id.length > 0) {
										topicMcList.push({
											childTopicMcId: mc.id.join(","),
											urlPath: "",
											resourceGroup: i
										});
									}
								}
								if (mc.file.length !== 0 && mc.id.length !== 0) {
									for (const m of mc.file) {
										let allFileInfo = {
											childTopicMcId: mc.id.join(","),
											urlPath: m,
											resourceGroup: i
										};
										for (const file of x.meetingResourceList) {
											if (file.urlPath === m) {
												allFileInfo = {
													...file,
													...allFileInfo
												};
											}
										}
										topicMcList.push(allFileInfo);
									}
								}
							});
							j.topiCustomList = j.mc;
							delete j.mc;
							j.meetingResourceList = topicMcList;
							j.parentId = x.topicId;
							j.grade = 1;
							j.childTopicLeaveId = j.leave.join(",");
							j.childTopicAttendId = j.attend.join(",");
						}
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
						this.$router.push("/meetingManage/meetingManage");
					} else {
						this.$message.error(res.msg);
					}
				} else {
					this.$message.error("表单信息不完整，请检查");
					return false;
				}
			});
		},
		// 获取会议字典内容
		getMeetingDicts() {
			getDicts("meeting_type").then((response) => {
				this.meetingOptions = response.data;
				console.log(this.meetingOptions);
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
				status: 0,
				userType: "01"
			};
			const res = await listUser(params);
			if (res.code === 200) {
				this.memberOptions = res.data.list;
				console.log(this.memberOptions);
			} else {
				this.$message.error(res.msg);
			}
		},
		async getDetail() {
			const { id } = this.$route.params;
			const res = await detailMeeting(id);
			if (res.code === 200) {
				const params = res.data;
				params.meetingTopicList = params.meetingTopicList.map((ele) => ({
					...ele,
					issuesIndex: this.issuesIndex
				}));
				this.meetingTopicList = params.meetingTopicList;
				// console.log(this.meetingTopicList, "this.meetingTopicListthis.meetingTopicList");
				params.meetingTopicList[0].issuesIndex = true;
				console.log(params.meetingTopicList, "params.meetingTopicList[0].issuesIndex");

				// const extTypeValue = this.formParams.extType ? "1" : "0";
				const fileList = [];
				if (params.extFileName && params.extFileUrl) {
					fileList.push({
						name: params.extFileName,
						extFileUrl: params.extFileUrl
					});
				}
				this.formParams = {
					name: params.name,
					type: params.meetType,
					compere: params.speaker * 1,
					date: params.meetingDate,
					time: [params.startTime, params.endTime],
					place: params.address,
					content: params.briefIntroduction,
					psw: params.password,
					join: params.joinPerson ? params.joinPerson.split(",").map((x) => x * 1) : [], // 参会
					attend: params.attendPerson ? params.attendPerson.split(",").map((x) => x * 1) : [], // 列席
					join_leave: JSON.parse(params.leavePerson).join_leaveList
						? JSON.parse(params.leavePerson).join_leaveList.map((x) => x.id * 1)
						: [], // 常驻参会请假 todo
					join_leaveList: JSON.parse(params.leavePerson).join_leaveList
						? JSON.parse(params.leavePerson).join_leaveList
						: [], // // 常驻参会请假本地列表 todo
					attend_leave: JSON.parse(params.leavePerson).attend_leaveList
						? JSON.parse(params.leavePerson).attend_leaveList.map((x) => x.id * 1)
						: [], // 列席参会请假 todo
					attend_leaveList: JSON.parse(params.leavePerson).attend_leaveList
						? JSON.parse(params.leavePerson).attend_leaveList
						: [], // // 列席参会请假本地列表
					extFile: fileList,
					extFileName: params.extFileName ? params.extFileName : "",
					extFileUrl: params.extFileUrl ? params.extFileUrl : ""
				};
				// console.log(this.formParams.extType, "extTypeextTypeextType");
				const topicParams = params.meetingTopicList;

				console.log(topicParams, "topicListtopicListtopicList");

				// 数据清洗以适应系统
				this.topicList = topicParams.map((x, index) => {
					// console.log(x, "meetingPersonAttendList");
					// x.extType = x.extType === "1";
					console.log(x, "meetingPersonAttendList");
					const extType = x.extType === "1";
					const issuesIndex = index ? !!this.issuesIndex : !this.issuesIndex;
					console.log(issuesIndex, "issuesIndexissuesIndex");
					const join = [];
					const attend = [];
					if (!x.meetingPersonAttendListLeave) {
						x.meetingPersonAttendListLeave = [];
					}
					const leave = x.meetingPersonAttendListLeave.map((person) => person.userId * 1);
					const leaveList = [];

					let mcArr = x.mc === "" ? [] : x.mc.split(",");
					if (x.meetingPersonAttendList === null) {
						x.meetingPersonAttendList = [];
					}
					for (let resourceIndex = 0; resourceIndex < x.meetingResourceList.length; resourceIndex += 1) {
						if (
							x.meetingResourceList[resourceIndex].urlPath === null ||
							x.meetingResourceList[resourceIndex].urlPath === ""
						) {
							x.meetingResourceList.splice(resourceIndex, 1);
							resourceIndex -= 1;
						}
					}
					for (const i of x.meetingPersonAttendList) {
						// 写入列席人员
						if (i.personType === "2") {
							attend.push(i.userId * 1);
						}
					}
					for (const i of x.meetingPersonAttendListLeave) {
						// 写入请假人员
						if (i.personType === "4") {
							leaveList.push({
								id: i.userId,
								personType: 4,
								leave: 1,
								reason: i.leaveNote,
								person: `${i.personDept}${i.office} ${i.personName}`
							});
						}
					}

					let childTopicList = [];
					const childTopicResult = [];
					if (!x.childTopicList) {
						x.childTopicList = [];
					}
					// 取出子议题数据
					for (const child of x.childTopicList) {
						// 排序 分组
						child.meetingResourceList = child.meetingResourceList.sort(
							(a, b) => (a.resourceGroup || 0) - (b.resourceGroup || 0)
						);
						childTopicList = child.meetingResourceList.reduce((result, item) => {
							const key = item.resourceGroup;
							if (!result[key]) {
								result[key] = [];
							}
							result[key].push(item);
							return result;
						}, {});
						console.log("reduce---------------", childTopicList);
						const obj = {
							topicContent: child.topicContent,
							mc: [],

							leave: child.childTopicLeaveList.map((user) => user.userId * 1),
							attend: child.childTopicAttendList.map((user) => user.userId * 1)
						};
						for (const idx in childTopicList) {
							console.log(childTopicList[idx]);

							let ids = [];
							const files = [];
							for (const mcinfo of childTopicList[idx]) {
								let mcinfoList = [];
								if (mcinfo.childTopicMcId === null || mcinfo.childTopicMcId === "") {
									mcinfoList = [];
								} else {
									mcinfoList = mcinfo.childTopicMcId.split(",");
								}
								ids = ids.concat(mcinfoList.map((mcid) => mcid * 1));
								if (mcinfo.urlPath) {
									files.push(mcinfo.urlPath);
								}
								console.log(ids);
								console.log(files);
							}
							ids = [...new Set(ids)];
							obj.mc.push({
								id: ids,
								file: files
							});
							console.log(obj);
						}
						childTopicResult.push(obj);
						console.log(childTopicResult);
					}
					mcArr = mcArr.map((j) => j * 1);
					return {
						topicContent: x.topicContent,
						meetingResourceList: x.meetingResourceList,
						childTopicList: childTopicResult,
						join,
						attend,
						mcArr,
						leave,
						leaveList,
						meetingPersonList: [],
						extType,
						issuesIndex
					};
				});
				console.log(this.topicList);
				// this.leave = this.formParams.leaveList.map((x) => x.id * 1);
				// console.log(this.leave);
			} else {
				this.$message.error(res.msg);
			}
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
	margin: 0 auto;
	width: 94%;
}

.summary {
	position: absolute;
	right: 0;
	top: 30px;
	font-weight: 600;
	// display: block;
	// text-align: center;
	padding-right: 65px;
}

.el-form-item {
	.el-select {
		display: inline-block !important;
		width: 100%;
	}
}

.beforeBtn {
	width: calc(100% - 195px) !important;
}

.fixIcon {
	margin: 30px 0;
	text-align: right;
}

.fixed {
	position: fixed;
	top: 0px;
	right: 0px;
	z-index: 99;
	width: 100%;
	background: #fff;
	padding: 15px 35px;
	text-align: right;
	opacity: 0.8;
	margin: 0 !important;
	box-shadow: 1px 1px 10px #ccc;
}
</style>
