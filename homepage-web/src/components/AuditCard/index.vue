<template>
  <div class="audit-wrapper-box">
    <div class="audit-wrapper">
      <div class="title">{{$t('YOU审计机构')}}</div>
      <div class="img-wrap"
           v-if="IsPC()">
        <div class="img-inner">
          <img class="img-left"
               :src="certikImgUrl"
               alt=""
               @click="handleCertikClick">
          <img class="img-right"
               :src="auditUrl"
               alt=""
               @click="handleAuditClick">
        </div>
      </div>
      <div class="img-wrap-mobile"
           v-else>
        <div class="img-inner">
          <img class="img-left"
               :src="certikMobileImgUrl"
               alt=""
               @click="handleCertikClick">
          <img class="img-right"
               :src="auditMobileUrl"
               alt=""
               @click="handleSwapClick">
        </div>
      </div>
      <!-- <div class="audit-wrapper-content">
        <img v-if="IsPC()" class="audit-wrapper-img" :src="auditWrapperImg" alt="">
        <div class="reportBox">
          <img class="audit-img" :src="this.$store.state.lan == 'EN' ? auditImgUrl : auditImgZhUrl" alt="">
          <div class="report-wrap">
            <div class="report-top">
              <div @click="handleLiquidityClick">{{$t('liquidityReport')}}</div>
              <div @click="handleSwapClick">{{$t('swapReport')}}</div>
            </div>
            <div class="report-bottom">
              <div @click="handleInviteClick">{{$t('invateReport')}}</div>
            </div>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      auditImgUrl: require('../../assets/mining-img/audit_icon.png'),
      auditImgZhUrl: require('../../assets/mining-img/audit_icon_zh.png'),
      auditWrapperImg: require('../../assets/auditWrapperImg.png'),
      certikImgUrl: require('../../assets/mining-img/certik.png'),
      certikMobileImgUrl: require('../../assets/mining-img/certik_mobile.png'),
      auditEnUrl: require('../../assets/mining-img/audit_en.png'),
      auditZhUrl: require('../../assets/mining-img/audit_zh.png'),
      auditMobileEnUrl: require('../../assets/mining-img/audit_mobile_en.png'),
      auditMobileZhUrl: require('../../assets/mining-img/audit_mobile_zh.png'),
    }
  },
  computed: {
    auditUrl () {
      return Cookies.get('lang') === 'ZH' ? this.auditZhUrl : this.auditEnUrl
    },
    auditMobileUrl () {
      return Cookies.get('lang') === 'ZH' ? this.auditMobileZhUrl : this.auditMobileEnUrl
    },
    isiOS () {
      const u = navigator.userAgent;
      const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1;
      return !isAndroid
    }
  },
  methods: {
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
    handleIDOClick () {
      if (Cookies.get('lang') === 'ZH') {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/white-papper-cn.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/white-papper-cn.pdf' }
          })
        }
      } else {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/white-papper-en.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/white-papper-en.pdf' }
          })
        }

      }
    },
    handleLiquidityClick () {
      if (Cookies.get('lang') === 'ZH') {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/youswap-mining-contract-zh.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/youswap-mining-contract-zh.pdf' }
          })
        }
      } else {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/youswap-mining-contract-en.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/youswap-mining-contract-en.pdf' }
          })
        }
      }
    },
    handleInviteClick () {
      if (Cookies.get('lang') === 'ZH') {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/mining-papper-cn.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/mining-papper-cn.pdf' }
          })
        }
      } else {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/mining-papper-en.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/mining-papper-en.pdf' }
          })
        }
      }
    },
    handleSwapClick () {
      if (Cookies.get('lang') === 'ZH') {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-cn.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-cn.pdf' }
          })
        }
      } else {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-en.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-en.pdf' }
          })
        }
      }
    },
    handleCertikClick () {
      if (this.isiOS) {
        window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/CertiKAuditReportYouSwap.pdf', '_self')
      } else {
        this.$router.push({
          path: 'fileRead',
          query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/CertiKAuditReportYouSwap.pdf' }
        })
      }
    },
    handleAuditClick () {
      if (Cookies.get('lang') === 'ZH') {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-cn.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-cn.pdf' }
          })
        }
      } else {
        if (this.isiOS) {
          window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-en.pdf', '_self')
        } else {
          this.$router.push({
            path: 'fileRead',
            query: { url: 'https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-en.pdf.pdf' }
          })
        }
      }
    }
  }
}

</script>
<style lang='less' scoped>
.no-show {
  color: #82929d !important;
  border: 1px solid #f0f4fa !important;
  cursor: default !important;
}
.no-show:hover {
  opacity: 1 !important;
}
.audit-wrapper-box {
  width: 100%;
  // background: #ffffff;
  margin-top: 30px;
  .audit-wrapper-img {
    width: 460px;
    height: 375px;
  }
  .audit-wrapper {
    width: 1000px;
    display: flex;
    flex-direction: column;
    padding-bottom: 36px;
    margin: 0 auto;
    .img-wrap {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30px;
      .img-inner {
        display: flex;
        align-items: center;
        & > img {
          width: 376px;
          height: 100px;
          cursor: pointer;
        }
        .img-right {
          margin-left: 37px;
        }
      }
    }
    .img-wrap-mobile {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 20px;
      .img-inner {
        display: flex;
        align-items: center;
        & > img {
          width: 142px;
          height: 46px;
        }
        .img-right {
          margin-left: 21px;
        }
      }
    }
    .title {
      text-align: center;
      font-size: 36px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #06263c;
      margin: 30px 0 50px 0;
    }
    .audit-wrapper-content {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .audit-img {
      width: 240px;
      margin-top: 68px;
    }
    .report-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      margin-top: 32px;
      .report-top,
      .report-bottom {
        display: flex;
        justify-content: space-between;
        & > div:first-child {
          margin-right: 20px;
        }
        & > div {
          width: 172px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          border: 2px solid #35bdb1;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #35bdb1;
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
}

@media screen and (max-width: 1000px) {
  .audit-wrapper-box {
    background-color: transparent;
    margin-top: 20px;
    .audit-wrapper {
      min-width: 0;
      width: 100% !important;
      margin-top: 15px !important;
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      padding: 20px;
      .title {
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263c;
        line-height: 22px;
        text-align: left;
        margin: 0;
      }
      .audit-img {
        width: 193px;
        height: 50px;
        margin-top: 20px !important;
      }
      .report-wrap {
        width: 100%;
        display: flex;
        flex-direction: column;
        margin-top: 32px;
        .report-top,
        .report-bottom {
          width: 100%;
          display: flex;
          justify-content: space-between;
          & > div:first-child {
            margin-right: 20px;
          }
          & > div {
            width: 138px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            border: 2px solid #35bdb1;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #35bdb1;
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
  }
}
</style>
