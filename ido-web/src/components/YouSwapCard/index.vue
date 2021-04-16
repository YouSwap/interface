<!-- 首页 YouSwap Card -->
<template>
  <div class="you-container">
    <div class="you-title">
      <img :src="youImgUrl" alt="">
      <button class="start-btn">{{showStatus}}</button>
      <button class="start-btn">{{ $t('public')}}</button>
    </div>
    <div class="info-wrapper">
      <div class="info-item" v-for="item in infoLists" :key="item.id">
        <p class="info-title">{{item.title}}</p>
        <p class="info-content">{{item.content}}</p>
      </div>
    </div>
    <div>
      <div class="progress">
        <span>{{$t('SwapProgress')}}</span>
        <span class="swapScale">
          <span>1 YOU = 0.1 USDT</span>
        </span>
      </div>
      <div>
        <progress-bar bar-color="#69EECB" bg-color="#11476E" size="medium" :bar-border-radius="10" text-align="left" :val="swapProgress" :text="swapProgressText" :title="swapProgressText" />
      </div>
      <div class="count-process">
        <span>{{ totalUsdtAmountOfPubIDO.toString() ? totalUsdtAmountOfPubIDO.toFixed(2): '...' }}</span>
        <span> / </span>
        <span>{{ targetUsdtAmountOfPubIDO ? targetUsdtAmountOfPubIDO : '...' }} </span>
      </div>
      <div v-if="!status" class="endTimeBox">{{$t('StartTime')}}: {{ startTime }}</div>
      <div v-else class="endTimeBox">{{$t('EndTime')}}: {{ endTime }}</div>
    </div>
    <button class="btn" @click="handleDetail">{{ $t('CheckIDODetails') }}</button>
  </div>
</template>

<script>
import ProgressBar from 'vue-simple-progress'
import { formatTime } from '../../utils'

export default {
  data () {
    return {
      youImgUrl: require('../../assets/logo@2x.png'),
      alertImgUrl: require('../../assets/alert.png'),
    }
  },
  components: {
    ProgressBar,
  },
  computed: {
    infoLists() {
      return [
        {
          id: 0,
          title: this.$t('TotalRaise'),
          content: `$ ${this.targetUsdtAmountOfPubIDO}`
        },
        {
          id: 1,
          title: this.$t('MinAllocationL'),
          content: `${this.bottomLimitUsdtOfPubIDO} USDT`
        },
        // {
        //   id: 2,
        //   public: 0,
        //   title: this.$t('MaxAllocation'),
        //   content: `${this.upperLimitYouOfPriIEO} USDT`
        // }
      ]
    },
    totalUsdtAmountOfPubIDO() {
      return this.$store.state.totalUsdtAmountOfPubIDO
    },
    targetUsdtAmountOfPubIDO() {
      return this.$store.state.targetUsdtAmountOfPubIDO
    },
    bottomLimitUsdtOfPubIDO () {
      return this.$store.state.bottomLimitUsdtOfPubIDO
    },
    totalUsdtAmountOfPriIEO() {
      return this.$store.state.totalUsdtAmountOfPriIEO
    },
    upperLimitYouOfPriIEO() {
      return this.$store.state.upperLimitYouOfPriIEO
    },
    status() {
      return this.$store.state.status
    },
    showStatus() {
      if (this.status === 0) {
        return this.$t('NotStarted')
      }
      if (this.status === 1) {
        return this.$t('InProgress')
      }
      if (this.status === 2) {
        return this.$t('Finish')
      }
      return '--'
    },
    startTime() {
      return this.formatTimeFn(this.$store.state.startTime, '-')
    },
    endTime() {
      return this.$store.state.endTime && this.formatTimeFn(this.$store.state.endTime, '-')
    },
    supplyYouForPriIEO() {
      return this.$store.state.supplyYouForPriIEO
    },
    youPriceOfPriIEO() {
      return this.$store.state.youPriceOfPriIEO
    },
    swapProgress() {
      const progress = (this.totalUsdtAmountOfPubIDO * 100 / this.targetUsdtAmountOfPubIDO).toFixed(2) ? (this.totalUsdtAmountOfPubIDO * 100 / this.targetUsdtAmountOfPubIDO).toFixed(2) : '...'
      return progress
    },
    swapProgressText() {
      return `${this.swapProgress}%`
    },
  },
  methods: {
    handleDetail () {
      this.$router.push('/detail')
    },
    formatTimeFn(time, sign) {
      return formatTime(time, sign)
    }
  }
}

</script>
<style scoped>
  .progress {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    color: #FFFDFA;
    line-height: 50px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  .progress .swapScale {
    font-family: DINPro-Medium, DINPro;
  }
  .count-process {
    text-align: right;
    margin-top: -12px;
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
  }
  .endTimeBox {
    margin-top: 30px;
    font-size: 14px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
  }
  .you-container {
    background: linear-gradient(180deg, #11476E 0%, #0B304A 100%, #0B304A 100%);
    border-radius: 20px;
    padding: 30px;
    min-width: 500px;
  }
  .you-title {
    display: flex;
    align-items: center;
  }
  .you-title>img {
    height: 30px;
  }
  .start-btn {
    margin-left: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 30px;
    background: rgba(255, 253, 250, 0.1);
    border-radius: 10px;
    border: 1px solid rgba(255, 253, 250, 0.15);
    border: none;
    outline: none;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    padding: 0 10px;
  }
  .info-wrapper {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
  }
  .info-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  /* .info-item:nth-child(2) {
    margin: 0 72px;
  } */
  .info-title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
  }
  .info-content {
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    margin-top: 8px;
  }
  .start-time {
    margin-top: 30px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
  }
  .time {
    display: flex;
    align-items: center;
    padding-left: 20px;
    background: rgba(6, 38, 60, 0.5);
    border-radius: 10px;
    margin-top: 16px;
    height: 60px;
  }
  .time>img {
    width: 26px;
    height: 26px;
  }
  .hour {
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 31px;
    margin-left: 10px;
  }
  .minute {
    margin-left: 16px;
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 31px;
  }
  .btn {
    width: 100%;
    height: 45px;
    margin-top: 40px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFDFA;
    outline: none;
    border: none;
    cursor: pointer;
  }
  .btn:hover {
    opacity: 0.8;
  }
  @media screen and (max-width: 1000px) {
    .progress {
      margin: 5vw 0 2vw 0;
      display: flex;
      justify-content: space-between;
      color: #FFFDFA;
      line-height: 50px;
      font-size: 3.2vw;
      font-family: PingFangSC-Regular, PingFang SC;
    }
    .progress .swapScale {
      font-family: DINPro-Medium, DINPro;
    }
    .count-process {
      text-align: right;
      margin-top: -12px;
      font-size: 3vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
    }
    .endTimeBox {
      margin-top: 30px;
      font-size: 3vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
    }
    .you-container {
      background: linear-gradient(180deg, #11476E 0%, #0B304A 100%, #0B304A 100%);
      border-radius: 20px;
      padding: 5.3vw;
      min-width: auto;
    }
    .you-title {
      display: flex;
      align-items: center;
    }
    .you-title>img {
      height: 6vw;
    }
    .start-btn {
      margin-left: 2vw;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 7.8vw;
      background: rgba(255, 253, 250, 0.1);
      border-radius: 2.6vw;
      border: 1px solid rgba(255, 253, 250, 0.15);
      border: none;
      outline: none;
      font-size: 3.7vw;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
      padding: 0 3vw;
    }
    .info-wrapper {
      margin-top: 6vw;
      display: flex;
      justify-content: space-between;
    }
    .info-item {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .info-item:nth-child(2) {
      margin: 0 72px;
    }
    .info-title {
      font-size: 3vw;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
    }
    .info-content {
      font-size: 4vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      margin-top: 3vw;
    }
    .start-time {
      margin-top: 60px;
      font-size: 3vw;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
    }
    .time {
      display: flex;
      align-items: center;
      padding-left: 40px;
      background: rgba(6, 38, 60, 0.5);
      border-radius: 20px;
      margin-top: 3vw;
      height: 16vw;
    }
    .time>img {
      width: 53px;
      height: 53px;
    }
    .hour {
      font-size: 5.2vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 31px;
      margin-left: 10px;
    }
    .minute {
      margin-left: 16px;
      font-size: 5.2vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 31px;
    }
    .btn {
      width: 100%;
      height: 11.7vw;
      margin-top: 40px;
      background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 4.2vw;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFDFA;
      outline: none;
      border: none;
      cursor: pointer;
    }
    .btn:hover {
      opacity: 0.8;
    }
  }
</style>