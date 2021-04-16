<template>
  <div class="product-wrapper">
    <div class="product-left">
      <span class="product-title">{{$t(`${digObj.title}`)}}</span>
      <span class="product-count">{{digObj.count}}</span>
    </div>
    <div class="product-right">
      <img :src="digImgUrl" alt="">
    </div>
  </div>
</template>

<script>
export default {
  props: ['digObj', 'digImgUrl'],
  data () {
    return {
    }
  }
}

</script>
<style lang='less' scoped>
  .product-wrapper {
    width: 420px;
    display: flex;
    justify-content: space-between;
    height: 123px;
    background: linear-gradient(80deg, #34BDB0 0%, #0C979C 100%);
    border-radius: 10px;
    padding: 22px 30px;
    .product-left {
      display: flex;
      flex-direction: column;
      .product-title {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 28px;
      }
      .product-count {
        margin-top: 13px;
        font-size: 30px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 38px;
        overflow: hidden;
        width: 200px;
      }
    }
    .product-right {
      width: 104px;
      display: flex;
      align-items: center;
      justify-content: center;
      & > img {
        width: 104px;
      }
    }
  }
  @media screen and (max-width: 1000px) {
    .product-wrapper {
      width: 90vw;
      display: flex;
      justify-content: space-between;
      height: 123px;
      background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
      border-radius: 10px;
      padding: 30px 30px;
      margin-top: 20px;
      .product-left {
        display: flex;
        flex-direction: column;
        .product-title {
          font-size: 16px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 22px;
        }
        .product-count {
          margin-top: 13px;
          font-size: 20px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 28px;
        }
      }
      .product-right {
        width: 80px;
        height: 80px;
        display: flex;
        align-items: center;
        justify-content: center;
        & > img {
          width: 80px;
        }
      }
    }
  }
</style>