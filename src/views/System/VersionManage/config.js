const formSearchParams = [
	{
		label: "版本号",
		name: "versionCode",
		type: "text",
		option: {
			placeholder: "请输入",
			width: 240
		}
	},
	{
		label: "发布人",
		name: "publisher",
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
		label: "序号",
		dataIndex: "index",
		width: "100"
	},
	{
		label: "版本号",
		dataIndex: "version"
	},
	{
		label: "描述",
		dataIndex: "upgradeDesc"
	},
	{
		label: "发布人",
		dataIndex: "createBy"
	},
	{
		label: "发布时间",
		dataIndex: "createTime"
	}
	// {
	// 	label: "操作",
	// 	slotName: "tool",
	// 	width: "150",
	// 	fixed: "right"
	// }
];

const buttonList = (add) => [
	// {
	// 	label: "+ 新建",
	// 	click: add
	// }
	{
		label: "+ 新建 APK",
		click: () => add("1") // 点击新建按钮时传递 "1" 作为参数
		// permissions: "app:inform:addApk:frame"
	},
	{
		label: "+ 新建前端资源包",
		click: () => add("2") // 点击新建按钮时传递 "2" 作为参数
		// permissions: "app:inform:addResource:frame"
	}
];
export { formSearchParams, tableColumns, buttonList };
