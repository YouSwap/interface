<template>
  <div class="staked-wrapper" @click="handleDialogClose">
    <div class="dialog-wrap" :class="$store.state.platform === 2 ? '': 'dialog-wrap-phone'" @click.stop="handleContentClick">
      <h5>{{$t('dialog')[0]}}</h5>
      <div class="input-wrap">
        <div class="title-wrap">
          <span>{{$t('digcards')[6]}}</span>
          <div>
            <span>{{$t('dialog')[1]}}:</span>
            <span style="margin-left: 4px">{{getDecimalsCoinFn(balanceof, 16)}}</span>
          </div>
        </div>
        <div class="content-wrap">
          <input style="font-size: 16px; width: 122px" type="text" placeholder="0.0" v-model="amount" @input="amount = mustNum(amount)">
          <div class="content-right">
            <el-button class="maxBtn"  @click="maxNumber">Max</el-button>
            <span>{{list_info.poolname}} <span v-if="list_info.type == 1">LP</span></span>
          </div>
        </div>
      </div>
      <div class="tip-wrap" v-if="tip_error">
        <span>*{{list_info.poolname}} LP {{$t('dialog')[6]}}</span>
      </div>
      <div class="btn-wrap">
        <button class="cancel" @click="handleDialogClose">{{$t('dialog')[3]}}</button>
        <button :class="notshowConfim?'confirm-disabled': ''" :disabled="notshowConfim" class="confirm" @click="confirm">{{$t('dialog')[4]}}</button>
      </div>
      <div class="link-wrap">
        <span>
          <a v-if="list_info.type == 2" :href="swapTokenUrl">{{$t('digcards')[13]}} {{list_info.poolname}} </a>
          <a v-else :href="lpTokenUrl">{{$t('digcards')[13]}} {{list_info.poolname}} LP</a>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import abiMing from '../../abi-mining.json'
import abiUSDT from '../../abi-usdt.json'
import bus from '../../assets/script/bus'
import { getDecimalsCoin } from '../../utils'

export default {
  data () {
    return {
      loading: false,
      gasLimit: 650000,
      gasPrice: '1',
      img1Url: require('../../assets/image/light.png'),
      img2Url: require('../../assets/image/light.png'),
      list_info: JSON.parse(localStorage.getItem('list_info')),
      amount: '',
      balanceof: '',
      tip_error: false,
      notshowConfim: false,
      lpTokenUrl: process.env.VUE_APP_LPTOKEN_URL,
      swapTokenUrl: process.env.VUE_APP_SWAP_URL,
      lpaddress: process.env.VUE_APP_YOU_ADDRESS,
    };
  },
  mounted() {
    this.getbalance();
  },
  methods: {
    /**
     * maxNumber
    */
    maxNumber() {
      this.amount = this.balanceof
    },
    /**
     * 截取小数精度
     */
    getDecimalsCoinFn(number, decimal) {
      return getDecimalsCoin(number, decimal)
    },
    handleDialogClose () {
      this.$emit('stakedClose')
    },
    handleContentClick() {
      // this.$emit('stakedClose')
    },
    /**
     * 只能输入数字
     */
    mustNum (num) {
      let str = '' + num
      str = str.replace(/[^\d.]/g, '') // 清除“数字”和“.”以外的字符
      str = str.replace(/^\./g, '') // 验证第一个字符是数字而不是.
      str = str.replace(/\.{2,}/g, '.') // 只保留第一个. 清除多余的.
      str = str.replace('.', '$#$').replace(/\./g, '').replace('$#$', '.')
      return str
    },
    /**
     * 获取合约实例
     */
    getContract() {
      const contractAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abiMing, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    getbalance() {
      const lpaddress = this.list_info.lpaddress
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(lpaddress, abiUSDT, provider)
      contract.balanceOf(this.$store.state.account).then(balanceof => {
        if (process.env.VUE_APP_YOU_ADDRESS === lpaddress) {
          this.balanceof = ethers.utils.formatUnits(balanceof.toString(), 6) || '--'
        } else {
          this.balanceof = ethers.utils.formatUnits(balanceof.toString(), 18) || '--'
        }
      })
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
    async sendAsync() {

      if (this.loading) {
        return
      }
      this.loading = true
      bus.$emit('showLoading', 'staked')
      this.$emit('stakedClose')
    
      let overrides = {
        gasLimit: this.gasLimit,
        gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(),'gwei')
      }
      const contract = await this.getContract()
      let BigNumbers = ''
      if (process.env.VUE_APP_YOU_ADDRESS === this.list_info.lpaddress) {
        BigNumbers = ethers.utils.parseUnits(this.amount, 6)
      } else {
        BigNumbers = ethers.utils.parseUnits(this.amount, 18)
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      await provider.getTransactionCount(this.$store.state.account).then((res) => {
        overrides.nonce = res
      }).catch(err => {
        console.log(err)
      })
      console.log(overrides)
      contract.deposit(this.list_info.id, BigNumbers, overrides).then((res) => {
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            console.log(receipt)
            if (receipt) {
              if (receipt.logs.length) {
                this.$message.success(this.$t('digcards')[20])
                bus.$emit('initBalance')
                setTimeout(()=>{
                  bus.$emit('initPoolList')
                  console.log('质押')
                }, 2000)
                bus.$emit('updateInviteBenefit')
                this.resetInput()
                bus.$emit('closeLoading')
                this.loading = false
              } else {
                this.$message.warning(this.$t('digcards')[21])
                this.resetInput()
                bus.$emit('closeLoading')
                this.loading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            bus.$emit('closeLoading')
            this.loading = false
            this.resetInput()
            console.log(err)
          });
        }, 1000)
      }).catch((err) => {
        bus.$emit('closeLoading')
        this.loading = false
        this.resetInput()
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else {
          this.$message.warning(this.$t('digcards')[21])
        }
      });
    },
    /**
     * 重置弹窗内容
     */
    resetInput() {
      this.amount = ''
    },
    confirm () {
      this.getGasValue()
    }
  },
  watch: {
    amount: {
      handler(val) {
        if (val === '' || val == 0) {
          this.tip_error = false;
          this.notshowConfim = true;
          return
        } else {
          if (Number(val) > Number(this.balanceof)) {
            this.tip_error = true;
            this.notshowConfim = true;
            return
          } else {
            let arr = val.toString().split('.')
            if (arr[1] && this.list_info.decimals) {
              if (arr[1].length > this.list_info.decimals) {
                this.amount = arr[0] + '.' + arr[1].substring(0, this.list_info.decimals)
              }
            }
            this.tip_error = false;
            this.notshowConfim = false;
          }
        }
      },
      deep: true,
      immediate: true
    }
  }
}

</script>
<style lang='less' scoped>
  .staked-wrapper {
    width: 100%;
    height: 100%;
    background: rgba(68, 68, 68, 0.5);
    position: fixed;
    left: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
    .dialog-wrap-phone {
       width: 90%!important;
       padding: 30px 15px!important;
       .input-wrap {
         .content-wrap {
          .content-right {
            display: flex;
          }
          .content-right > span {
            font-size: 12px!important;
            margin-left: 0!important;
          }
         }
       }
       .right-wrap >img{
         display: none
       }
    }
    .dialog-wrap {
      width: 480px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
      padding: 30px;
      z-index: 1111;
      & > h5 {
        font-size: 20px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #06263C;
        line-height: 28px;
      }
      .input-wrap {
        width: 100%;
        padding: 20px;
        border-radius: 10px;
        border: 1px solid #E6E9EB;
        margin-top: 30px;
        display: flex;
        flex-direction: column;
        .title-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          & > span {
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #06263C;
            line-height: 16px;
            opacity: 0.5;
          }
          & > div {
            display: flex;
            & > span {
              font-size: 12px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #06263C;
              line-height: 16px;
              opacity: 0.5;
            }
          }
        }
        .content-wrap {
          display: flex;
          margin-top: 9px;
          align-items: center;
          justify-content: space-between;
          
          .content-right {
            display: flex;
            align-items: center;
            .right-wrap {
              width: 20px;
              height: 20px;
              position: relative;
              .img1 {
                height: 20px;
              }
              .img2 {
                width: 20px;
                height: 20px;
                position: absolute;
                right: -50%;
              }
            }
            & > span {
              margin-left: 10px;
              font-size: 14px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #06263C;
              line-height: 18px;
            }
          }
        }
      }
      .tip-wrap {
        width: 100%;
        height: 26px;
        padding-top: 10px;
        & > span {
          font-size: 12px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #FE535B;
          line-height: 16px;
        }
      }
      .btn-wrap {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 30px;
        .cancel {
          width: 200px;
          height: 45px;
          background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
          border-radius: 10px;
          opacity: 0.5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 22px;
          cursor: pointer;
        }
        .cancel:hover {
          opacity: 0.8;
        }
        .confirm {
          width: 200px;
          height: 45px;
          margin-left: 20px;
          background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
          border-radius: 10px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #FFFFFF;
          line-height: 22px;
          cursor: pointer;
        }
        .confirm-disabled {
          opacity: 0.6;
        }
        .confirm:hover {
          opacity: 0.8;
        }
      }
      .link-wrap {
        width: 100%;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        & > span {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06999E;
          line-height: 18px;
          text-decoration: underline;
          cursor: pointer;
          a {
            color: #06999E;
          }
          a:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .maxBtn {
    height: 28px;
    border: none;
    background: linear-gradient(80deg, rgb(52, 189, 176) 0%, rgb(12, 151, 156) 100%);
    font-weight: 500;
    color: rgb(255, 255, 255);
    padding: 4px 5px;
    margin-right: 5px;
  }
</style>