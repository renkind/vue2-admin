const getters = {
	permissions: (state) => state.app.permissions,
	userInfo: (state) => state.app.userInfo,
	menus: (state) => state.app.menus,
	roles: (state) => state.app.roles,
	device: (state) => state.app.device,
	sidebar: (state) => state.app.sidebar,
	visitedViews: (state) => state.tagsView.visitedViews,
	cachedViews: (state) => state.tagsView.cachedViews,
	sidebarRouters: (state) => state.permission.sidebarRouters,
	avatar: (state) => state.user.avatar
};
export default getters;
