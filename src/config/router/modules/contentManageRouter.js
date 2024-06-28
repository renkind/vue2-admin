// 内容管理路由
import Layout from "@/layout";

const contentManageRouter = [
	{
		path: "/meetingManage",
		name: "MeetingManage",
		component: Layout,
		children: [
			{
				path: "/meetingManage/meetingManage",
				name: "MeetingManage",
				meta: {
					title: "会议列表"
				},
				component: () => import("@/views/MeetingManage")
			},
			{
				path: "/meetingManage/meetingManage/edit/:id?",
				name: "meetingEdit",
				meta: {
					title: "会议编辑",
					activeMenu: "/meetingManage/meetingManage/meetingManage"
				},
				component: () => import("@/views/MeetingManage/edit")
			},
			{
				path: "/meetingManage/meetingManage/detail/:id",
				name: "meetingDetail",
				meta: {
					title: "会议详情",
					activeMenu: "/meetingManage/meetingManage/meetingManage"
				},
				component: () => import("@/views/MeetingManage/detail")
			}
		]
	},
	{
		path: "/meetingListManage",
		name: "MeetingListManage",
		component: Layout,
		children: [
			{
				path: "/meetingListManage/meetingListManage",
				name: "meetingListManage",
				meta: {
					title: "参会人员管理"
				},
				component: () => import("@/views/MeetingListManage")
			},
			{
				path: "/meetingListManage/meetingListManage/edit/:id?",
				name: "meetingEdit",
				meta: {
					title: "参会人员编辑",
					activeMenu: "/meetingListManage/meetingListManage/meetingListManage"
				},
				component: () => import("@/views/MeetingListManage/edit")
			},
			{
				path: "/meetingListManage/meetingListManage/detail/:id",
				name: "meetingDetail",
				meta: {
					title: "参会人员详情",
					activeMenu: "/meetingListManage/meetingListManage/meetingListManage"
				},
				component: () => import("@/views/MeetingListManage/detail")
			}
		]
	},
	{
		path: "/memberManage",
		name: "MemberManage",
		component: Layout,
		children: [
			{
				path: "/memberManage/memberManage",
				name: "MemberManage",
				meta: {
					title: "参会人员管理"
				},
				component: () => import("@/views/MemberManage")
			},
			{
				path: "/memberManage/memberManage/edit/:id?",
				name: "memberEdit",
				meta: {
					title: "参会人员编辑",
					activeMenu: "/memberManage/memberManage/memberManage"
				},
				component: () => import("@/views/MemberManage/edit")
			},
			{
				path: "/memberManage/memberManage/detail/:id",
				name: "memberDetail",
				meta: {
					title: "参会人员详情",
					activeMenu: "/memberManage/memberManage/memberManage"
				},
				component: () => import("@/views/MemberManage/detail")
			}
		]
	},
	{
		path: "/memberManage",
		name: "MemberManage",
		component: Layout,
		children: [
			{
				path: "/meetingMonitoring/meetingMonitoring",
				name: "MeetingMonitoring",
				meta: {
					title: "会议监控"
				},
				component: () => import("@/views/MeetingMonitoring")
			},
			{
				path: "/meetingMonitoring/meetingMonitoring/detailPerson/:meetingid/:uid",
				name: "MeetingMonitoringDetailPerson",
				meta: {
					title: "会议监控详情"
				},
				component: () => import("@/views/MeetingMonitoring/detailPerson")
			},
			{
				path: "/meetingMonitoring/meetingMonitoring/detailFile/:meetingid/:topicid/:fileid",
				name: "MeetingMonitoringDetailFile",
				meta: {
					title: "会议监控详情"
				},
				component: () => import("@/views/MeetingMonitoring/detailFile")
			}
		]
	},
	{
		path: "/meetingControlManage",
		name: "MeetingControlManage",
		component: Layout,
		children: [
			{
				path: "/meetingControlManage/meetingControlManage/:id",
				name: "MeetingControlManage",
				meta: {
					title: "会议控制管理",
					activeMenu: "/meetingControlManage/meetingControlManage"
				},
				component: () => import("@/views/MeetingControlManage")
			},
			{
				path: "/meetingControlManage/meetingControlManage/edit/:id?",
				name: "meetingControlEdit",
				meta: {
					title: "会议控制编辑",
					activeMenu: "/meetingControlManage/meetingControlManage/meetingControlManage"
				},
				component: () => import("@/views/MeetingControlManage/edit")
			},
			{
				path: "/meetingControlManage/meetingControlManage/detail/:id",
				name: "meetingControlDetail",
				meta: {
					title: "会议控制详情",
					activeMenu: "/meetingControlManage/meetingControlManage/meetingControlManage"
				},
				component: () => import("@/views/MeetingControlManage/detail")
			}
		]
	},
	{
		path: "/meetingProgressManage",
		name: "MeetingProgressManage",
		component: Layout,
		children: [
			{
				path: "/meetingProgressManage/meetingProgressManage/:id",
				name: "MeetingProgressManage",
				meta: {
					title: "会议过程管理"
				},
				component: () => import("@/views/MeetingProgressManage")
			},
			{
				path: "/meetingProgressManage/meetingProgressManage/edit/:id?",
				name: "meetingControlEdit",
				meta: {
					title: "会议过程编辑",
					activeMenu: "/meetingProgressManage/meetingProgressManage/meetingProgressManage"
				},
				component: () => import("@/views/MeetingProgressManage/edit")
			},
			{
				path: "/meetingProgressManage/meetingProgressManage/detail/:id",
				name: "meetingControlDetail",
				meta: {
					title: "会议过程详情",
					activeMenu: "/meetingProgressManage/meetingProgressManage/meetingProgressManage"
				},
				component: () => import("@/views/MeetingProgressManage/detail")
			}
		]
	},
	{
		path: "/meetingSignManage",
		name: "MeetingSignManage",
		component: Layout,
		children: [
			{
				path: "/meetingSignManage/meetingSignManage",
				name: "MeetingSignManage",
				meta: {
					title: "会议签到管理"
				},
				component: () => import("@/views/MeetingSignManage")
			},
			{
				path: "/meetingSignManage/meetingSignManage/edit/:id?",
				name: "meetingControlEdit",
				meta: {
					title: "会议签到编辑",
					activeMenu: "/meetingSignManage/meetingSignManage/meetingSignManage"
				},
				component: () => import("@/views/MeetingSignManage/edit")
			},
			{
				path: "/meetingSignManage/meetingSignManage/detail/:id",
				name: "meetingControlDetail",
				meta: {
					title: "会议签到详情",
					activeMenu: "/meetingSignManage/meetingSignManage/meetingSignManage"
				},
				component: () => import("@/views/MeetingSignManage/detail")
			}
		]
	},
	{
		path: "/meetingProgressManage",
		name: "MeetingProgressManage",
		component: Layout,
		children: [
			{
				path: "/meetingProgressManage/meetingProgressManage",
				name: "MeetingProgressManage",
				meta: {
					title: "会议过程管理"
				},
				component: () => import("@/views/MeetingProgressManage")
			},
			{
				path: "/meetingProgressManage/meetingProgressManage/edit/:id?",
				name: "meetingControlEdit",
				meta: {
					title: "会议过程编辑",
					activeMenu: "/meetingProgressManage/meetingProgressManage/meetingProgressManage"
				},
				component: () => import("@/views/MeetingProgressManage/edit")
			},
			{
				path: "/meetingProgressManage/meetingProgressManage/detail/:id",
				name: "meetingControlDetail",
				meta: {
					title: "会议过程详情",
					activeMenu: "/meetingProgressManage/meetingProgressManage/meetingProgressManage"
				},
				component: () => import("@/views/MeetingProgressManage/detail")
			}
		]
	},
	{
		path: "/meetinLogManage",
		name: "MeetinLogManage",
		component: Layout,
		children: [
			{
				path: "/meetinLogManage/meetinLogManage",
				name: "MeetinLogManage",
				meta: {
					title: "会议归档管理"
				},
				component: () => import("@/views/MeetinLogManage")
			},
			{
				path: "/meetinLogManage/MeetingStatistics",
				name: "MeetingStatistics",
				meta: {
					title: "会议统计"
				},
				component: () => import("@/views/MeetingStatistics")
			},
			{
				path: "/meetinLogManage/meetinLogManage/edit/:id?",
				name: "meetinLogEdit",
				meta: {
					title: "会议归档编辑",
					activeMenu: "/meetinLogManage/meetinLogManage/meetinLogManage"
				},
				component: () => import("@/views/MeetinLogManage/edit")
			},
			{
				path: "/meetinLogManage/meetinLogManage/detail/:id",
				name: "meetinLogDetail",
				meta: {
					title: "会议归档详情",
					activeMenu: "/meetinLogManage/meetinLogManage/meetinLogManage"
				},
				component: () => import("@/views/MeetinLogManage/detail")
			}
		]
	},
	{
		path: "/meetingRoomManage",
		name: "MeetingRoomManage",
		component: Layout,
		children: [
			{
				path: "/meetingRoomManage/meetingRoomManage",
				name: "meetingRoomManage",
				meta: {
					title: "会议室管理"
				},
				component: () => import("@/views/MeetingRoomManage")
			},
			{
				path: "/meetingRoomManage/meetingRoomManage/edit/:id?",
				name: "meetingRoomEdit",
				meta: {
					title: "会议室编辑",
					activeMenu: "/meetingRoomManage/meetingRoomManage/meetingRoomManage"
				},
				component: () => import("@/views/MeetingRoomManage/edit")
			},
			{
				path: "/meetingRoomManage/meetingRoomManage/detail/:id",
				name: "meetingRoomDetail",
				meta: {
					title: "会议室详情",
					activeMenu: "/meetingRoomManage/meetingRoomManage/meetingRoomManage"
				},
				component: () => import("@/views/MeetingRoomManage/detail")
			}
		]
	},
	{
		path: "/meetingEndManage",
		name: "MeetingEndManage",
		component: Layout,
		children: [
			{
				path: "/meetingEndManage/meetingEndManage",
				name: "meetingEndManage",
				meta: {
					title: "会议终端管理"
				},
				component: () => import("@/views/MeetingEndManage")
			},
			{
				path: "/meetingEndManage/meetingEndManage/edit/:id?",
				name: "meetingEndEdit",
				meta: {
					title: "会议终端编辑",
					activeMenu: "/meetingEndManage/meetingEndManage/meetingEndManage"
				},
				component: () => import("@/views/MeetingEndManage/edit")
			},
			{
				path: "/meetingEndManage/meetingEndManage/detail/:id",
				name: "meetingEndDetail",
				meta: {
					title: "会议终端详情",
					activeMenu: "/meetingEndManage/meetingEndManage/meetingEndManage"
				},
				component: () => import("@/views/MeetingEndManage/detail")
			}
		]
	},
	{
		path: "/createMeeting",
		name: "CreateMeeting",
		component: Layout,
		children: [
			{
				path: "/createMeeting/createMeeting",
				name: "CreateMeeting",
				meta: {
					title: "创建会议"
				},
				component: () => import("@/views/CreateMeeting")
			},
			{
				path: "/createMeeting/createMeeting/:id",
				name: "CreateMeeting",
				meta: {
					title: "编辑会议"
				},
				component: () => import("@/views/CreateMeeting")
			}
		]
	},
	{
		path: "/conference",
		name: "Conference",
		component: Layout,
		children: [
			{
				path: "/conference/conference",
				name: "Conference",
				meta: {
					title: "会议控制"
				},
				component: () => import("@/views/Conference")
			}
		]
	}
];
export default contentManageRouter;
