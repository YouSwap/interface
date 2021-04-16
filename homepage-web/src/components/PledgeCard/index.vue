<!-- 当前流动性质押 -->
<template>
  <div class="pledge-card">
    <span class="card-title">{{$t('pledgeTotal')}}</span>
    <span class="pledge-count">{{getDecimalsCoinFn(totalUSDT, 3)}}</span>
    <div class="pledge-card-list" :class="this.$store.state.lan == 'EN' ? 'en-version' : ''">
      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('当前价格')}}</span>
        </div>
        <div class="item-right">
          <span v-show="pledgeNowPrice !== '--'">$</span>
          <span>{{pledgeNowPrice}}</span>
        </div>
      </div>

      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('YOU 余额')}}</span>
        </div>
        <div class="item-right">
          <span>{{youBalanceCount}}</span>
        </div>
      </div>

      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('总回购手续费')}}</span>
        </div>
        <div class="item-right">
          <span v-show="rewardFee !== '--'">$</span>
          <span>{{rewardFee}}</span>
        </div>
      </div>

      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('总回购销毁数量')}}</span>
        </div>
        <div class="item-right">
          <span>{{buyDestoryAmmount}}</span>
        </div>
      </div>

      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('实时通缩率')}}</span>
        </div>
        <div class="item-right">
          <span>{{realTimeDeflationRate}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getDecimalsCoin } from '../../utils'
export default {
  props: ['pledgeObj', 'realTimeDeflationRate', 'totalUSDT'],
  data () {
    return {
    }
  },
  computed: {
    pledgeAmmount() {
      return getDecimalsCoin(this.pledgeObj.totalCurrentAmmount, 3)
    },
    // 当前价格
    pledgeNowPrice() {
      return getDecimalsCoin(this.pledgeObj.nowPrice, 3)
    },
    // YOU 余额
    youBalanceCount () {
      if (this.pledgeObj.youBalance === '0.0') {
        return 0
      }
      return getDecimalsCoin(this.pledgeObj.youBalance, 3)
    },
    // 总回购手续费
    rewardFee () {
      return getDecimalsCoin(this.pledgeObj.rewardAmount, 3)
    },
    // 总回购销毁数量
    buyDestoryAmmount () {
      return getDecimalsCoin(this.pledgeObj.buyDestoryTotalCount, 3)
    }
  },
  methods: {
    /**
     * 截取小数精度
     */
    getDecimalsCoinFn(number, decimal) {
      return getDecimalsCoin(number, decimal)
    }
  }
}

</script>
<style lang='less' scoped>
  .pledge-card {
    width: 320px;
    display: flex;
    flex-direction: column;
    padding: 30px 30px 37px 30px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 20px;
    .card-title {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #06263C;
      line-height: 28px;
    }
    .pledge-count {
      margin-top: 11px;
      font-size: 30px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #06263C;
      line-height: 38px;
    }
    .pledge-card-list {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      .pledge-item {
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: rgba(105, 238, 203, 0.1);
        padding: 0 20px;
        color: #06263C;
        border-radius: 6px;
        margin-top: 10px;
        .item-left {
          & > span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #06263C;
            line-height: 20px;
            white-space: nowrap;
          }
        }
        .item-right {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 500;
          color: #06263C;
          line-height: 18px;
          & > span {
            font-family: PingFangSC-Regular, PingFang SC;
          }
        }
      }
    }
    .pledge-card-list.en-version {
      span {
        font-family: DINPro-Regular, DINPro!important;
      }
    }
    .btn {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
      border-radius: 10px;
      font-size: 16px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 21px;
      margin-top: 60px;
      outline: none;
      border: none;
      cursor: pointer;
    }
    .btn:hover {
      opacity: 0.8;
    }
  }
  @media screen and (max-width: 1000px) {
    .pledge-card {
      width: 90vw;
      display: flex;
      flex-direction: column;
      padding: 30px 20px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
      .card-title {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263C;
        line-height: 28px;
      }
      .pledge-count {
        margin-top: 11px;
        font-size: 30px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 38px;
      }
      .pledge-card-list {
        margin-top: 20px;
        display: flex;
        flex-direction: column;
        .pledge-item {
          height: 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: rgba(105, 238, 203, 0.1);
          padding: 0 20px;
          color: #06263C;
          border-radius: 6px;
          margin-top: 10px;
          .item-left {
            & > span {
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              color: #06263C;
              line-height: 20px;
            }
          }
          .item-right {
            font-size: 14px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: #06263C;
            line-height: 18px;
          }
        }
      }
      .btn {
        width: 100%;
        height: 45px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
        border-radius: 10px;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 21px;
        margin-top: 60px;
        outline: none;
        border: none;
        cursor: pointer;
      }
      .btn:hover {
        opacity: 0.8;
      }
    }
  }
</style>