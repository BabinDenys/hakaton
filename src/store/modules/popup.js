const state = {
  editBeforeProduct: false
}

const mutations = {
  EDIT_POPOUP: (state, log) => {
    state.editBeforeProduct = true
  },
  NO_POPUP: (state) => {
    state.editBeforeProduct = false
  },
}

const actions = {
  editPopup({ commit }) {
    commit('EDIT_POPOUP')
  },
  noPopup({ commit }) {
    commit('NO_POPUP')
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
