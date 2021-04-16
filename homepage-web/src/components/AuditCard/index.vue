<template>
  <div class="audit-wrapper">
    <span class="title">{{$t('YOU审计机构')}}</span>
    <img class="audit-img" :src="this.$store.state.lan == 'EN' ? auditImgUrl : auditImgZhUrl" alt="">
    <div class="report-wrap">
      <div class="report-top">
        <div @click="handleIDOClick">{{$t('idoReport')}}</div>
        <div @click="handleLiquidityClick">{{$t('liquidityReport')}}</div>
      </div>
      <div class="report-bottom">
        <div @click="handleSwapClick">{{$t('swapReport')}}</div>
        <div @click="handleInviteClick">{{$t('invateReport')}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      auditImgUrl: require('../../assets/mining-img/audit_icon.png'),
      auditImgZhUrl: require('../../assets/mining-img/audit_icon_zh.png')
    }
  },
  methods: {
    handleIDOClick () {
      if (Cookies.get('lan') === 'ZH') {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/white-papper-cn.pdf', '_self')
      } else {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/white-papper-en.pdf', '_self')
      }
    },
    handleLiquidityClick() {
      if (Cookies.get('lan') === 'ZH') {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/youswap-mining-contract-zh.pdf', '_self')
      } else {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/youswap-mining-contract-en.pdf', '_self')
      }
    },
    handleInviteClick () {
      if (Cookies.get('lan') === 'ZH') {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/mining-papper-cn.pdf', '_self')
      } else {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/mining-papper-en.pdf', '_self')
      }
    },
    handleSwapClick() {
      if (Cookies.get('lan') === 'ZH') {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/swap-papper-cn.pdf', '_self')
      } else {
        window.open('https://youswap.s3-ap-southeast-1.amazonaws.com/YouSwap/swap-papper-en.pdf', '_self')
      }
    },
  }
}

</script>
<style lang='less' scoped>
  .no-show {
    color: #82929D !important;
    border: 1px solid #F0F4FA !important;
    cursor: default !important;
  }
  .no-show:hover {
    opacity: 1 !important;
  }
  .audit-wrapper {
    min-width: 320px;
    display: flex;
    flex-direction: column;
    padding: 30px 30px 36px 30px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    .title {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #06263C;
      line-height: 28px;
    }
    .audit-img {
      width: 170px;
      margin-top: 68px;
    }
    .report-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 32px;
      .report-top, .report-bottom {
        display: flex;
        justify-content: space-between;
        & > div {
          width: 120px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 1px solid #35BDB1;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #35BDB1;
          line-height: 12px;
          cursor: pointer;
        }
        & > div:hover {
          opacity: 0.8;
        }
      }
      .report-bottom {
        margin-top: 15px;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .audit-wrapper {
      min-width: 0;
      width: 90vw;
      margin-top: 15px;
      .audit-img {
        margin-top: 30px;
      }
    }
  }
</style>