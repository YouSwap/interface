<!-- 头部导航栏 -->
<template>
  <div class="container">
    <div class="head-container">
      <div class="head-left">
        <img :src="logoUrl" alt="">
        <ul>
          <li style="margin-left: 20px;" @click="handleLinkHome">{{ $t('Home') }}</li>
          <li @click="handleLinkDetail">{{$t('IDO')}}</li>
        </ul>
      </div>
      <div class="head-right">
        <div class="wallet-unconnect" v-if="!walletShow" @click="handleConnectWallet">{{ $t('ConnectWallet_add') }}</div>
        <div class="wallet-info-wrapper" v-if="walletShow">
          <div class="wallet-right">{{ disWalletAddress }}</div>
        </div>
        <el-select class="language"  @change="handleLanguageChange(language)" v-model="language">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { getShowAddress } from '../../utils'
import Cookies from 'js-cookie'

export default {
  data () {
    return {
      logoUrl: require('../../assets/logo@2x.png'),
      lightUrl: require('../../assets/light.png'),
      walletShow: false,
      disWalletAddress: '',
      walletAddress: '',
      symbol: '',
      options: [
        {
          value: 'English',
          lan: 'en',
        },
        {
          value: '简体中文',
          lan: 'zh',
        }
      ],
      language: 'English',
      Balance: '',
      currentBlockNumber: '', // 当前块高
      startHeightOfPriIEO: '', // 私募开始时间
      endHeightOfPriIEO: '', // 私募结束时间
      accountsAddress: '',
    }
  },
  mounted () {
    // 获取当前块高
    this.getBlockHigh();
    const defaultLan = Cookies.get('lan') || 'en'
    this.options.forEach(item => {
      if (defaultLan === item.lan) {
        this.language = item.value
      }
    })
    // window.ethereum.on('accountsChanged', (accounts) => {
    //   this.accountsAddress = accounts[0]
    //   localStorage.setItem('accountsAddress', accounts[0])
    //   this.walletShow = false
    // })
    // this.walletShow = true
    // window.ethereum.on('connect', (handler) => {
    //   if (handler) {
    //     // this.walletShow = false
    //     // this.$store.commit('isNotConnect', true)
    //     // this.handleConnectWallet();
    //   }
    // });
    // window.ethereum.on('chainChanged', () => window.location.reload());
    // this.handleConnectWallet();
    // 获取YOU地址
    this.$store.commit('_youAddress', '--')
    setInterval(() => {
      this.getBlockHigh();
    }, 10000);
  },
  methods: {
    // 跳转首页
    handleLinkHome () {
      this.$router.push('/home')
    },
    // 跳转详情页面
    handleLinkDetail() {
      this.$router.push('/detail')
    },
    getBlockHigh() {
      const provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL);
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.getBlockNumber().then(BlockNumber => {
        this.currentBlockNumber = BlockNumber
        const startBlock = parseInt(12043919 - BlockNumber) * 15
        const endBlock = parseInt(12045359 - BlockNumber) * 15
        const nowTime = parseInt(new Date().getTime()/1000)
        this.$store.commit('startTime', nowTime + startBlock)
        this.$store.commit('endTime', nowTime + endBlock)
        this.$store.commit('RemainingBlockchain', 12043919 - BlockNumber)
        this.$store.commit('startBlock', '12043919')
        this.$store.commit('endBlock', '12045359')
      })
    },
    handleConnectWallet() {
      // 连接钱包
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts'}).then(res => {
          // console.log(res)
          this.walletAddress = res[0]
          this.disWalletAddress = getShowAddress(res[0])
          this.walletShow = true
        })
      } else {
        window.open('https://metamask.io/', '_self')
      }
      
    },
    // 切换语言
    handleLanguageChange (value) {
      this.options.forEach(item => {
        if (item.value === value) {
          this.$i18n.locale = item.lan
          Cookies.set('lan', item.lan, {domain: "wbfexchina.top"})
          this.$store.commit('lan', item.lan)
          location.reload();
        }
      })
    },
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      }
    },
    getStatus(val) {
      if (val < this.startHeightOfPriIEO) {
        this.$store.commit('status', 0);
      } else if (val > this.startHeightOfPriIEO && val < this.endHeightOfPriIEO) {
        this.$store.commit('status', 1);
      } else if (val > this.endHeightOfPriIEO) {
        this.$store.commit('status', 2);
      }
    }
  },
  watch: {
    currentBlockNumber: {
      handler (val, olaVal) {
        if (olaVal !== val) {
          this.getStatus(val)
        }
      },
      deep: true, 
    }
  }
}

</script>
<style scoped>
  .container {
    width: 100%;
    height: 60px;
    /* position: fixed; */
    left: 0;
    top: 0;
    z-index: 100;
  }
  .head-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }
  .head-left {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .head-left > img {
    height: 30px;
  }
  
  .head-container ul {
    display: flex;
  }
  .head-container li {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
    padding: 0 20px;
    cursor: pointer;
  }
  li:hover {
    opacity: 0.8;
  }
  .head-right {
    display: flex;
  }
  .wallet-info-wrapper {
    display: flex;
    background: #FFFFFF;
    height: 38px;
    padding: 4px 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
  }
  .wallet-unconnect {
    display: flex;
    background: #FFFFFF;
    height: 38px;
    padding: 0 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
  }
  .wallet-unconnect:hover {
    opacity: 0.8;
  }
  .wallet-left {
    padding-right: 4px;
  }
  .wallet-right:hover {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    opacity: 0.6;
  }
  .toggle-light {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .toggle-light:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  .language {
    width: 117px;
    height: 38px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    margin-left: 10px;
    cursor: pointer;
  }
  .language:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }

@media screen and (max-width: 1000px) {
  .container {
    width: 100%;
    height: 10vw;
    /* position: fixed; */
    left: 0;
    top: 0;
    z-index: 100;
  }
  .head-container {
    height: 15vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .head-left {
    height: 10vw;
    display: flex;
    align-items: center;
  }
  .head-left > img {
    height: 6vw;
  }
  
  .head-container ul {
    display: flex;
  }
  .head-container li {
    margin-left: 6px!important;
    font-size: 3vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
    padding: 0 5px;
    cursor: pointer;
  }
  li:hover {
    opacity: 0.8;
  }
  .head-right {
    display: flex;
    align-items: center;
  }
  .wallet-info-wrapper {
    display: flex;
    background: #FFFFFF;
    height: 5vw;
    padding: 0 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
    color: #fff;
    font-size: 3vw;
  }
  .wallet-unconnect {
    display: flex;
    background: #FFFFFF;
    height: 5vw;
    padding: 6px 8px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
    color: #fff;
    font-size: 3vw;
  }
  .wallet-unconnect:hover {
    opacity: 0.8;
  }
  .wallet-left {
    padding-right: 4px;
  }
  .wallet-right {
    padding-left: 12px;
  }
  .wallet-right:hover {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    opacity: 0.6;
  }
  .toggle-light {
    width: 38px;
    height: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .toggle-light:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  .language {
    width: 60px;
    height: 5vw;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    margin-left: 10px;
    cursor: pointer;
  }
  /deep/.el-input__inner {
    height: 30px;
    padding: 0 4px;
    font-size: 10px;
  }
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  /deep/.el-select .el-input .el-select__caret {
    display: none;
  }
  .language:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
}
</style>
