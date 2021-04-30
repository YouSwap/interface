<template>
  <div class="head-container">
    <div class="header-wrapper">
      <img height="20px" :src="logoUrl" alt="">
      <ul>
        <li><a :href="homeUrl">{{ $t('navs')[0] }}</a></li>
        <!-- <li @click="handleLinkInvite"><a>{{ $t('navs')[5] }}</a></li>-->
        <li><a :href="swapUrl">{{ $t('navs')[1] }}</a></li>
        <li><a :href="poolUrl">{{ $t('navs')[2] }}</a></li>
        <li><a class="active" href="/">{{ $t('navs')[3] }}</a></li>
        <li><a :href="chartUrl">{{ $t('navs')[4] }}</a></li>
        <li><a :href="acrossChainUrl">{{ $t('navs')[7] }}</a></li>
        <!-- <li><a :href="idoUrl">{{ $t('navs')[6] }}</a></li> -->
      </ul>
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
      chartUrl: process.env.VUE_APP_CHART_URL,
      acrossChainUrl: process.env.VUE_APP_ACROSSCHAIN_URL
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
    .header-wrapper {
      padding: 31px 30px 0 20px;
      display: flex;
      align-items: center;
      position: relative;
      img {
        width: 22px;
        height: 22px;
      }
      ul {
        display: flex;
        li {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          line-height: 20px;
          margin-left: 13px;
          opacity: 0.6;
        }
        a {
          color: #BFC6CB;
        }
        a:hover {
          color: #fff;
        }
        .active {
          color: #fff;
        }
      }
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