<template>
  <div class="introduct">
    <div class="content">
      <div class="head"
           @click="handleGoBack">
        <img :src="forwordImg"
             alt="">
        <span>{{$t('typeText1')}}</span>
      </div>
      <div class="introduct_text">
        <p>{{$t('title')[0]}}</p>
        <span>{{$t('content')[0]}}</span>
      </div>
      <div class="introduct_text">
        <p>{{$t('title')[1]}}</p>
        <span>{{$t('content')[1]}}</span>
      </div>
      <div class="introduct_text">
        <p>{{$t('title')[2]}}</p>
        <span>{{$t('content')[2]}}</span>
        <span>{{$t('content')[3]}}</span>
        <span>{{$t('content')[4]}}</span>
        <span>{{$t('content')[5]}}</span>
      </div>
      <div class="introduct_text">
        <p>{{$t('title')[3]}}</p>
        <span>{{$t('content')[6]}}</span>
        <span>{{$t('content')[7]}}</span>
        <span>{{$t('content')[8]}}</span>
      </div>
      <div class="introduct_text">
        <p>{{$t('title')[4]}}</p>
        <span>{{$t('content')[9]}}</span>
        <span>{{$t('content')[10]}}</span>
        <span>{{$t('content')[11]}}</span>
        <span style="color: red">{{$t('content')[12]}}</span>
        <span>{{$t('content')[13]}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      forwordImg: require('../../assets/image/forword.png')
    }
  },
  mounted () {
    if (Cookies.get('lang') === 'ZH') {
      this.$i18n.locale = 'zh'
    } else if (Cookies.get('lang') === 'EN') {
      this.$i18n.locale = 'en'
    } else {
      this.$i18n.locale = 'zh'
    }
  },
  computed: {

  },
  methods: {
    handleGoBack () {
      this.$router.push('/')
    },
    back () {
      this.$router.go(-1);//返回上一层
    },
  }
}
</script>

<style lang="less" scoped>
.introduct {
  width: 100%;
  display: flex;
  justify-content: center;
  .content {
    width: 1200px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    margin-top: 40px;
    padding: 30px;
    .head {
      display: flex;
      align-items: center;
      cursor: pointer;
      & > img {
        width: 16px;
        height: 10px;
      }
      & > span {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #14181f;
        line-height: 25px;
        margin-left: 10px;
      }
    }
    .introduct_text {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
    }
    .introduct_text p,
    span {
      text-align: left;
      font-family: PingFangSC-Medium, PingFang SC;
    }
    .introduct_text p {
      font-size: 14px;
      font-weight: 500;
      color: #385163;
      line-height: 20px;
      margin-bottom: 4px;
    }
    .introduct_text span {
      font-size: 12px;
      font-weight: 400;
      color: #82929d;
      line-height: 20px;
    }
  }
}
</style>