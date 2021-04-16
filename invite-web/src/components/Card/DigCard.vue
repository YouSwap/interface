<template>
  <div>
    <div v-if="!loading">
      <div v-if="poolsList.length > 0" :class="platform === 2 ? 'container' : 'h5-container'">
        <div class="digcard-item" v-for="(item, index) in poolsList" :key="index">
          <div v-if="item.isfinshed" class="isfinshed_tips">{{$t('isfinshed')}}</div>
          <div class="title-inner">
            <div class="title-left">
              <img class="img1" :src="`https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/${item.lpaddress}.png`" alt="">
              <span>{{item.poolname}}</span>
            </div>
            <div class="title-right">{{item.rewardmultiple}} X</div>
          </div>
          <div class="content">
            <div class="content-item">
              <div class="item-left">{{$t('digcards')[0]}}</div>
              <div class="item-right" v-if="item.reserveUSD || lpaddress === item.lpaddress">
                <span v-if="((item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)) === 0) || (youPrice * (item.staketotaldnow / 10**item.decimals) === 0)">0.00%</span>
                <span v-else>
                  <span v-if="lpaddress === item.lpaddress">
                    {{getDecimalsCoinFn((item.rewardperblock / 10**6 * youPrice * 10512000 * 100) / ( youPrice * (item.staketotaldnow / 10**item.decimals)), 2)}}%
                  </span>
                  <span v-else>
                    {{getDecimalsCoinFn((item.rewardperblock / 10**6 * youPrice * 10512000 * 100) / (item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)), 2)}}%
                  </span>
                </span>
              </div>
              <div class="item-right" v-else>0.00%</div>
            </div>
            <div v-if="!item.isNotStart" class="content-item">
              <div class="item-left">{{$t('digcards')[1]}}</div>
              <div class="item-right">YOU</div>
            </div>
            <div v-if="!item.isNotStart" class="content-item">
              <div class="item-left">
                <span>{{$t('digcards')[2]}}</span>
                <div>
                  <a class="toast-box">
                    <img :src="questionImgUrl" alt="">
                    <div>
                      {{$t('digcards')[10]}}
                      <i></i>
                    </div>
                  </a>
                </div>
              </div>
              <div class="item-right">
                <span v-if="item.user.length > 0">
                  <span v-for="poolsinfo in item.user[0].poolsinfo" :key="poolsinfo.id">
                    <span v-if="poolsinfo.id.split('-')[0] === item.id">
                     {{ getDecimalsCoinFn(scientificNotationToStringFn((poolsinfo.invitepower/10**item.decimals + poolsinfo.stakepower/10**item.decimals)*100/(poolsinfo.pool.totalpower/10**item.decimals)), 2)}}%</span>
                    </span>
                  </span>
                <span v-else>0.00%</span>
              </div>
            </div>
            <div v-if="!item.isNotStart" class="content-item">
              <div class="item-left">{{$t('digcards')[3]}}</div>
            </div>
            <div v-if="!item.isNotStart" class="content-item">
              <div class="item-left">
              <span>{{item.youPrice ? getDecimalsCoinFn(item.youPrice, 4) : '0'}}</span>
              </div>
              <button
                :disabled="!(Number(item.youPrice) > 0)"
                :class="Number(item.youPrice) > 0 ? '': 'receive-disabled'"
                class="receive"
                @click="handleToReceive(item)">
                {{$t('digcards')[7]}}
              </button>
            </div>
            <div v-if="item.allowance > 0 && !item.isNotStart">
              <div class="content-item">
                <div class="item-left">
                {{item.poolname}} 
                <i style="margin-left:4px" v-if="lpaddress !== item.lpaddress">LP</i>
                {{$t('digcards')[4]}}</div>
              </div>
              <div class="content-item">
                <div class="item-left">
                  <span v-if="item.user.length > 0">
                    <span v-for="poolsinfo in item.user[0].poolsinfo" :key="poolsinfo.id">
                      <span v-if="poolsinfo.id.split('-')[0] === item.id">
                        <span v-if="poolsinfo.pool.lpaddress === lpaddress">{{getDecimalsCoinFn(ethersFn.utils.formatUnits(poolsinfo.stake, 6), 16)}}</span>
                        <span v-else>{{getDecimalsCoinFn(ethersFn.utils.formatUnits(poolsinfo.stake, item.decimals), 16)}}</span>
                      </span>
                    </span>
                  </span>
                  <span v-else>0</span>
                </div>
                <div class="havepledge">
                  <div v-if="item.user.length > 0">
                    <div v-for="poolsinfo in item.user[0].poolsinfo" :key="poolsinfo.id">
                      <div v-if="poolsinfo.id.split('-')[0] === item.id">
                        <div v-if="!item.isfinshed">
                          <button class="pledge" v-if="poolsinfo.stake > 0" @click="handleUnstake(item)">-</button>
                          <button v-if="poolsinfo.stake > 0" :class="item.isfinshed ? 'isfinshed':''" :disabled="item.isfinshed" class="pledge" @click="handlePledge(item)">+</button>
                          <button v-if="poolsinfo.stake <= 0" class="pledge" @click="handlePledge(item)">{{$t('digcards')[6]}}</button>
                        </div>
                        <div v-else>
                          <button class="pledge" :class="poolsinfo.stake > 0 ? '':'isfinshed'" :disabled="poolsinfo.stake <= 0"  @click="handleUnstake(item)">-</button>
                          <button :class="item.isfinshed ? 'isfinshed':''" :disabled="item.isfinshed" class="pledge" @click="handlePledge(item)">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button v-else :disabled="item.isfinshed" class="pledge" :class="item.isfinshed? 'isfinshed': ''" @click="handlePledge(item)">{{$t('digcards')[6]}}</button>
                </div>
              </div>
            </div>
          </div>
          <button v-if="item.allowance <= 0 && !item.isNotStart" :disabled="item.isfinshed" :class="item.isfinshed ? 'isfinshed': ''" class="btn" @click="handleApproval(item)">{{$t('digcards')[5]}}</button>
          <div v-if="!item.isNotStart" class="line"></div>
          <div v-if="!item.isNotStart" class="fold">
            <div class="fold-inner" @click="handleFoldChange(item)">
              <span>{{item.fold ? $t('digcards')[11] : $t('digcards')[12]}}</span>
              <img :src="arrowDownUrl" alt="" v-show="item.fold">
              <img :src="arrowUpUrl" alt="" v-show="!item.fold">
            </div>
          </div>
          <div class="bottom" v-if="!item.fold && !item.isNotStart">
            <div class="bottom-item">
              <div class="item-left">{{$t('digcards')[8]}}</div>
              <div class="item-right">
                <span v-if="item.reserveUSD || lpaddress === item.lpaddress">
                  <span v-if="lpaddress === item.lpaddress">${{getDecimalsCoinFn(( youPrice * (item.staketotaldnow / 10**item.decimals)), 2)}}</span>
                  <span v-else>${{getDecimalsCoinFn((item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)), 2)}}</span>
                </span>
                <span v-else>$0</span>
              </div>
            </div>
            <div class="bottom-item">
              <div class="last-left">
                <a v-if="lpaddress === item.lpaddress" :href="swapTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} </a>
                <a v-else :href="lpTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} LP</a>
              </div>
            </div>
          </div>
          <button v-if="item.isNotStart" class="btn">{{$t('hopes')}}</button>
        </div>
      </div>
      <div v-else class="noData" :class="platform === 2 ? '' : 'h5-noData'">{{$t('nodata')}}</div>
    </div>
    <div v-else class="loadings" :class="platform === 2 ? '' : 'h5-loadings'">{{$t('loading')}}</div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { getDecimalsCoin, scientificNotationToString } from '../../utils'
import abiMing from '../../abi-mining.json'
import abiUSDT from '../../abi-usdt.json'
import bus from '../../assets/script/bus'
import { request, gql } from 'graphql-request'

export default {
  props: ['cardLists', 'platform', 'loading'],
  data () {
    return {
      receiveGasLimit: 600000,
      approvalGasLimit: 170000,
      gasPrice: '1',
      imgUrl: require('../../assets/image/default_coin_icon.png'),
      arrowDownUrl: require('../../assets/image/arrow_down.png'),
      arrowUpUrl: require('../../assets/image/arrow_top.png'),
      questionImgUrl: require('../../assets/image/question_extend.png'),
      poolsList: this.cardLists,
      progressLoading: false, // 接口请求loading，防止重复点击按钮
      YouPrice: '',
      lpTokenUrl: process.env.VUE_APP_LPTOKEN_URL,
      lpaddress: process.env.VUE_APP_YOU_ADDRESS,
      swapTokenUrl: process.env.VUE_APP_SWAP_URL,
    }
  },
  mounted() {
    this.getYouPrice();
  },
  computed: {
    ethersFn() {
      return ethers
    },
    youPrice() {
      return this.YouPrice
    }
  },
  methods: {
    scientificNotationToStringFn(params) {
      return scientificNotationToString(params)
    },
    /**
     * 截取小数精度
     */
    getDecimalsCoinFn(number, decimal) {
      return getDecimalsCoin(number, decimal)
    },
    /**
     * 收起/详情
     */
    handleFoldChange (item) {
      item.fold = !item.fold
    },
    // 获取YOU的折UDST价格
    getYouPrice() {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`
        {
          token(id: "${process.env.VUE_APP_YOU_ADDRESS.toLowerCase()}") {
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
    /**
     * 获取gasPrice
     */
    getGasValue(item, callback) {
      this.$get(process.env.VUE_APP_HECO_GAS_API).then(res => {
        if (res.code == 0) {
          this.gasPrice = res.prices.median
        }
        callback(item)
      }).catch((err) => {
        console.log(err)
        callback(item)
      })
    },
    /**
     * 点击领取
     */
    handleToReceive (item) {
      this.getGasValue(item, this.requestReceive)
    },
    /**
     * 请求领取
     */
    async requestReceive(item) {
      if (this.progressLoading) {
        return
      }
      this.progressLoading = true
      let overrides = {
        gasLimit: this.receiveGasLimit,
        gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(),'gwei')
      }

      bus.$emit('showLoading', 'receive')
      const LpAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(LpAddress, abiMing, provider)
      const contractWithSigner = contract.connect(provider.getSigner())
      
      await provider.getTransactionCount(this.$store.state.account).then((res) => {
        overrides.nonce = res
      }).catch(err => {
        console.log(err)
      })
      console.log(overrides)
      contractWithSigner.withdraw(parseInt(item.id, 10), '0', overrides).then((res) => {
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  this.$message.success(this.$t('digcards')[14])
                  bus.$emit('initBalance')
                  bus.$emit('initPoolList')
                  bus.$emit('updateInviteBenefit')
                  bus.$emit('closeLoading')
                  this.progressLoading = false
                }, 2000)
              } else {
                this.$message.warning(this.$t('digcards')[15])
                bus.$emit('closeLoading')
                this.progressLoading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            bus.$emit('closeLoading')
            this.progressLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        bus.$emit('closeLoading')
        this.progressLoading = false
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else {
          this.$message.warning(this.$t('digcards')[15])
        }
      })
    },
    /**
     * 质押
     */
    handlePledge (item) {
      localStorage.setItem('list_info', JSON.stringify(item))
      this.$emit('pledgeInit', true)
    },
    /**
     * 赎回
    */
    handleUnstake(item) {
      localStorage.setItem('list_info', JSON.stringify(item))
      this.$emit('redeemInit')
    },
    /**
     * 点击授权
     */
    handleApproval (item) {
      this.getGasValue(item, this.requestApproval)
    },
    /**
     * 请求授权
     */
    // requestApproval(item) {
    //   if (this.progressLoading) {
    //     return
    //   }
    //   this.progressLoading = true
    //   let overrides = {
    //     gasLimit: this.approvalGasLimit,
    //     gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(),'gwei')
    //   }
    //   bus.$emit('showLoading', 'approval')
    //   const LpAddress = item.lpaddress
    //   const provider = new ethers.providers.Web3Provider(window.ethereum)
    //   const contract = new ethers.Contract(LpAddress, abiUSDT, provider)
    //   const BigNumbers = ethers.utils.parseUnits('100000000', 18)
    //   const contractWithSigner = contract.connect(provider.getSigner())
    //   contractWithSigner.approve(process.env.VUE_APP_MINING_CONTRACT, BigNumbers, overrides).then((res) => {
    //     res.wait(abiUSDT).then((receipt) => {
    //       console.log('=======')
    //       console.log('=======')
    //       console.log('=======')
    //       console.log(receipt)
    //       if (receipt) {
    //         setTimeout(() => {
    //           this.$message.success(this.$t('digcards')[18])
    //           bus.$emit('initBalance')
    //           bus.$emit('initPoolList')
    //           bus.$emit('closeLoading')
    //           this.progressLoading = false
    //         }, 2000)
    //       }
    //     }).catch((err) => {
    //       bus.$emit('closeLoading')
    //       this.progressLoading = false
    //       console.log(err)
    //     });
    //   }).catch(err => {
    //     bus.$emit('closeLoading')
    //     this.progressLoading = false
    //     if (err.code == 4001) {
    //       this.$message.warning(this.$t('activate')[16])
    //     } else {
    //       this.$message.warning(err.code || this.$t('digcards')[19])
    //     }
    //   })
    // },
    /**
     * 请求授权
     */
    requestApproval(item) {
      if (this.progressLoading) {
        return
      }
      this.progressLoading = true
      let overrides = {
        gasLimit: this.approvalGasLimit,
        gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(),'gwei')
      }
      bus.$emit('showLoading', 'approval')
      const LpAddress = item.lpaddress
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(LpAddress, abiUSDT, provider)
      const BigNumbers = ethers.utils.parseUnits('100000000', 18)
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.approve(process.env.VUE_APP_MINING_CONTRACT, BigNumbers, overrides).then((res) => {
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            // console.log(receipt)
            if (receipt) {
              setTimeout(() => {
                this.$message.success(this.$t('digcards')[18])
                bus.$emit('initBalance')
                bus.$emit('initPoolList')
                bus.$emit('closeLoading')
                this.progressLoading = false
              }, 2000)
              clearInterval(timer)
            }
          }).catch((err) => {
            bus.$emit('closeLoading')
            this.progressLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        bus.$emit('closeLoading')
        this.progressLoading = false
        if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else {
          this.$message.warning(err.code || this.$t('digcards')[19])
        }
      })
    }
  },
  watch: {
    cardLists: {
      handler(value) {
        this.poolsList = value
      },
      deep: true,
      immediate:true,
    }
  },
}

</script>
<style lang='less' scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  .digcard-item:nth-child(3n + 1) {
    margin-left: 0;
  }
  .digcard-item {
    width: 380px;
    padding: 26px 30px 30px 26px;
    // display: flex;
    // flex-direction: column;
    float: left;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 20px;
    margin-top: 20px;
    margin-left: 29px;
    position: relative;
    overflow: hidden;
    .title-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-left {
        display: flex;
        align-items: center;
        .img1 {
          height: 30px;
          margin-right: 10px;
        }
        font-size: 20px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 28px;
      }
      .title-right {
        padding: 4px 5px;
        height: 18px;
        background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 14px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .content-item {
        width: 100.00%;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .item-left {
          display: flex;
          align-items: center;
          & > span {
            font-size: 16px;
            font-family: DINPro-Regular, DINPro;
            font-weight: 400;
            line-height: 18px;
          }
        }
        .item-right {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 18px;
        }
        .last-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06999F;
          line-height: 18px;
        }
        .receive, .pledge {
          padding: 4px 18px;
          height: 32px;
          background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFFFF;
          cursor: pointer;
        }
        .havepledge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .pledge {
            margin: 0 4px;
          }
          .pledge:last-child {
            margin-right: 0;
          }
          >div>div>div>div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        .receive:hover {
          opacity: 0.8;
        }
        .receive-disabled {
          opacity: 0.3;
        }
        .receive-disabled:hover {
          opacity: 0.3;
        }
        .pledge:hover {
          opacity: 0.8;
        }
      }
      .content-item:last-child {
        margin-top: 16px;
      }
    }
    .line {
      margin-top: 30px;
      width: 100.00%;
      height: 1px;
      border-top: 1px dashed #06263C;
      opacity: 0.08;
    }
    .btn {
      width: 320px;
      height: 45px;
      background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFFFF;
      margin-top: 30px;
      cursor: pointer;
    }
    .btn:hover {
      opacity: 0.8;
    }
    .fold {
      display: flex;
      align-items: center;
      margin-top: 19px;
      width: 100.00%;
      justify-content: center;
      cursor: pointer;
      .fold-inner {
        display: flex;
        align-items: center;
        & > span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06999E;
          line-height: 20px;
        }
        & > img {
          width: 16px;
          height: 16px;
          margin-left: 10px;
        }
      }
    }
    .bottom {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      .bottom-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        .item-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06263C;
          line-height: 18px
        }
        .item-right {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 18px;
        }
        .last-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06999F;
          line-height: 18px;
          cursor: pointer;
          a {
            color: #06999F;
          }
        }
      }
    }
  }
}

.h5-container {
  margin-top: 6px;
  color: #FFFDFA;
  .digcard-item {
    width: 100.00%;
    padding: 26px 30px 30px 26px;
    display: flex;
    flex-direction: column;
    background-color: #0B304A;
    border-radius: 20px;
    margin-top: 10px;
    position: relative;
    overflow: hidden;
    .title-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-left {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #FFFDFA;
        line-height: 28px;
        .img1 {
          height: 30px;
          margin-right: 10px;
        }
      }
      .title-right {
        width: 36px;
        height: 18px;
        background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
        border-radius: 4px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 12px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #FFFDFA;
        line-height: 14px;
      }
    }
    .content {
      display: flex;
      flex-direction: column;
      margin-top: 20px;
      .content-item {
        width: 100.00%;
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .item-left {
          display: flex;
          align-items: center;
          & > span {
            font-size: 14px;
            font-family: DINPro-Regular, DINPro;
            font-weight: 400;
            color: #FFFDFA;
            line-height: 18px;
          }
        }
        .item-right {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #FFFDFA;
          line-height: 18px;
        }
        .last-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06999F;
          line-height: 18px;
        }
        .havepledge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          .pledge:nth-child(1) {
            margin: 0 10px;
          }
          >div>div>div>div {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
        .receive, .pledge {
          width: 60px;
          height: 32px;
          background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #FFFDFA;
          cursor: pointer;
        }
        .pledge:last-child{
          margin-right: 0!important;
        }
        .receive:hover {
          opacity: 0.8;
        }
        .receive-disabled {
          opacity: 0.5;
        }
        .receive-disabled:hover {
          opacity: 0.5;
        }
        .pledge:hover {
          opacity: 0.8;
        }
      }
      .content-item:last-child {
        margin-top: 16px;
      }
    }
    .line {
      margin-top: 30px;
      width: 100.00%;
      height: 1px;
      border-top: 1px dashed #06263C;
      opacity: 0.08;
    }
    .btn {
      width: 100.00%;
      height: 45px;
      background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #FFFDFA;
      margin-top: 30px;
      cursor: pointer;
    }
    .btn:hover {
      opacity: 0.8;
    }
    .fold {
      display: flex;
      align-items: center;
      margin-top: 19px;
      width: 100.00%;
      justify-content: center;
      cursor: pointer;
      .fold-inner {
        display: flex;
        align-items: center;
        & > span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06999E;
          line-height: 20px;
        }
        & > img {
          width: 16px;
          height: 16px;
          margin-left: 10px;
        }
      }
    }
    .bottom {
      margin-top: 4px;
      display: flex;
      flex-direction: column;
      .bottom-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 16px;
        .item-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #FFFDFA;
          line-height: 18px;
          opacity: 0.6;
        }
        .item-right {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #FFFDFA;
          line-height: 18px;
        }
        .last-left {
          font-size: 14px;
          font-family: DINPro-Regular, DINPro;
          font-weight: 400;
          color: #06999F;
          line-height: 18px;
          cursor: pointer;
          a {
            color: #06999F;
          }
        }
      }
      .bottom-item:last-child {
        display: flex;
        justify-content: flex-start;
      }
    }
  }
}

.toast-box {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  margin-left: 6px;
  img {
    width: 20px;
    height: 20px;
  }
  div {
    position: absolute;
    left: -11px;
    bottom: 26px;
    width: 316px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    padding: 10px;
    font-size: 12px;
    color: rgba(6, 38, 60, 0.5);
    display: none;
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
.h5-noData {
  color: #fff!important;
}
.noData {
  text-align: center;
  min-height: 200px;
  line-height:200px;
  color: #333;
}
.loadings {
  text-align: center;
  min-height: 200px;
  line-height:200px;
}
.h5-loadings {
  color: #fff
}
.isfinshed {
  background: #C7D1D8!important;
  color: #fff!important;
}
.isfinshed_tips {
  width: 60.00%;
  height: 50px;
  line-height: 50px;
  background-color: #C7D1D8;
  color: #fff;
  position: absolute;
  right: -60px;
  top: 20px;
  transform: rotate(45deg);
  text-align: center;
  font-size: 20px;
  font-weight: 600;
}
</style>