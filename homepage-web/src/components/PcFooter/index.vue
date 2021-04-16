<template>
  <div class="footer-wrap">
    <div class="footer-inner">
      <div class="footer-left">
        <span>{{$t('contactUs')}}</span>
        <div class="img-wrap">
          <div @click="handleItemClick(0)">
            <img class="img" :src="url1" alt="">
          </div>
          <div @click="handleItemClick(1)">
            <img class="img" :src="url2" alt="">
          </div>
          <div @click="handleItemClick(2)">
            <img class="img" :src="url3" alt="">
          </div>
          <div @click="handleItemClick(3)">
            <img class="img" :src="url4" alt="">
          </div>
          <div @click="handleItemClick(0)">
            <img class="img" :src="url5" alt="">
          </div>
          <div @click="handleItemClick(4)">
            <img class="img" :src="url6" alt="">
          </div>
          <el-tooltip class="item" effect="dark" content="support@youswap.info" placement="top">
            <div>
              <img class="img" :src="url7" alt="">
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="footer-right">
        <span>Copyright©2021 YouSwap All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      url1: require('../../assets/mining-img/Twitter.png'),
      url2: require('../../assets/mining-img/telegram.png'),
      url3: require('../../assets/mining-img/medium.png'),
      url4: require('../../assets/mining-img/facebook.png'),
      url5: require('../../assets/mining-img/csdn.png'),
      url6: require('../../assets/mining-img/weibo.png'),
      url7: require('../../assets/mining-img/youxiang.png')
    };
  },
  methods: {
    handleItemClick(index) {
      switch(index) {
        case 0: 
          window.open('https://twitter.com/YouSwap_Global', '_self')
          break
        case 1:
          window.open('https://t.me/YouSwap_Dex', '_self')
          break
        case 2:
          window.open('https://medium.com/@adamkpeterson', '_self')
          break
        case 3:
          window.open('https://www.facebook.com/YouSwap.Global', '_self')
          break
        case 4:
          window.open('https://blog.csdn.net/YouSwap?spm=1010.2135.3001.5343', '_self')
          break
        case 5:
          window.open('https://weibo.com/7572028591/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1&sudaref=www.youswap.info')
          break
        case 6:
          window.open('https://weibo.com/7572028591/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1&sudaref=www.youswap.info')
          break
      }
    }
  }
}

</script>
<style lang='less' scoped>
.footer-wrap {
  margin-top: 60px;
  width: 100%;
  height: 110px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFFFFF;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  .footer-inner {
    width: 1200px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .footer-left {
      display: flex;
      align-items: center;
      & > span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #06263C;
        line-height: 20px;
      }
      .img-wrap {
        margin-left: 20px;
        display: flex;
        & > div {
          display: flex;
          margin-right: 16px;
          .img {
            width: 30px;
            height: 30px;
          }
        }
        & > div:hover {
          cursor: pointer;
        }
      }
    }
    .footer-right {
      font-size: 14px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #06263C;
      line-height: 18px;
      opacity: 0.5;
    }
  }
}
</style>