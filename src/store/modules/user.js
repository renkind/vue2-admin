const store = {
	token: localStorage.getItem("token") || ""
};

const mutations = {
	LOGIN(state, params) {
		state.token = params;
	},
	LOGINOUT(state) {
		localStorage.clear();
		state.token = "";
	}
};

const actions = {
	useLogin({ commit }, params) {
		localStorage.setItem("token", params);
		commit("LOGIN", params);
	}
};

export default {
	namespaced: true,
	store,
	mutations,
	actions
};
