<!-- 倒计时组件 -->
<template>
  <div class="time-wrapper">
    <div class="time-card" v-for="(item, index) in timeLists" :key="index">
      <div class="time-left">
        <div class="time-show">{{item.count}}</div>
        <div class="time-sign">{{item.name}}</div>
      </div>
      <div class="time-right" v-if="item.ifShow">:</div>
    </div>
    <!-- <div class="time-card">
      <div class="time-show">15</div>
      <div class="time-sign">Hour</div>
    </div>
    <div class="time-card">
      <div class="time-show">20</div>
      <div class="time-sign">Minute</div>
    </div>
    <div class="day-card">
      <div class="day-show">20</div>
      <div class="day-sign">Second</div>
    </div> -->
  </div>
</template>

<script>
import { formatTime } from '../../utils'
export default {
  data () {
    return {
      day: '0',
      hour: '00',
      min: '00',
      second: '00',
    }
  },
  mounted () {
    // 等于0的时候不调用
    // if (Number(this.hour) === 0 && Number(this.day) === 0 && Number(this.min) === 0 && Number(this.second) === 0) {
    //   return
    // } else {
    // // 递归每秒调用countTime方法，显示动态时间效果,
      
    // }
    setInterval(() => {
      this.countTime()
    }, 1000);
    // console.log('this.distanceTime', this.startTime, formatTime(this.startTime, '-'));
  },
  computed: {
    status() {
      return this.$store.state.status
    },
    startTime() {
      return this.$store.state.startTime
    },
    endTime() {
      return this.$store.state.endTime
    },
    formatTimeFn(time, sign) {
      return formatTime(time, sign)
    },
    timeLists() {
      return [
        {
          id: 1,
          name: 'Day',
          count: this.day,
          ifShow: true
        },
        {
          id: 2,
          name: 'Hour',
          count: this.hour,
          ifShow: true
        },
        {
          id: 3,
          name: 'Minute',
          count: this.min,
          ifShow: true
        },
        {
          id: 4,
          name: 'Second',
          count: this.second,
          ifShow: false
        },
      ]
    },
  },
  methods: {
    countTime () {
      // 获取当前时间
      let date = new Date()
      let now = date.getTime()
      // 时间差
      let leftTime = ''
      if (this.status === 0) {
        leftTime =  this.startTime*1000 - now
      }
      if (this.status === 1) {
        leftTime =  this.endTime*1000 - now
      }
      // alert(now)
      // alert(this.startTime)
      // 定义变量 d,h,m,s保存倒计时的时间
      if (leftTime >= 0) {
        // 天
        this.day = Math.floor(leftTime / 1000 / 60 / 60 / 24)
        // 时
        let h = Math.floor(leftTime / 1000 / 60 / 60 % 24)
        this.hour = h < 10 ? '0' + h : h
        // 分
        let m = Math.floor(leftTime / 1000 / 60 % 60)
        this.min = m < 10 ? '0' + m : m
        // 秒
        let s = Math.floor(leftTime / 1000 % 60)
        this.second = s < 10 ? '0' + s : s
      } else {
        this.day = '0'
        this.hour = '00'
        this.min = '00'
        this.second = '00'
      }
    },
  },
}

</script>
<style scoped>
  .time-wrapper {
    width: 290px;
    display: flex;
    justify-content: space-between;
  }
  .time-card {
    display: flex;
  }
  .time-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .time-right {
    height: 60px;
    width: 30px;
    display: flex;
    align-items: center;
    justify-content: center; 
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 31px;
  }
  .time-show {
    width: 50px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 9px;
    border: 1px solid rgba(255, 253, 250, 0.2);
    font-size: 24px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 31px;
  }
  .time-sign {
    margin-top: 15px;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 15px;
    opacity: 0.3;
  }
  @media screen and (max-width: 1000px) {
    .time-wrapper {
      display: flex;
      justify-content: space-between;
    }
    .time-card {
      display: flex;
    }
    .time-left {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .time-right {
      height: 60px;
      width: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      font-size: 24px;
      line-height: 30px;
      opacity: 0.5;
    }
    .time-show {
      width: 50px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 9px;
      border: 1px solid rgba(255, 253, 250, 0.2);
      font-size: 24px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 30px;
    }
    .time-sign {
      font-size: 3vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
      line-height: 15px;
      opacity: 0.3;
    }
  }
</style>