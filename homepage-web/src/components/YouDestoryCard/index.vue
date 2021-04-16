<!-- YouHouse -->
<template>
  <div class="you-wrapper">
    <div class="card-title">
      <span class="card-title-left">{{$t(`${dataObj.title}`)}}</span>
      <span class="more" @click="handleMoreClick">{{$t('More')}}</span>
    </div>
    <div class="list-title">
      <div class="title-item title-item1" style="justify-content: flex-start">{{$t('Time')}}</div>
      <div class="title-item title-item2" style="justify-content: flex-start; width: 80px;">{{$t('CoinType')}}</div>
      <div class="title-item title-item3" style="justify-content: flex-end">{{$t('Count')}}</div>
    </div>
    <div class="line"></div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in lists" :key="index">
        <div class="list-item-child list-item-child1">{{item.timestamp}}</div>
        <div class="list-item-child list-item-child2">{{item.pair}}</div>
        <div class="list-item-child list-item-child3">{{item.amount0Out}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime, getDecimalsCoin } from '../../utils'
export default {
  props: ['dataObj'],
  data () {
    return {
    }
  },
  methods: {
    handleMoreClick () {
      window.open(process.env.VUE_APP_HECOSCAN_URL, '_self');
    }
  },
  computed: {
    lists () {
      let destoryLists = []
      this.dataObj.lists.forEach(item => {
        destoryLists.push({
          timestamp: formatTime(item.timestamp),
          amount0Out: getDecimalsCoin(item.amount0Out, 3),
          pair: item.pair.token0.symbol
        })
      })
      return destoryLists
    }
  }
}

</script>
<style lang='less' scoped>
  .you-wrapper {
    width: 420px;
    min-height: 416px;
    padding: 30px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 20px;
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-title-left {
        font-size: 20px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 31px;
      }
      .more {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #06263C;
        line-height: 17px;
        text-decoration: underline;
        cursor: pointer;
      }
      .more:hover {
        opacity: 0.8;
      }
    }
    .list-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 37px;
      .title-item {
        width: 100px;
        display: flex;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 21px;
      }
      .title-item1 {
        width: 160px;
        justify-content: flex-start;
      }
      .title-item2 {
        width: 80px;
        justify-content: flex-start;
      }
      .title-item3 {
        flex: 1;
        justify-content: flex-end;
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      .list-item:not(:first-child) {
        margin-top: 30px;
      }
      .list-item:first-child {
        margin-top: 20px;
      }
      .list-item {
        display: flex;
        font-size: 16px;
        font-family: DINPro-Regular, DINPro;
        font-weight: 400;
        color: #06263C;
        line-height: 21px;
        .list-item-child {
          width: 140px;
          display: flex;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06263C;
          line-height: 21px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .list-item-child1 {
          width: 160px;
          justify-content: flex-start;
        }
        .list-item-child2 {
          width: 80px;
          justify-content: flex-start;
        }
        .list-item-child3 {
          flex: 1;
          justify-content: flex-end;
        }
        .list-item-child4 {
          display: flex;
          flex: 1;
          justify-content: flex-end;
        }
      }
    }
    .line {
      margin-top: 20px;
      height: 1px;
      border-bottom: 1px dashed #06263C;
      opacity: 0.2;
    }
  }
  @media screen and (max-width: 1000px) {
    .you-wrapper {
      min-width: 0;
      width: 90vw;
      padding: 30px 20px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
      .card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-title-left {
          font-size: 20px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 31px;
        }
        .more {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263C;
          line-height: 17px;
          text-decoration: underline;
          cursor: pointer;
        }
        .more:hover {
          opacity: 0.8;
        }
      }
      .list-title {
        width: 100%;
        display: flex;
        margin-top: 37px;
        .title-item {
          width: 33.3%;
          display: flex;
          font-size: 16px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 21px;
        }
        .title-item1 {
          width: 120px;
          justify-content: flex-start;
        }
        .title-item2 {
          width: 40px;
          justify-content: flex-start;
        }
        .title-item3 {
          flex: 1;
          justify-content: flex-end;
        }
      }
      .list {
        display: flex;
        flex-direction: column;
        .list-item {
          display: flex;
          margin-top: 20px;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06263C;
          line-height: 21px;
          .list-item-child {
            width: 33.3%;
            display: flex;
            font-size: 14px;
            font-family: DINPro-Regular, DINPro;
            font-weight: 400;
            color: #06263C;
            line-height: 21px;
          }
          .list-item-child1 {
            width: 120px;
            justify-content: flex-start;
          }
          .list-item-child2 {
            width: 40px;
            justify-content: flex-start;
          }
          .list-item-child3 {
            flex: 1;
            justify-content: flex-end;
          }
          .list-item-child4 {
            display: flex;
            flex: 1;
            justify-content: flex-end;
          }
        }
      }
      .line {
        margin-top: 20px;
        height: 1px;
        border-bottom: 1px dashed #06263C;
        opacity: 0.2;
      }
    }
  }
</style>