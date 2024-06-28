import { getDicts } from "@/service/dict/data";
// 搜索
const searchParams = () => [
	{
		label: "事项名称", // 表单label
		name: "name", // 表单值
		type: "text", // 控件类型
		option: {
			// 其他配置选项
			placeholder: "请输入",
			width: 240
		}
	},
	{
		label: "厅局",
		name: "bureau",
		type: "zs-select",
		option: {
			asyncData: true,
			placeholder: "请输入",
			request: () => getDicts("app_event_bureau"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
		}
	},
	{
		label: "一级分类",
		name: "primaryClassification",
		type: "zs-select",
		option: {
			asyncData: true,
			placeholder: "请输入",
			request: () => getDicts("app_event_primary_classification"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
		}
	},
	{
		label: "类别",
		name: "type",
		type: "zs-select",
		option: {
			asyncData: true,
			placeholder: "请输入",
			request: () => getDicts("app_event_type"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
		}
	}
	// {
	// 	label: "归属地市",
	// 	name: "deptId",
	// 	type: "zs-select",
	// 	option: {
	// 		asyncData: true,
	// 		placeholder: "请选择",
	// 		request: () => getDicts("app_city"),
	// 		labelKey: "dictLabel",
	// 		valueKey: "dictValue"
	// 	}
	// },
	// {
	// 	label: "审批状态",
	// 	name: "approvalStatus",
	// 	type: "zs-select",
	// 	option: {
	// 		asyncData: true,
	// 		placeholder: "请选择",
	// 		request: () => getDicts("app_approval_status"),
	// 		labelKey: "dictLabel",
	// 		valueKey: "dictValue"
	// 	}
	// }
];
// 表格
const tableColumns = () => [
	{
		label: "厅局",
		dataIndex: "bureau",
		slotName: "bureau",
		width: 150
	},
	{
		label: "一级分类",
		dataIndex: "primaryClassification",
		slotName: "primaryClassification",
		width: 150
	},
	{
		label: "事项名称",
		dataIndex: "name",
		width: 120
	},
	{
		label: "对应接口名称",
		dataIndex: "apiName",
		width: 200
	},
	{
		label: "类别",
		dataIndex: "type",
		slotName: "type",
		width: 120
	},
	{
		label: "归属地市",
		dataIndex: "deptId",
		slotName: "deptId"
	},
	{
		label: "上线时间",
		dataIndex: "createTime",
		width: "200"
	},
	{
		label: "上线渠道",
		dataIndex: "frameType",
		slotName: "frameType"
	},
	{
		label: "接入方式",
		dataIndex: "accessMethod",
		slotName: "accessMethod"
	},
	{
		label: "事项地址",
		dataIndex: "externalUrl"
	},
	{
		label: "审批状态",
		dataIndex: "approvalStatus",
		slotName: "approvalStatus"
	},
	{
		label: "是否扫脸",
		dataIndex: "faceSwiping",
		slotName: "faceSwiping"
	},
	{
		label: "上线状态",
		dataIndex: "frameFlag",
		slotName: "frameFlag"
	},
	{
		label: "创建人",
		dataIndex: "createBy"
	},
	{
		label: "创建时间",
		dataIndex: "createTime",
		width: 200
	}
];

export { searchParams, tableColumns };
