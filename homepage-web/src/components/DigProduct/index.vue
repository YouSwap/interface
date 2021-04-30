<template>
  <div class="product-wrapper" :class="digImgUrl === '1'? 'active':''">
    <div class="product-wrappers">
      <div class="product-left">
        <span class="product-title">{{$t(`${digObj.title}`)}}</span>
        <span class="product-count">{{digObj.content}}</span>
      </div>
      <div v-if="IsPC()" class="line"></div>
      <div class="product-right">
        <div class="product-title">{{$t(`${digObj.title2}`)}}</div>
        <div class="product-count">{{digObj.content2}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['digObj', 'digImgUrl'],
  data () {
    return {

    }
  },
  methods: {
    // 判断是否是PC端
    IsPC() {
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
    }
  }
}

</script>
<style lang='less' scoped>
  .active {
    background: linear-gradient(80deg, #FF9650 0%, #FC751A 100%)!important;
  }
  .product-wrapper {
    width: 590px;
    height: 123px;
    /* background: linear-gradient(80deg, #34BDB0 0%, #0C979C 100%); */
    /* background: linear-gradient(72deg, #F0B70D 0%, #F8A229 100%); */
    background: linear-gradient(252deg, #0C979C 0%, #34BDB0 100%);
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 20px;
    .product-wrappers {
      display: flex;
      padding: 22px 30px;
      justify-content: space-between;
      align-items: center;
      background-image: url('../../assets/wenlih5.png');
      padding: 22px 30px;
      .line {
        width: 2px;
        height: 78px;
        background-image: url('../../assets/line.png');
        background-repeat: no-repeat;
      }
      .product-left,.product-right {
        width: 100%;
        display: flex;
        flex-direction: column;
        .product-title {
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 28px;
          opacity: 0.8;
        }
        .product-count {
          margin-top: 13px;
          font-size: 30px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 38px;
          overflow: hidden;
          width: 200px;
        }
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .active {
      background: linear-gradient(80deg, #FF9650 0%, #FC751A 100%)!important;
    }
    .product-wrapper {
      width: 90vw;
      height: auto;
      background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
      border-radius: 10px;
      padding: 0;
      margin-top: 20px;
      .product-wrappers {
        display: flex;
        flex-direction: column;
        background-image: url('../../assets/wenlih5.png');
        padding: 20px 20px;
        .product-left {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          border-bottom: 1px dashed #fff;
          margin-bottom: 15px;
          padding-bottom: 15px;
          .product-title {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #EFF3F5;
            line-height: 22px;
            opacity: 0.8;
          }
          .product-count {
            margin-top: 0px;
            font-size: 16px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #FFFDFA;
            line-height: 28px;
          }
        }
        .product-right {
          width: 100%;
          font-size: 12px;
          .product-title {
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #EFF3F5;
            line-height: 28px;
            font-size: 16px;
            opacity: 0.8;
          }
          .product-count {
            margin-top: 0px;
            font-size: 16px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #FFFDFA;
            line-height: 28px;
          }
        }
      }
      
    }
  }
</style>