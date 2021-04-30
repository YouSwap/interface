<template>
  <div>
    <div v-if="!loading">
      <template v-if="platform === 2">
        <div class="filter-container">
          <div class="filter-left">
            <div class="radio-wrapper">
              <div class="switch-container">
                <input id="switch" type="checkbox" class="switch" @click="handleCheckedMine"/>
                <label for="switch"></label>
              </div>
              <span>{{$t('liquidity')[2]}}</span>
            </div>
            <div class="radio-wrapper state-wrapper">
              <div class="switch-container">
                <input id="switch-state" type="checkbox" class="switch" @click="handleCheckedState"/>
                <label for="switch-state"></label>
              </div>
              <span>{{$t('tabs')[1]}}</span>
            </div>
          </div>
          <div class="filter-right">
            <div class="sort-box" @click.stop="showSortHandle">
              <div class="main-sort"><span>{{curSortTxt}}</span><i :class="isShowSort ? 'up' : ''"></i></div>
              <div class="sort-list" v-if="isShowSort">
                <div class="list-item"
                v-for="(item, index) in sortTitle"
                :key="index"
                :class="curSortVal == item.value ? 'active' : ''"
                @click="switchSortHandle(item)"
                >
                  {{item.label}}
                </div>
              </div>
            </div>
            <div class="search-box">
              <input type="text" v-model="keyword" :placeholder="$t('section')[4]" @input="searchHandle()">
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="filter-h5-container">
          <div class="search-box">
            <img src="../../assets/image/icon-search.png" alt="">
            <input type="text" v-model="keyword" :placeholder="$t('section')[4]" @input="searchHandle()">
          </div>
          <div class="filter-box">
            <img @click.stop="showFilterHandle" src="../../assets/image/about.png" alt="">
            <div class="filter-dialog" v-if="isShowFilterDialog">
              <div class="title">筛选</div>
              <div class="list-item">
                <div class="list-left">{{$t('liquidity')[2]}}</div>
                <div class="list-right" @click.stop="handleCheckedH5Mine">
                  <template v-if="isMine">
                    <img src="../../assets/image/icon-opened.png" alt="">
                  </template>
                  <template v-else>
                    <img src="../../assets/image/icon-closed.png" alt="">
                  </template>
                </div>
              </div>
              <div class="list-item">
                <div class="list-left">{{$t('tabs')[1]}}</div>
                <div class="list-right" @click.stop="handleCheckedH5State">
                  <template v-if="isFinished">
                    <img src="../../assets/image/icon-opened.png" alt="">
                  </template>
                  <template v-else>
                    <img src="../../assets/image/icon-closed.png" alt="">
                  </template>
                </div>
              </div>
              <div class="list-item">
                <div class="list-left">排序</div>
              </div>
              <div class="sort-box">
                <div class="list-item"
                v-for="(item, index) in sortTitle"
                :key="index"
                :class="curSortVal == item.value ? 'active' : ''"
                @click="switchSortHandle(item)"
                >
                  {{item.label}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <div v-if="poolsList.length > 0">
        <div :class="platform === 2 ? 'container' : 'h5-container'">
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
                <div class="item-right">{{item.apy}}%</div>
              </div>
              <div class="content-item">
                <div class="item-left">TVL</div>
                <div class="item-right">${{item.liquidityTotal}}</div>
              </div>
              <div v-if="!item.isNotStart" class="content-item">
                <div class="item-left">{{$t('digcards')[1]}}</div>
                <div class="item-right">YOU</div>
              </div>
              <div v-if="!item.isNotStart" class="content-item">
                <div class="item-left">
                  {{$t('digcards')[2]}}
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
                  <i style="margin-left:4px" v-if="item.type == 1">LP</i>
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
              <a v-if="item.type == 2" :href="swapTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} </a>
              <a v-else :href="lpTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} LP</a>
              <!-- <div class="fold-inner" @click="handleFoldChange(item)">
                <span>{{item.fold ? $t('digcards')[11] : $t('digcards')[12]}}</span>
                <img :src="arrowDownUrl" alt="" v-show="item.fold">
                <img :src="arrowUpUrl" alt="" v-show="!item.fold">
              </div> -->
            </div>
            <!-- <div class="bottom" v-if="!item.fold && !item.isNotStart">
              <div class="bottom-item">
                <div class="item-left">{{$t('digcards')[8]}}</div>
                <div class="item-right">
                  <span>${{item.liquidityTotal}}</span>
                </div>
              </div>
              <div class="bottom-item">
                <div class="last-left">
                  <a v-if="item.type == 2" :href="swapTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} </a>
                  <a v-else :href="lpTokenUrl">{{$t('digcards')[13]}} {{item.poolname}} LP</a>
                </div>
              </div>
            </div> -->
            <button v-if="item.isNotStart" class="btn">{{$t('hopes')}}</button>
          </div>
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
      questionImgUrl: require('../../assets/image/question-h5.png'),
      poolsList: this.cardLists,
      finishedList: [],  //结束列表
      progressList: [],   // 进行中的列表
      myprogressList: [], //我的进行中的池子
      myfinishedList: [],  // 我的结束的池子
      progressLoading: false, // 接口请求loading，防止重复点击按钮
      YouPrice: '',
      lpTokenUrl: process.env.VUE_APP_LPTOKEN_URL,
      lpaddress: process.env.VUE_APP_YOU_ADDRESS,
      swapTokenUrl: process.env.VUE_APP_SWAP_URL,
      sortTitle: [
        {
          label: 'APY',
          value: 'apy'
        },
        {
          label: this.$t('section')[3],
          value: 'multiple'
        },
        {
          label: this.$t('digcards')[8],
          value: 'liquidityTotal'
        },
        {
          label: 'Hot',
          value: 'priority'
        },
      ],
      curSortTxt: 'Hot',
      curSortVal: 'priority',
      isShowSort: false, // 是否显示下拉排序列表
      keyword: '', // 搜索关键字
      state: true,
      isMine: false, // 是否仅看我的
      isFinished: false, // 是否结束
      isShowFilterDialog: false
    }
  },
  mounted() {
    this.initEvent();
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
    },
    /**
     * 切换仅看自己的矿
     */
    handleCheckedMine (e) {
      this.isMine = e.target.checked
      this.formatCardList()
    },
    /**
     * 切换已结束
     */
    handleCheckedState (e) {
      this.isFinished = e.target.checked
      this.formatCardList()
    },
    showFilterHandle() {
      this.isShowFilterDialog = !this.isShowFilterDialog
    },
    /**
     * 切换仅看自己的矿h5
     */
    handleCheckedH5Mine() {
      this.isMine = !this.isMine
      setTimeout(() => {
        this.isShowFilterDialog = false
        this.formatCardList()
      }, 500)
    },
    /**
     * 切换已结束h5
     */
    handleCheckedH5State () {
      this.isFinished = !this.isFinished
      setTimeout(() => {
        this.isShowFilterDialog = false
        this.formatCardList()
      }, 500)
    },
    /**
     * 筛选数据
     */
    formatCardList () {
      if (this.isFinished) {
        if (this.isMine) {
          this.poolsList = this.myfinishedList
        } else {
          this.poolsList = this.finishedList
        }
      } else {
        if (this.isMine) {
          this.poolsList = this.myprogressList
        } else {
          this.poolsList = this.progressList
        }
      }
      let sortParam = {
        label: this.curSortTxt,
        value: this.curSortVal
      }

      this.sortFunc(sortParam, this.poolsList)
    },
    /**
     * 初始化数据
    */
    initList(val) {
      let that = this
      let copy = JSON.stringify(val)
      let sortData = JSON.parse(copy)
      const finishedList = [];
      const progressList = [];
      const myfinishedList = [];
      const myprogressList= [];

      sortData.forEach((item) => {
        item.apy = '0.00'
        item.liquidityTotal = '0'
        if (item.reserveUSD || that.lpaddress === item.lpaddress) {
          // 计算apy
          if (((item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)) === 0) || (that.youPrice * (item.staketotaldnow / 10**item.decimals) === 0)) {
            item.apy = '0.00'
          } else {
            if (that.lpaddress === item.lpaddress) {
              item.apy = getDecimalsCoin((item.rewardperblock / 10**6 * that.youPrice * 10512000 * 100) / ( that.youPrice * (item.staketotaldnow / 10**item.decimals)), 2)
            } else {
              item.apy = getDecimalsCoin((item.rewardperblock / 10**6 * that.youPrice * 10512000 * 100) / (item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)), 2)
            }
          }
     
          // 计算流动性总额
          if (that.lpaddress === item.lpaddress) {
            item.liquidityTotal = getDecimalsCoin(( that.youPrice * (item.staketotaldnow / 10**item.decimals)), 2)
          } else {
            item.liquidityTotal = getDecimalsCoin((item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**item.decimals)), 2)
          }
        }
        if (item.isfinshed) {
          finishedList.push(item)
        } else {
          progressList.push(item)
        }
        if (item.user.length > 0) {
          if (item.isfinshed) {
            myfinishedList.push(item)
          } else {
            myprogressList.push(item)
          }
        }
      })
      this.finishedList = finishedList
      this.progressList = progressList
      this.myprogressList = myprogressList;
      this.myfinishedList = myfinishedList;
      this.formatCardList()
    },
    initEvent() {
      window.onclick = () => {
        this.isShowSort = false
        setTimeout(() => {
          this.isShowFilterDialog = false
        }, 500)
      }
    },
    /**
     * 切换排序
    */
    switchSortHandle(item) {
      this.curSortTxt = item.label
      this.curSortVal = item.value
      setTimeout(() => {
        this.isShowFilterDialog = false
      }, 500)
      this.formatCardList()
    },
    /**
     * 排序函数
    */
    sortFunc(item, data) {
      if (item.value == 'apy') {
        data.sort((a, b) => {
          return b.apy - a.apy
        })
      } else if (item.value == 'multiple') {
        data.sort((a, b) => {
          return b.rewardmultiple - a.rewardmultiple
        })
      } else if (item.value == 'liquidityTotal') {
        data.sort((a, b) => {
          return b.liquidityTotal - a.liquidityTotal
        })
      } else if (item.value == 'priority') {
        data.sort((a, b) => {
          return a.priority - b.priority
        })
      }
      let copy = JSON.stringify(data)
      this.poolsList = JSON.parse(copy)
      this.searchFunc()
    },
    showSortHandle() {
      this.isShowSort = !this.isShowSort
    },
    /**
     * 搜索
    */
    searchHandle() {
      if (!this.state) {
        return;
      }
      this.state = false;
      setTimeout(() => {
        this.searchFunc(true)
        this.state = true;
      }, 500);
    },
    searchFunc(val) {
      let newData = []
      let text = this.keyword.replace(/\s/ig,'')
      if (text) {
        this.poolsList.forEach((item) => {
          let tempKeyword = this.keyword.toLowerCase()
          let tempPoolname = item.poolname.toLowerCase()
          if (tempPoolname.indexOf(tempKeyword) != -1) {
            newData.push(item)
          }
        })
        this.poolsList = newData
      } else {
        if (val) {
          this.formatCardList()
        }
      }
    }
  },
  watch: {
    cardLists: {
      handler(value) {
        this.keyword = ''
        this.initList(value)
      },
      deep: true,
      immediate:true,
    }
  },
}

</script>
<style lang='less' scoped>
.filter-container {
  display: flex;
  justify-content: space-between;
  .filter-left {
    display: flex;
    .radio-wrapper {
      display: flex;
      align-items: center;
      & > span {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #06263C;
        line-height: 20px;
        opacity: 0.5;
        margin-left: 12px;
      }
      .switch-container {
        height: 15px;
        width: 30px;
        .switch {
          display: none;
        }
        label {
          display: block;
          background-color: #EEEEEE;
          height: 100%;
          width: 100%;
          cursor: pointer;
          border-radius: 25px;
        }
        label:before {
          content: '';
          display: block;
          border-radius: 25px;
          height: 100%;
          width: 15px;
          background-color: white;
          opacity: 1;
          box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08);
          -webkit-transition: all 0.2s ease;
        }
        label:after {
          position: relative;
          top: -15px;
          left: 15px;
          content: '';
          display: block;
          border-radius: 25px;
          height: 100%;
          width: 15px;
          background-color: white;
          opacity: 0;
          box-shadow: 1px 1px 1px 1px rgba(0, 0, 0, 0.08);
          -webkit-transition: all 0.2s ease;
        }
        #switch:checked~label:after {
          opacity: 1;
        }
        #switch:checked~label:before {
          opacity: 0;
        }
        #switch:checked~label {
          background-color: #0C979C;
        }
        #switch-state:checked~label:after {
          opacity: 1;
        }
        #switch-state:checked~label:before {
          opacity: 0;
        }
        #switch-state:checked~label {
          background-color: #0C979C;
        }
      }
    }
    .state-wrapper {
      margin-left: 40px;
    }
  }
  .filter-right {
    display: flex;
    .sort-box {
      position: relative;
      margin-left: 10px;
      width: 120px;
      cursor: pointer;
      text-align: center;
      z-index: 100;
      .main-sort {
        width: 100%;
        height: 40px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        box-sizing: border-box;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px 0px 9px 0px rgb(197 199 203 / 50%);
        span {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #06263C;
          line-height: 40px;
        }
        i {
          width: 10px;
          height: 7px;
          margin-left: 3px;
          background: url('../../assets/image/down-arrow.png') no-repeat;
          background-size: 100%;
          transition: .2s;
        }
        .up {
          transform: rotate(180deg)
        }
      }
      .sort-list {
        position: absolute;
        left: 0;
        top: 43px;
        width: 100%;
        height: 160px;
        background: #fff;
        border-radius: 6px;
        box-shadow: 0px 0px 9px 0px rgb(197 199 203 / 50%);
        .list-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 40px;
          padding: 0 0 0 12px;
          box-sizing: border-box;
          line-height: 40px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #06263C;
          cursor: pointer;
        }
        .active {
          color: #35BDB1;
          img {
            width: 10px;
            height: 6px;
            margin-left: 13px;
          }
        }
      }
    }
    .search-box {
      margin-left: 40px;
      width: 216px;
      height: 40px;
      line-height: 40px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 6px;
      input {
        width: 100%;
        height: 40px;
        padding: 0 12px;
        border-radius: 6px;
        color: #06263C!important;
      }
      input::-webkit-input-placeholder {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #82929D;
      }
    }
  }
}
.filter-h5-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .search-box {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 0 11px;
    height: 30px;
    background: #FFFFFF;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    img {
      width: 14px;
      height: 13px;
    }
    input {
      flex: 1;
      margin-left: 9px;
    }
  }
  .filter-box {
    position: relative;
    margin-left: 65px;
    width: 18px;
    height: 14px;
    img {
      width: 18px;
      height: 14px;
    }
    .filter-dialog {
      position: absolute;
      right: 0;
      top: 20px;
      width: 280px;
      box-sizing: border-box;
      padding: 20px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      z-index: 2;
      .title {
        margin-bottom: 21px;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263C;
      }
      .list-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 21px;
        .list-left {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #82929D;
          line-height: 17px;
        }
        .list-right {
          img {
            width: 30px;
            height: 16px;
          }
        }
      }
      .sort-box {
        display: flex;
        &>div {
          margin-right: 4px;
          height: 30px;
          border-radius: 10px;
          border: 1px solid #35BDB1;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #35BDB1;
          line-height: 30px;
          padding: 0 10px;
        }
        &>div.active {
          background: #35BDB1;
          color: #fff;
        }
      }
    }
  }
}
.container {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  padding-top: 10px;
  .digcard-item:nth-child(3n + 1) {
    margin-left: 0;
  }
  .digcard-item {
    width: 380px;
    padding: 30px 30px 20px 30px;
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
          height: 30px;
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
      a {
        font-size: 14px;
        font-family: DINPro-Regular, DINPro;
        color: #06999F;
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
  padding: 0 0 30px;
  .digcard-item {
    width: 100.00%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    margin-top: 20px;
    position: relative;
    overflow: hidden;
    .title-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .title-left {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263C;
        line-height: 21px;
        .img1 {
          height: 22px;
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
          color: #6A7D8A;
          span {
            font-size: 16px;
            font-family: DINPro-Regular, DINPro;
            font-weight: 500;
            color: #06263C;
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
          height: 30px;
          background: linear-gradient(80deg, #35BEB1 0.00%, #0C979C 100.00%);
          border-radius: 6px;
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
      border-radius: 6px;
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
      a {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06999F;
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
    width: 13px;
    height: 13px;
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
  color: #6A7D8A!important;
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
  color: #6A7D8A
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