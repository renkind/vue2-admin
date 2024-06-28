import Vue from "vue";

const action = Vue.directive("action", {
	inserted: (el, binding, vnode) => {
		// console.log("el", el);
		// console.log("binding", binding);
		// console.log("vnode", vnode);
		const actions = vnode.data.attrs.actions ? vnode.data.attrs.actions : [];
		const match = actions.find((v) => v.code && v.code === binding.value);
		if (!match) {
			(el.parentNode && el.parentNode.removeChild(el)) ||
				(el.style.display = "none");
		}
	}
});

export default action;
