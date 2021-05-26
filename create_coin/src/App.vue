<template>
  <div id="app">
    <template v-if="isPc() && !isShow">
      <PcHeader :disWalletAddress="disWalletAddress"
                :isConnected="isConnected"
                :account="account"
                @connectWallet="connetWallet"
                @addBSCChain="addBSCChain"
                @addHecoChain="addHecoChain" />
    </template>
    <template v-if="!isPc() && !isShow">
      <MobileHeader @addHecoChain="addHecoChain"
                    @addBSCChain="addBSCChain" />
    </template>
    <router-view></router-view>
    <div v-if="!isPc() && !isShow">
      <MobileFooter :isConnected="isConnected"
                    :disWalletAddress="disWalletAddress"
                    @connectWallet="connetWallet" />
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { getShowAddress, IsPC } from './utils/index'
import { ethers } from 'ethers'
import PcHeader from "./components/header/PcHeader"
import MobileHeader from './components/header/MobileHeader'
import MobileFooter from './components/footer/MobileFooter'
export default {
  name: 'App',
  components: {
    PcHeader, MobileFooter, MobileHeader
  },
  data () {
    return {
      network: true,
      account: '',
      isConnected: false,
      balance: '--',
      disWalletAddress: ''
    }
  },
  mounted () {
    setTimeout(() => {
      this.checkNetwork() // 检测网路
    }, 500)
    this.initLanguage()
    this.accountChanged() // 监听账户改变

  },
  computed: {
    isShow () {
      return this.$route.path.indexOf('/introduct') !== -1
    }
  },
  methods: {
    /**
     * 判断是否是PC端
     */
    isPc () {
      return IsPC()
    },
    /**
     * 切换账户之后的回调
     */
    accountChanged () {
      let that = this
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          that.account = accounts[0]
          that.$store.commit('setAccount', accounts[0])
          localStorage.setItem('account', accounts[0])
          that.shortAccount = getShowAddress(accounts[0])
          window.location.reload()
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    },
    /**
     * 初始化语言
     */
    initLanguage () {
      if (Cookies.get('lang') === 'ZH') {
        this.$i18n.locale = 'zh'
        Cookies.set('lang', "ZH", { domain: `${process.env.VUE_APP_DOMAIN}` })
      } else if (Cookies.get('lang') === 'EN') {
        this.$i18n.locale = 'en'
        Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
      } else {
        this.$i18n.locale = "en"
        Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
      }
    },
    /**
     * 连接钱包
    */
    connetWallet () {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
          this.walletAddress = res[0]
          this.$store.commit('setAccount', this.walletAddress)
          localStorage.setItem('account', this.walletAddress)
          this.disWalletAddress = getShowAddress(res[0])
          this.walletShow = true
        })
      } else {
        this.$store.commit('setAccount', '')
        localStorage.setItem('account', '')
        window.open('https://metamask.io/', '_self')
      }
    },
    /**
     * 检测网络
     */
    checkNetwork () {
      if (!window.ethereum) {
        this.$message({ message: '未检测到钱包', type: 'error' })
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getNetwork().then(Network => {
        this.$store.commit('setChainId', Network.chainId)
        if (Network.chainId != (localStorage.getItem('currentChainIdSelect') ?? '128')) {
          this.$message.error({ message: `请确保已连接${localStorage.getItem('currentChainIdSelect') == 56 ? 'bsc' : 'heco'}正式网络`, type: 'error' })
          this.network = false
          this.$store.commit('setNetwork', false)
          localStorage.setItem('account', '')
        } else {
          this.network = true
          this.$store.commit('setNetwork', true)
          this.initAccount()
        }
      })
    },
    /**
     * 初始化账户
     */
    initAccount () {
      let that = this
      let param = {
        'method': 'eth_accounts'
      }
      this.sendRequest(param, function (err, res) {
        if (res.result && res.result.length) {
          that.account = res.result[0]
          that.$store.commit('setAccount', that.account)
          localStorage.setItem('account', that.account)
          that.disWalletAddress = getShowAddress(res.result[0])
          that.isConnected = true
          that.initBalance()
        } else {
          that.$store.commit('setAccount', '')
          localStorage.setItem('account', '')
        }
      })
    },
    /**
     * 初始化余额
     */
    initBalance () {
      let that = this
      let param = {
        params: [this.account],
        'method': 'eth_getBalance'
      }
      this.sendRequest(param, function (err, res) {
        if (res && res.result) {
          that.balance = (parseInt(res.result, 16) / 1e18).toFixed(3)
        }
      })
    },
    /**
     * 封装请求
     */
    sendRequest (param, cb) {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.provider.sendAsync(param, function (err, res) {
        if (!err && res.error) err = new Error('RPC Error - ' + res.error.message)
        if (err) return cb(err)
        cb(null, res)
      })
    },
    /**
     * 添加heco公链
     */
    addHecoChain () {
      let param = {
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x80",
          chainName: "Heco Mainnet",
          nativeCurrency: {
            name: "Heco",
            symbol: "HT",
            decimals: 18
          },
          rpcUrls: ["https://http-mainnet-node.huobichain.com"],
          blockExplorerUrls: ["https://hecoinfo.com"]
        }]
      };
      window.ethereum.request(param).then((res) => {
        this.$router.push('/')
        if (res && res.result === null) {
          window.location.reload()
        }
      }).catch((err) => {
        setTimeout(() => {
          this.checkNetwork() // 检测网路
        }, 500)
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
    /**
     * 添加BSC公链
     */
    addBSCChain () {
      let param = {
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          chainName: "BSC Mainnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "bnb",
            decimals: 18
          },
          rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
          blockExplorerUrls: ["https://bscscan.com/"]
        }]
      };
      window.ethereum.request(param).then((res) => {
        this.$router.push('/')
        if (res && res.result === null) {
          window.location.reload()
        }
      }).catch((err) => {
        setTimeout(() => {
          this.checkNetwork() // 检测网路
        }, 500)
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
  }
}
</script>

<style lang='less'>
@import "./assets/style/global.css";
@import "./assets/style/common.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
