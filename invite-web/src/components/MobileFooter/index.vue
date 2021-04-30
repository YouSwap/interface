<template>
  <div class="footer-container">
    <template v-if="!isConnected">
      <div class="account">
        <div class="connect" @click="connectWallet">{{$t('connect')[0]}}</div>
      </div>
      <!-- <div class="connect" @click="connectWallet">{{$t('connect')[0]}}</div> -->
    </template>
    <template v-else>
      <div class="account">
        <!-- <div class="account-num">{{balance}}ETH</div> -->
        <template v-if="loading">
          <div class="loading-box"><span>Pending</span><loading></loading></div>
        </template>
        <template v-else>
          <div class="address" :title="account">{{shortenAddress(account, 4)}}</div>
        </template>
      </div>
    </template>
    <div class="footer-right">
      <div class="language-wrapper" @click="changeLangHandle">
          {{langTxt}}
        </div>
      <!-- <div class="light">
        <img :src="lightUrl" alt="">
      </div> -->
    </div>
  </div>
</template>

<script>
import bus from '../../assets/script/bus'
import loading from '../loading'
import { mapState } from 'vuex'
export default {
  components: {
    loading
  },
  props: {
    isConnected: {
      type: Boolean,
      require: true
    }
  },
  data () {
    return {
      lang: '',
      langTxt: '',
      loading: false,
      isShowLang: false,
      lightUrl: require('../../assets/image/light.png')
    }
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  mounted() {
    this.initLangHandle()
    bus.$on('showLoading', this.showLoadingHandle)
    bus.$on('closeLoading', this.closeLoadingHandle)
  },
  methods: {
    connectWallet() {
      bus.$emit('connectWallet')
    },
    scrollToTop() {
      let drag = 10
      const gap = document.documentElement.scrollTop || document.body.scrollTop;
      console.log(gap)
      if (gap > 0) {
        window.requestAnimationFrame(this.scrollToTop);
        window.scrollTo(0, gap - gap / drag);
      }
    },
    showLoadingHandle() {
      // this.scrollToTop()
      this.loading = true
    },
    closeLoadingHandle() {
      this.loading = false
    },
    /**
     * 格式化钱包地址
     */
    shortenAddress(address, chars, type) {
      let label = '...'
      if (type == 1) {
        label = '...'
      } else if (type == 2) {
        label = '****'
      }
      return `${address.substring(0, chars)}${label}${address.substring(42 - chars)}`
    },
    /**
     * 设置初始语言
     */
    initLangHandle() {
      let lang = 'en'
      let langTxt = 'EN'
      const localLang = localStorage.getItem('lang')
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
      this.$emit('setLang', lang)
      localStorage.setItem('lang', lang)
      document.title = this.$t('connect')[3]
    },
    changeLangHandle() {
      let lang = ''
      let langTxt = ''

      if (this.langTxt === 'EN') {
        lang = "zh"
        langTxt = "ZH"
      } else if (this.langTxt === 'ZH') {
        lang = "en"
        langTxt = "EN"
      }
      this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      localStorage.setItem('lang', lang)
      document.title = this.$t('connect')[3]
    }
  }
}

</script>
<style lang='less' scoped>
  .footer-container {
    position: fixed;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 68px;
    background: #FFFFFF;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5), 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 8px 8px 0px 0px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 20px;
    z-index: 1111;
    .account {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 36px;
      background: #FFFFFF;
      border-radius: 10px;
      .connect {
        height: 36px;
        line-height: 36px;
        padding: 0 10px;
        box-sizing: border-box;
        background: linear-gradient(
  80deg
  , #35BEB1 0%, #0C979C 100%);
        box-shadow: 0px 0px 2px 0px rgba(157, 157, 158, 0.5);
        border-radius: 10px;
        font-size: 12px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #fff;
        text-align: center;
      }
      .account-num {
        width: 86px;
        padding: 0 6px;
        box-sizing: border-box;
        font-size: 12px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
      }
      .loading-box {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 99px;
        height: 38px;
        padding: 0 15px;
        background: linear-gradient(
    80deg
    , #35BEB1 0%, #0C979C 100%);
        border-radius: 10px;
        box-sizing: border-box;
        span {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 38px;
        }
      }
      .address {
        height: 36px;
        line-height: 36px;
        padding: 0 5px;
        box-sizing: border-box;
        box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
        border-radius: 10px;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
      }
    }
    .footer-right {
      display: flex;
      align-items: center;
      .language-wrapper {
        margin-left: 10px;
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        color: #06263C;
        font-weight: 500;
        background: #F1F2F5;
        border-radius: 10px;
        cursor: pointer;
      }
      .light {
        background: #FFFFFF;
        border-radius: 8px;
        opacity: 0.8;
        margin-left: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
</style>