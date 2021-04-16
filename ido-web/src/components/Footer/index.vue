<!-- footer 组件 -->
<template>
  <div class="footer-container">
    <div class="content-wrapper">
      <div class="medie">
        <span class="content">{{ $t('ContactUs') }}</span>
        <div class="img-wrapper">
          <a v-for="item in imgUrlLists" :key="item.id" :href="item.href" target="_blank"><img class="img-inner"  :src="item.url" alt=""></a>
        </div>
      </div>
      <div class="copy">
        <span>Copyright©2021 YouSwap All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      imgUrlLists: [
        {
          id: 0,
          url: require('../../assets/Twitter@2x.png'),
          href: 'https://twitter.com/YouSwap_Global',
        },
        {
          id: 1,
          url: require('../../assets/telegram@2x.png'),
          href: 'https://t.me/YouSwap_Dex',
        },
        {
          id: 2,
          url: require('../../assets/medium@2x.png'),
          href: 'https://medium.com/@adamkpeterson'
        },
         {
          id: 5,
          url: require('../../assets/facebook@2x.png'),
          href: 'https://www.facebook.com/YouSwap.Global'
        },
        {
          id: 3,
          url: require('../../assets/csdn@2x.png'),
          href: 'https://blog.csdn.net/YouSwap?spm=1010.2135.3001.5343'
        },
        {
          id: 4,
          url: require('../../assets/webo@2x.png'),
          href: 'https://weibo.com/7572028591/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1'
        }
      ]
    }
  }
}

</script>
<style scoped>
  .footer-container {
    width: 100%;
    height: 122px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #06263C;
  }
  .content-wrapper {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    color: #fff;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    line-height: 20px;
    align-items: center;
  }
  .medie {
    display: flex;
    align-items: center;
  }
  .content {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 20px;
  }
  .img-wrapper {
    margin-left: 27px;
  }
  .img-wrapper a{
    display: inline-block;
    width: 40px;
    height: 40px;
    cursor: pointer;
    margin-right: 20px;
  }
  .img-inner {
    width: 100%;
    height: 100%;
  }
  @media screen and (max-width: 1000px) {
    .footer-container {
      width: 100%;
      height: 122px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #06263C;
      margin-top: 60px;
    }
    .content-wrapper {
      width: 100%;
      display: flex;
      padding-top: 20px;
      flex-direction: column;
      text-align: center;
      margin: 0 auto 30px auto;
    }
    .content {
      font-size: 18px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 500;
      line-height: 25px;
    }
    .medie {
      display: block;
      /* padding-bottom: 50px; */
    }
    .medie .content {
      display: block;
      font-size: 4.8vw;
      margin: 30px 0;
    }
    .img-wrapper {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-left: 0;
    }
    .img-inner {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      margin-right: 8px;
    }
    .copy {
      /* padding: 30px 0; */
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #001F34;
      padding: 0;
      margin-top: 60px;
    }
    .copy > span {
      font-size: 12px;
      font-family: DINPro;
      color: #FFFFFF;
      line-height: 31px;
      opacity: 0.5;
    }
    .img-wrapper a{
      display: inline-block;
      width: 40px;
      height: 40px;
      cursor: pointer;
      margin-right: 10px;
    }
  }
</style>