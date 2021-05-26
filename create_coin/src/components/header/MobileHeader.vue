<template>
  <div>
    <div class="headerContant moblieContant">
      <img class="logo"
           :src="logo_mobile"
           alt="">
      <ul v-clickoutside="handleDropdownMenuHide">
        <li :class="active === 1 ? 'active': ''"
            class="coin-contianer">
          <a class="coin-wrap"
             @click="handleDropdownMenuShow">{{$t('oneClickIco')}}<i :class="isHover ? 'up' : ''"></i></a>
          <div class="drop-down">
            <div class="drop-down-wrap"
                 :class="!isZh?'drop-down-wrap-EN':''"
                 v-if="isHover">
              <div class="drop-down-item"
                   :class='{active:1==dynamic}'
                   @click="handleCreateHecoCoin">
                <span>{{$t('createHecoCoin')}}</span>
                <img v-if="hecoIconShow"
                     :src="arrowRight"
                     alt="">
              </div>
              <div class="drop-down-item"
                   :class='{active:2==dynamic}'
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
    </div>

  </div>
</template>

<script>
import { IsPC } from '../../utils'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'
const clickoutside = {
  // 初始化指令
  bind (el, binding) {
    function documentHandler (e) {
      // 这里判断点击的元素是否是本身，是本身，则返回
      if (el.contains(e.target)) {
        return false;
      }
      // 判断指令中是否绑定了函数
      if (binding.expression) {
        // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
        binding.value(e);
      }
    }
    // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
    el.__vueClickOutside__ = documentHandler;
    document.addEventListener('click', documentHandler);
  },
  unbind (el) {
    // 解除事件监听
    document.removeEventListener('click', el.__vueClickOutside__);
    delete el.__vueClickOutside__;
  },
};
export default {
  components: {},
  data () {
    return {
      logo_mobile: require('../../assets/image/logo_mobile.png'),
      arrowRight: require('../../assets/image/arrow_right.png'),
      languageText: '',
      isHover: false,
      hecoIconShow: true,
      bscIconShow: true,
      dynamic: false
    };
  },
  directives: { clickoutside },
  mounted () {
    if (this.$route.path === '/main') {
      this.$store.commit('setActiveTab', 1)
    } else if (this.$route.path === '/list') {
      this.$store.commit('setActiveTab', 2)
    }
  },
  computed: {
    ...mapState({
      chainId: state => state.chainId,
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
    isPC () {
      return IsPC()
    },
    handleCreateHecoCoin () {
      this.isHover = false
      this.dynamic = 1;
      localStorage.setItem('currentChainIdSelect', process.env.VUE_APP_HECO_CHAINID)
      this.$router.push('/')
      if (this.chainId == 128) {
        this.$message.warning('当前已为HECO网络')
      } else {
        this.isHover = false
        this.$emit('addHecoChain')
      }
    },
    handleCreateBscCoin () {
      this.isHover = false
      this.dynamic = 2;
      localStorage.setItem('currentChainIdSelect', process.env.VUE_APP_BSC_CHAINID)
      if (this.chainId == 56) {
        this.$message.warning('当前已为BSC网络')
      } else {
        this.isHover = false
        this.$emit('addBSCChain')
      }
    },
    goList () {
      this.$store.commit('setActiveTab', 2)
      this.$router.push('/list')
    },
    /**
     * 链切换
     */
    handleDropdownMenuShow () {
      this.isHover = !this.isHover
    },
    handleDropdownMenuHide () {
      this.isHover = false
    }
  }
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
        top: 20px;
        left: 0;
        padding-top: 20px;
        z-index: 999;

        .drop-down-wrap {
          width: 150px;
          display: flex;
          flex-direction: column;
          background: #ffffff;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 6px;

          .drop-down-item {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 15px 10px 15px 10px;

            & > span {
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #14181f;
              line-height: 22px;
            }

            & > img {
              margin-left: 20px;
              width: 16px;
              height: 16px;
            }
          }
          .active {
            background-color: #f8fbff;
          }
          .drop-down-item:hover {
            background-color: #f8fbff;
          }
        }
        .drop-down-wrap-EN {
          width: 230px;
        }
      }
    }

    li {
      cursor: pointer;
      height: 100%;
      float: left;
      margin: 0 20px;
      color: #fff;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
    }

    li:hover {
      color: #fafafa;
    }
  }

  .logo {
    height: 52px;
  }
}

.moblieContant {
  padding-left: 15px;
  display: flex;
  align-items: center;
  height: 60px;

  .logo {
    width: 50px;
    height: 32px;
  }

  ul {
    margin-top: 0;
    margin-left: 10px;

    li {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #bfc6cb;
      margin: 0 10px;
    }
  }
}

.active {
  color: #c154ff !important;
}
</style>