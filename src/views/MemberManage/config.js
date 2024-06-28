import { getDicts } from "@/service/dict/data";
const formSearchParams = [
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
		label: "用户状态",
		name: "meeting_status",
		type: "zs-select",
		option: {
			asyncData: true,
			request: () => getDicts("meeting_status"),
			labelKey: "dictLabel",
			valueKey: "dictValue"
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
		label: "用户状态",
		dataIndex: "status",
		slotName: "status"
	},
	{
		label: "创建时间",
		dataIndex: "createTime"
	},
	{
		label: "操作",
		slotName: "tool",
		width: "150",
		fixed: "right"
	}
];

const buttonList = (addNotice, batchDelete) => [
	{
		label: "新增",
		click: addNotice,
		batchBtn: false,
		permissions: "system:user:add"
	},
	{
		label: "批量删除",
		click: batchDelete,
		batchBtn: true,
		type: "danger",
		permissions: "meeting:membermanage:delete"
	}
];
export { formSearchParams, tableColumns, buttonList };
