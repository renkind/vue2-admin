const searchParams = () => [
	{
		label: "聚合页名称",
		name: "name",
		type: "text",
		option: {
			placeholder: "请输入",
			width: 150
		}
	}
];

const tableColumns = () => [
	{
		label: "聚合页名称",
		dataIndex: "name"
	},
	{
		label: "聚合页模板名称",
		dataIndex: "templateType"
	},
	{
		label: "聚合页地址",
		dataIndex: "externalUrl"
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
		label: "归属地市",
		dataIndex: "deptId",
		slotName: "deptId"
	}
];
export { searchParams, tableColumns };
