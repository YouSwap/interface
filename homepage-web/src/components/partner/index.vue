<template>
  <div class="partner-content">
    <div class="partner-content-div">
      <div class="title">{{ $t('Partners')}}</div>
      <div>
        <img class="imgList"
             :src="IsPC()?imgList:imgListH5"
             alt="">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgList: require('../../assets/mining-img/partnerList.png'),
      imgListH5: require('../../assets/mining-img/partnerListH5.png'),
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
  }
}
</script>

<style lang="less" scoped>
.partner-content {
  width: 100%;
  // background: #EDF7FF;
  padding-bottom: 30px;
  .partner-content-div {
    width: 1200px;
    margin: 0 auto;
  }
  .title {
    text-align: center;
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #06263c;
    margin: 30px 0 50px 0;
  }
  .imgList {
    width: 1200px;
  }
}
@media screen and (max-width: 1000px) {
  .partner-content {
    width: 100%;
    padding-bottom: 30px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    margin-top: 20px;
    padding: 20px;
    .partner-content-div {
      width: 100%;
      margin: 0 auto;
      .title {
        text-align: left;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263c;
        margin: 0;
        height: 22px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263c;
        line-height: 22px;
      }
    }

    .imgList {
      margin-top: 20px;
      width: 100%;
    }
  }
}
</style>