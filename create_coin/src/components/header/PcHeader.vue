<template>
  <div>
    <div class="headerContant"
         :class="!isPC()? 'moblieContant': ''">
      <img v-if="isPC()"
           class="logo"
           :src="logo"
           alt="">
      <img v-else
           class="logo"
           :src="logo_mobile"
           alt="">
      <ul>
        <li :class="active === 1 ? 'active': ''"
            class="coin-contianer"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
          <a class="coin-wrap">{{$t('oneClickIco')}}<i :class="isHover ? 'up' : ''"></i></a>
          <div class="drop-down">
            <div class="drop-down-wrap"
                 :class="!isZh?'drop-down-wrap-EN':''"
                 v-if="isHover">
              <div class="drop-down-item"
                   :style="isZh ? 'minWidth: 195px' : 'minWidth: 250px'"
                   @mouseenter="handleHecoItemEnter"
                   @mouseleave="handleHecoItemLeave"
                   @click="handleCreateHecoCoin">
                <span>{{$t('createHecoCoin')}}</span>
                <img v-if="hecoIconShow"
                     :src="arrowRight"
                     alt="">
              </div>
              <div class="drop-down-item"
                   @mouseenter="handleBscItemEnter"
                   @mouseleave="handleBscItemLeave"
                   @click="handleCreateBscCoin">
                <span>{{$t('createBscCoin')}}</span>
                <img v-if="bscIconShow"
                     :src="arrowRight"
                     alt="">
              </div>
            </div>
          </div>
        </li>
        <li :class="active === 2 ? 'active': ''"
            @click="goList">{{$t('tokenList')}}</li>
      </ul>
      <template v-if="isPC()">
        <div v-if="network"
             class="wallet">
          <el-button class="wallet-unconnect"
                     v-if="!walletShow && !isConnected"
                     @click="handleConnectWallet">{{$t('connectWallet')}}</el-button>
          <div class="wallet-info-wrapper"
               v-if="walletShow || isConnected">
            <div class="wallet-right">{{ disWalletAddress }}</div>
          </div>
        </div>
        <div class="wallet"
             v-else>
          <el-button class="wallet-unconnect">{{$t('networkError')}}</el-button>
        </div>
        <div class="language">
          <button @click="handleLanChnage">{{languageText}}</button>
        </div>
      </template>
    </div>

  </div>
</template>

<script>
import { IsPC } from '../../utils'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  components: {},
  props: ['disWalletAddress', 'isConnected', 'account'],
  data () {
    return {
      logo: require('../../assets/image/logo@2x.png'),
      logo_mobile: require('../../assets/image/logo_mobile.png'),
      arrowRight: require('../../assets/image/arrow_right.png'),
      walletShow: false,
      languageText: '',
      // network: true,
      isHover: false,
      hecoIconShow: false,
      bscIconShow: false,
    };
  },
  mounted () {
    if (this.$route.path === '/main') {
      this.$store.commit('setActiveTab', 1)
    } else if (this.$route.path === '/list') {
      this.$store.commit('setActiveTab', 2)
    }
    this.initLanguage()
  },
  computed: {
    ...mapState({
      chainId: state => state.chainId,
      network: state => state.network,
      active: state => state.activeTab
    }),
    /**
     * 是否为中文
     */
    isZh () {
      return Cookies.get('lang') === 'ZH'
    }
  },
  methods: {
    // 初始化语言
    initLanguage () {
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
    // 切换语言
    handleLanChnage () {
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

    isPC () {
      return IsPC()
    },
    goHome () {
      this.$router.push('/main')
    },
    handleMouseEnter () {
      this.isHover = true
    },
    handleMouseLeave () {
      this.isHover = false
    },
    handleHecoItemEnter () {
      this.hecoIconShow = true
    },
    handleHecoItemLeave () {
      this.hecoIconShow = false
    },
    handleBscItemEnter () {
      this.bscIconShow = true
    },
    handleBscItemLeave () {
      this.bscIconShow = false
    },
    handleCreateHecoCoin () {
      localStorage.setItem('currentChainIdSelect', process.env.VUE_APP_HECO_CHAINID)
      if (this.chainId == 128) {
        this.$router.push('/')
        this.$message.warning('当前已为HECO网络')
      } else {
        this.$emit('addHecoChain')
      }
    },
    handleCreateBscCoin () {
      localStorage.setItem('currentChainIdSelect', process.env.VUE_APP_BSC_CHAINID)
      if (this.chainId == 56) {
        this.$router.push('/')
        this.$message.warning('当前已为BSC网络')
      } else {
        this.$emit('addBSCChain')
      }
    },
    goList () {
      this.$store.commit('setActiveTab', 2)
      this.$router.push('/list')
    },
    /**
     * 连接钱包
     */
    handleConnectWallet () {
      this.$emit('connectWallet')
    },
  },
};
</script>
<style scoped lang='less'>
.headerContant {
  width: 100%;
  height: 80px;
  padding: 0 40px 0 48px;
  background: #0d064b;
  display: flex;
  align-items: center;
  ul {
    margin-left: 20px;
    margin-top: 10px;
    .coin-contianer {
      position: relative;
      .coin-wrap {
        display: flex;
        align-items: center;
        position: relative;
        img {
          width: 5px;
          height: 5px;
          position: absolute;
          right: 10px;
          top: 0;
        }
        i {
          width: 8px;
          height: 6px;
          margin-left: 5px;
          background: url("../../assets/image/arrow_down.png") no-repeat;
          background-size: 100%;
          transition: 0.2s;
        }
        .up {
          transform: rotate(180deg);
        }
      }
      .drop-down {
        position: absolute;
        top: 0;
        left: 0;
        padding-top: 53px;
        .drop-down-wrap {
          display: flex;
          flex-direction: column;
          background: #ffffff;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 6px;
          .drop-down-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px 20px 15px 20px;
            & > span {
              font-size: 16px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #14181f;
              line-height: 22px;
              white-space: nowrap;
            }
            & > img {
              width: 16px;
              height: 16px;
            }
          }
          .drop-down-item:hover {
            background-color: #f8fbff;
          }
        }
        .drop-down-wrap-EN {
          width: 260px;
        }
      }
    }
    li {
      cursor: pointer;
      height: 100%;
      float: left;
      margin: 0 20px;
      color: #fff;
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    li:hover {
      color: #fafafa;
    }
  }
  .logo {
    height: 52px;
  }
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
  .language {
    margin-left: 40px;
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
    button {
      width: 100%;
      height: 100%;
      border-radius: 10px;
      cursor: pointer;
    }
  }
  .language:hover {
    opacity: 0.8;
  }
}
.moblieContant {
  padding: 0 20px;
  height: 50px;
  .logo {
    width: 60px;
    height: 39px;
  }
  ul {
    margin-top: 0;
    margin-left: 10px;
    li {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #bfc6cb;
      margin: 0 10px;
    }
  }
  .wallet-unconnect {
    width: 76px;
    height: 30px;
    background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
    border-radius: 8px;
    padding: 4px;
  }
}
.active {
  color: #c154ff !important;
}
</style>