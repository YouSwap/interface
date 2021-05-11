<template>
  <div>
    <div class="pc-container"
         v-if="platform === 2">
      <Header :isConnected="isConnected"
              :poolType="poolType"
              :apy="apy" />
      <div class="pc-content">
        <DealHeadShow :titleShowData="titleShowData" />
        <DealPoolList />
        <DealInstruc />
      </div>
    </div>
    <div class="mobile-container"
         v-if="platform === 1">
      <MobileHeader :poolType="poolType"
                    :apy="apy" />
      <div class="mobile-content">
        <MobileCardShow :titleShowData="titleShowData" />
        <MobileDealList />
        <DealInstruc />
        <MobileFooter :isConnected="isConnected" />
      </div>
    </div>
  </div>
</template>

<script>
import Header from '../components/Header'
import DealHeadShow from '../components/DealHeadShow'
import DealPoolList from '../components/DealPoolList'
import DealInstruc from '../components/DealInstruc'
import MobileHeader from '../components/MobileHeader'
import MobileCardShow from '../components/MobileCardShow'
import MobileDealList from '../components/MobileDealList'
import MobileFooter from '../components/MobileFooter'
import { getShowAddress } from '../utils'
import bus from '../assets/script/bus'
import { ethers } from 'ethers'
import { mapState } from 'vuex'
import { post } from '../assets/script/http'
import { abi_airport } from '../utils/abi_airport'
import { request, gql } from 'graphql-request'

export default {
  components: {
    Header,
    DealHeadShow,
    DealPoolList,
    DealInstruc,
    MobileHeader,
    MobileCardShow,
    MobileDealList,
    MobileFooter
  },
  data () {
    return {
      isConnected: false,
      poolType: 'deal',
      network: false,
      account: '',
      titleShowData: {
        sendTotal: '--', // 累计发放奖励
        todayExchangeTotal: '--', // 今日总交易额
        myExchangePercent: '--', // 今日我的交易额占比
        willReceive: '--' // 待领取奖励
      },
      apy: {},
      youprice: 0,
    }
  },
  mounted () {
    this.getYouPrice()
    setTimeout(() => {
      this.checkNetwork()
    }, 100)
    this.accountChanged()
    // 连接钱包
    bus.$on('connectWallet', this.connectWallet)
    this.getData()
    this.timer = window.setInterval(() => {
      setTimeout(() => {
        this.getData()
      }, 0)
    }, 2000)
    this.getAPY()
  },
  computed: {
    ...mapState({
      platform: state => state.platform
    }),
    accountCurrey () {
      return this.$store.state.account.toString()
    }
  },
  destroyed () {
    window.clearInterval(this.timer)
  },
  methods: {
    /**
     * 获取APY数据
     */
    getAPY () {
      const params = {
        address: this.accountCurrey,
        chain: 'heco'
      }
      this.$post(`${process.env.VUE_APP_API_ROOT}/v1/airdrop/Apy`, params).then(res => {
        this.apy = res
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * YOU价格
    */
    getYouPrice () {
      const that = this
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        token(id : "${process.env.VUE_APP_AIRPORT_YOU_ADDRESS}"){
          derivedETH
        }
        bundle(id : "1"){
          ethPrice
        }
      }`
      request(endpoint, query).then((res) => {
        that.youprice = res.bundle.ethPrice * res.token.derivedETH;
        that.getTotalAmounts()
        setInterval(() => {
          that.getTotalAmounts()
        }, 5000)
      })
    },
    /**
     * 获取待领取数据
     */
    getWillReceive () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        process.env.VUE_APP_AIRPORT_CONTRACT,
        abi_airport,
        provider
      )
      contract.pendingUserAmounts(process.env.VUE_APP_AIRPORT_YOU_ADDRESS, this.accountCurrey).then(res => {
        this.titleShowData.willReceive = res.toString()
      })
    },
    /**
     * 获取累计发放奖励
     */
    getTotalAmounts () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        process.env.VUE_APP_AIRPORT_CONTRACT,
        abi_airport,
        provider
      )
      contract.totalAmounts(process.env.VUE_APP_AIRPORT_YOU_ADDRESS).then(res => {
        this.titleShowData.sendTotal = (this.youprice * (res.toString() / 10 ** 6)).toFixed(2)
      })
    },
    /**
     * 获取数据
     */
    getData () {
      let params = {
        address: this.account,
        chain: 'heco'
      }
      post(`${process.env.VUE_APP_API_ROOT}/v1/airdrop/info`, params).then(res => {
        if (res) {
          // this.titleShowData.sendTotal = res.total_send_reward
          this.titleShowData.todayExchangeTotal = res.today_amount
          this.titleShowData.myExchangePercent = (res.exchange_percent * 100).toFixed(2)
        }
      })
    },
    /**
     * 连接钱包
     */
    async connectWallet () {
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            if (accounts.length === 0) {
              console.log('Please connect to a wallet.');
            } else {
              this.addHecoChain()
            }
          })
          .catch((err) => {
            if (err.code === 4001) {
              console.log('Please connect to a wallet.');
            } else {
              console.error(err);
            }
          })
      } else {
        window.open('https://metamask.io/', '_self')
      }
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
        if (res && res.result === null) {
          window.location.reload()
        }
      }).catch((err) => {
        this.checkNetwork()
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
    /**
     * 检测网络
     */
    checkNetwork () {
      if (!window.ethereum) {
        this.$message.error(this.$t('connect')[2])
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getNetwork().then(Network => {
        this.$store.commit('setChainId', Network.chainId.toString())
        if (Network.chainId != process.env.VUE_APP_HECO_CHAINID) {
          this.$message.error(this.$t('index')[6])
          this.network = false
        } else {
          this.network = true
          this.initCoin(Network.chainId)
          this.initAccount()
        }
      })
    },
    /**
     * 初始化币种
     */
    initCoin (chainId) {
      let coin = 'HT'
      if (chainId == process.env.VUE_APP_CHAINID) {
        coin = 'ETH'
      } else if (chainId == process.env.VUE_APP_HECO_CHAINID) {
        coin = 'HT'
      }
      this.$store.commit('setCoin', coin)
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
          that.$store.commit('setAccount', res.result[0])
          that.shortAccount = getShowAddress(res.result[0])
          that.isConnected = true
          that.initBalance()
          that.getWillReceive()
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
        if (res.result) {
          that.balance = (parseInt(res.result, 16) / 1e18).toFixed(3)
          that.$store.commit('setBalance', that.balance)
        }
      })
    },
    /**
     * 切换账户之后的回调
     */
    accountChanged () {
      let that = this
      if (!window.ethereum) return
      window.ethereum.on('accountsChanged', (accounts) => {
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          // this.initAccount()
          window.location.reload()
        }
      });
      window.ethereum.on('chainChanged', () => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload()
      });
    },
    /**
     * 封装请求
     */
    sendRequest (param, cb) {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.provider.sendAsync(param, function (err, res) {
        if (!err && res.error) err = new Error('EthQuery - RPC Error - ' + res.error.message)
        if (err) return cb(err)
        cb(null, res)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.pc-container {
  width: 100%;
  padding-bottom: 40px;
  .pc-content {
    width: 1200px;
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    position: relative;
  }
}
.mobile-container {
  position: relative;
  .mobile-content {
    position: absolute;
    left: 0;
    width: 100%;
    top: 170px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #f8fcff;
    border-radius: 20px 20px 0px 0px;
    padding: 20px 15px 88px 15px;
    z-index: 1111;
  }
}
</style>