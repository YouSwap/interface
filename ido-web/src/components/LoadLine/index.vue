<!-- 路线图样式组件 -->
<template>
  <div class="line-container">
    <div class="line-first">
      <LineCard
        :cardWidth="CardWidth1" 
        :directAlign="flexStart" 
        :timeTitle="timeTitle1" 
        :firstContent="firstContent1"
        :arrowDirect="bottom"/>
      <LineCard
        class="LineCard1"
        :cardWidth="CardWidth2" 
        :directAlign="flexCenter"
        :timeTitle="timeTitle2"
        :firstContent="firstContent2" 
        :secondContent="secondContent2"
        :arrowDirect="bottom"/>
      <LineCard
        class="LineCard2"
        :cardWidth="CardWidth3" 
        :directAlign="flexCenter"
        :timeTitle="timeTitle3"
        :firstContent="firstContent3"
        :arrowDirect="bottom"/>
    </div>
    <div class="line-second">
      <div class="arrow-right"></div>
    </div>
    <div class="line-third">
      <LineCard
        class="LineCard3"
        :cardWidth="CardWidth1" 
        :directAlign="flexCenter" 
        :timeTitle="timeTitle4" 
        :firstContent="firstContent4"
        :arrowDirect="top"/>
      <LineCard
        class="LineCard4"
        :cardWidth="CardWidth5" 
        :directAlign="flexCenter" 
        :timeTitle="timeTitle5" 
        :firstContent="firstContent5"
        :arrowDirect="top"/>
      <LineCard
        class="LineCard6"
        :cardWidth="CardWidth6" 
        :directAlign="flexCenter" 
        :timeTitle="timeTitle6" 
        :firstContent="firstContent6"
        :arrowDirect="top"/>
    </div>
  </div>
</template>

<script>
import LineCard from './LineCard'
export default {
  components: {
    LineCard
  },
  data () {
    return {
      flexStart: 'flex-start',
      flexCenter: 'center',
      flexEnd: 'flex-end',
      bottom: 'bottom',
      top: 'top',
      CardWidth1: '263px',
      timeTitle1: this.$t('Time1'),
      firstContent1: [
        {
          value: this.$t('store1.one')
        },
        {
          value: this.$t('store1.two')
        },
        {
          value: this.$t('store1.three')
        },
        {
          value: this.$t('store1.four')
        },
        {
          value: this.$t('store1.five')
        }
      ],
      CardWidth2: '250px',
      timeTitle2: this.$t('Time3'),
      firstContent2: [
        {
          value: this.$t('store3.one')
        },
        {
          value: this.$t('store3.two')
        },
        {
          value: this.$t('store3.three')
        },
      ],
      secondContent2: '· YouSwap V2 版本主网启动',
      CardWidth3: '253px',
      timeTitle3: this.$t('Time5'),
      firstContent3:  [
        {
          value: this.$t('store5.one')
        },
        {
          value: this.$t('store5.two')
        },
        {
          value: this.$t('store5.three')
        },
        {
          value: this.$t('store5.four')
        },
      ],
      secondContent3: '· YouSwap V3对波卡底层跨链技术开发',
      CardWidth4: '247px',
      timeTitle4: this.$t('Time2'),
      firstContent4: [
        {
          value: this.$t('store2.one')
        },
        {
          value: this.$t('store2.two')
        },
        {
          value: this.$t('store2.three')
        },
        {
          value: this.$t('store2.four')
        },
        {
          value: this.$t('store2.five')
        },
      ],
      secondContent4: '· YouSwap V1 在BSC、HECO主网启动',
      CardWidth5: '305px',
      timeTitle5: this.$t('Time4'),
      firstContent5: [
        {
          value: this.$t('store4.one')
        },
        {
          value: this.$t('store4.two')
        },
        {
          value: this.$t('store4.three')
        },
      ],
      secondContent5: '· YouSwap V2 打通 Layer2 其他主要扩展解决方案',
      CardWidth6: '305px',
      timeTitle6: this.$t('Time6'),
      firstContent6: [
        {
          value: this.$t('store6.one')
        },
        {
          value: this.$t('store6.two')
        },
        {
          value: this.$t('store6.three')
        },
        {
          value: this.$t('store6.four')
        },
      ],
      secondContent6: '· YouSwap V2 打通 Layer2 其他主要扩展解决方案',
    }
  },
  methods: {
    
  }
}

</script>
<style scoped>
  .LineCard1 {
    margin-left: 160px;
  }
  .LineCard2 {
    margin-left: 200px;
  }
  .LineCard3 {
    margin-left: 140px;
  }
  .LineCard4 {
    margin-left: 115px;
  }
  .LineCard6 {
    margin-left: 140px;
  }
  .line-first {
    display: flex;
    margin-bottom: 15px;
  }
  .line-third {
    display: flex;
    margin-top: 15px;
  }
  .line-second {
    width: 100%;
    height: 1px;
    border-bottom: 2px dashed #11476E;
    position: relative;
  }
  .arrow-right {
    position: absolute;
    right: -10px;
    top: 1px;
    transform: translateY(-50%);
    font-size: 0;
    line-height: 0;
    border-width: 10px;
    border-color: #11476E;
    border-right-width: 0;
    border-style: dashed;
    border-left-style: solid;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }
  @media screen and (max-width: 1000px) {
    .line-container {
      display: flex;
      justify-content: space-between;
    }
    .LineCard1 {
      margin-left: 0;
    }
    .LineCard2 {
      margin-left: 0;
    }
    .LineCard3 {
      margin-left: 0;
    }
    .LineCard4 {
      margin-left: 0;
    }
    .line-first {
      display: flex;
      flex-direction: column;
      margin-bottom: 15px;
      position: absolute;
      top: 10px;
      left: 20px;
    }
    .line-third {
      display: flex;
      flex-direction: column;
      margin-top: 15px;
      position: absolute;
      right: 0;
      top: 10px;
    }
    .line-second {
      width: 1px;
      height: 1200px;
      border-left: 2px dashed #11476E;
      position: relative;
    }
    .arrow-right {
      position: absolute;
      bottom: -10px;
      left: 1px;
      transform: translateY(-50%);
      font-size: 0;
      line-height: 0;
      border-width: 10px;
      border-color: #11476E;
      border-right-width: 0;
      border-style: dashed;
      border-left-style: solid;
      border-top-color: transparent;
      border-bottom-color: transparent;
    }
  }
</style>