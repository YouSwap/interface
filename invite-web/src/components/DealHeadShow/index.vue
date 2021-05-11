<template>
  <div class="show-container">
    <div class="content-left-wrap">
      <div class="content-left-item">
        <div class="item-left">
          <span>{{$t('sendRewardTotal')}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('totalSendReward')}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <span><span v-if="titleShowData.sendTotal !== '--'">$</span>{{titleShowData.sendTotal}}</span>
      </div>
      <div class="content-left-item">
        <div class="item-left">
          <span>{{$t('todayExchangeTotal')}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('todayExchangeTotalDesc')}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <span>
          <span v-if="titleShowData.todayExchangeTotal !== '--'">$</span>
          <span v-if="titleShowData.todayExchangeTotal == '--'">{{titleShowData.todayExchangeTotal}}</span>
          <countTo v-else
                   :startVal="startVal"
                   :endVal='Number(titleShowData.todayExchangeTotal)'
                   :decimals="2"
                   :duration='500'></countTo>
        </span>
      </div>
      <div class="content-left-item">
        <div class="item-left">
          <span>{{$t('myExchangePercent')}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('myExchangePercentDesc')}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <span>
          <span v-if="titleShowData.myExchangePercent == '--'">{{titleShowData.myExchangePercent}}</span>
          <countTo v-else
                   :startVal="startVal"
                   :endVal='Number(titleShowData.myExchangePercent)'
                   :decimals="2"
                   :duration='500'></countTo>
          <span v-if="titleShowData.myExchangePercent !== '--'">%</span>
        </span>
      </div>
    </div>
    <div class="content-right-wrap">
      <div class="content-right">
        <div class="item-right">
          <span>{{$t('receiveReward')}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('receiveRewardDesc')}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <div class="content-right-count">
          <span>{{titleShowData.willReceive !== '--' ? titleShowData.willReceive / 10**6 : '--'}}</span>
          <span v-if="titleShowData.willReceive !== '--'"> YOU</span>
        </div>
      </div>
      <el-button :loading="progressLoading"
                 :disabled="withdraw_disabled"
                 :style="withdraw_disabled? 'opacity: 0.5' : 'opacity: 1'"
                 @click="withdraw">{{$t('withdraw')}}</el-button>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { abi_airport } from '../../utils/abi_airport'
import countTo from 'vue-count-to'

export default {
  props: {
    titleShowData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      questionImgUrl: require('../../assets/image/question-pc.png'),
      progressLoading: false,
      startVal: 0
    }
  },
  components: {
    countTo
  },
  computed: {
    withdraw_disabled () {
      return this.titleShowData.willReceive === '--' || (this.titleShowData.willReceive * 1 === 0)
    }
  },
  methods: {
    withdraw () {
      const overrides = {
        gasLimit: 100000,
        gasPrice: ethers.utils.parseUnits('2', 'gwei')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        process.env.VUE_APP_AIRPORT_CONTRACT,
        abi_airport,
        provider
      )
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.withdraw(process.env.VUE_APP_AIRPORT_YOU_ADDRESS, this.titleShowData.willReceive, overrides).then(res => {
        this.progressLoading = true
        // 更新领取奖励
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            console.log('receipt', receipt)
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  this.$message.success(this.$t('digcards')[14])
                  this.progressLoading = false
                  this.$parent.getWillReceive()
                }, 2000)
              } else {
                this.$message.warning(this.$t('digcards')[15])
                this.progressLoading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            this.progressLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        this.progressLoading = false
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else {
          this.$message.warning(this.$t('digcards')[15])
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.show-container {
  width: 1200px;
  height: 90px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f2f6;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 60px;
  margin-top: 30px;
  .content-left-wrap {
    display: flex;
    flex: 1;
    margin-left: 9px;
    padding-right: 58px;
    align-items: center;
    justify-content: space-between;
    height: 100%;
    border-right: 1px dashed rgba(6, 38, 60, 0.2);
    .content-left-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      & > .item-left {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6a7d8a;
        line-height: 16px;
        display: flex;
        align-items: center;
      }
      & > span:last-child {
        margin-top: 8px;
        font-size: 26px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263c;
        line-height: 26px;
        margin-right: 26px;
      }
    }
  }
  .content-right-wrap {
    margin-left: 59px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .content-right {
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      & > .item-right {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6a7d8a;
        line-height: 16px;
        display: flex;
        align-items: center;
        span {
          white-space: nowrap;
        }
      }
      & > .content-right-count {
        margin-right: 26px;
        margin-top: 8px;
        font-size: 26px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263c;
        line-height: 26px;
      }
    }
    & > button {
      margin-left: 30px;
      height: 40px;
      white-space: nowrap;
      padding: 0 18px;
      background: linear-gradient(72deg, #34bdb0 0%, #0c979c 100%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #ffffff;
      line-height: 22px;
      cursor: pointer;
    }
    & > button:hover {
      opacity: 0.8;
    }
  }
}
.toast-box {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  margin-left: 6px;
  img {
    width: 14px;
    height: 14px;
  }
  div {
    position: absolute;
    left: -11px;
    bottom: 26px;
    width: 168px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    padding: 10px;
    font-size: 12px;
    color: rgba(6, 38, 60, 0.5);
    display: none;
    z-index: 100;
    i {
      position: absolute;
      bottom: -12px;
      left: 15px;
      border: 6px solid transparent;
      border-top: 8px solid #fff;
      width: 0;
      height: 0px;
    }
  }
  .activate-tip {
    bottom: 25px;
  }
}
.toast-box:hover {
  div {
    display: block;
  }
}
</style>