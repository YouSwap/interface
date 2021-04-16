<template>
  <div class="share-box">
    <div class="inner-box" :class="platform == 2 ? 'pc-wrap' : 'h5-wrap'" @click.stop>
      <img class="close" @click="cancelHandle" src="../assets/image/icon-close.png" alt="">
      <p>{{$t('share')[1]}}{{$t('invite')[10]}}{{shortenAddress(shareAddress, 4)}}{{$t('share')[2]}}{{$t('share')[3]}}</p>
      <a href="javascript:;" class="bottom" @click="confirmHandle">
        <template v-if="!account">
          {{$t('connect')[0]}}
        </template>
        <template v-else>
          <template v-if="loading">
            <loading></loading>
          </template>
          <template v-else>
            {{$t('share')[0]}}
          </template>
        </template>
      </a>
    </div>
  </div>
</template>
<script>
import { ethers } from 'ethers'
import abi from '../abi-invite.json'
import bus from '../assets/script/bus'
import loading from './loading'

export default {
  name: 'activate',
  components: {
    loading
  },
  data() {
    return {
      fileName: '',
      outputs: [],
      tabId: 1,
      tip: '',
      loading: false,
      gasLimit: 300000,
      gasPrice: '1'
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
    },
    shareAddress: {
      type: String,
      require: true
    }
  },
  mounted() {
    
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
    /**
     * 格式化钱包地址
     */
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
     * 获取gasPrice
     */
    getGasValue() {
      this.$get(process.env.VUE_APP_HECO_GAS_API).then(res => {
        if (res.code == 0) {
          this.gasPrice = res.prices.median
        }
        this.sendAsync()
      }).catch((err) => {
        console.log(err)
        this.sendAsync()
      })
    },
    /**
     * 获取合约实例
     */
    async getContract() {
      const contractAddress = process.env.VUE_APP_INVITE_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abi, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    async sendAsync() {
      let that = this
      if (this.loading) {
        return
      }
      this.loading = true
      bus.$emit('showLoading')
      this.$emit('cancel')
      let overrides = {
        gasLimit: this.gasLimit,
        gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(),'gwei')
      }
      const contract = await this.getContract()
      contract.acceptInvitation(this.shareAddress, overrides).then((res) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        console.log(res.hash)
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            // console.log(receipt)
            if (receipt) {
              if (receipt.logs.length) {
                that.$message.success(that.$t('index')[2])
                that.$emit('inviteSucc')
              } else {
                that.$message.warning(that.$t('index')[3])
              }
              setTimeout(() => {
                this.cancelHandle()
              }, 1000)
              bus.$emit('closeLoading')
              that.loading = false
              clearInterval(timer)
            }
          }).catch((err) => {
            bus.$emit('closeLoading')
            this.loading = false
            console.log(err)
          });
        }, 1000)
      }).catch((err) => {
        console.log(err)
        bus.$emit('closeLoading')
        this.loading = false
        if ( err.error && err.error.code == -32603) {
          this.$message.warning(this.$t('activate')[4])
        } else if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else {
          this.$message.warning(err.code || this.$t('activate')[15])
        }
        setTimeout(() => {
          this.cancelHandle()
        }, 1000)
      });
    },
    /**
     * 确认
     */
    confirmHandle() {
      let account = this.account.toLowerCase()
      let shareAddress = this.shareAddress.toLowerCase()
      if (!this.account) {
        this.$emit('connect')
      } else {
        // console.log(this.shareAddress.tolowerCase())
        if (account == shareAddress) {
          this.$message.warning(this.$t('index')[4])
        } else {
          this.getGasValue()
        }
      }
    },
    cancelHandle() {
      this.$emit('cancel', true) // true代表点击关闭按钮
    }
  }
};
</script>
<style lang="less" scoped>
  .share-box {
    width: 100%;
    height: 100%;
    background: rgba(68, 68, 68, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    .inner-box.pc-wrap {
      position: relative;
      width: 300px;
      padding: 30px;
      box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 20px;
      p {
        padding: 30px 0 50px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263C;
        border-radius: 10px;
      }
      .close {
        position: absolute;
        top: 30px;
        right: 30px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .bottom {
        display: block;
        width: 100%;
        height: 45px;
        background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #FFFFFF;
        cursor: pointer;
      }
      .bottom:hover {
        opacity: .9;
      }
    }
    .inner-box.h5-wrap {
      position: relative;
      width: 85%;
      padding: 15px;
      margin: 0 20px;
      box-sizing: border-box;
      background: #FFFFFF;
      border-radius: 20px;
      p {
        font-size: 14px;
        padding: 30px 0 30px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #06263C;
        line-height: 25px;
      }
      .close {
        position: absolute;
        top: 20px;
        right: 20px;
        width: 24px;
        height: 24px;
        cursor: pointer;
      }
      .bottom {
        display: block;
        height: 45px;
        background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
        border-radius: 10px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        color: #FFFFFF;
        cursor: pointer;
      }
    }
  }
</style>
