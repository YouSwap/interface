<!-- 头部导航栏 -->
<template>
  <div class="container">
    <div class="head-container">
      <div class="title-wrapper">
        <div class="title1">{{title}}</div>
        <div class="title2">{{titleDesc}}</div>
      </div>
      <youswap-header :home="home"
                      :swap="swap"
                      :liquidity="liquidity"
                      :pool="pool"
                      :chart="chart"
                      :bridge="bridge"
                      :homeUrl="homeUrl"
                      :swapUrl="swapUrl"
                      :liquidityUrl="liquidityUrl"
                      :poolUrl="poolUrl"
                      :chartUrl="chartUrl"
                      :bridgeUrl="bridgeUrl"
                      :actived="actived"></youswap-header>
      <div class="head-right">
        <template v-if="!isConnected">
          <a href="javascript:;"
             class="connect"
             @click="connectWallet">{{$t('ConnectWallet_add')}}</a>
        </template>
        <template v-else>
          <div class="account">
            <div class="account-num">{{balance}}{{this.$store.state.coin}}</div>
            <template v-if="loading">
              <div class="loading-box"><span>pending</span>
                <loading></loading>
              </div>
            </template>
            <template v-else>
              <div class="address"
                   :title="account">{{shortenAddress(account, 4)}}</div>
            </template>
          </div>
        </template>
        <div class="net-box"
             :class="nothing? 'nothing': ''"
             @click.stop="showNetHandle">
          <div class="main-net"><span>{{$t('network.heco')}}</span><i :class="isShowNet ? 'up' : ''"></i></div>
          <div class="net-list"
               v-if="isShowNet">
            <a :href="youswapHECO"
               class="active">{{$t('network.heco')}}<img src="../../assets/mining-img/icon-cur.png"
                   alt=""></a>
            <a :href="youswapETH">{{$t('network.eth')}}</a>
            <a :href="youswapBSC">{{$t('network.bsc')}}</a>
          </div>
        </div>
        <div class="language-wrapper"
             @click="handleLanguageChange">
          {{languageText}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import loading from '../loading'

export default {
  components: {
    loading
  },
  props: ["isConnected", "balance", "account", "title", "titleDesc"],
  data () {
    return {
      logoUrl: require('../../assets/logo@2x.png'),
      mobileLogoUrl: require('../../assets/mining-img/logo@2x.png'),
      lightUrl: require('../../assets/light.png'),
      loading: false,
      languageText: '',
      isShowNet: false,
      youswapETH: process.env.VUE_APP_YOUSWAP_ETH,
      youswapHECO: process.env.VUE_APP_YOUSWAP_HECO,
      youswapBSC: process.env.VUE_APP_YOUSWAP_BSC,
      homeUrl: process.env.VUE_APP_HOME_URL,
      swapUrl: process.env.VUE_APP_SWAP_URL,
      liquidityUrl: process.env.VUE_APP_LIQUIDITY_URL,
      poolUrl: process.env.VUE_APP_POOL_URL,
      chartUrl: process.env.VUE_APP_CHART_URL,
      bridgeUrl: process.env.VUE_APP_ACROSSCHAIN_URL,
      actived: 0,
      nothing: ''
    }
  },
  mounted () {
    if (this.$route.path === '/acrossChain') {
      this.nothing = true
      this.active = 'across'
    }
    this.initEvent()
    if (Cookies.get('lang') === 'ZH') {
      this.languageText = 'ZH'
      this.$i18n.locale = 'zh'
      this.$store.commit('lan', "ZH")
    } else if (Cookies.get('lang') === 'EN') {
      this.languageText = 'EN'
      this.$i18n.locale = 'en'
      this.$store.commit('lan', "EN")
    } else {
      this.$i18n.locale = "en"
      this.languageText = "EN"
      Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
      this.$store.commit('lan', "EN")
    }
  },
  computed: {
    isEnglish () {
      return Cookies.get('lang') === 'EN'
    },
    home () {
      return this.$t('Home')
    },
    swap () {
      return this.$t('Swap')
    },
    liquidity () {
      return this.$t('liquidity')
    },
    pool () {
      return this.$t('LiquidityDig')
    },
    chart () {
      return this.$t('Quatation')
    },
    bridge () {
      return this.$t('crossChain')
    }
  },
  methods: {
    /**
     * 连接钱包
     */
    connectWallet () {
      this.$emit('connectWallet')
    },
    // 判断是否是PC端
    IsPC () {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    /**
     * 语言切换
     */
    handleLanguageChange () {
      if (this.languageText === 'EN') {
        this.$i18n.locale = "zh"
        this.languageText = "ZH"
        Cookies.set('lang', "ZH", { domain: `${process.env.VUE_APP_DOMAIN}` })
        this.$store.commit('lan', "ZH")
        location.reload();
      } else if (this.languageText === 'ZH') {
        this.$i18n.locale = "en"
        this.languageText = "EN"
        Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
        this.$store.commit('lan', "EN")
        location.reload();
      }
    },

    // 跳转首页
    handleLinkHome () {
      this.active = 'index'
      this.$router.push('/mining')
    },
    // 跳转详情页面
    handleLinkDetail () {
      this.$router.push('/detail')
    },

    /**
     * 格式化钱包地址
     */
    shortenAddress (address, chars, type) {
      let label = '...'
      if (type == 1) {
        label = '...'
      } else if (type == 2) {
        label = '****'
      }
      return `${address.substring(0, chars)}${label}${address.substring(42 - chars)}`
    },
    handleLinkSwap () {
      window.open(process.env.VUE_APP_SWAP_URL, '_self')
    },
    handleLinkLiquatity () {
      window.open(process.env.VUE_APP_LIQUIDITYT_URL, '_self')
    },
    handleLinkLiquatityDig () {
      window.open(process.env.VUE_APP_POOL_URL, '_self')
    },
    handleLinkQuatation () {
      window.open(process.env.VUE_APP_CHART_URL, '_self')
    },
    handleLinkAcross () {
      this.active = 'across'
      this.$router.push('/acrossChain')
    },
    handleLinkIDO () {
      window.open(process.env.VUE_APP_IDO_URL, '_self')
    },
    initEvent () {
      let that = this
      window.onclick = function () {
        that.isShowNet = false
      }
    },
    showNetHandle () {
      this.isShowNet = !this.isShowNet
    }
  }
}

</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: 360px;
  z-index: 100;
  background: url("../../assets/mining-img/top-bg.png") center no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.head-container {
  height: 68px;
  display: flex;
  justify-content: space-between;
  padding: 0 30px;
}
.title-wrapper {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 50px;
  font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
  font-weight: bold;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  .title1 {
    font-size: 40px;
    font-family: Futura-Medium, Futura;
    font-weight: 500;
    color: #ffffff;
    display: flex;
    justify-content: center;
  }
  .title2 {
    width: 610px;
    font-size: 20px;
    font-family: Alibaba-PuHuiTi-B, Alibaba-PuHuiTi;
    font-weight: normal;
    color: #ffffff;
    line-height: 34px;
    text-align: center;
    margin: 30px auto;
  }
}
.head-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .connect {
    height: 38px;
    line-height: 38px;
    text-align: center;
    padding: 0 15px;
    background: linear-gradient(80deg, #34bdb0 0%, #0c979c 100%);
    border-radius: 10px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    cursor: pointer;
  }
  .connect:hover {
    opacity: 0.9;
  }
  .language-wrapper {
    margin-left: 10px;
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #06263c;
    font-weight: 500;
    background-color: #fffdfa;
    border-radius: 10px;
    cursor: pointer;
  }
  .language-wrapper:hover {
    opacity: 0.8;
  }
  .account {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 38px;
    background: #fff;
    border-radius: 12px;
    .account-num {
      width: 92px;
      padding: 0 8px 0 12px;
      box-sizing: border-box;
      font-size: 16px;
      font-family: DINPro-Medium, DINPro, PingFang SC;
      font-weight: 500;
      color: #06263c;
    }
    .address {
      width: 112px;
      height: 38px;
      line-height: 38px;
      padding: 0 16px 0 12px;
      box-sizing: border-box;
      box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
      background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      border-radius: 12px;
      font-size: 16px;
      font-family: DINPro-Medium, DINPro, PingFang SC;
      font-weight: 500;
      color: #fff;
    }
    .loading-box {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 99px;
      height: 38px;
      padding: 0 15px;
      background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      border-radius: 12px;
      box-sizing: border-box;
      span {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 38px;
      }
    }
  }
  .net-box {
    position: relative;
    margin-left: 10px;
    width: 117px;
    cursor: pointer;
    text-align: center;
    .main-net {
      width: 100%;
      height: 38px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 15px;
      box-sizing: border-box;
      background: #fff;
      border-radius: 10px;
      span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263c;
        line-height: 38px;
      }
      i {
        width: 10px;
        height: 7px;
        margin-left: 3px;
        background: url("../../assets/mining-img/icon-arrow.png") no-repeat;
        background-size: 100%;
        transition: 0.2s;
      }
      .up {
        transform: rotate(180deg);
      }
    }
    .net-list {
      position: absolute;
      left: 0;
      top: 43px;
      width: 100%;
      background: #fff;
      border-radius: 8px;
      a {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        height: 38px;
        padding: 0 17px;
        box-sizing: border-box;
        line-height: 38px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263c;
      }
      a:first-child {
        border-bottom: 1px solid #f8f8f8;
      }
      .active {
        color: #35bdb1;
        img {
          width: 10px;
          height: 6px;
          margin-left: 13px;
        }
      }
    }
  }
}
.wallet-info-wrapper {
  display: flex;
  background: #ffffff;
  height: 38px;
  padding: 4px 12px;
  align-items: center;
  border-radius: 6px;
  cursor: pointer;
}
.wallet-unconnect {
  display: flex;
  background: #ffffff;
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
  background-color: #ffffff;
  border-radius: 6px;
  margin-left: 10px;
  cursor: pointer;
}
.toggle-light:hover {
  background-color: #ffffff;
  opacity: 0.8;
}

@media screen and (max-width: 1000px) {
  .container {
    width: 100%;
    height: 240px;
    left: 0;
    top: 0;
    z-index: 100;
    background: url("../../assets/mining-img/mobile_bg.png") center no-repeat;
    background-size: 100% 100%;
  }
  .head-container {
    width: 100%;
    display: flex;
    height: fit-content;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 0 20px;
  }
  .title-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 50px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #ffffff;
    line-height: 69px;
    display: flex;
    flex-direction: column;
  }
  .title-wrapper > div {
    white-space: nowrap;
    display: flex;
    justify-content: center;
  }
  .title-wrapper > div:first-child {
    font-size: 24px;
    font-family: Futura-Medium, Futura;
    font-weight: 500;
    color: #ffffff;
    line-height: 32px;
  }
  .title-wrapper > div:last-child {
    width: 300px;
    margin-top: 10px;
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 22px;
    white-space: normal;
  }
  .head-right {
    display: none !important;
    display: flex;
    align-items: center;
  }
  .wallet-info-wrapper {
    display: flex;
    background: #ffffff;
    height: 5vw;
    padding: 0 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
    color: #fff;
    font-size: 3vw;
  }
  .wallet-unconnect {
    display: flex;
    background: #ffffff;
    height: 5vw;
    padding: 6px 8px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
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
    background-color: #ffffff;
    border-radius: 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .toggle-light:hover {
    background-color: #ffffff;
    opacity: 0.8;
  }
  .language {
    width: 60px;
    height: 5vw;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #ffffff;
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
}
.nothing {
  display: none !important;
}
.disabled {
  color: #bfc6cb !important;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}
</style>
