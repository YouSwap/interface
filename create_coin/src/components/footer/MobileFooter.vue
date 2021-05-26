<template>
  <div class="footer-container">
    <div class="footer-left">
      <!-- <template v-if="!isConnected">
        <a href="javascript:;"
           class="connect"
           @click="connectWallet">{{$t('connectWallet')}}</a>
      </template>
      <template v-else>
        <div class="account">
          <template>
            <div class="address"
                 :title="account">{{shortenAddress(account, 4)}}</div>
          </template>
        </div>
      </template> -->
      <div v-if="network"
           class="wallet">
        <el-button class="wallet-unconnect"
                   v-if="!walletShow && !isConnected"
                   @click="connectWallet">{{$t('connectWallet')}}</el-button>
        <div class="wallet-info-wrapper"
             v-if="walletShow || isConnected">
          <div class="wallet-right">{{ disWalletAddress }}</div>
        </div>
      </div>
      <div class="wallet"
           v-else>
        <el-button class="wallet-unconnect">{{$t('networkError')}}</el-button>
      </div>
    </div>
    <div class="footer-right">
      <div class="language-wrapper"
           @click="handleLanguageChange">
        {{languageText}}
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
export default {
  props: ["isConnected", "account", "disWalletAddress"],
  data () {
    return {
      languageText: '',
      walletShow: false,
    }
  },
  mounted () {
    if (Cookies.get('lang') === 'ZH') {
      this.languageText = 'ZH'
      this.$i18n.locale = 'zh'
    } else if (Cookies.get('lang') === 'EN') {
      this.languageText = 'EN'
      this.$i18n.locale = 'en'
    } else {
      this.languageText = "ZH"
      this.$i18n.locale = 'zh'
    }
  },
  computed: {
    ...mapState({
      network: state => state.network
    })
  },
  methods: {
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
    /**
     * 语言切换
     */
    handleLanguageChange () {
      if (this.languageText === 'EN') {
        this.$i18n.locale = "zh"
        this.languageText = "ZH"
        Cookies.set('lang', "ZH", { domain: `${process.env.VUE_APP_DOMAIN}` })
        this.$store.commit('lan', "ZH")
        window.location.reload();
      } else if (this.languageText === 'ZH') {
        this.$i18n.locale = "en"
        this.languageText = "EN"
        Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
        this.$store.commit('lan', "EN")
        window.location.reload();
      }
    },
    /**
     * 连接钱包
     */
    async connectWallet () {
      this.$emit('connectWallet')
    },
  }
}

</script>
<style lang='less' scoped>
.footer-container {
  width: 100%;
  height: 68px;
  background: #ffffff;
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
    .wallet {
      margin-left: auto;
      .el-button {
        color: #fff;
        border: none;
        background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
        border-radius: 6px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
      }
      .wallet-unconnect:hover {
        opacity: 0.8;
      }
      .wallet-info-wrapper {
        display: flex;
        background: #ffffff;
        padding: 4px 12px;
        align-items: center;
        border-radius: 6px;
        cursor: pointer;
        background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
        color: #fff;
      }
      .wallet-right {
        display: flex;
        align-items: center;
        font-size: 15px;
        height: 30px;
        font-weight: 600;
      }
      .wallet-right:hover {
        border-top-left-radius: 6px;
        border-bottom-left-radius: 6px;
        opacity: 0.6;
      }
    }
    .connect {
      height: 38px;
      line-height: 38px;
      text-align: center;
      padding: 0 15px;
      background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
      border-radius: 8px;
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
      background: #ffffff;
      border-radius: 6px;
      .account-num {
        width: 86px;
        padding: 0 6px;
        box-sizing: border-box;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro, PingFang SC;
        font-weight: 500;
        color: #06263c;
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
        color: #06263c;
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
        background: #ffffff;
        border-radius: 8px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #06263c;
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
    .language-wrapper {
      margin-left: 20px;
      width: 38px;
      height: 38px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #06263c;
      font-weight: 500;
      background: #f1f2f5;
      border-radius: 10px;
      cursor: pointer;
    }
  }
}
</style>