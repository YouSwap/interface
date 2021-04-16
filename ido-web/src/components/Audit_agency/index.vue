<!--  -->
<template>
  <div>
    <div class="views">
      <img class="pic" :src="webp" alt="" />
      <div class="view">
        <div><img class="logo" :src="viewRecord" alt=""></div>
        <div>
          <!-- https://raw.githubusercontent.com/amazingHuo/YouSwap/master -->
          <el-button class="btn">
            <a target="_blank" :href="lan === 'zh' ? '/YouSwap-smart-contract-zh.pdf': '/YouSwap-smart-contract-en.pdf'">{{$t('viewRecord')}}</a>
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import cookie from 'js-cookie'
export default {
  data() {
    return {
      viewRecord: require('../../assets/viewRecord.png'),
      webp: require('../../assets/webp@3x.png'),
      lan: cookie.get('lan'),
    };
  },
  created() {},
  mounted() {},
};
</script>
<style scoped>
  .views {
    width: 1000px;
    display: flex;
    justify-content: space-between;
  }
  .pic {
    width: 460px;
    height: 375px;
  }
  .logo {
    width: 210px; 
    height: auto;
  }
  .view {
    text-align: center;
    padding-top: 100px;
  }
  .btn{
    width: 200px;
    height: 46px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border-radius: 8px;
    color: #fff;
    margin-top: 55px;
    border: none;
  }
  .btn a {
    color: #fff;
  }
@media (max-width: 1000px) {
  .views {
    width: 90%;
    display: block;
    text-align: center;
    margin-bottom:40px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto 50px auto;
  }
  .logo {
    width: 106px;
    height: 30px;
  }
  .pic {
    width: 170px;
    height: 138px;
  }
  .view {
    text-align: center;
    padding-top: 30px;
  }
  .btn{
    width: 120px;
    height: 36px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border-radius: 8px;
    color: #fff;
    margin-top: 20px;
    border: none;
    font-size: 14px;
  }
  .btn a {
    color: #fff;
  }
}
</style>