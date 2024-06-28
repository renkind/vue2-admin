# components TablePage 通用动态传参列表页

## 传入参数

|     字段      |   类型   | 必填 |                                描述                                |
| :-----------: | :------: | :--: | :----------------------------------------------------------------: |
|   listData    | [Object] |  是  |                           table 的数据源                           |
|  listLoading  | Boolean  |  是  |                          table 的 loading                          |
|    columns    | [Object] |  是  |                  table 的展示列和对应的字段配置项                  |
| searchParams  | [Object] |  是  |                         form 表单的配置项                          |
|   initData    | [Object] |  否  |                     form 表单的筛选栏默认参数                      |
| showTopButton | Boolean  |  否  |                        是否展示列表上部按钮                        |
|    pageNo     |  Number  |  是  |                            分页当前页码                            |
|   pageSize    |  Number  |  是  |                              分页条数                              |
|   showBatch   | Boolean  |  否  |                       是否展示列表左侧复选框                       |
|  totalCount   |  Number  |  是  |                             数据总条数                             |
|     query     | Function |  是  |                    table 查询分页触发的方法回调                    |
| selectionRow  | Function |  否  |                      table 复选框点击触发回调                      |
|    button     |   插槽   |  否  | table 上侧的按钮操作栏,有 scope 属性，属性值为复选框选中的值的数组 |
|   showRadio   | Boolean  |  否  |                         是否展示左侧单选框                         |

## 回调方法

### query

- 方法说明: 表单的搜索/table 的分页

- 回调参数为 searchFormData 是一个对象

### selectionRow

- 如果不接受这个回调函数，默认给 table 的 button 按钮回调当前复选框选中的值。

- 方法说明: 列表左侧复选框选中的值

- 回调参数为 selection 是一个数组为左侧复选框选中的行的对象

### columns 配置参考

```javascript
[
	{
		label: "图片id", // 列名
		dataIndex: "id", // 数据回显key
		slotName: "imageurl" // 插槽名称 非必填
		fixed:true // 是否固定 非必填 "left" "right"
		width:"200" // 列宽度 非必填
	}
];
```

### searchParams 配置参考

```javascript
[
	{
		label: "姓名", // 表单label
		name: "name", // 表单值
		type: "text", // 控件类型
		option: {
			// 其他配置选项
			placeholder: "请输入",
			width: 240
		},
		rules: [{ required: true, message: "请输入活动名称", trigger: "blur" }] // 控件校验规则，参考element-ui 表单 rules
	}
];
```

#### type 支持类型/注意每个类型配置项不一样

- text
  - 文本输入框
- zs-select
  - 下拉框
- datepicker
  - 日期控件

### 每个不同的 type 配置

#### text

```javascript
 {
    label: "姓名", // 表单label
    name: "name", // 表单值
    type: "text", // 控件类型
    option: {  // 其他配置选项
        placeholder: "请输入",
        width: 240
    },
    rules: [{ required: true, message: "请输入活动名称", trigger: "blur" }] // 控件校验规则，参考element-ui 表单 rules
  }
```

#### zs-select

```javascript
// 异步下拉框
{
  label: "状态", // 表单label
  name: "status", // 表单值
  type: "zs-select", // 控件类型
  option: { // 其他配置项
    asyncData: true, // 下拉框的是是否是接口返回。 true是/false否
    request: () => getDicts("app_picture_type"), // 下拉框数据返回的方法
    placeholder: "请选择",
    labelKey: "dictLabel", // 选项展示label对应的字段
    valueKey: "dictValue" //  选项值的 对应字段
  }
}
// 非异步下拉框
{
  label: "状态", // 表单label
  name: "status", // 表单值
  type: "zs-select", // 控件类型
  option: { // 其他配置项
    asyncData: false, // 下拉框的是是否是接口返回。 true是/false否
    data:[
      {
        label:"男",
        value:"0"
      },{
        label:"女",
        value:"1"
      }
    ],
    placeholder: "请选择",
    labelKey: "label", // 选项展示label对应的字段
    valueKey: "value" //  选项值的 对应字段
  }
},
```

### zs-cascader 操作人联级下拉框

## 静态数据

```javascript
{
	label: "操作人", // 标题
	name: "name3", // form表单对应值
	type: "zs-cascader", // 控件类型
	option: {
	asyncData: false, // 异步数据
	showAllLevels: false, // 填false
	data: [],
	props: {
		multiple: true, // 多选
		value: "id", // 对应的值的key
		label: "label" // 对应的label的key
	},
	placeholder: "请输入",
	special: true // 是否需要自定义返回值，填true
}
},
```

## 异步数据

```javascript
{
	label: "操作人", // 标题
	name: "name3", // form表单对应值
	type: "zs-cascader", // 控件类型
	option: {
	asyncData: true, // 异步数据
	showAllLevels: false, // 填false
	request: () => getDicts("app_picture_type"),
	props: {
		multiple: true, // 多选
		value: "id", // 对应的值的key
		label: "label" // 对应的label的key
	},
	placeholder: "请输入",
	special: true // 是否需要自定义返回值，填true
}
},
```

#### datepicker

```javascript
{
  label: "创建日期", // 表单label
  name: "date", // 表单值
  type: "datepicker" // 控件类型 datepicker-带年月日的控件。datetimerange-带年月日时分秒的控件
}
```

#### checkbox

```javascript
{
		label: "性别",// 表单label
		name: "sex",// 表单值
		type: "zs-checkbox",// 控件类型
		option: {
			asyncData: false, //为true时添加传参 request: () => getDicts("app_picture_type"),
			data: [
				{
					label: "男",
					value: "1"
				},
				{
					label: "女",
					value: "2"
				}
			],
			labelKey: "label",
			valueKey: "value"
		}
	}
```

#### radio

```javascript
{
		label: "性别",// 表单label
		name: "sex",// 表单值
		type: "zs-radio",// 控件类型
		option: {
			asyncData: false, //为true时添加传参 request: () => getDicts("app_picture_type"),
			data: [
				{
					label: "男",
					value: "1"
				},
				{
					label: "女",
					value: "2"
				}
			],
			labelKey: "label",
			valueKey: "value"
		}
	}
```

#### switch

```javascript
	{
		label: "性别",
		name: "sex",
		type: "zs-switch",
		option: {
			data: [
				{
					label: "男",
					value: "1"
				},
				{
					label: "女",
					value: "2"
				}
			],
			activeColor: "blue",
			defultColor: "green"
		}
	}
```
