<!-- YouHouse -->
<template>
  <div class="you-wrapper">
    <div class="card-title">
      <span class="card-title-left">{{$t(`${dataObj.title}`)}}</span>
      <span class="more" @click="handleMoreClick">{{$t('More')}}</span>
    </div>
    <div class="list-title">
      <div class="title-item title-item1" style="justify-content: flex-start">{{$t('Stacked')}}</div>
      <div class="title-item title-item2" style="justify-content: flex-start; width: 80px;">{{$t('Earned')}}</div>
      <div class="title-item title-item3" style="justify-content: flex-end; padding-left: 52px">{{$t('APY')}}</div>
      <div v-if="IsPC()" class="title-item title-item3" style="justify-content: flex-end">{{$t('Action')}}</div>
    </div>
    <div class="line"></div>
    <div class="list">
      <div class="list-item" v-for="(item, index) in sortData" :key="index">
        <div class="list-item-child list-item-child1">{{item.poolname}}</div>
        <div class="list-item-child list-item-child2">YOU</div>
        <div class="list-item-child list-item-child3">
          <span>{{item.apy}}%</span>
        </div>
        <div v-if="IsPC()" class="list-item-child list-item-child4">
          <el-button @click="handleLinkLiquatityDig" size="mini">{{$t('LiquidityDig')}}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from 'graphql-request'
import { getDecimalsCoin } from '../../utils'
export default {
  props: ['dataObj'],
  data () {
    return {
      YouPrice: '',
      sortData: []
    }
  },
  watch: {
    dataObj: {
      handler() {
        this.sortHandle()
      },
      deep: true
    }
  },
  mounted() {
    this.getYouPrice();
  },
  computed: {
    youPrice() {
      return this.YouPrice
    }
  },
  methods: {
    // 判断是否是PC端
    IsPC() {
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
    handleLinkLiquatityDig () {
      window.open(process.env.VUE_APP_POOL_URL, '_self')
    },
    handleMoreClick () {
      window.open(process.env.VUE_APP_POOL_URL, '_self');
    },
    // 获取YOU的折UDST价格
    getYouPrice() {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`
        {
          token(id: "${process.env.VUE_APP_YOU_CONTRACT_ADDRESS.toLowerCase()}") {
            derivedETH
          }
          bundle(id: "1") {
            ethPrice
          } 
        }`
      request(endpoint, query).then((res) => {
        if (res.bundle) {
          this.YouPrice = res.bundle.ethPrice * res.token.derivedETH
        }
      })
    },
    sortHandle() {
      let copy = JSON.stringify(this.dataObj.lists)
      let sortData = JSON.parse(copy)
      let unFinishedList = []
      sortData.forEach((item) => {
        item.apy = 0
        if (item.reserveUSD) {
          if (((item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)) === 0) || (this.YouPrice * (item.staketotaldnow / 10**item.decimals) === 0)) {
            item.apy = 0
          } else {
            if (item.type == 2) {
              item.apy = getDecimalsCoin((item.rewardperblock / 10**6 * this.YouPrice * 10512000 * 100) / ( item.reserveUSD * (item.staketotaldnow / 10**item.decimals)), 3)
            } else {
              item.apy = getDecimalsCoin((item.rewardperblock / 10**6 * this.YouPrice * 10512000 * 100) / (item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)), 3)
            }
          }
        }
        item.apy = parseFloat(item.apy, 10)
        if (!item.isfinshed && (item.tab == 1 || item.tab == 2 || item.tab == 3)) {
          unFinishedList.push(item)
        }
      })
      unFinishedList.sort((a, b) => {
        return b.apy - a.apy
      })
      this.sortData = Object.assign([], unFinishedList)
      this.sortData = this.sortData.slice(0, 5)
    }
  }
}

</script>
<style lang='less' scoped>
  .you-wrapper {
    width: 100%;
    min-height: 409px;
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
        font-family: DINPro-Medium, DINPro, PingFang SC;
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
        font-weight: 400;
        color: #6A7D8A;
        line-height: 22px;
      }
      .title-item1 {
        width: 160px;
        justify-content: flex-start;
      }
      .title-item2 {
        width: 80px;
        justify-content: flex-start;
      }
    }
    .list {
      display: flex;
      flex-direction: column;
      .list-item:not(:first-child) {
        margin-top: 20px;
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
        line-height: 30px;
        .list-item-child {
          width: 120px;
          display: flex;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06263C;
          line-height: 22px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        .list-item-child1 {
          width: 205px;
          justify-content: flex-start;
        }
        .list-item-child2 {
          width: 140px;
          justify-content: flex-start;
        }
        .list-item-child3 {
          color: #35BDB1;
        }
        .list-item-child4 {
          width: 140px;
          display: flex;
          flex: 1;
          justify-content: flex-end;
          .el-button {
            width: 60px;
            height: 30px;
            border-radius: 6px;
            border: 1px solid #35BDB1;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #35BDB1;
            line-height: 0px;
          }
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
      width: 92vw;
      padding: 20px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
      min-height: 300px;
      margin-top: 15px;
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
          width: 33.3%;
          display: flex;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6A7D8A;
          line-height: 30px;
        }
        .title-item1 {
          width: 110px;
          justify-content: flex-start;
        }
        .title-item2 {
          width: 40px;
          justify-content: flex-start;
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
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06263C;
          line-height: 30px;
          margin-top: 10px!important;
          .list-item-child {
            width: 130px;
            display: flex;
            font-size: 14px;
            font-family: DINPro-Regular, DINPro;
            font-weight: 400;
            color: #06263C;
            line-height: 22px;
            text-align: center;
          }
          .list-item-child1 {
            font-size: 12px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            color: #06263C;
            width: 120px;
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
        margin-top: 20px;
        height: 1px;
        border-bottom: 1px dashed #06263C;
        opacity: 0.2;
      }
    }
  }
</style>