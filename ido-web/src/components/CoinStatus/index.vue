<!-- 代币生态样式组件 -->
<template>
  <div class="progress-container">
    <div class="progress-circle">
      <el-progress 
        type="circle" 
        :percentage="precent" 
        :stroke-width="26"
        color="#0D989D"
        :width="300"
        stroke-linecap="round">
      </el-progress>
      <div class="text_desc">{{ text_desc }}</div>
    </div>
    <div class="operate-list">
      <div class="operate-item" v-for="item in operateLists" :key="item.id" @click="handleItemImgClick(item)">
        <img class="item-img" width="36px" :src="[item.itemSelected ? item.choiceImgUrl : item.unChoiceImgUrl]" alt="">
        <div class="operate-list-desc" style="margin-left: 22px;">
          <span class="item-text">{{item.title}}</span>
          <span class="item-text" style="margin-left: 10px;">{{item.percentage}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      precent: 60,
      selectIndex: 0,
      text_desc: this.$t('MiningBonus'),
    }
  },
  computed : {
    operateLists() {
      return [
        {
          id: 0,
          unChoiceImgUrl: require('../../assets/bianzu_unchoice.png'),
          title: this.$t('InitialLiquidity'),
          percentage: '5%',
          percentageNumber: 5,
          itemSelected: false,
          choiceImgUrl: require('../../assets/bianzu_choice.png')
        },
        {
          id: 1,
          unChoiceImgUrl: require('../../assets/sqst_unchoice.png'),
          title: this.$t('CommunityEcologyIncentive'),
          percentage: '15%',
          percentageNumber: 15,
          itemSelected: false,
          choiceImgUrl: require('../../assets/sqst_choice.png')
        },
        {
          id: 2,
          unChoiceImgUrl: require('../../assets/tzz_unchoice.png'),
          title: this.$t('Investors'), 
          percentage: '5%',
          percentageNumber: 5,
          itemSelected: false,
          choiceImgUrl: require('../../assets/ttz_choice.png')
        },
        {
          id: 3,
          unChoiceImgUrl: require('../../assets/hxtd_unchoice.png'),
          title: this.$t('CoreTeam'),
          percentage: '15%',
          percentageNumber: 15,
          itemSelected: false,
          choiceImgUrl: require('../../assets/hxtd_choice.png')
        },
        {
          id: 4,
          unChoiceImgUrl: require('../../assets/wkjl_unchoice.png'),
          title: this.$t('MiningBonus'),
          percentage: '60%',
          percentageNumber: 60,
          itemSelected: true,
          choiceImgUrl: require('../../assets/wkjl_choice.png')
        },
      ]
    },
  },
  methods: {
    handleItemImgClick (item) {
      this.precent = item.percentageNumber
      this.operateLists.forEach(list => {
        if (item.id === list.id) {
          list.itemSelected = true
          this.text_desc = list.title
        } else {
          list.itemSelected = false
        }
      })
    }
  }
}

</script>
<style scoped>
  .progress-container {
    display: flex;
    width: 1200px;
    justify-content: center;
  }
  .progress-circle {
    width: 400px;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
  }
  /deep/.el-progress__text {
    color: #fff;
  }
  .operate-list {
    height: 400px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 96px;
  }
  .operate-list-desc {
    width: 300px;
  }
  .operate-item {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .item-text {
    font-size: 16px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
  }
  .item-img {
    cursor: pointer;
  }
  .item-img:hover {
    opacity: 0.8;
  }
  .text_desc {
    color: #fff;
    position: absolute;
    top: 60%;
    text-align: center;
    font-size: 18px;
  }
  @media screen and (max-width: 1000px) {
    .progress-container {
      display: flex;
      width: 100%;
      justify-content: center;
    }
    /deep/.el-progress-circle {
      width: 140px!important;
      height: 140px!important;
    }
    .progress-circle {
      width: 40vw;
      height: 40vw;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .operate-list {
      width: 40vw;
      height: 40vw;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      margin-left: 20px;
    }
    .operate-list-desc {
      width: auto;
      font-size: 12px;
    }
    .operate-item {
      display: flex;
      align-items: center;
      margin-top: 3vw;
    }
    .operate-item> img {
      width: 22px;
      height: 22px;
    }
    .item-text {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
    }
    .item-img {
      cursor: pointer;
    }
    .item-img:hover {
      opacity: 0.8;
    }
    .text_desc {
      color: #fff;
      position: absolute;
      top: 57%;
      text-align: center;
      font-size: 14px;
    }
    /deep/.el-progress--circle .el-progress__text{
      top: 45%;
      font-size: 20px!important;
    }
  }
  
</style>