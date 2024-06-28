import { getDicts } from "@/service/dict/data";
const formSearchParams = [
	{
		label: "通知名称",
		name: "name",
		type: "text",
		option: {
			placeholder: "请输入",
			width: 240
		}
	},
	{
		label: "审批状态",
		name: "approvalStatus",
		type: "zs-select",
		option: {
			asyncData: true,
			placeholder: "请输入",
			request: () => getDicts("app_approval_status"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
		}
	},
	// {
	// 	label: "操作人",
	// 	name: "updateBy",
	// 	type: "zs-cascader",
	// 	option: {
	// 		asyncData: true,
	// 		showAllLevels: false,
	// 		data: [],
	// 		request: () => treeselectUser(),
	// 		props: {
	// 			multiple: true,
	// 			value: "id",
	// 			label: "label"
	// 		},
	// 		placeholder: "请输入",
	// 		special: true
	// 	}
	// },
	// {
	// 	label: "通知内容",
	// 	name: "content",
	// 	type: "text",
	// 	option: {
	// 		placeholder: "请输入",
	// 		width: 240
	// 	}
	// },
	{
		label: "上线状态",
		name: "frameFlag",
		type: "zs-select",
		option: {
			asyncData: true,
			request: () => getDicts("frame_flag"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
		}
	},
	{
		label: "更新时间",
		name: "createTime",
		type: "datetimerange",
		option: {
			placeholder: "请输入"
		}
	}
];

const tableColumns = [
	{
		label: "通知名称",
		dataIndex: "name"
	},
	{
		label: "审批状态",
		dataIndex: "approvalStatus",
		slotName: "approvalStatus"
	},
	{
		label: "上线状态",
		dataIndex: "frameFlag",
		slotName: "frameFlag"
	},
	{
		label: "当前审批人",
		dataIndex: "currentApproverName"
	},
	{
		label: "创建日期",
		dataIndex: "createTime"
	},
	{
		label: "操作人",
		dataIndex: "updateBy"
	},
	{
		label: "更新日期",
		dataIndex: "updateTime"
	},
	{
		label: "归属地市",
		dataIndex: "deptId",
		slotName: "deptId"
	},
	{
		label: "操作",
		slotName: "tool",
		width: "150",
		fixed: "right"
	}
];

const buttonList = (addNotice, up, down, refreshCache) => [
	{
		label: "新增通知",
		click: addNotice,
		batchBtn: false,
		permissions: "app:inform:save"
	},
	{
		label: "上架",
		click: up,
		batchBtn: true,
		type: "danger",
		permissions: "app:inform:edit:frame"
	},
	{
		label: "下架",
		click: down,
		batchBtn: true,
		type: "danger",
		permissions: "app:inform:edit:frame"
	},
	{
		label: "刷新缓存",
		click: refreshCache,
		batchBtn: false,
		permissions: "app:inform:refresh:cache"
	}
];
export { formSearchParams, tableColumns, buttonList };
