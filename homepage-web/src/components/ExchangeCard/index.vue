<template>
  <div class="exchange-wrapper">
    <div class="exchange-title">{{$t(`${exchangeObj.title1}`)}}</div>
    <div class="exchange-count">{{exchangeObj.content1}}</div>
    <div class="line"></div>
    <div class="exchange-title">{{$t(`${exchangeObj.title2}`)}}</div>
    <div class="exchange-count">{{exchangeObj.content2}}</div>
  </div>
</template>

<script>
export default {
  props: ['exchangeObj'],
  data () {
    return {
    }
  }
}

</script>
<style lang='less' scoped>
  .exchange-wrapper {
    margin-top: 20px;
    min-width: 420px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    padding: 30px;
    .exchange-title {
      font-size: 20px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #06263C;
      line-height: 28px;
      opacity: 0.5;
    }
    .exchange-count {
      margin-top: 15px;
      font-size: 30px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #06263C;
      line-height: 31px;
    }
    .line {
      margin-top: 31px;
      margin-bottom: 29px;
      height: 1px;
      border-bottom: 1px dashed #06263C;
      opacity: 0.2;
    }
  }
  @media screen and (max-width: 1000px) {
    .exchange-wrapper {
      min-width: 0;
      width: 90vw;
      margin-left: 0;
      margin-top: 15px;
      .exchange-title {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #06263C;
        line-height: 28px;
        opacity: 0.5;
      }
      .exchange-count {
        margin-top: 15px;
        font-size: 20px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 31px;
      }
    }
  }
</style>