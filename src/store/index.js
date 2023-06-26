import { createStore } from 'vuex'

export default createStore({
  state: {
    userInfo: {}
  },
  getters: {
  },
  mutations: {
    setUserInfo (state, info) {
      state.userInfo = info
    }
  },
  actions: {
  },
  modules: {
  }
})
