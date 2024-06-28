### components TablePage 通用动态表单

formSettings 为必填配置项，配置格式如下：
[{
label: 'xxx', //；表单区块名
items: [{
label: 'xx', // 表单项名
name: 'xxx', // 字段名
type: 'xx', // 表单类型（text, select, date, radio, checkbox, cascader, daterange, textarea, img, file, slot...）
options: [{ // select、radio、checkbox 等的选择内容
label: '...',
value: '...'
}]
value: xx, // 默认值
valueType: 'xxx', // 值类型，number/string/date/array...
rule: [{
validator: validatePass, trigger: 'blur'
}],
events: {
change: 'emitName' // 事件发生时 emit 指定名的事件
},
required: Boolean, // 是否为必填项
hidden: Boolean, // 是否隐藏该项，隐藏项不会发送数据
limit: Number, //上传文件时的最大上传限制
tip: String, // 上传文件时的文字 tip
}]

}]

formData 为选填项，如传入 formDate，则表单会有默认值，格式如下：
{
key: value,
key: value
}

slot 示例:
<template slot="location" slot-scope="scope">
<el-input placeholder="" v-model="scope.model.location">
<el-button slot="append" icon="el-icon-search"></el-button>
</el-input>
</template>
