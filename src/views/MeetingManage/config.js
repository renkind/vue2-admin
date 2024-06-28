const formSearchParams = [
	{
		label: "会议名称",
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
];

const tableColumns = [
	{
		label: "会议名",
		dataIndex: "name",
		width: "250"
	},
	{
		label: "主持人",
		dataIndex: "speakerName"
	},
	{
		label: "会议地点",
		dataIndex: "address"
	},
	{
		label: "会议时间",
		dataIndex: "time",
		slotName: "time",
		width: "230"
	},
	{
		label: "会议状态",
		dataIndex: "status",
		slotName: "status",
		width: "120"
	},
	{
		label: "创建时间",
		dataIndex: "createTime",
		slotName: "createTime",
		width: "230"
	},
	{
		label: "操作",
		slotName: "tool",
		width: "280",
		fixed: "right"
	}
];

const buttonList = (addNotice, batchDelete) => [
	{
		label: "新增",
		click: addNotice,
		batchBtn: false,
		permissions: "meeting:meetingmanage:add"
	},
	{
		label: "批量删除",
		click: batchDelete,
		batchBtn: true,
		type: "danger",
		permissions: "meeting:meetingmanage:batchDelete"
	}
];
export { formSearchParams, tableColumns, buttonList };
