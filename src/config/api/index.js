const isProd = process.env.NODE_ENV === "production";
const imgUrl = window.location.host.includes("http://")
	? `${window.location.host}/minio/ysb-zk/`
	: `http://${window.location.host}/minio/ysb-zk/`;
const apis = {
	/** 公共接口 **/
	common: {
		login: "/login", // 登陆
		logout: "/logout", // 登出
		getInfo: "/info", // 获取用户信息
		captchaImg: "/captcha-image", // 获取验证码
		getRouters: "/routers", // 获取用户菜单
		uploadImage: "/app/file/upload2", // 上传图片
		uploadFile: "/file/upload", // 上传文件
		uploadFileMi: "/file/uploadMi", // 加密上传文件

		imgUrl: isProd ? imgUrl : "http://100.122.0.149:9009/ysb-zk/" // 图片路径 生产
	},
	/** 单独业务相关 **/
	// 个人信息
	profile: {
		profile: "/system/user/profile", // 获取个人信息
		updatePassword: "/system/user/profile/update-pwd" // 修改密码
	},
	// 用户
	user: {
		listUser: "/system/user/list", // 获取用户列表
		getUser: "/system/user", // 获取用户
		delUser: "/system/user", // 删除用户
		addUser: "/system/user", // 添加用户
		updateUser: "/system/user", // 更新用户
		resetUserPwd: "/system/user/reset-pwd", // 重制密码
		changeUserStatus: "/system/user/change-status", // 更新用户状态
		getUserProfile: "/system/user/profile", // 查询用户个人信息
		updateUserProfile: "/system/user/profile", // 修改用户个人信息
		updateUserPwd: "/system/user/profile/reset-pwd", // 用户密码重置
		uploadAvatar: "/system/user/profile/avatar", // 用户头像上传
		getAuthRole: "/system/user/auth-role", // 查询授权角色
		updateAuthRole: "/system/user/auth-role" // 用户授权角色
	},
	application: {
		appList: "/app/info/page", // 获取应用列表
		getApp: "/app/info", // 获取应用详情
		delApp: "/app/info", // 删除应用
		addApp: "/app/info", // 添加应用
		updateApp: "/app/info", // 更新应用
		submitApp: "/app/publishHistory", // 发布应用
		submitHistory: "/app/submitHistory", // 发布历史
		submitHistoryList: "/app/submitHistory/page", // 提交记录
		publishHistoryList: "/app/publishHistory/page", // 发布记录
		rollBack: "/app/submitHistory/rollBack", // 回滚
		searchMemberList: "/system/user/dimQuery", // 分页查询应用成员
		showMemberList: "/app/member", // 列表查询应用成员
		addMember: "/app/member", // 新增成员
		updateMember: "/app/member", // 修改成员角色
		delMember: "/app/member/remove" // 删除成员
	},
	// 部门
	dept: {
		listDept: "/system/dept/list", // 查询部门列表
		listDeptExcludeChild: "/system/dept/list/exclude", // 查询部门列表（排除节点）
		getDept: "/system/dept", // 查询部门详细
		treeselect: "/system/dept/treeselect", // 查询部门下拉树结构
		roleDeptTreeselect: "/system/dept/role-dept-treeselect", // 根据角色ID查询部门树结构
		addDept: "/system/dept", // 新增部门
		updateDept: "/system/dept", // 修改部门
		delDept: "/system/dept", // 删除部门
		deptUserTree: "/system/dept/treeselect-user", // 获取部门下用户树列表
		refreshCache: "/system/dept/refreshRedis" // 刷新缓存
	},
	// 配置参数接口
	config: {
		listConfig: "/system/config/list", // 查询参数列表
		getConfig: "/system/config", // 查询参数详细
		getConfigKey: "/system/config/config-key", // 根据参数键名查询参数值
		addConfig: "/system/config", // 新增参数配置
		updateConfig: "/system/config", // 修改参数配置
		delConfig: "/system/config", // 删除参数配置
		refreshCache: "/system/config/refresh-cache" // 刷新参数缓存
	},
	// 数据字典
	dict: {
		listData: "/system/dict/data/list", // 查询字典数据列表
		getData: "/system/dict/data", // 查询字典数据详细
		getDicts: "/system/dict/data/type", // 根据字典类型查询字典数据信息
		addData: "/system/dict/data", // 新增字典数据
		updateData: "/system/dict/data", // 修改字典数据
		delData: "/system/dict/data", // 删除字典数据
		listType: "/system/dict/type/list", // 查询字典类型列表
		getType: "/system/dict/type", // 查询字典类型详细
		addType: "/system/dict/type", // 新增字典类型
		updateType: "/system/dict/type", // 修改字典类型
		delType: "/system/dict/type", // 删除字典类型
		refreshCache: "/system/dict/type/refreshCache", // 刷新字典缓存
		optionselect: "/system/dict/type/optionselect" // 获取字典选择框列表
	},
	// 岗位管理
	post: {
		listPost: "/system/post/list", // 查询岗位列表
		getPost: "/system/post", // 查询岗位详细
		addPost: "/system/post", // 新增岗位
		updatePost: "/system/post", // 修改岗位
		delPost: "/system/post" // 删除岗位
	},
	// 操作日志
	operlog: {
		list: "/monitor/operlog/list", // 查询操作日志列表
		delOperlog: "/monitor/operlog", // 删除操作日志
		cleanOperlog: "/monitor/operlog/clean" // 清空操作日志
	},
	// 登陆日志
	logininfor: {
		list: "/monitor/logininfor/list", // 查询登录日志列表
		delLogininfor: "/monitor/logininfor", // 删除登录日志
		cleanLogininfor: "/monitor/logininfor/clean" // 清空登录日志
	},
	// 菜单管理
	menu: {
		list: "/system/menu/list", // 获取列表
		add: "/system/menu", // 新增菜单
		del: "/system/menu", // 删除菜单
		update: "/system/menu", // 更新菜单
		detail: "/system/menu", // 查询详情
		treeselect: "/system/menu/treeselect", // 获取菜单下拉树列表
		roleTree: "/system/menu/role-menu-treeselect" // 加载对应角色菜单列表树
	},
	// 首页
	homePage: {
		dataSumup: "/app/index/count", // 头部综合数据
		chartsData: "/app/index/echart", // 折线图数据
		viewReview: "/app/index/approvalrecord" // 待审核视频数据
	},
	// 目录管理
	directory: {
		list: "/app/category/list", // 获取列表
		add: "/app/category", // 新增菜单
		del: "/app/category", // 删除菜单
		update: "/app/category", // 更新菜单
		detail: "/app/category", // 查询详情
		cancel: "/app/category/approve/cancel", // 撤回
		batchFrame: "/app/category/batch-frame", // 批量上下架
		refreshCache: "/app/category/refresh-cache" // 刷新缓存
	},
	// 角色
	role: {
		listRole: "/system/role/list", // 获取角色列表
		getRole: "/system/role", // 查询角色详细
		addRole: "/system/role", // 新增角色
		delRole: "/system/role", // 删除角色
		updateRole: "/system/role", // 修改角色
		dataScope: "/system/role/data-scope", // 角色数据权限
		changeRoleStatus: "/system/role/change-status", // 角色状态修改
		allocatedUserList: "/system/role/auth-user/allocated-list", // 查询角色已授权用户列表
		unallocatedUserList: "/system/role/auth-user/unallocated-list", // 查询角色未授权用户列表
		authUserCancel: "/system/role/auth-user/cancel", // 取消用户授权角色
		authUserCancelAll: "/system/role/auth-user/cancel-all", // 批量取消用户授权角色
		authUserSelectAll: "/system/role/auth-user/select-all" // 授权用户选择
	},

	// 会议管理
	meeting: {
		list: "/management/meetingInfo/list", // 获取列表
		add: "/management/meetingInfo", // 新增
		del: "/management/meetingInfo", // 删除
		update: "/management/meetingInfo", // 更新
		detail: "/management/meetingInfo", // 查询详情
		publish: "/management/meetingInfo/release", // 发布
		pushFile: "/management/meetingInfo/notice", // 主动推送
		copy: "/management/meetingInfo/copyMeeting" // 复制会议
	},
	// 参会人员管理
	member: {
		list: "/meetingPerson/list", // 获取列表
		add: "/meetingPerson", // 新增
		del: "/meetingPerson", // 删除
		update: "/meetingPerson", // 更新
		detail: "/meetingPerson" // 查询详情
	},
	// 人员模板管理
	memberModal: {
		list: "/meetingPersonModel/list", // 获取列表
		add: "/meetingPersonModel", // 新增
		del: "/meetingPersonModel", // 删除
		update: "/meetingPersonModel", // 更新
		detail: "/meetingPersonModel" // 查询详情
	},
	// 创建会议
	createMeeting: {
		listNotice: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 会议列表
	meetingList: {
		listNotice: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 会议控制管理
	meetingControl: {
		listNotice: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 会议签到管理
	meetingSign: {
		list: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 会议过程管理
	meetingProgress: {
		processList: "/management/meetingInfo", // 查询通知列表
		changeStatus: "/management/meetingTopic/state", //  议题状态变更
		changeMeetStatus: "/management/meetingInfo/state", //  会议状态变更
		addIssues: "/management/meetingTopic/add" // 增加临时议题
	},
	// 会议归档管理
	meetinLogManage: {
		list: "management/meetingFile/list/meeting", // 查询通知列表
		deleted: "/management/meetingInfo", // 删除列表已归档会议
		meetContentList: "/management/meetingFile/list", //  弹框查询  会议内容
		archiveDestroy: "/management/annotation/broadcastMsg", // 销毁
		archiving: "/management/meetingFile",
		exportMeeting: "/management/meetingFile/downloadFile",
		meetingList: "/management/meetingInfo", // 点击查看跳转会议详情列表
		meetingPersonList: "/management/meetingFile/like", // 过滤参会人员列表
		tableList: "/management/meetingFile/infoList", // 会议详情表格
		priview: "/management/meetingFile/preview", // 预览pdf
		meetPreview: "/management/meetingFile/meetPreview" // 预览word
	},
	// 会议统计
	meetingStatistic: {
		listNotice: "/management/meetingFile/count" // 查询图表
	},
	// 会议归档
	meetingLog: {
		listNotice: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 会议室管理
	meetingRoom: {
		listNotice: "/app/app-inform/page", // 查询通知列表
		getNotice: "/app/app-inform/get-one", //  查询通知详细
		addNotice: "/app/app-inform/add-update-one"
	},
	// 终端管理
	meetingDevice: {
		list: "/management/meetingDevice/list", // 查询列表
		detail: "/management/meetingDevice", // 查询详情
		add: "/management/meetingDevice/", // 添加
		del: "/management/meetingDevice", // 删除
		update: "/management/meetingDevice" // 更新
	},
	// 会议监控
	monitor: {
		info: "/management/meetingMonitor/listMeetingInfo", // 获取进行中会议详情
		listPerson: "/management/meetingMonitor/listPerson", // 按人员查看会议监控信息
		listResource: "/management/meetingMonitor/listResource", // 按文件查看会议监控信息
		pushFile: "/management/annotation/publish", // 推送文件
		detailPerson: "/management/meetingMonitor/listPersonDetail", // 按人员获取详情页
		detailResource: "/management/meetingMonitor/listResource/details" // 按文件获取详情页
	},
	// 升级管理
	upgradeManagement: {
		upgrade: "/management/meetingAndroid/list", // 查询通知列表
		addAndroid: "/management/meetingAndroid" // 新增 发布
	}
};

export default apis;
