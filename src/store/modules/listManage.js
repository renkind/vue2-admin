
const listManage = {
  namespaced: true,
  state: {
    queryParams: null
  },
  mutations: {
    UPDATE_QUERY_PARAMS(state, params) {
      state.queryParams = params;
    }
  }
};

export default listManage;
