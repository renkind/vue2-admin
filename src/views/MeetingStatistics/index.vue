// 会议统计页面
<template>
	<div class="statistic">
		<el-card class="box-card">
			<p class="meetingStc">会议统计</p>
			<div class="meetingNum">
				<div style="display: flex;flex-warp: nowarp">
					<p>会议次数</p>
					<p style="text-indent: 1em;">{{ countInfo }}</p>
				</div>
				<div style="display: flex;flex-warp: nowarp">
					<p>议题数</p>
					<p style="text-indent: 1em;">{{ countAllTopic }}</p>
				</div>
			</div>

			<div>
				<el-date-picker v-model="value1" type="datetimerange" range-separator="至" start-placeholder="开始日期"
					end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
					@change="handleDateChange"></el-date-picker>
				<!-- 添加切换按钮 -->
				<div style="display: inline-block;margin-left: 20px">
					<el-button type="primary" @click="changeTimeRange('month')">本月</el-button>
					<el-button type="primary" @click="changeTimeRange('quarter')">本季度</el-button>
					<el-button type="primary" @click="changeTimeRange('year')">本年</el-button>
				</div>
			</div>

			<div id="main" style="width: 900px; height: 500px"></div>
		</el-card>
	</div>
</template>

<script>
import * as echarts from "echarts";
import { listNotice } from "@/service/statistic";
export default {
	data() {
		return {
			value1: [], // 用于存储选择的时间范围
			pickerOptions: {
				selectableRange: "00:00:00 - 23:59:59" // 设置可选的时间范围，精确到秒
			},
			countInfo: null,
			countAllTopic: null,
			deptList: [],
			countList: [],
			chartInstance: null, // 存储图表实例
			timeRange: [] // 存储当前时间范围
		};
	},
	watch: {},
	created() {
	},
	mounted() {
		this.initDateRange(); // 初始化时间范围
		this.getList(); // 获取数据，此时会使用默认时间范围
		this.handleDateChange(); // 手动触发一次接口调用和数据渲染
	},
	methods: {
		// 进入页面初始化数据
		initDateRange() {
			const currentDate = new Date(); // 当前日期
			const oneYearAgo = new Date(currentDate);
			oneYearAgo.setFullYear(currentDate.getFullYear() - 1); // 一年前的日期
			// 格式化日期为字符串
			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");
				const seconds = String(date.getSeconds()).padStart(2, "0");
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			};
			this.value1 = [formatDate(oneYearAgo), formatDate(currentDate)]; // 设置默认时间范围
		},

		async getList() {
			console.log(this.value1);
			// console.log(timeRange, "timeRangetimeRangetimeRange");
			const data = {
				startDate: this.value1[0],
				endDate: this.value1[1]
			};
			// console.log(this.countInfo, "res.data.countInfo");
			try {
				const res = await listNotice(data);
				console.log(res, "resresres");
				this.countInfo = res.data.countInfo;
				this.countAllTopic = res.data.countAllTopic;
				this.deptList = res.data.deptList;
				this.countList = res.data.countList;

				// 更新柱状图数据
				const option = {
					xAxis: {
						name: "汇报单位",
						nameTextStyle: {
							color: "#333",
							fontSize: 16
						},
						axisLabel: {
							// x轴文字的配置
							show: true,
							interval: 0, // 使x轴文字显示全
							rotate: -20
						},
						type: "category",
						data: this.deptList // 使用部门列表作为 x 轴数据
					},
					yAxis: {
						name: "议题数",
						nameTextStyle: {
							color: "#333",
							fontSize: 16
						},
						type: "value"
					},
					series: [
						{
							data: this.countList, // 使用计数列表作为柱状图数据
							type: "bar"
						}
					]
				};

				// 获取柱状图 DOM 元素
				const chartDom = document.getElementById("main");
				const myChart = echarts.init(chartDom);

				// 在初始化新实例之前，先销毁先前的实例
				if (this.chartInstance) {
					this.chartInstance.dispose();
				}

				// 初始化新的图表实例
				this.chartInstance = echarts.init(document.getElementById("main"));
				this.chartInstance.setOption(option);

				// 更新柱状图的 option
				myChart.setOption(option);
				// 其他数据处理逻辑
			} catch (error) {
				// 处理错误
			}
		},

		async handleDateChange() {
			if (this.value1 && this.value1.length === 2) {
				this.getList(); // 时间范围变化时重新获取数据
			}
		},

		async changeTimeRange(type) {
			const currentDate = new Date();
			let startDate,
				endDate;

			if (type === "month") {
				startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
				endDate = currentDate;
			} else if (type === "quarter") {
				const currentQuarter = Math.floor(currentDate.getMonth() / 3);
				startDate = new Date(currentDate.getFullYear(), currentQuarter * 3, 1);
				endDate = currentDate;
			} else if (type === "year") {
				startDate = new Date(currentDate.getFullYear(), 0, 1);
				endDate = currentDate;
			}

			// 格式化日期为字符串
			const formatDate = (date) => {
				const year = date.getFullYear();
				const month = String(date.getMonth() + 1).padStart(2, "0");
				const day = String(date.getDate()).padStart(2, "0");
				const hours = String(date.getHours()).padStart(2, "0");
				const minutes = String(date.getMinutes()).padStart(2, "0");
				const seconds = String(date.getSeconds()).padStart(2, "0");
				return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
			};

			this.value1 = [formatDate(startDate), formatDate(endDate)];
			this.getList();
		}
	}
};
</script>

<style lang="scss" scoped>
.statistic {

	.box-card {
		width: 95%;
		margin: 0 auto;
		margin-top: 30px;

		.meetingStc {
			font-size: 23px;
			font-weight: 600;
			margin-bottom: 50px;
		}

		.meetingStc {}

		.meetingNum {
			display: flex;
			align-items: center;
			justify-content: space-around;
			width: 30%;
			margin-bottom: 50px;

			p {
				font-size: 20px;
			}
		}
	}
}
</style>
