import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    account: '', // 当前登陆账户
    balance: 0,
    inviteNum: '--', // 邀请数量
    inviteBenefit: '--',
    pledgeBenefit: '--',
    platform: 2,
    coin: 'ETH',
    chainId: "128"
  },
  mutations: {
    setCoin (state, data) {
      state.coin = data
    },
    setAccount (state, data) {
      state.account = data
    },
    setInviteNum (state, data) {
      state.inviteNum = data
    },
    setInviteBenefit (state, data) {
      state.inviteBenefit = data
    },
    setPledgeBenefit (state, data) {
      state.pledgeBenefit = data
    },
    setBalance (state, data) {
      state.balance = data
    },
    setPlatform (state, data) {
      state.platform = data
    },
    setChainId (state, data) {
      state.chainId = data
    }
  },
  actions: {
  },
  modules: {
  }
})
