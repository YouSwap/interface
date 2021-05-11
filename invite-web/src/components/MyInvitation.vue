<template>
  <div class="invitation-box">
    <div v-if="platform == 2"
         class="pc-invitation">
      <div class="block-title">
        {{$t('invite')[9]}}
        <p>
          <span>{{$t('exchangeDig')[12]}} {{totalNum}} {{$t('invite')[2]}}</span>
          <a class="toast-box">
            <img src="../assets/image/question-pc.png"
                 alt="">
            <div :class="lang == 'en' ? 'en-version' : ''">
              <p>{{$t('invite')[3]}}：{{levelOneNum}}{{$t('invite')[2]}}</p>
              <p>{{$t('invite')[4]}}：{{levelTwoNum}}{{$t('invite')[2]}}</p>
              <i></i>
            </div>
          </a>
        </p>
      </div>
      <div class="data-box">
        <template v-if="dataList.length > 0">
          <div class="data-title">
            <div class="serial">{{$t('exchangeDig')[13]}}</div>
            <div class="address">{{$t('exchangeDig')[14]}}</div>
            <div class="rank">{{$t('exchangeDig')[15]}}</div>
            <div class="operate">{{$t('exchangeDig')[16]}}</div>
          </div>
          <div class="data-content">
            <div class="item"
                 v-for="(item, index) in dataList"
                 :key="index">
              <p class="serial">{{index + 1 + (curPage - 1) * num}}</p>
              <p class="address">{{shortenAddress(item.address, 4, 2)}}</p>
              <p class="rank">
                <template v-if="item.type0 == 1">
                  {{$t('level')[0]}}
                </template>
                <template v-if="item.type0 == 2">
                  {{$t('level')[1]}}
                </template>
              </p>
              <p class="operate"><a :href="'https://hecoinfo.com/address/' + item.address">{{$t('exchangeDig')[17]}}<img src="../assets/image/icon-scan.png"
                       alt=""></a></p>
            </div>
          </div>
          <div class="page-box">
            <img class="pre-page"
                 :class="curPage == 1 ? 'disabled' : ''"
                 @click="prePageHandle"
                 src="../assets/image/icon-arrow.png"
                 alt="">
            <div>Page {{curPage}} of {{totalPage}}</div>
            <img class="next-page"
                 :class="curPage == totalPage ? 'disabled' : ''"
                 @click="nextPageHandle"
                 src="../assets/image/icon-arrow.png"
                 alt="">
          </div>
        </template>
        <template v-else-if="loading">
          <div class="no-data">{{$t('loading')}}</div>
        </template>
        <template v-else>
          <div class="no-data">{{$t('invite')[21]}}</div>
        </template>
      </div>
    </div>
    <div v-else
         class="h5-invitation">
      <div class="block-title">
        {{$t('invite')[9]}}
        <p>
          <span>{{$t('exchangeDig')[12]}} {{totalNum}} {{$t('invite')[2]}}</span>
          <a class="toast-box">
            <img src="../assets/image/question-h5.png"
                 alt="">
            <div :class="lang == 'en' ? 'en-version' : ''">
              <p>{{$t('invite')[3]}}：{{levelOneNum}}{{$t('invite')[2]}}</p>
              <p>{{$t('invite')[4]}}：{{levelTwoNum}}{{$t('invite')[2]}}</p>
              <i></i>
            </div>
          </a>
        </p>
      </div>
      <div class="data-box">
        <template v-if="dataList.length > 0">
          <div class="data-title">
            <div class="serial">{{$t('exchangeDig')[13]}}</div>
            <div class="address">{{$t('exchangeDig')[14]}}</div>
            <div class="rank">{{$t('exchangeDig')[15]}}</div>
          </div>
          <div class="data-content">
            <div class="item"
                 v-for="(item, index) in dataList"
                 :key="index">
              <p class="serial">{{index + 1 + (curPage - 1) * num}}</p>
              <p class="address"><a :href="'https://hecoinfo.com/address/' + item.address">{{shortenAddress(item.address, 4, 2)}}</a></p>
              <p class="rank">
                <template v-if="item.type0 == 1">
                  {{$t('level')[0]}}
                </template>
                <template v-if="item.type0 == 2">
                  {{$t('level')[1]}}
                </template>
              </p>
            </div>
          </div>
          <div class="page-box">
            <img class="pre-page"
                 :class="curPage == 1 ? 'disabled' : ''"
                 @click="prePageHandle"
                 src="../assets/image/icon-arrow.png"
                 alt="">
            <div>Page {{curPage}} of {{totalPage}}</div>
            <img class="next-page"
                 :class="curPage == totalPage ? 'disabled' : ''"
                 @click="nextPageHandle"
                 src="../assets/image/icon-arrow.png"
                 alt="">
          </div>
        </template>
        <template v-else-if="loading">
          <div class="no-data">{{$t('loading')}}</div>
        </template>
        <template v-else>
          <div class="no-data">{{$t('invite')[21]}}</div>
        </template>
      </div>
    </div>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { ethers } from 'ethers'
import { request, gql } from 'graphql-request'
import bus from '../assets/script/bus'
import abiMining from '../abi-mining.json'
export default {
  name: 'activate',
  data () {
    return {
      num: 5, // 每页的数量
      curPage: 1,
      totalPage: 0,
      dataList: [],
      levelOneNum: '--',
      levelTwoNum: '--',
      totalNum: 0,
      loading: false,
      lang: ''
    };
  },
  props: {
    platform: {
      type: Number,
      require: true
    },
    account: {
      type: String,
      require: true
    }
  },
  watch: {
    account () {
      this.getInviteData(0)
    }
  },
  mounted () {
    this.lang = Cookies.get('lang') && typeof Cookies.get('lang') === 'string' ? Cookies.get('lang').toLowerCase() : ''
    // 激活成功之后更新邀请数据
    bus.$on('updateInvite', this.getInviteData)
  },
  methods: {
    /**
     * 钱包地址输入验证
     */
    checkAddress (address) {
      if (!(address.length != 42 || address.slice(0, 2) != "0x") && address != "") {
        return true
      }
      return false
    },
    shortenAddress (address, chars, type) {
      let label = '...'
      if (type == 1) {
        label = '...'
      } else if (type == 2) {
        label = '****'
      }
      return `${address.substring(0, chars)}${label}${address.substring(42 - chars)}`
    },
    /**
     * 获取我的邀请数据
     */
    getInviteData (index) {
      let skip = 0
      if (index) {
        skip = index
      }
      if (!this.account) {
        return false
      }
      if (this.loading) {
        return
      }
      this.loading = true
      const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
      const query = gql`
        {
          relationShips(first: ${this.num} skip: ${skip},orderBy: height, orderDirection: desc, where: {owner: "${this.account.toLowerCase()}"}) {
            address
            type0
          }
          counts(where: {id: "${this.account.toLowerCase()}"}){
            total
            one
            two
          }
        }
      `
      request(endpoint, query).then((res) => {
        let data = res
        // data = { "counts": [{ "one": "5", "total": "5", "two": "0" }], "relationShips": [{ "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }, { "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }, { "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }, { "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }, { "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }, { "address": "0xb067903d4e7819f2be1ed7a3052b38577501cf48", "type0": "1" }] }
        if (data.counts.length) {
          this.totalPage = Math.ceil(data.counts[0].total / this.num)
          this.levelOneNum = data.counts[0] ? data.counts[0].one : 0
          this.levelTwoNum = data.counts[0] ? data.counts[0].two : 0
          this.totalNum = data.counts[0] ? data.counts[0].total : 0
        } else {
          this.levelOneNum = 0
          this.levelTwoNum = 0
          this.totalNum = 0
        }
        if (data.relationShips.length) {
          this.dataList = data.relationShips
          // this.getFinalData(this.dataList)
        } else {
          this.dataList = []
        }
        this.loading = false
      }).catch((err) => {
        this.loading = false
        console.log(err)
      })
    },
    async getFinalData (arr) {
      let contract = await this.getContract()
      arr.map((item, index) => {
        contract.rewardInfos(item.address).then(data => {
          let benefit = ethers.utils.formatEther(data.receiveReward)
          benefit = parseFloat(benefit, 10)
          this.dataList[index].benefit = benefit > 0 ? benefit.toFixed(8) : 0
          this.dataList = Object.assign([], this.dataList)
        }).catch(err => {
          console.log(err)
        })
      })
      this.dataList.sort(function (a, b) {
        return a.benefit - b.benefit
      })
    },
    /**
     * 获取挖矿合约实例
     */
    getContract () {
      const contractAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abiMining, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    /**
     * 上一页
     */
    prePageHandle () {
      if (this.curPage > 1) {
        this.curPage--
        let skip = this.num * (this.curPage - 1)
        this.getInviteData(skip)
      }
    },
    /**
     * 下一页
     */
    nextPageHandle () {
      if (this.curPage < this.totalPage) {
        this.curPage++
        let skip = this.num * (this.curPage - 1)
        this.getInviteData(skip)
      }
    }
  }
};
</script>
<style lang="less" scoped>
.invitation-box {
  font-size: 16px;
  .pc-invitation {
    .block-title {
      display: flex;
      justify-content: space-between;
      margin: 0 30px;
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #06263c;
      line-height: 25px;
      p {
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #6a7d8a;
          line-height: 20px;
        }
      }
      .toast-box {
        position: relative;
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-left: 6px;
        line-height: 14px;
        img {
          width: 14px;
          height: 14px;
        }
        div {
          position: absolute;
          right: -14px;
          bottom: 21px;
          width: 130px;
          background: #ffffff;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 10px;
          padding: 10px;
          font-size: 12px;
          color: rgba(6, 38, 60, 0.5);
          display: none;
          text-align: left;
          line-height: 20px;
          i {
            position: absolute;
            bottom: -12px;
            right: 15px;
            border: 6px solid transparent;
            border-top: 8px solid #fff;
            width: 0;
            height: 0px;
          }
        }
        div.en-version {
          width: 200px;
        }
      }
      .toast-box:hover {
        div {
          display: block;
        }
      }
    }
    .data-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      height: 70px;
      line-height: 70px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: rgba(6, 38, 60, 0.5);
      border-top: 1px solid #f8f8f8;
      .serial {
        width: 30%;
        padding: 0 0 0 30px;
        box-sizing: border-box;
      }
      .address {
        width: 50%;
      }
      .rank {
        width: 20%;
      }
      .operate {
        width: 20%;
        padding: 0 30px 0 0;
        box-sizing: border-box;
        text-align: right;
      }
    }
    .data-content {
      height: 300px;
      overflow: hidden;
      margin-bottom: 20px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 60px;
        line-height: 60px;
        font-size: 14px;
        font-family: DINPro-Medium, DINPro;
        color: #82929d;
        border-top: 1px solid #f8f8f8;
        .serial {
          width: 30%;
          padding: 0 0 0 30px;
          box-sizing: border-box;
          color: #06263c;
        }
        .address {
          width: 50%;
        }
        .rank {
          width: 20%;
          color: #06263c;
        }
        .operate {
          width: 20%;
          padding: 0 30px 0 0;
          box-sizing: border-box;
          text-align: right;
          a {
            display: flex;
            justify-content: flex-end;
            color: #35bdb1;
            text-decoration: underline;
            line-height: 1;
            img {
              margin-left: 3px;
              width: 15px;
              height: 14px;
            }
          }
        }
      }
    }
    .page-box {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .pre-page {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); /* Opera */
      }
      img.disabled {
        opacity: 0.6;
      }
      div {
        margin: 0 20px;
        font-size: 14px;
        font-family: DINPro-Regular, DINPro;
        color: #06263c;
        line-height: 18px;
      }
    }
    .no-data {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #06263c;
      line-height: 50px;
      opacity: 0.5;
      text-align: center;
    }
  }
  .h5-invitation {
    .block-title {
      display: flex;
      justify-content: space-between;
      margin: 0 20px 0 20px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #06263c;
      line-height: 22px;
      p {
        display: flex;
        align-items: center;
        span {
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #6a7d8a;
          line-height: 20px;
        }
      }
      .toast-box {
        position: relative;
        display: inline-block;
        width: 14px;
        height: 14px;
        margin-left: 6px;
        line-height: 14px;
        img {
          width: 14px;
          height: 14px;
        }
        div {
          position: absolute;
          right: -14px;
          bottom: 21px;
          width: 130px;
          background: #ffffff;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 10px;
          padding: 10px;
          font-size: 12px;
          color: rgba(6, 38, 60, 0.5);
          display: none;
          text-align: left;
          line-height: 20px;
          i {
            position: absolute;
            bottom: -12px;
            right: 15px;
            border: 6px solid transparent;
            border-top: 8px solid #fff;
            width: 0;
            height: 0px;
          }
        }
        div.en-version {
          width: 200px;
        }
      }
      .toast-box:hover {
        div {
          display: block;
        }
      }
    }
    .data-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #82929d;
      .serial {
        width: 40%;
        padding: 0 0 0 30px;
        box-sizing: border-box;
      }
      .address {
        width: 50%;
      }
      .rank {
        width: 20%;
      }
    }
    .data-content {
      max-height: 230px;
      overflow: hidden;
      margin-bottom: 20px;
      .item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-family: DINPro-Medium, DINPro;
        color: #82929d;
        .serial {
          width: 40%;
          padding: 0 0 0 30px;
          box-sizing: border-box;
          color: #06263c;
        }
        .address {
          width: 50%;
          a {
            font-size: 12px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: #35bdb1;
            line-height: 15px;
          }
        }
        .rank {
          width: 20%;
          color: #06263c;
        }
      }
    }
    .page-box {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 16px;
        height: 16px;
        cursor: pointer;
      }
      .pre-page {
        transform: rotate(180deg);
        -ms-transform: rotate(180deg); /* IE 9 */
        -moz-transform: rotate(180deg); /* Firefox */
        -webkit-transform: rotate(180deg); /* Safari 和 Chrome */
        -o-transform: rotate(180deg); /* Opera */
      }
      img.disabled {
        opacity: 0.6;
      }
      div {
        margin: 0 20px;
        font-size: 14px;
        font-family: DINPro-Regular, DINPro;
        color: #06263c;
        line-height: 18px;
      }
    }
    .no-data {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      color: #06263c;
      line-height: 50px;
      opacity: 0.5;
      text-align: center;
    }
  }
}
</style>
