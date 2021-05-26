import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: '', // 当前登陆账户
    network: '',
    chainId: 128,
    activeTab: 1
  },
  mutations: {
    setAccount (state, data) {
      state.account = data
    },
    setNetwork (state, data) {
      state.network = data
    },
    setChainId (state, data) {
      state.chainId = data
    },
    setActiveTab (state, data) {
      state.activeTab = data
    }
  },
})
