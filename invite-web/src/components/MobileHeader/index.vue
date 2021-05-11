<template>
  <div class="head-container"
       :class="poolType === 'deal'? 'dealPool' : ''">
    <div class="head-wrap">
      <youswap-header :nowEnv="nowEnv"
                      :actived="actived"
                      :chainId="chainId" />
      <div class="slogn-wrap"
           v-if="!(poolType === 'deal')">
        <p>{{$t('liquidity')[0]}}</p>
        <p>{{$t('liquidity')[1]}}</p>
      </div>
      <div class="slogn-wrap-deal"
           v-else>
        <div class="info">
          <p>{{$t('todayAwardTotal')}}</p>
          <p>APY {{apy.apy ? apy.apy : '--'}}%</p>
          <p>{{apy.total_amt ? apy.total_amt : '--'}} YOU</p>
        </div>
        <img :src="dealPoolimg"
             alt="">
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
      dealPoolUrl: process.env.VUE_APP_DEALPOOL_URL,
      liquidityUrl: process.env.VUE_APP_LIQUIDITY_URL,
      chartUrl: process.env.VUE_APP_CHART_URL,
      acrossChainUrl: process.env.VUE_APP_ACROSSCHAIN_URL,
      actived: 3,
      chainId: '128',
      nowEnv: process.env.VUE_APP_ENV,
      dealPoolimg: require('../../assets/image/mining-banner.gif')
    }
  },
  props: {
    poolType: {
      type: String,
      require: false
    },
    apy: {
      type: Object,
      require: false
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
  background: url("../../assets/image/bg@2x.png") center no-repeat;
  background-size: 100% 100%;
  .head-wrap {
    width: 100%;
    height: fit-content;
    display: flex;
    align-items: center;
    padding: 0 0 0 20px;
    .slogn-wrap {
      min-width: 80%;
      line-height: 30px;
      position: absolute;
      left: 50%;
      top: 84px;
      transform: translateX(-50%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      & > p:first-child {
        font-size: 20px;
        font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
        font-weight: bold;
        color: #ffffff;
        line-height: 27px;
        white-space: nowrap;
      }
      .info {
        line-height: 30px;
        > p:first-child {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(228, 232, 234, 0.8);
        }
        > p:nth-child(2) {
          font-size: 20px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          color: #35bdb1;
          text-shadow: 1px 0px 0px #465f5d;
        }
        > p:last-child {
          font-size: 16px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          color: #ffffff;
        }
      }
      & > p:last-child {
        margin-top: 9px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #ffffff;
        line-height: 20px;
        opacity: 0.6;
      }
    }
  }
  .slogn-wrap-deal {
    width: 100%;
    height: fit-content;
    position: absolute;
    left: 50%;
    top: 10px;
    transform: translateX(-50%);
    padding: 0 20px;
    margin-top: 38px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #ffffff;
    .info {
      > p:first-child {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(228, 232, 234, 0.8);
        line-height: 17px;
      }
      > p:nth-child(2) {
        font-size: 20px;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #35bdb1;
        line-height: 26px;
        margin-top: 4px;
        text-shadow: 1px 0px 0px #465f5d;
      }
      > p:last-child {
        font-size: 16px;
        font-family: DINPro-Bold, DINPro;
        font-weight: bold;
        color: #ffffff;
        line-height: 21px;
        margin-top: 4px;
      }
    }
    > img {
      width: 156px;
      height: 113px;
    }
  }
}

.dealPool {
  background: url("../../assets/image/dealPoolHeader.png") center no-repeat;
  background-size: 100% 100%;
}
</style>