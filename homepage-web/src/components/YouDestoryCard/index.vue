<!-- YouHouse -->
<template>
  <div class="you-wrapper">
    <div class="card-title">
      <span class="card-title-left">{{$t(`${dataObj.title}`)}}</span>
      <span class="more" @click="handleMoreClick">{{$t('More')}}</span>
    </div>
    <div class="list-title">
      <div class="title-item title-item1" style="justify-content: flex-start">{{$t('Time')}}</div>
      <div class="title-item title-item2" style="justify-content: flex-end; width: 62px;">{{$t('CoinType')}}</div>
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
import { formatDate, getDecimalsCoin } from '../../utils'
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
          timestamp: formatDate(item.timestamp*1000/1),
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
    width: 100%;
    padding: 30px;
    background: #FFFFFF;
    min-height: 414px;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 20px;
    .card-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .card-title-left {
        font-size: 20px;
        font-family: DINPro-Medium, DINPro, PingFang SC;
        font-weight: 500;
        color: #06263C;
        line-height: 31px;
      }
      .more {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 17px;
        text-decoration: underline;
        cursor: pointer;
        color: #35BDB1;
      }
      .more:hover {
        opacity: 0.8;
      }
    }
    .list-title {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
      .title-item {
        width: 100px;
        display: flex;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro, PingFang SC;
        color: #6A7D8A;
        line-height: 22px;
        font-weight: 400;
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
        align-content: space-between;
        font-size: 16px;
        font-family: DINPro-Regular, DINPro;
        font-weight: 400;
        color: #06263C;
        line-height: 22px;
        .list-item-child {
          width: 140px;
          display: flex;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .list-item-child1 {
          width: 260px;
          justify-content: flex-start;
        }
        .list-item-child2 {
          width: 200px;
          justify-content: flex-start;
          color: #6A7D8A;
        }
        .list-item-child3 {
          flex: 1;
          justify-content: flex-end;
          color: #35BDB1;
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
      width: 92vw;
      padding: 20px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      min-height: auto;
      padding: 20px;
      .card-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .card-title-left {
          font-size: 16px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
          font-weight: 500;
          color: #06263C;
          line-height: 31px;
        }
        .more {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06999F;
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
        margin-top: 20px;
        .title-item {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6A7D8A;
          width: 33.3%;
          display: flex;
          line-height: 22px;
        }
        .title-item1 {
          width: 120px;
          justify-content: flex-start;
        }
        .title-item2 {
          width: 40px;
          justify-content: flex-end!important;
        }
        .title-item3 {
          flex: 1;
          justify-content: flex-end!important;
        }
      }
      .list {
        display: flex;
        flex-direction: column;
        .list-item {
          display: flex;
          margin-top: 10px!important;
          font-size: 16px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
          font-weight: 400;
          color: #06263C;
          margin-top: 10px!important;
          line-height: 30px;
          .list-item-child {
            width: 33.3%;
            display: flex;
            font-size: 16px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #06263C;
            line-height: 22px;
          }
          .list-item-child1 {
            font-size: 12px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #06263C;
            width: 164px;
            justify-content: flex-start;
          }
          .list-item-child2 {
            font-size: 12px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #6A7D8A;
            width: 40px;
            justify-content: flex-start;
          }
          .list-item-child3 {
            font-size: 12px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #06999F;
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
        margin-top: 10px;
        height: 1px;
        border-bottom: 1px dashed #06263C;
        opacity: 0.2;
      }
    }
  }
</style>