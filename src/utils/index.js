// import store from "@/store"
import _ from "lodash";
import gm from "gm-crypt";

export function getToken() {
	return localStorage.getItem("Authorization");
}

export function removeToken() {
	return localStorage.clear();
}

export function filterRoleTree(routes) {
	routes = _.cloneDeep(routes);
	const role = [];
	routes.forEach((item) => {
		if (item.children) {
			item.children = filterRoleTree(item.children);
			const res = {
				name: item.name,
				title: item.meta.title,
				children: item.children
			};
			role.push(res);
		} else if (item.meta && item.meta.title && !item.meta.hideInRoleTree) {
			role.push({
				name: item.name,
				title: item.meta.title
			});
		}
	});
	return role;
}

export function filterAllAuth(routes) {
	routes = _.cloneDeep(routes);
	let res = [];
	routes.forEach((item) => {
		if (item.children) {
			res = [...res, item.name, ...filterAllAuth(item.children)];
		} else {
			res.push(item.name);
		}
	});
	return res;
}

export function deepClone(source) {
	if (!source && typeof source !== "object") {
		throw new Error("error arguments", "deepClone");
	}
	const targetObj = source.constructor === Array ? [] : {};
	Object.keys(source).forEach((keys) => {
		if (source[keys] && typeof source[keys] === "object") {
			targetObj[keys] = deepClone(source[keys]);
		} else {
			targetObj[keys] = source[keys];
		}
	});
	return targetObj;
}
// 添加日期范围
export function addDateRange(params, dateRange, propName) {
	const search = params;
	search.params =
		typeof search.params === "object" && search.params !== null && !Array.isArray(search.params) ? search.params : {};
	dateRange = Array.isArray(dateRange) ? dateRange : [];
	if (typeof propName === "undefined") {
		search.params["beginTime"] = dateRange[0];
		search.params["endTime"] = dateRange[1];
	} else {
		search.params[`begin${propName}`] = dateRange[0];
		search.params[`end${propName}`] = dateRange[1];
	}
	return search;
}

// 数据合并
export function mergeRecursive(source, target) {
	for (const p in target) {
		try {
			if (target[p].constructor === Object) {
				source[p] = mergeRecursive(source[p], target[p]);
			} else {
				source[p] = target[p];
			}
		} catch (e) {
			source[p] = target[p];
		}
	}
	return source;
}

// 转换字符串，undefined,null等转化为""
export function parseStrEmpty(str) {
	if (!str || str === "undefined" || str === "null") {
		return "";
	}
	return str;
}

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
	let result = "";
	for (const propName of Object.keys(params)) {
		const value = params[propName];
		const part = `${encodeURIComponent(propName)}=`;
		if (value !== null && typeof value !== "undefined") {
			if (typeof value === "object") {
				for (const key of Object.keys(value)) {
					if (value[key] !== null && typeof value[key] !== "undefined") {
						const param = `${propName}[${key}]`;
						const subPart = `${encodeURIComponent(param)}=`;
						result += `${subPart + encodeURIComponent(value[key])}&`;
					}
				}
			} else {
				result += `${part + encodeURIComponent(value)}&`;
			}
		}
	}
	return result;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 */
export function handleTree(data, id, parentId, children) {
	const config = {
		id: id || "id",
		parentId: parentId || "parentId",
		childrenList: children || "children"
	};

	const childrenListMap = {};
	const nodeIds = {};
	const tree = [];

	for (const d of data) {
		const parentIds = d[config.parentId];
		if (childrenListMap[parentIds] == null) {
			childrenListMap[parentIds] = [];
		}
		nodeIds[d[config.id]] = d;
		childrenListMap[parentIds].push(d);
	}

	for (const d of data) {
		const parentIds = d[config.parentId];
		if (nodeIds[parentIds] == null) {
			tree.push(d);
		}
	}
	function adaptToChildrenList(o) {
		if (childrenListMap[o[config.id]] !== null) {
			o[config.childrenList] = childrenListMap[o[config.id]];
		}
		if (o[config.childrenList]) {
			for (const c of o[config.childrenList]) {
				adaptToChildrenList(c);
			}
		}
	}
	for (const t of tree) {
		adaptToChildrenList(t);
	}

	return tree;
}
// 回显数据字典
export function selectDictLabel(datas, value) {
	const actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].value === `${value}`) {
			actions.push(datas[key].label);
			return true;
		}
		return false;
	});
	return actions.join("");
}

// 验证是否为blob格式
export async function blobValidate(data) {
	try {
		const text = await data.text();
		JSON.parse(text);
		return false;
	} catch (error) {
		return true;
	}
}

// 递归处理成一个数组
const loopRouter = (list, router) => {
	router &&
		router.forEach((element) => {
			if (element.children && element.children.length > 0) {
				loopRouter(list, element.children);
			} else {
				list.push({
					name: element.name,
					path: element.path
				});
			}
		});
};

// 判断即将跳转的路由地址是否有权限
export function filterRouters(store) {
	const tempArray = [];
	const routerList = store.getters.menus;
	loopRouter(tempArray, routerList);
	// tempArray = tempArray.concat();
	return tempArray;
}
/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
	return !!ele.className.match(new RegExp(`(\\s|^)${cls}(\\s|$)`));
}
/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
	if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}
/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
	if (hasClass(ele, cls)) {
		const reg = new RegExp(`(\\s|^)${cls}(\\s|$)`);
		ele.className = ele.className.replace(reg, " ");
	}
}

// 国密4加密
export function gm4() {
	const sm4Config = {
		// 配置sm4参数
		key: "567502e0e087c22f", // 加密公钥
		mode: "ecb", // 加密的方式有两种，ecb和cbc两种 cbc要加一个iv的参数
		cipherType: "base64" //
	};
	const Gm = gm.sm4;
	return new Gm(sm4Config);
}
