<!-- 当前流动性质押 -->
<template>
  <div>
    <div class="pledge-card">
      <div class="title">
        <img v-if="IsPC()"
             class="img-title"
             :src="titleImg"
             alt="">
        <div class="card-title">{{$t('pledgeTotal')}}
          <template v-if="TotalTvlAmount == '--'">
            --
          </template>
          <template v-else>
            <countTo :startVal="startVal"
                     :endVal='TotalTvlAmount'
                     :decimals="2"
                     :duration='500'></countTo>
          </template> USDT
        </div>
      </div>
      <div class="dataList">
        <div class="list"
             v-for="(list, index) in dataList"
             :key="index">
          <div class="list_div">
            <img :src="list.icon"
                 alt="">
            <span>{{$t('pledgeCurrer')}} <span v-if="!IsPC()">(USDT)</span></span>
          </div>
          <div class="countTo">
            <template v-if="list.number == '--'">
              --
            </template>
            <template v-else>
              <countTo :startVal="startVal"
                       :endVal='list.number'
                       :decimals="2"
                       :duration='500'></countTo>
            </template>
            <span v-if="IsPC()">USDT</span>
          </div>
        </div>
      </div>
    </div>
    <div class="pledge-card-list"
         :class="this.$store.state.lan == 'EN' ? 'en-version' : ''">
      <div class="pledge-item">
        <div class="item-left">
          <!-- <img src="" alt=""> -->
          <span>{{$t('当前价格')}}</span>
        </div>
        <div class="item-right">
          <span v-show="pledgeNowPrice !== '--'">$</span>
          <span>{{pledgeNowPrice}}</span>
          <!-- <span>0.52</span> -->
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
import countTo from 'vue-count-to';
export default {
  props: ['pledgeObj', 'realTimeDeflationRate', 'totalUSDT'],
  data () {
    return {
      titleImg: require('../../assets/index-title.png'),
      EthTvlAmount: '--',
      HecoTvlAmount: '--',
      BSCTvlAmount: '--',
      TotalTvlAmount: '--',
      startVal: 0,
    }
  },
  components: { countTo },
  mounted () {
    this.getData();
    setInterval(() => {
      this.getData()
    }, 5000)
  },
  computed: {
    pledgeAmmount () {
      return getDecimalsCoin(this.pledgeObj.totalCurrentAmmount, 3)
    },
    // 当前价格
    pledgeNowPrice () {
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
    },
    dataList () {
      return [
        {
          id: 1,
          icon: require('../../assets/huobi.png'),
          number: this.HecoTvlAmount,
        },
        {
          id: 2,
          icon: require('../../assets/ETH.png'),
          number: this.EthTvlAmount,
        },
        {
          id: 2,
          icon: require('../../assets/BSC.png'),
          number: this.BSCTvlAmount,
        }
      ]
    },
  },
  methods: {
    // 判断是否是PC端
    IsPC () {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
        "SymbianOS", "Windows Phone",
        "iPad", "iPod"];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) {
          flag = false;
          break;
        }
      }
      return flag;
    },
    /**
     * 截取小数精度
     */
    getDecimalsCoinFn (number, decimal) {
      return getDecimalsCoin(number, decimal)
    },
    getData () {
      this.$get(process.env.VUE_APP_VUE_TVL).then(res => {
        this.EthTvlAmount = res.mainnet
        this.HecoTvlAmount = res.heconet
        this.BSCTvlAmount = res.bscnet
        this.TotalTvlAmount = res.total
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
    }
  }
}

</script>
<style lang='less' scoped>
.pledge-card {
  width: 1200px;
  padding: 30px 0px;
  background: #ffffff;
  border-radius: 20px;
  background: linear-gradient(360deg, #ffffff 0%, #c1e9e9 100%);
  box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
  border-radius: 20px;
  .title {
    display: flex;
    align-items: center;
    justify-content: center;
    .img-title {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    .card-title {
      font-size: 26px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 300;
      color: #35bdb1;
      line-height: 42px;
      > span {
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        font-size: 30px;
      }
    }
  }
  .dataList {
    margin-top: 24px;
    display: flex;
    padding: 0;
    align-items: center;
    justify-content: center;
    position: relative;
    .line {
      width: 0.5px;
      height: 50%;
      background: #cdd4d8;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .list:last-child {
      line-height: 32px;
      margin-right: 0;
      img {
        margin-right: 4px;
      }
    }
    .list {
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 30px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #666666;
      margin-right: 20px;
      .list_div {
        display: flex;
        align-items: center;
        padding-right: 4px;
        > span {
          font-weight: 400;
        }
      }
      .countTo {
        margin-top: 0;
        font-size: 18px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263c;
        line-height: 32px;
        > span:last-child {
          color: #666;
        }
      }
      img {
        width: 20px;
        margin-right: 10px;
      }
    }
  }
  .pledge-count {
    margin-top: 11px;
    font-size: 30px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #06263c;
    line-height: 38px;
  }
  .btn {
    width: 100%;
    height: 45px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
    border-radius: 10px;
    font-size: 16px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #ffffff;
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
.pledge-card-list {
  margin: 24px 0;
  display: flex;
  align-content: center;
  justify-content: space-between;
  width: 1200px;
  height: 90px;
  background: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
  border-radius: 20px;
  padding: 20px;
  .pledge-item {
    height: 40px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 20px;
    color: #06263c;
    border-radius: 6px;
    font-family: DINPro-Medium, DINPro, PingFangSC-Medium, PingFang SC;
    font-weight: 600;
    .item-left {
      & > span {
        font-size: 16px;
        font-family: DINPro-Regular, DINPro;
        font-weight: 400;
        color: #6a7d8a;
      }
    }
    .item-right {
      font-size: 26px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #06263c;
      margin-top: 12px;
      & > span {
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 600;
      }
    }
  }
}
.pledge-card-list.en-version {
  span {
    font-family: DINPro-Medium, DINPro, PingFang SC !important;
    font-weight: 300;
  }
}
@media screen and (max-width: 1000px) {
  .pledge-card {
    width: 92vw;
    margin: 0 auto;
    padding: 0;
    background: none;
    box-shadow: none;
    border-radius: none;
    .title {
      height: 40px;
      background: linear-gradient(71deg, #35beb1 0%, #0c979c 100%);
      border-radius: 10px;
      .card-title {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 20px;
        > span {
          font-size: 14px;
          font-weight: 600;
        }
      }
    }
    .dataList {
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      display: inherit;
      padding: 20px;
      .list:last-child {
        border-bottom: none;
        img {
          margin-right: 4px;
        }
      }
      .list {
        background: #ffffff;
        box-shadow: none;
        border-radius: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #666666;
        margin-right: 0;
        border-bottom: 1px solid #f8f8f8;
        line-height: 40px;
        .list_div {
          display: flex;
          align-items: center;
          padding-right: 0;
          font-size: 12px;
          min-width: 50%;
        }
        .countTo {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263c;
          line-height: 21px;
          > span:last-child {
            color: #06263c;
          }
        }
        img {
          width: auto;
          height: 20px;
          margin-right: 8px;
        }
      }
    }
    .pledge-count {
      margin-top: 11px;
      font-size: 30px;
      font-family: DINPro-Medium, DINPro, PingFang SC;
      font-weight: 500;
      color: #06263c;
      line-height: 38px;
    }
    .btn {
      width: 100%;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      border-radius: 10px;
      font-size: 16px;
      font-family: DINPro-Medium, DINPro, PingFang SC;
      font-weight: 500;
      color: #ffffff;
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
  .pledge-card-list {
    width: 92vw;
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    height: auto;
    padding: 15px 20px;
    border-radius: 10px;
    .pledge-item:last-child {
      border-bottom: none;
    }
    .pledge-item {
      height: 40px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0;
      color: #06263c;
      border-radius: 6px;
      margin-top: 0;
      font-family: DINPro-Medium, DINPro;
      border-bottom: 1px solid #f8f8f8;
      .item-left {
        & > span {
          font-size: 14px;
          color: #6a7d8a;
          line-height: 20px;
          font-weight: 400;
        }
      }
      .item-right {
        font-size: 14px;
        font-weight: 500;
        color: #06263c;
        margin-top: 0;
      }
    }
  }
}
</style>