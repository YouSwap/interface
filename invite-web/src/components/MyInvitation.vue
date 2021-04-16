<template>
  <div class="invitation-box">
    <div :class="platform == 2 ? 'pc-wrap' : 'h5-wrap'">
      <div class="block-title">
        {{$t('invite')[9]}}
      </div>
      <div class="data-box">
        <template v-if="dataList.length > 0">
          <div class="data-title">
            <div>{{$t('invite')[10]}}</div>
            <div>{{$t('invite')[11]}}</div>
            <!-- <div>{{$t('invite')[16]}}</div> -->
          </div>
          <div class="data-content">
            <div 
              class="item" 
              v-for="(item, index) in dataList" 
              :key="index"
            > 
              <p>{{shortenAddress(item.address, 4, 2)}}</p>
              <template v-if="item.type0 == 1">
                <p>{{$t('level')[0]}}</p>
              </template>
              <template v-if="item.type0 == 2">
                <p>{{$t('level')[1]}}</p>
              </template>
              <!-- <p>{{item.benefit}}</p> -->
            </div>
          </div>
          <div class="page-box">
            <img 
            class="pre-page"
            :class="curPage == 1 ? 'disabled' : ''"
            @click="prePageHandle"
            src="../assets/image/icon-arrow.png"
            alt="">
            <div>Page {{curPage}} of {{totalPage}}</div>
            <img 
            class="next-page"
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
import { ethers } from 'ethers'
import { request, gql } from 'graphql-request'
import bus from '../assets/script/bus'
import abiMining from '../abi-mining.json'
export default {
  name: 'activate',
  data() {
    return {
      num: 7, // 每页的数量
      curPage: 1,
      totalPage: 0,
      dataList: [],
      loading: false
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
    account() {
      this.getInviteData(0)
      this.getInviteBenefit()
    }
  },
  mounted() {
    // 激活成功之后更新邀请数据
    bus.$on('updateInvite', this.getInviteData)
  },
  methods: {
    /**
     * 钱包地址输入验证
     */
    checkAddress(address) {
      if (!(address.length != 42 || address.slice(0, 2) != "0x") && address != "") {
        return true
      }
      return false
    },
    shortenAddress(address, chars, type) {
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
    getInviteData(index) {
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
        if (data.counts.length) {
          this.totalPage = Math.ceil(data.counts[0].total / this.num)
          this.$emit('submit', data.counts[0])
        } else {
          this.$emit('submit', data.counts[0])
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
    async getFinalData(arr) {
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
      this.dataList.sort(function(a, b) {
        return a.benefit - b.benefit
      })
    },
    /**
     * 获取挖矿合约实例
     */
    getContract() {
      const contractAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abiMining, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    /**
     * 获取累计邀请收益,收益加成
     */
    async getInviteBenefit() {
      let contract = await this.getContract()
      contract.rewardInfos(this.account).then(data => {
        let inviteBenefit = ethers.utils.formatUnits(data.receiveReward.toString(), 6)
        let pledgeBenefit = ethers.utils.formatUnits(data.pledgeReward.toString(), 6)
        if (inviteBenefit > 0) {
          inviteBenefit = parseFloat(inviteBenefit, 10).toFixed(4)
          this.$store.commit('setInviteBenefit', inviteBenefit)
        } else {
          this.$store.commit('setInviteBenefit', 0)
        }
        if (pledgeBenefit > 0) {
          // pledgeBenefit = parseFloat(pledgeBenefit, 10).toFixed(4)
          this.$store.commit('setPledgeBenefit', pledgeBenefit)
        }
        setTimeout(() => {
          this.getInviteBenefit()
        }, 3000)
      }).catch(err => {
        setTimeout(() => {
          this.getInviteBenefit()
        }, 3000)
        console.log(err)
      })
      contract.selfReward(this.account).then(data => {
        let reward = ethers.utils.formatUnits(data.toString(), 6)
        if (reward > 0) {
          reward = parseFloat(reward, 10).toFixed(4)
          this.$emit('showSelfReward', reward)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 上一页
     */
    prePageHandle() {
      if (this.curPage > 1) {
        this.curPage--
        let skip = this.num * (this.curPage - 1)
        this.getInviteData(skip)
      }
    },
    /**
     * 下一页
     */
    nextPageHandle() {
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
    .pc-wrap {
      .block-title {
        font-size: 26px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263C;
        line-height: 37px;
        span {
          margin: 0 5px 0 15px;
          font-size: 36px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          line-height: 36px;
        }
      }
      .data-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 20px;
        height: 50px;
        line-height: 50px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(6, 38, 60, .5);
        line-height: 20px;
        div {
          width: 33%;
          text-align: center;
        }
      }
      .data-content {
        height: 350px;
        overflow: hidden;
        margin-bottom: 20px;
        .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 50px;
          line-height: 50px;
          font-size: 16px;
          font-family: DINPro-Medium, DINPro;
          color: #06263C;
          line-height: 21px;
          p {
            width: 33%;
            text-align: center;
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
          transform:rotate(180deg);
          -ms-transform:rotate(180deg); 	/* IE 9 */
          -moz-transform:rotate(180deg); 	/* Firefox */
          -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
          -o-transform:rotate(180deg); 	/* Opera */
        }
        img.disabled {
          opacity: .6;
        }
        div {
          margin: 0 20px;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          color: #06263C;
          line-height: 18px;
        }
      }
      .no-data {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263C;
        line-height: 50px;
        opacity: 0.5;
        text-align: center;
      }
    }
    .h5-wrap {
      .block-title {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #fff;
        line-height: 25px;
        span {
          margin: 0 5px 0 15px;
          font-size: 36px;
          font-family: DINPro-Bold, DINPro;
          font-weight: bold;
          line-height: 36px;
        }
      }
      .data-title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 16px;
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(255, 255, 255, .5);
        line-height: 20px;
        div {
          width: 33%;
          text-align: center;
        }
      }
      .data-content {
        height: 280px;
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
          color: #fff;
          line-height: 18px;
          p {
            width: 33%;
            text-align: center;
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
          transform:rotate(180deg);
          -ms-transform:rotate(180deg); 	/* IE 9 */
          -moz-transform:rotate(180deg); 	/* Firefox */
          -webkit-transform:rotate(180deg); /* Safari 和 Chrome */
          -o-transform:rotate(180deg); 	/* Opera */
        }
        img.disabled {
          opacity: .6;
        }
        div {
          margin: 0 20px;
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          color: #fff;
          line-height: 18px;
        }
      }
      .no-data {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #fff;
        line-height: 50px;
        opacity: 0.6;
        text-align: center;
      }
    }
  }
</style>
