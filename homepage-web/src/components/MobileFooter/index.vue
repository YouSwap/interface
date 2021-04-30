<template>
  <div class="footer-container">
    <div class="footer-left">
      <template v-if="!isConnected">
        <a href="javascript:;" class="connect" @click="connectWallet">{{$t('ConnectWallet_add')}}</a>
      </template>
      <template v-else>
        <div class="account">
          <!-- <div class="account-num">{{balance}}ETH</div> -->
          <template v-if="loading">
            <div class="loading-box"><span>pending</span><loading></loading></div>
          </template>
          <template v-else>
            <div class="address" :title="account">{{shortenAddress(account, 4)}}</div>
          </template>
        </div>
      </template>
    </div>
    <div class="footer-right">
      <div class="net-box" :class="nothing? 'nothing': ''" @click="showNetHandle">{{$t('network.heco')}}</div>
      <div class="language-wrapper" @click="handleLanguageChange">
        {{languageText}}
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import loading from '../loading'
export default {
  props:["isConnected", "balance", "account"],
  components: {
    loading
  },
  data () {
    return {
      lightUrl: require('../../assets/light.png'),
      languageText: '',
      loading: false,
      nothing: false
    }
  },
  mounted() {
    if (this.$route.path === '/acrossChain') {
      this.nothing = true
    }
    if (Cookies.get('lang') === 'ZH') {
      this.languageText = 'ZH'
      this.$i18n.locale = 'zh'
    } else if(Cookies.get('lang') === 'EN') {
      this.languageText = 'EN'
      this.$i18n.locale = 'en'
    } else {
      this.languageText = "ZH"
      this.$i18n.locale = 'zh'
    }
  },
  methods: {
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
     * 语言切换
     */
    handleLanguageChange () {
      if (this.languageText === 'EN') {
        this.$i18n.locale = "zh"
        this.languageText = "ZH"
        Cookies.set('lang', "ZH", {domain: `${process.env.VUE_APP_DOMAIN}`})
        this.$store.commit('lan', "ZH")
        // location.reload();
      } else if (this.languageText === 'ZH') {
        this.$i18n.locale = "en"
        this.languageText = "EN"
        Cookies.set('lang', "EN", {domain: `${process.env.VUE_APP_DOMAIN}`})
        this.$store.commit('lan', "EN")
        // location.reload();
      }
    },
    /**
     * 连接钱包
     */
    async connectWallet () {
      this.$emit('connectWallet')
    },
    /**
     * 切换明暗模式
     */
    handleLightClick () {
      alert('切换明暗模式')
    },
    showNetHandle() {
      this.$emit('showNet')
    }
  }
}

</script>
<style lang='less' scoped>
  .footer-container {
    width: 100%;
    height: 68px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 8px 8px 0px 0px;
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 100;
    .footer-left {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .connect {
        height: 38px;
        line-height: 38px;
        text-align: center;
        padding: 0 15px;
        background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
        border-radius: 10px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        cursor: pointer;
      }
      .connect:hover {
        opacity: .9;
      }
      .account {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 38px;
        background: #FFFFFF;
        border-radius: 6px;
        .account-num {
          width: 86px;
          padding: 0 6px;
          box-sizing: border-box;
          font-size: 16px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
          font-weight: 500;
          color: #06263C;
        }
        .address {
          width: 99px;
          height: 38px;
          line-height: 38px;
          padding: 0 5px;
          box-sizing: border-box;
          box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
          border-radius: 6px;
          font-size: 16px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
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
          background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
          border-radius: 6px;
          box-sizing: border-box;
          span {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 38px;
          }
        }
      }
      .lang-box {
        position: relative;
        margin-left: 10px;
        width: 100px;
        cursor: pointer;
        text-align: center;
        span {
          height: 38px;
          padding: 0 10px;
          display: block;
          box-sizing: border-box;
          background: #FFFFFF;
          border-radius: 8px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263C;
          line-height: 38px;
        }
        div {
          position: absolute;
          left: 0;
          top: 40px;
          width: 100px;
          height: 76px;
          background: #fff;
          border-radius: 8px;
          p {
            height: 38px;
            line-height: 38px;
          }
        }
      }
    }
    .footer-right {
      display: flex;
    
      .net-box {
        margin-left: 10px;
        height: 38px;
        padding: 0 10px;
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
      .language-wrapper {
        margin-left: 20px;
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
    }
  }
  .nothing{
    display: none!important;
  }
</style>