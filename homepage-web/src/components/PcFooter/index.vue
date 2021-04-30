<template>
  <div class="footer-wrap">
    <div class="footer-wrap-inner">
      <div class="footer-inner">
        <div class="footer-left">
          <div class="img-wrap">
            <div @mouseenter="showActive(1)" @mouseleave="showActive(0)" @click="handleItemClick(0)">
              <img v-if="active === 1" class="img" :src="url1_active" alt="">
              <img v-else class="img" :src="url1" alt="">
            </div>
            <div @mouseenter="showActive(2)" @mouseleave="showActive(0)" @click="handleItemClick(1)">
              <img v-if="active === 2" class="img" :src="url2_active" alt="">
              <img v-else class="img" :src="url2" alt="">
            </div>
            <div @mouseenter="showActive(3)" @mouseleave="showActive(0)" @click="handleItemClick(2)">
              <img v-if="active === 3" class="img" :src="url3_active" alt="">
              <img v-else class="img" :src="url3" alt="">
            </div>
            <div @mouseenter="showActive(4)" @mouseleave="showActive(0)" @click="handleItemClick(3)">
              <img v-if="active === 4" class="img" :src="url4_active" alt="">
              <img v-else class="img" :src="url4" alt="">
            </div>
            <div @mouseenter="showActive(5)" @mouseleave="showActive(0)" @click="handleItemClick(4)">
              <img v-if="active === 5" class="img" :src="url5_active" alt="">
              <img v-else class="img" :src="url5" alt="">
            </div>
            <div @mouseenter="showActive(6)" @mouseleave="showActive(0)" @click="handleItemClick(5)">
              <img v-if="active === 6" class="img" :src="url6_active" alt="">
              <img v-else class="img" :src="url6" alt="">
            </div>
            <el-tooltip class="item" effect="dark" content="support@youswap.info" placement="top">
              <div @mouseenter="showActive(7)" @mouseleave="showActive(0)">
                <img v-if="active === 7" class="img" :src="url7_active" alt="">
                <img v-else class="img" :src="url7" alt="">
              </div>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" :content="$t('docs')" placement="top">
              <div @mouseenter="showActive(8)" @mouseleave="showActive(0)" @click="handleItemClick(6)">
                <img v-if="active === 8" class="img" :src="url8_active" alt="">
                <img v-else class="img" :src="url8" alt="">
              </div>
            </el-tooltip>
            <div @mouseenter="showActive(9)" @mouseleave="showActive(0)" @click="handleItemClick(9)">
              <img v-if="active === 9" class="img" :src="url9_active" alt="">
              <img v-else class="img" :src="url9" alt="">
            </div>
          </div>
        </div>
        <!-- <div class="footer-right">
          <el-button @click="WhitePaper">{{$t('WhitePaper')}}</el-button>
        </div> -->
      </div>
      <div class="footer-copy">
        <span>Copyright©2021 YouSwap All Rights Reserved</span>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      url1: require('../../assets/mining-img/Twitter.png'),
      url1_active: require('../../assets/mining-img/Twitter_active.png'),
      url2: require('../../assets/mining-img/telegram.png'),
      url2_active: require('../../assets/mining-img/telegram_active.png'),
      url3: require('../../assets/mining-img/medium.png'),
      url3_active: require('../../assets/mining-img/medium_active.png'),
      url4: require('../../assets/mining-img/facebook.png'),
      url4_active: require('../../assets/mining-img/facebook_active.png'),
      url5: require('../../assets/mining-img/csdn.png'),
      url5_active: require('../../assets/mining-img/csdn_active.png'),
      url6: require('../../assets/mining-img/weibo.png'),
      url6_active: require('../../assets/mining-img/weibo_active.png'),
      url7: require('../../assets/mining-img/youxiang.png'),
      url7_active: require('../../assets/mining-img/youxiang_active.png'),
      url8: require('../../assets/mining-img/faq.png'),
      url8_active: require('../../assets/mining-img/faq_active.png'),
      url9: require('../../assets/mining-img/github.png'),
      url9_active: require('../../assets/mining-img/github_active.png'),
      active: 0,
    };
  },
  methods: {
    showActive(index) {
      this.active = index;
    },
    WhitePaper() {
      if (Cookies.get('lang') === 'ZH') {
        window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-cn.pdf', '_self')
      } else {
        window.open('https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/swap-papper-en.pdf', '_self')
      }
    },
    handleItemClick(index) {
      switch(index) {
        case 0: 
          window.open('https://twitter.com/YouSwap_Global', '_self')
          break
        case 1:
          if (Cookies.get('lang') === 'ZH') {
            window.open('https://t.me/Youswap_DEX_CN', '_self')
          } else {
            window.open('https://t.me/youswapglobalofficial', '_self')
          }
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
          window.open('https://weibo.com/7572028591/profile?rightmod=1&wvr=6&mod=personinfo&is_all=1&sudaref=www.youswap.info', '_self')
          break
        case 6:
          window.open('https://youswap-1.gitbook.io/youswap/', '_self')
          break
        case 9:
          window.open('https://github.com/youswap/', '_self')
          break
      }
    }
  }
}

</script>
<style lang='less' scoped>
.footer-wrap {
  width: 100%;
  background: #001F34;
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  .footer-wrap-inner {
    width: 1200px;
    margin: 30px auto;
    text-align: center;
    display: flex;
    justify-content: space-between;
    .footer-inner {
      display: flex;
      align-items: center;
      justify-content: center;
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
            .img:hover {
              
            }
          }
          & > div:hover {
            cursor: pointer;
          }
        }
      }
      .footer-right {
        .el-button {
          width: 200px;
          height: 46px;
          background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
          border-radius: 8px;
          color: #fff;
          border: none;
        }
      }
    }
    .footer-copy {
      font-size: 14px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #EFF3F5;
      line-height: 30px;
      opacity: 0.5;
    }
  }
  
}
@media screen and (max-width: 1000px) {
  .footer-wrap {
    width: 100%;
    height: 100px;
    background: #001F34;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
    margin-bottom: 68px;
    .footer-wrap-inner {
      width: 100%;
      margin: 20px auto;
      text-align: center;
      display: inherit;
      .footer-inner {
        width: 100%;
        display: flex;
        align-items: center;
        display: inherit;
        justify-content: center;
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
            width:100%;
            margin-left: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            & > div {
              display: flex;
              margin-right: 10px;
              .img {
                width: 22px;
                height: 22px;
              }
            }
            & > div:hover {
              cursor: pointer;
            }
          }
        }
        .footer-right {
          .el-button {
            width: auto;
            height: 30px;
            background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
            border-radius: 10px;
            color: #fff;
            border: none;
            padding: 5px 10px;
            margin-right: 15px;
          }
        }
      }
      .footer-copy {
        margin-top: 20px;
        font-size: 10px;
        font-family: DINPro-Regular, DINPro;
        font-weight: 400;
        color: #EFF3F5;
        line-height: 12px;
        opacity: 1;
      }
    }
    
  }
}
</style>