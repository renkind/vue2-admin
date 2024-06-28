// 这里通过权限来过滤菜单
// import menu from "@/router/backstage";
// const routeMenu = menu.children;
// console.log(routeMenu);
import _ from "lodash";
function filterMenu(menuList) {
	menuList = _.cloneDeep(menuList);
	// console.log("menuListmenuListmenuList", menuList);
	return menuList.filter((item) => {
		if (item.children) {
			item.children = filterMenu(item.children);
			return item.children.length && item.meta && item.meta.isNave;
		} else {
			if (item.name === "car") {
				console.log(item);
			}
			return item.meta && item.meta.isNave;
		}
	});
}

export function filterRoute(menuList) {
	menuList = _.cloneDeep(menuList);
	// console.log("menuList------", menuList);
	return menuList.filter((item) => {
		if (item.children) {
			item.children = filterRoute(item.children);
			return item.children.length;
		} else {
			if (item.name === "addSchool") {
				console.log(item);
			}
			return item.component && item.meta;
		}
	});
}

export default filterMenu;
