<template>
  <div class="introduct">
    <div class="head">
      <img v-on:click="back"
           class="arrow_left"
           :src="leftImg"
           alt="">
      <span>{{$t('typeText1')}}</span>
    </div>
    <div class="division"></div>
    <div class="introduct_text">
      <p>{{$t('title[0]')}}</p>
      <span>{{$t('content[1]')}}</span>
    </div>
    <div class="introduct_text">
      <p>{{$t('title[1]')}}</p>
      <span>{{$t('content[1]')}}</span>
    </div>
    <div class="introduct_text">
      <p>{{$t('title[2]')}}</p>
      <span>{{$t('content[2]')}}</span>
      <span>{{$t('content[3]')}}</span>
      <span>{{$t('content[4]')}}</span>
      <span>{{$t('content[5]')}}</span>
    </div>
    <div class="introduct_text">
      <p>{{$t('title[3]')}}</p>
      <span>{{$t('content[6]')}}</span>
      <span>{{$t('content[7]')}}</span>
      <span>{{$t('content[8]')}}</span>
    </div>
    <div class="introduct_text">
      <p>{{$t('title[4]')}}</p>
      <span>{{$t('content[9]')}}</span>
      <span>{{$t('content[10]')}}</span>
      <span>{{$t('content[11]')}}</span>
      <span style="color: red">{{$t('content[12]')}}</span>
      <span>{{$t('content[13]')}}</span>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
export default {
  data () {
    return {
      leftImg: require('../../assets/image/icon_left.png')
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
    back () {
      this.$router.go(-1);//返回上一层
    },
  }
}
</script>

<style lang="less" scoped>
.introduct {
  width: 100%;
  padding-bottom: 22px;
  .head {
    width: 100%;
    height: 58px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    padding-left: 15px;
    position: relative;
    .arrow_left {
      width: 9px;
      height: 15px;
      position: absolute;
      top: 22px;
      left: 15px;
    }
    span {
      text-align: center;
    }
  }
  .division {
    width: 100%;
    height: 20px;
    background: #f8fcff;
  }

  .introduct_text {
    padding: 0 12px 0 15px;
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
    color: #385163;
    line-height: 20px;
  }
}
</style>