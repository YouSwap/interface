<!-- 兑换池详情页面 -->
<template>
  <div class="pool-container">
    <div class="pool-wrapper">
      <div class="card-title"><span>{{ $t('PoolInformation') }}</span></div>
      <div class="card-content" v-for="item in contentLists" :key="item.key">
        <span class="item-left">{{item.keyName}}</span>
        <span class="item-right">{{item.valName}}</span>
      </div>
    </div>

    <div class="pool-wrapper pool-wrapper2">
      <div class="card-title"><span>{{ $t('TokenInformation') }}</span></div>
      <div class="card-content" v-for="item in coinLists" :key="item.key">
        <span class="item-left">{{item.keyName}}</span>
        <span class="item-right">{{item.valName}}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from '../../utils'

export default {
  data () {
    return{}
  },
  computed: {
    startTime() {
      return this.$store.state.startTime
    },
    bottomLimitUsdtOfPubIDO() {
      return this.$store.state.bottomLimitUsdtOfPubIDO
    },
    contentLists() {
      return [
        {
          key: 0,
          keyName: this.$t('startBlock'),
          // valName: this.$store.state.startTime,
          valName: this.$store.state.startHeightOfPriIEO
        },
        {
          key: 1,
          keyName: this.$t('endBlock'),
          // valName: this.$store.state.startTime,
          valName: this.$store.state.endHeightOfPriIEO
        },
        {
          key: 2,
          keyName: this.$t('TokenAllocatedTime'),
          // valName: this.$store.state.startTime,
          valName: formatTime(this.$store.state.endTime, '-')
        },
        // {
        //   key: 1,
        //   keyName: this.$t('MinAllocationL'),
        //   valName: '100 USDT'
        // },
        {
          key: 3,
          keyName: this.$t('MinAllocationL'),
          valName: `${this.bottomLimitUsdtOfPubIDO} USDT`
        },
        // {
        //   key: 3,
        //   keyName: this.$t('MinimumSwapAmount'),
        //   valName: '100U'
        // },
        {
          key: 4,
          keyName: this.$t('Qualification'),
          valName: this.$t('no')
        },
      ]
    },
    coinLists() {
      return [
        {
          key: 5,
          keyName: this.$t('Name'),
          valName: 'YouSwap Token'
        },
        {
          key: 6,
          keyName: this.$t('ContractAddress'),
          valName: this.$store.state._youAddress
        },
        {
          key: 7,
          keyName: this.$t('TotalSupply'),
          valName: 500000
        },
        {
          key: 8,
          keyName: this.$t('Holder'),
          valName: this.$store.state.holders
        },
        {
          key: 9,
          keyName: this.$t('Trades'),
          valName: this.$store.state.transfers
        },
      ]
    }
  },
}

</script>
<style scoped>
  .pool-container {
    display: flex;
  }
  .pool-wrapper {
    width: 590px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 16px;
    display: flex;
    flex-direction: column;
  }
  .pool-wrapper2 {
    margin-left: 20px;
  }
  .card-title { 
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    padding-left: 30px;
  }
  .card-title > span {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #06263C;
    line-height: 20px;
    opacity: 0.5;
  }
  .card-content {
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;
  }
  .item-left {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #06263C;
    line-height: 20px;
  }
  .item-right {
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #06263C;
    line-height: 18px;
  }
   @media screen and (max-width: 1000px) {
    .pool-container {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      /* margin: 0 7vw; */
    }
    .pool-wrapper {
      width: 100%;
      background: #0B304A;
      border-radius: 32px;
      box-shadow: none;
      border-radius: 16px;
      display: flex;
      flex-direction: column;
      padding-bottom: 2vw;
      padding-top: 2vw;
    }
    .pool-wrapper2 {
      margin-left: 0;
      margin-top: 5vw;
    }
    .card-title { 
      width: 100%;
      height: 8vw;
      display: flex;
      align-items: center;
      padding: 20px;
      box-sizing: border-box;
    }
    .card-title > span {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #C9CED1;
      line-height: 4vw;
      opacity: 0.5;
    }
    .card-content {
      height: 6.5vw;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 19px;
    }
    .item-left {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
      line-height: 20px;
    }
    .item-right {
      font-size: 14px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #fff;
      line-height: 18px;
      max-width: 40vw;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
</style>