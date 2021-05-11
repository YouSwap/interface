<template>
  <span>
    <slot v-if="!isTimeDown" name="first" />{{CountdownTime}}
    <slot v-if="!isTimeDown" /></span>
</template>
<script>
/* eslint-disable */
export default {
  name: 'CountDown',
  props: {
    totalSeconds: {
      required: true
    },
    intervalId: {
      type: [Number, String],
      required: true
    },
    endInfo: {
      type: String,
      default: () => ''
    },
    // 1: 自动显示 2: 只显示几天和几小时
    timeType: {
      type: [String, Number],
      default: () => 1
    },
    //  0： 显示单位“：”   1: 显示单位天时分秒， 默认为0
    unitType: {
      type: [String, Number],
      default: () => 0
    }
  },
  data() {
    return {
      CountdownTime: '',
      // 是否有计时完成的状态
      isTimeDown: false,
      time: 0,
      timers: [],
      unit: {
        y: '-',
        m: '-',
        d: ' ',
        h: ':',
        mm: ':',
        s: ''
      }
    };
  },
  watch: {
    totalSeconds(nextValue) {
      this.init(nextValue);
    }
  },
  mounted() {
    this.unit = this.unitInit(this.unitType)
    this.init(this.totalSeconds);
    // 清除定时器
    this.$once('hook:beforeDestroy', () => {
      this.timers.filter((elment, k) => {
        clearInterval(elment);
      })
    });
  },
  methods: {
    // 显示处理
    unitInit: function(type) {
      let result;
      switch (type) {
        case 0:
          result = {
            y: '-',
            m: '-',
            d: ' day ',
            h: ':',
            mm: ':',
            s: ''
          }
          break;
        case 1:
          result = {
            y: '年',
            m: '月',
            d: '天',
            h: '时',
            mm: '分',
            s: '秒'
          }
          break;
        case 2:
          result = {
            y: 'y',
            m: 'm',
            d: 'd',
            h: 'h',
            mm: 'm',
            s: 's'
          }
          break;
        default:
          result = {
            y: '-',
            m: '-',
            d: ' ',
            h: ':',
            mm: ':',
            s: ''
          }
          break;
      }
      return result;
    },
    init(nextValue) {
      this.time = `${nextValue.toString()}.${Date.now()}`;
      this.isTimeDown = false;
      // 如果定时器存在则清楚上次的定时器
      if (this.timers.length > 0) {
        this.timers.filter((elment, k) => {
          if (elment) {
            clearInterval(elment);
          }
        })
      }
      // if (window[`mark${this.intervalId}`]) {
      //   clearInterval(window[`mark${this.intervalId}`]);
      // }
      // 保存当前总时间
      let currentTime = parseInt(this.time || 0, 10);
      if (currentTime !== 0) {
        currentTime = this.timeDown(currentTime);
        let timer = setInterval(() => {
          if (currentTime <= 0) {
            // 如果时间为0 则停止定时器
            this.timers.filter((elment, k) => {
              if (elment) {
                clearInterval(elment);
              }
            })
            // clearInterval(window[`mark${this.intervalId}`]);
            this.CountdownTime = this.endInfo;
            this.isTimeDown = true;
            // 执行组件绑定事件
            this.$emit('endTime');
          } else {
            /* eslint-disable */
            // 开始倒计时
            // 递减时间 每次一秒
            --currentTime;
            currentTime = this.timeDown(currentTime);
          }
        }, 1000);
        this.timers.push(timer)
      } else {
        this.isTimeDown = true;
        this.CountdownTime = this.endInfo;
        // 执行组件绑定事件
        this.$emit('endTime');
      }
    },
    addZero(num) {
      if (num < 10) {
        return '0' + num;
      } else {
        return num;
      }
    },
    /**
     * 倒计时  一秒为单位
     * @param {Number|String} totalSeconds 以秒为单位
     */
    timeDown(totalSeconds) {
      totalSeconds = parseInt(totalSeconds, 10);
      // 一天的秒数
      const dayTime = 24 * 60 * 60;
      // 一小时的秒数
      const hourTime = 60 * 60;
      // 一分钟的秒数
      const minuteTime = 60;
      /* eslint-disable */
      // 天数    总时间 / (24 * 60 * 60);
      const Nday = parseInt(totalSeconds / dayTime, 10);
      // 小时数  总时间 - 天数 = 剩余秒数 / (60 * 60)
      let Nhour = parseInt((totalSeconds - Nday * dayTime) / hourTime, 10);
      Nhour = this.addZero(Nhour);
      // 分数   总时间 - 天数 - 小时数 = 剩余秒数  / 60 = 分数
      let Nminute = parseInt(
        (totalSeconds - Nday * dayTime - Nhour * hourTime) / minuteTime,
        10
      );
      Nminute = this.addZero(Nminute);
      // 秒数   总时间 - 天数 - 小时数 - 分数 = 剩余秒数
      let Nseconds = parseInt(
        totalSeconds - Nday * dayTime - Nhour * hourTime - Nminute * minuteTime,
        10
      );
      Nseconds = this.addZero(Nseconds);
      // 如果天数和小时数都为0则不显示这个
      if (+this.timeType === 2 && (Nday > 0 || Nhour > 0)) {
        this.CountdownTime = `${Nday}${this.unit.d}${Nhour}${this.unit.h}`;
      } else {
        if (Nday > 0) {
          this.CountdownTime = `${Nday}${this.unit.d}${Nhour}${this.unit.h}${Nminute}${this.unit.mm}${Nseconds}${this.unit.s}`;
        } else if (Nhour > 0) {
          this.CountdownTime = `${Nhour}${this.unit.h}${Nminute}${this.unit.mm}${Nseconds}${this.unit.s}`;
        } else if (Nminute > 0) {
          this.CountdownTime = `${Nminute}${this.unit.mm}${Nseconds}${this.unit.s}`;
        } else {
          this.CountdownTime = `00${this.unit.mm}${Nseconds}${this.unit.s}`;
        }
      }
      return totalSeconds;
    }
  }
};
/* eslint-enable */
</script>
