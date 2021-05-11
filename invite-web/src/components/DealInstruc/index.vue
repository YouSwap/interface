<template>
  <div>
    <div class="instruc-container-pc"
         v-if="platform === 2">
      <h3>{{$t('instrcTitle')}}</h3>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[0]')}}</p>
      <p>{{$t('dealPoolContent[1]')}}<span style="color: #FE535B;">1U</span> {{$t('dealPoolContent[2]')}}</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[3]')}}</p>
      <p>{{$t('dealPoolContent[4]')}}</p>
      <p>{{$t('dealPoolContent[5]')}}</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[6]')}}</p>
      <p>{{$t('dealPoolContent[7]')}}</p>
      <div class="list-box">
        <div class="list-item"
             v-for="(item, index) in lists"
             :key="index">
          <div class="first">{{$t('grade')}}{{index !== 0 ? index : ''}}</div>
          <div class="second">{{item.second === '个人交易额' ? $t('yourVolumn') : item.second}}</div>
          <div class="third">{{item.third === '算力系数' ? $t('hashpowerFactor') : item.third}}</div>
        </div>
      </div>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[8]')}}</p>
      <p>{{$t('dealPoolContent[9]')}}</p>
      <p>{{$t('dealPoolContent[10]')}} 100000 * 1 = 100000</p>
      <p>{{$t('dealPoolContent[11]')}}（300000-100000） * 1.1 = 220000</p>
      <p>{{$t('dealPoolContent[12]')}}（500000-300000） * 1.2 = 240000</p>
      <p>{{$t('dealPoolContent[13]')}}（800000-500000） * 1.3 = 390000</p>
      <p>{{$t('dealPoolContent[14]')}}100000+220000+240000+390000 = 950000。</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[15]')}}</p>
      <p>{{$t('dealPoolContent[16]')}}</p>
      <p>{{$t('dealPoolContent[17]')}}</p>
      <p>{{$t('dealPoolContent[18]')}}</p>
      <p>{{$t('dealPoolContent[19]')}}</p>
      <p>{{$t('dealPoolContent[20]')}}</p>
    </div>
    <div class="instruc-container-mobile"
         v-if="platform === 1">
      <h3>{{$t('instrcTitle')}}</h3>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[0]')}}</p>
      <p>{{$t('dealPoolContent[1]')}}<span style="color: #FE535B;">1U</span> {{$t('dealPoolContent[2]')}}</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[3]')}}</p>
      <p>{{$t('dealPoolContent[4]')}}</p>
      <p>{{$t('dealPoolContent[5]')}}</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[6]')}}</p>
      <p>{{$t('dealPoolContent[7]')}}</p>
      <div class="list-box">
        <div class="list-item"
             v-for="(item, index) in lists"
             :key="index">
          <div class="first">{{$t('grade')}}{{index !== 0 ? index : ''}}</div>
          <div class="second">{{item.second === '个人交易额' ? $t('yourVolumn') : item.second}}</div>
          <div class="third">{{item.third === '算力系数' ? $t('hashpowerFactor') : item.third}}</div>
        </div>
      </div>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[8]')}}</p>
      <p>{{$t('dealPoolContent[9]')}}</p>
      <p>{{$t('dealPoolContent[10]')}} 100000 * 1 = 100000</p>
      <p>{{$t('dealPoolContent[11]')}}（300000-100000） * 1.1 = 220000</p>
      <p>{{$t('dealPoolContent[12]')}}（500000-300000） * 1.2 = 240000</p>
      <p>{{$t('dealPoolContent[13]')}}（800000-500000） * 1.3 = 390000</p>
      <p>{{$t('dealPoolContent[14]')}}100000+220000+240000+390000 = 950000。</p>
      <p class="title"
         style="margin-top: 20px;">{{$t('dealPoolContent[15]')}}</p>
      <p>{{$t('dealPoolContent[16]')}}</p>
      <p>{{$t('dealPoolContent[17]')}}</p>
      <p>{{$t('dealPoolContent[18]')}}</p>
      <p>{{$t('dealPoolContent[19]')}}</p>
      <p>{{$t('dealPoolContent[20]')}}</p>
    </div>
  </div>

</template>

<script>
import { mapState } from 'vuex'
export default {
  data () {
    return {
      lists: [
        {
          first: '阶梯',
          second: '个人交易额',
          third: '算力系数'
        },
        {
          first: '阶梯',
          second: '0-100000U',
          third: '1'
        },
        {
          first: '阶梯',
          second: '100000U-300000U',
          third: '1.1'
        },
        {
          first: '阶梯',
          second: '300000U-500000U',
          third: '1.2'
        },
        {
          first: '阶梯',
          second: '500000U-800000U',
          third: '1.3'
        },
        {
          first: '阶梯',
          second: '800000U-1200000U',
          third: '1.4'
        },
        {
          first: '阶梯',
          second: '1200000U-9999999U',
          third: '1.5'
        },
      ]
    }
  },
  computed: {
    ...mapState({
      platform: state => state.platform
    })
  }
}
</script>

<style lang="less" scoped>
.title {
  color: #385163 !important;
}
.instruc-container-pc {
  width: 1200px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f2f6;
  margin-top: 20px;
  padding: 40px 30px 30px 30px;
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 18px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #06263c;
    line-height: 25px;
  }
  p {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #6a7d8a;
    line-height: 24px;
  }
  .list-box {
    width: 371px;
    margin-top: 10px;
    border-radius: 3px;
    border: 1px solid #979797;
    .list-item {
      height: 40px;
      display: flex;
      align-items: center;
      padding: 0 10px 0 20px;
      border-bottom: 1px solid #d8d8d8;
      font-size: 14px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #6a7d8a;
      line-height: 18px;
      .first {
        width: 107px;
        text-align: left;
        white-space: nowrap;
      }
      .second {
        width: 170px;
        text-align: left;
        white-space: nowrap;
      }
      .third {
        flex: 1;
        text-align: left;
        white-space: nowrap;
      }
    }
    .list-item:last-child {
      border-bottom: 0;
    }
  }
}
.instruc-container-mobile {
  width: 100%;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f2f6;
  margin-top: 20px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #06263c;
    line-height: 22px;
  }
  p {
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #6a7d8a;
    line-height: 20px;
  }
  .list-box {
    width: 270px;
    margin-top: 10px;
    border-radius: 3px;
    border: 1px solid #979797;
    .list-item {
      height: 35px;
      display: flex;
      align-items: center;
      padding: 0 10px 0 20px;
      border-bottom: 1px solid #d8d8d8;
      font-size: 12px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #6a7d8a;
      line-height: 15px;
      .first {
        width: 62px;
        text-align: left;
        white-space: nowrap;
      }
      .second {
        width: 150px;
        text-align: left;
        white-space: nowrap;
      }
      .third {
        flex: 1;
        text-align: left;
        white-space: nowrap;
      }
    }
    .list-item:last-child {
      border-bottom: 0;
    }
  }
}
</style>