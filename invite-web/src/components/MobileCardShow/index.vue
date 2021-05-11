<template>
  <div class="show-wrap">
    <ul>
      <li>
        <div class="item">
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
          <div><span v-if="titleShowData.sendTotal !== '--'">$</span><span>{{titleShowData.sendTotal}}</span></div>
        </div>
      </li>
      <li>
        <div class="item">
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
          <div><span v-if="titleShowData.todayExchangeTotal !== '--'">$</span><span>{{titleShowData.todayExchangeTotal}}</span></div>
        </div>
      </li>
      <li>
        <div class="item">
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
          <div><span>{{titleShowData.myExchangePercent}}</span><span v-if="titleShowData.myExchangePercent !== '--'">%</span></div>
        </div>
      </li>
      <li>
        <div class="item">
          <div class="item-left">
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
          <div>{{titleShowData.willReceive !== '--'? titleShowData.willReceive / 10**6 : '--'}} <span v-if="titleShowData.willReceive !== '--'">YOU</span></div>
        </div>
      </li>
    </ul>
    <el-button @click="withdraw"
               :loading="progressLoading"
               :disabled="withdraw_disabled"
               :style="withdraw_disabled? 'opacity: 0.5' : 'opacity: 1'"
               class="btn">{{$t('withdraw')}}</el-button>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { abi_airport } from '../../utils/abi_airport'
export default {
  props: {
    titleShowData: {
      type: Object,
      require: true
    }
  },
  data () {
    return {
      progressLoading: false,
      questionImgUrl: require('../../assets/image/question-h5.png'),
    }
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
        console.log('resss', res)
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
      })
    }
  }
}
</script>

<style lang="less" scoped>
.show-wrap {
  width: 100%;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f0f2f6;
  padding: 10px 20px 20px 20px;
  ul {
    width: 100%;
    display: flex;
    flex-direction: column;
    li {
      display: flex;
      height: 38px;
      align-items: center;
      border-bottom: 1px solid #f8f8f8;
      .item {
        width: 100%;
        display: flex;
        justify-content: space-between;
        .item-left {
          display: flex;
          align-items: center;
          span {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #6a7d8a;
            line-height: 17px;
          }
        }

        div {
          span {
            font-size: 14px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: #06263c;
            line-height: 18px;
          }
        }
      }
    }
    li:last-child {
      border-bottom: 0;
    }
  }
  .btn {
    width: 100%;
    height: 40px;
    background: linear-gradient(71deg, #35beb1 0%, #0c979c 100%);
    border-radius: 10px;
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    margin-top: 10px;
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
    width: 170px;
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