<!-- 合作伙伴模块样式组件 -->
<template>
  <div>
    <div class="el-row">
      <img src="../../statics/Partners7.png" alt="">
      <img src="../../statics/Partners8.png" alt="">
      <img src="../../statics/Partners9.png" alt="">
      <img src="../../statics/Partners10.png" alt="">
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
    display: flex;
    justify-content: center;
  }
  .el-row img {
    width: 140px;
    height: 50px;
    margin: 20px;
  }
  @media screen and (max-width: 1000px) {
    .el-row {
      width: 80vw;
      margin-bottom: 20px;
      display: inherit;
      margin: 0 auto;
    }
    .el-row img {
      width: 20vw;
      height: auto;
      margin: 2vw 3vw;
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