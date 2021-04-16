<template>
  <div class="card-container">
    <div class="count-wrapper">
      <span>{{ $t('SwapAmount') }}</span>
      <span> 1 YOU = 0.1 USDT</span>
    </div>
    <div class="count">
      <div class="count-left">
        <span>{{ $store.state.supplyYouForPriIEO?$store.state.supplyYouForPriIEO:'...' }}</span>
        <span style="margin-left: 8px;">YOU</span>
      </div>
      <div class="count-right">
        <span>{{supplyYouForPriIEO * youPriceOfPriIEO}}</span>
        <span> USDT</span>
      </div>
    </div>
    <div class="time-tips">
      <div>{{status===0 ? $t('StartTimwe') : $t('LeftTimeEnd')}}</div>
      <div class="block" v-if="status === 0">
        <img :src="block" alt="">
        <span>{{$t('RemainingBlockchain')}}</span>
        <span>{{$store.state.RemainingBlockchain}}</span>
      </div>
       <div class="block" v-if="status === 1">
        <img :src="block" alt="">
        <span>{{$t('RemainingBlockchain')}}</span>
        <span>{{$store.state.RemainingBlockchainEnd}}</span>
      </div>
    </div>
    <div v-if="status!==2" class="time-count">
      <time-count></time-count>
    </div>
    <div v-else class="finishBlock">{{$t('Finished')}}</div>
    <div class="time-tips">
      <div>{{ $t('SwapProgress') }}</div>
    </div>
    <div class="progress-bar">
      <progress-bar bar-color="#69EECB" bg-color="#11476E" size="medium" :bar-border-radius="10" text-align="left" :val="swapProgress" :text="swapProgressText" :title="swapProgressText" />
    </div>
    <div class="count-process">
      <span>{{ totalUsdtAmountOfPubIDO.toString() ? totalUsdtAmountOfPubIDO.toFixed(2) : '...'}}</span>
      <span> / </span>
      <span>{{ targetUsdtAmountOfPubIDO ? targetUsdtAmountOfPubIDO:'...' }} </span>
    </div>
  </div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import TimeCount from './TimeCount'
export default {
  components: {
    ProgressBar,
    TimeCount
  },
  data () {
    return {
      block: require('../../assets/block.png')
    }
  },
  computed: {
    totalUsdtAmountOfPubIDO() {
      return this.$store.state.totalUsdtAmountOfPubIDO
    },
    targetUsdtAmountOfPubIDO() {
      return this.$store.state.targetUsdtAmountOfPubIDO
    },
    supplyYouForPriIEO() {
      return this.$store.state.supplyYouForPriIEO
    },
    youPriceOfPriIEO() {
      return this.$store.state.youPriceOfPriIEO
    },
    totalUsdtAmountOfPriIEO() {
      return this.$store.state.totalUsdtAmountOfPriIEO
    },
    swapProgress() {
      const progress = (this.totalUsdtAmountOfPubIDO * 100 / this.targetUsdtAmountOfPubIDO).toFixed(2) ? (this.totalUsdtAmountOfPubIDO * 100  / this.targetUsdtAmountOfPubIDO).toFixed(2) : '...'
      return progress
    },
    swapProgressText() {
      return `${this.swapProgress}%`
    },
    status() {
      return this.$store.state.status
    },
  }
}

</script>
<style>
  .vue-simple-progress-text {
    margin-top: 15px !important;
    color: #09999E !important;
  }
  @media screen and (max-width: 1000px) {
    .vue-simple-progress-text {
      font-size: 3vw!important;
      line-height: 4vw;
    }
  }
</style>
<style scoped>
  .card-container {
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 30px;
    width: 480px;
    background: linear-gradient(180deg, #11476E 0%, #0B304A 100%, #0B304A 100%);
    border-radius: 19px;
  }
  .count-wrapper {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    line-height: 20px;
  }
  .count {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }
  .count-left { 
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 31px;
  }
  .count-right {
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 18px;
  }
  .time-tips {
    margin-top: 30px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    line-height: 20px;
    display: flex;
    align-items: center;
  }
  .time-tips .block{
    margin-left: 20px;
    padding: 0 10px;
    display:flex;
    align-items: center;
    height: 30px;
    background: rgba(6, 38, 60, 0.5);
    border-radius: 9px;
    border: 1px solid rgba(255, 253, 250, 0.2);
  }
  .time-tips .block img {
    width: 20px;
  }
  .time-tips .block span {
    margin-left: 8px;
  }
  .progress-bar {
    margin-top: 16px;
  }
  .count-process {
    position: absolute;
    bottom: 30px;
    right: 30px;
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 18px;
  }
  .time-count {
    margin-top: 16px;
  }
  .finishBlock {
    width: 420px;
    height: 60px;
    background: #092E48;
    border-radius: 9px;
    border: 1px solid rgba(255, 253, 250, 0.2);
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 60px;
    text-align: center;
    margin: 20px auto;
  }
  @media screen and (max-width: 1000px) {
    .card-container {
      position: relative;
      display: flex;
      padding: 30px 20px;
      width: 80vw;
      background: linear-gradient(180deg, #11476E 0%, #0B304A 100%, #0B304A 100%);
      border-radius: 19px;
    }
    .count-wrapper {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
      line-height: 20px;
    }
    .count {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      font-size: 24px;
    }
    .count-left { 
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 5vw;
    }
    .count-right {
      font-size: 14px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 4vw;
      opacity: 0.5;
    }
    .time-tips {
      margin-top: 30px;
      font-size: 10px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    }
    .time-tips .block{
      margin-left: 0;
      margin-top: 10px;
      padding: 0 3vw;
      display:flex;
      align-items: center;
      height: 7vw;
      background: rgba(6, 38, 60, 0.5);
      border-radius: 3vw;
      border: 1px solid rgba(255, 253, 250, 0.2);
    }
    .time-tips .block img {
      width: 3vw;
    }
    .time-tips .block span {
      margin-left: 8px;
    }
    .progress-bar {
      margin-top: 16px;
    }
    .count-process {
      position: absolute;
      bottom: 30px;
      right: 30px;
      font-size: 3vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 4vw;
    }
    .time-count {
      margin-top: 16px;
      width: 100%;
    }
    .finishBlock {
      width: 300px;
      height: 40px;
      background: #092E48;
      border-radius: 9px;
      border: 1px solid rgba(255, 253, 250, 0.2);
      font-size: 15px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 40px;
      text-align: center;
      margin: 10px auto;
    }
  }
</style>