// 转大写
export function toUpperCase(arg) {
	return arg && arg.toUpperCase();
}
// 转小写
export function toLowerCase(arg) {
	return arg && arg.toLowerCase();
}
//

/* 时间格式化
	年月日：yyyy-M-d
	年月日（小于两位数时补0）：yyyy-MM-dd
	年月日时分秒：yyyy-M-d H:m:s
	年月日时分秒（小于两位时补0）：yyyy-MM-dd HH:mm:ss */
export function formatDate(value, args) {
	const dt = new Date(value);
	if (args === "yyyy-M-d") {
		// yyyy-M-d
		const year = dt.getFullYear();
		const month = dt.getMonth() + 1;
		const date = dt.getDate();
		return `${year}-${month}-${date}`;
	} else if (args === "yyyy-M-d H:m:s") {
		// yyyy-M-d H:m:s
		const year = dt.getFullYear();
		const month = dt.getMonth() + 1;
		const date = dt.getDate();
		const hour = dt.getHours();
		const minute = dt.getMinutes();
		const second = dt.getSeconds();
		return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
	} else if (args === "yyyy-MM-dd") {
		// yyyy-MM-dd
		const year = dt.getFullYear();
		const month = (dt.getMonth() + 1).toString().padStart(2, "0");
		const date = dt.getDate().toString().padStart(2, "0");
		return `${year}-${month}-${date}`;
	} else {
		// yyyy-MM-dd HH:mm:ss
		const year = dt.getFullYear();
		const month = (dt.getMonth() + 1).toString().padStart(2, "0");
		const date = dt.getDate().toString().padStart(2, "0");
		const hour = dt.getHours().toString().padStart(2, "0");
		const minute = dt.getMinutes().toString().padStart(2, "0");
		const second = dt.getSeconds().toString().padStart(2, "0");
		return `${year}-${month}-${date} ${hour}:${minute}:${second}`;
	}
}
