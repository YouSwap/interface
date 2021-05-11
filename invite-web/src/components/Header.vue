<!-- 头部导航栏 -->
<template>
  <div :class="poolType === 'deal' ? 'container' : 'liquidity-container'">
    <div class="head-container">
      <div class="title-wrapper"
           v-if="poolType === 'liquidity'">
        <span>{{$t('liquidity')[0]}}</span>
        <p>{{$t('liquidity')[1]}}</p>
      </div>
      <div class="total-reward"
           v-if="poolType === 'deal'">
        <span class="you-title">{{$t('todayAwardTotal')}}</span>
        <div class="apy-wrap">
          <span>APY</span>
          <span>{{apy.apy? apy.apy : '--'}}%</span>
        </div>
        <div class="you-count-wrap">
          <span>{{apy.total_amt ? apy.total_amt : '--'}}</span>
          <span>YOU</span>
        </div>
        <img :src="headBg"
             alt="">
      </div>
      <youswap-header :actived="actived"
                      :chainId="chainId"
                      :nowEnv="nowEnv" />
      <div class="head-right">
        <template v-if="!isConnected">
          <a href="javascript:;"
             class="connect"
             @click="connectWallet">{{$t('connect')[0]}}</a>
        </template>
        <template v-else>
          <div class="account">
            <div class="account-num">{{balance}}{{this.$store.state.coin}}</div>
            <template v-if="loading">
              <div class="loading-box"><span>Pending</span>
                <loading></loading>
              </div>
            </template>
            <template v-else>
              <div class="address"
                   :title="account">{{shortenAddress(account, 4)}}</div>
            </template>
          </div>
        </template>
        <!-- <div class="theme"></div> -->
        <div class="language-wrapper"
             @click="changeLangHandle">
          {{langTxt}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '../assets/script/bus'
import loading from './loading'
import Cookies from 'js-cookie'

export default {
  components: {
    loading
  },
  data () {
    return {
      logoUrl: require('../assets/image/logo@2x.png'),
      lightUrl: require('../assets/image/light.png'),
      headBg: require('../assets/image/mining-banner.gif'),
      lang: '',
      langTxt: '',
      isShowLang: false,
      startHeightOfPriIEO: '', // 私募开始时间
      endHeightOfPriIEO: '', // 私募结束时间
      loading: false,
      actived: 3,
      chainId: '128',
      nowEnv: process.env.VUE_APP_ENV
    }
  },
  props: {
    isConnected: {
      type: Boolean,
      require: true
    },
    poolType: {
      type: String,
      require: true
    },
    apy: {
      type: Object,
      require: true
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      balance: state => state.balance
    })
  },
  mounted () {
    this.initLangHandle()
    bus.$on('showLoading', this.showLoadingHandle)
    bus.$on('closeLoading', this.closeLoadingHandle)
  },
  methods: {
    // 跳转邀请
    handleLinkInvite () {
      this.$router.push('/invite')
    },
    handleLinkSwap () {
      window.open('http://localhost:3000/#/swap', '_blank')
    },
    handleLinkLiquatity () {
      window.open('http://localhost:3000/#/pool', '_blank')
    },
    /**
     * 设置初始语言
     */
    initLangHandle () {
      let lang = 'en'
      let langTxt = 'EN'
      const localLang = Cookies.get('lang') && typeof Cookies.get('lang') === 'string' ? Cookies.get('lang').toLowerCase() : ''
      if (localLang) {
        if (localLang == 'zh') {
          lang = 'zh'
          langTxt = 'ZH'
        }
      } else {
        // if ((navigator.language || navigator.systemLanguage).toLowerCase().indexOf('zh-cn') == -1) {
        //   lang = 'en'
        //   langTxt = 'English'
        // }
      }
      this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      Cookies.set('lang', lang.toUpperCase(), { domain: `${process.env.VUE_APP_DOMAIN}` })
      document.title = this.$t('connect')[3]
    },
    changeLangHandle () {
      let lang = ''
      let langTxt = ''

      if (this.langTxt === 'EN') {
        lang = "zh"
        langTxt = "ZH"
      } else if (this.langTxt === 'ZH') {
        lang = "en"
        langTxt = "EN"
      }
      // this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      Cookies.set('lang', lang.toUpperCase(), { domain: `${process.env.VUE_APP_DOMAIN}` })
      localStorage.setItem('lang', lang)
      document.title = this.$t('connect')[3]
      location.reload();
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
    scrollToTop () {
      let drag = 10
      const gap = document.documentElement.scrollTop || document.body.scrollTop;
      if (gap > 0) {
        window.requestAnimationFrame(this.scrollToTop);
        window.scrollTo(0, gap - gap / drag);
      }
    },
    showLoadingHandle (type) {
      if (type) {
        this.$nextTick(() => {
          let title = ''
          if (type === 'approval') {
            title = `${this.$t('ing.Approving')}`
          }
          if (type === 'staked') {
            title = `${this.$t('ing.Staking')}`
          }
          if (type === 'unstacked') {
            title = `${this.$t('ing.Unstaking')}`
          }
          if (type === 'receive') {
            title = `${this.$t('ing.Harvest')}`
          }
          this.$notify.info({
            title,
            duration: 0,
            showClose: true
          });
        });
      }
      this.loading = true
    },
    closeLoadingHandle () {
      this.$notify.closeAll();
      this.loading = false
    },
    connectWallet () {
      bus.$emit('connectWallet')
    }
  }
}

</script>
<style lang="less" scoped>
.liquidity-container {
  width: 100%;
  height: 400px;
  z-index: 100;
  background: url("../assets/image/top-bg.png") center no-repeat;
  background-size: 100% 100%;
  position: relative;
}
.container {
  width: 100%;
  height: 400px;
  z-index: 100;
  background: url("../assets/image/top-bg1.png") center no-repeat;
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
  font-size: 40px;
  font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
  font-weight: bold;
  color: #ffffff;
}
.title-wrapper > span {
  white-space: nowrap;
}
.title-wrapper > p {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 30px;
  font-size: 20px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #92a0a5;
}
.total-reward {
  width: 1200px;
  transform: translateX(-50%);
  position: absolute;
  left: 50%;
  top: 128px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: #fff;
  z-index: 9;
  & > img {
    width: 477px;
    position: absolute;
    right: 0;
    top: -68px;
  }
  .you-count-wrap {
    font-size: 20px;
    margin-top: 10px;
  }
  .you-title {
    font-size: 30px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #e4e8ea;
    line-height: 42px;
  }
  .apy-wrap {
    font-size: 60px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #35bdb1;
    line-height: 76px;
    text-shadow: 3px 0px 0px #465f5d;
    & > span:first-child {
      margin-right: 8px;
    }
  }
  .you-count-wrap {
    margin-top: 4px;
    font-size: 50px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #ffffff;
    line-height: 64px;
    & > span:first-child {
      margin-right: 8px;
    }
  }
}
.head-left {
  height: 30px;
  display: flex;
  align-items: flex-end;
  cursor: pointer;
  margin-top: 15px;
}
.head-left > img:hover {
  transform: rotate(-5deg);
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
  line-height: 20px;
  padding: 0 20px;
  cursor: pointer;
  a {
    color: #bfc6cb;
  }
  a:hover {
    color: #fff;
  }
  .active {
    color: #fff;
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
    background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
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
      font-family: DINPro-Medium, DINPro;
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
      font-family: DINPro-Medium, DINPro;
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
    margin-left: 6px !important;
    font-size: 3vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 20px;
    padding: 0 5px;
    cursor: pointer;
    a {
      color: #bfc6cb;
    }
    a:hover {
      color: #fff;
    }
    .active {
      color: #fff;
    }
  }
  .head-right {
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
</style>
