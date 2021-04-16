<template>
  <div class="head-container">
    <div class="head-wrap">
      <youswap-header
        :home="home"
        :swap="swap"
        :pool="pool"
        :liquidity="liquidity"
        :chart="chart"
        :bridge="bridge"
        :homeUrl="homeUrl"
        :swapUrl="swapUrl"
        :poolUrl="poolUrl"
        :liquidityUrl="liquidityUrl"
        :chartUrl="chartUrl"
        :briderUrl="briderUrl"
        :actived="actived">
      </youswap-header>
      <div class="slogn-wrap">
        <p>{{$t('liquidity')[0]}}</p>
        <p>{{$t('liquidity')[1]}}</p>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      logoUrl: require('../../assets/image/logoPhone.png'),
      homeUrl: process.env.VUE_APP_HOME_URL,
      idoUrl: process.env.VUE_APP_IDO_URL,
      swapUrl: process.env.VUE_APP_SWAP_URL,
      poolUrl: process.env.VUE_APP_POOL_URL,
      liquidityUrl: process.env.VUE_APP_LIQUIDITY_URL,
      chartUrl: process.env.VUE_APP_CHART_URL,
      acrossChainUrl: process.env.VUE_APP_ACROSSCHAIN_URL,
      actived: 3
    }
  },
  computed: {
    home () {
      return this.$t('navs')[0]
    },
    swap () {
      return this.$t('navs')[1]
    },
    pool () {
      return this.$t('navs')[3]
    },
    liquidity () {
      return this.$t('navs')[2]
    },
    chart () {
      return this.$t('navs')[4]
    },
    bridge () {
      return this.$t('navs')[7]
    }
  },
  methods: {
    // 跳转邀请
    handleLinkInvite () {
      this.$router.push('/invite')
    }
  }
}

</script>
<style lang='less' scoped>
  .head-container {
    width: 100%;
    height: 192px;
    background: url('../../assets/image/bg@2x.png') center no-repeat;
    background-size: 100% 100%;
    .head-wrap {
      width: 100%;
      height: fit-content;
      display: flex;
      align-items: center;
      padding: 0 0 0 20px;
      .slogn-wrap {
        position: absolute;
        left: 50%;
        top: 84px;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        & > p:first-child {
          font-size: 20px;
          font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
          font-weight: bold;
          color: #FFFFFF;
          line-height: 27px;
          white-space: nowrap;
        }
        & > p:last-child {
          margin-top: 9px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          line-height: 20px;
          opacity: 0.6;
        }
      }
    }
  }
</style>