<!-- 合作伙伴模块样式组件 -->
<template>
  <div>
    <div class="el-row" >
      <img src="../../statics/partners@2x.png" alt="">
      <img src="../../statics/partner1.png" alt="">
      <img src="../../statics/partner2.png" alt="">
      <img src="../../statics/Partners1.png" alt="">
      <img src="../../statics/Partners2.png" alt="">
      <img src="../../statics/partner3.png" alt="">
      <img src="../../statics/Partners3.png" alt="">
      <img src="../../statics/Partners4.png" alt="">
      <img src="../../statics/Partners5.png" alt="">
      <img src="../../statics/Partners6.png" alt="">
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
    }
  }
}

</script>
<style scoped>
  .el-row {
    width: 1200px;
    margin-bottom: 20px;
  }
  .el-row img {
    width: 140px;
    height: 50px;
    margin: 10px;
  }
  @media screen and (max-width: 1000px) {
    .el-row {
      width: 80vw;
      margin: 0 auto;
      margin-bottom: 20px;
    }
    .el-row img {
      width: 20vw;
      height: auto;
      margin: 3vw;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>