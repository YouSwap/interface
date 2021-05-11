<template>
  <div class="list-container">
    <div class="list-title">
      <span>{{$t('trading')}}</span>
      <div class="search-box">
        <template>
          <img src="../../assets/image/icon-search.png"
               alt="">
        </template>
        <input type="text"
               :placeholder="$t('searchPlaceholder')"
               v-model="pairInputValue">
      </div>
    </div>
    <div class="list-wrap">
      <ul class="table-wrap">
        <li class="table-column">
          <div class="column-pair">{{$t('exchangePair')}}</div>
          <div class="title-column-item column-exchange-total">
            <span>{{$t('exchangeTotal')}}</span>
            <img :src="exchangeSortType === 'down' ? sortDownIcon : exchangeSortType === 'up' ? sortUpIcon : sortDefaultIcon"
                 @click="handleExchangeSort()"
                 alt="">
            <div>
              <a class="toast-box">
                <img :src="questionImgUrl"
                     alt="">
                <div>
                  {{$t('exchangeTotalDesc')}}
                  <i></i>
                </div>
              </a>
            </div>
          </div>
          <div class="title-column-item column-my-exchange">
            <span>{{$t('myBaseExchange')}}</span>
            <img :src="myBaseSortType === 'down' ? sortDownIcon : myBaseSortType === 'up' ? sortUpIcon : sortDefaultIcon"
                 @click="handleMyBaseSort()"
                 alt="">
            <div>
              <a class="toast-box">
                <img :src="questionImgUrl"
                     alt="">
                <div>
                  {{$t('myBaseExchangeDesc')}}
                  <i></i>
                </div>
              </a>
            </div>
          </div>
          <div class="title-column-item column-my-exchange">
            <span>{{$t('referralVolume')}}</span>
            <img :src="friendSortType === 'down' ? sortDownIcon : friendSortType === 'up' ? sortUpIcon : sortDefaultIcon"
                 @click="handleFriendExchangeSort()"
                 alt="">
            <div>
              <a class="toast-box">
                <img :src="questionImgUrl"
                     alt="">
                <div>
                  {{$t('referralVolumeDesc')}}
                  <i></i>
                </div>
              </a>
            </div>
          </div>
          <div class="column-operator">
            {{$t('operate')}}
          </div>
        </li>
        <li class="no-data"
            v-if="dealLists.length === 0 && !loading">{{$t('noDataText')}}</li>
        <li class="no-data"
            v-if="dealLists.length === 0 && loading">{{$t('loading')}}</li>
        <li class="table-column table-content"
            v-for="(item, index) in dealLists"
            :key="index"
            v-else>
          <div class="column-pair">
            <img class="img1"
                 :src="getCoinImg(item.token_0)"
                 alt=""
                 :onerror="defaultLogo">
            <img class="img2"
                 :src="getCoinImg(item.token_1)"
                 alt=""
                 :onerror="defaultLogo">
            <span>{{item.pair}}</span>
          </div>
          <div class="itle-column-item column-exchange-total"><span v-if="item.total_amount"><span v-if="account">$</span></span>{{item.total_amount}}</div>
          <div class="title-column-item column-my-exchange"><span v-if="item.base_amount"><span v-if="account">$</span></span>{{item.base_amount}}</div>
          <div class="title-column-item column-my-exchange"><span v-if="item.relation_amount"><span v-if="account">$</span></span>{{item.relation_amount}}</div>
          <div class="column-operator">
            <button class="btn"
                    @click="goTrade(item)">{{$t('trade')}}</button>
          </div>
        </li>
      </ul>
    </div>

  </div>
</template>

<script>
import { post } from '../../assets/script/http'
import { mapState } from 'vuex'
import _ from 'lodash'

export default {
  data () {
    return {
      pairNameInput: '',
      questionImgUrl: require('../../assets/image/question-pc.png'),
      sortDownIcon: require('../../assets/image/sort-down.png'),
      sortUpIcon: require('../../assets/image/sort-up.png'),
      sortDefaultIcon: require('../../assets/image/sort-default.png'),
      youIcon: require('../../assets/image/you-icon.png'),
      ethIcon: require('../../assets/image/eth-icon.png'),
      pairInputValue: '', // 搜索输入值
      exchangeSortType: '', // 总交易额排序类型
      myBaseSortType: '', // 我的基础交易额类型
      friendSortType: '', // 好友贡献交易额
      dealLists: [],
      dealListsCopy: [],
      loading: true,
      defaultLogo: 'this.src="' + require('../../assets/image/logo_default.png') + '"'
    }
  },
  watch: {
    pairInputValue () {
      this.debounce(this.handleSearch(), 500)
    },
    account () {
      this.getShowData()
    }
  },
  mounted () {
    this.getShowData()
  },
  computed: {
    ...mapState({
      account: state => state.account
    })
  },
  methods: {
    /**
     * 获取展示数据
     */
    getShowData () {
      this.loading = true
      let params = {
        address: this.account,
        chain: 'heco'
      }
      post('/v1/airdrop/list', params).then(res => {
        this.loading = false
        if (this.pairInputValue.length === 0) {
          if (Array.isArray(res)) {
            let list = []
            if (this.account) {
              res.forEach(item => {
                list.push({
                  address: item.address,
                  base_amount: typeof item.base_amount === 'string' ? parseFloat(item.base_amount) : item.base_amount,
                  pair: item.pair,
                  relation_amount: typeof item.relation_amount === 'string' ? parseFloat(item.relation_amount) : item.relation_amount,
                  token_0: item.token_0,
                  token_1: item.token_1,
                  total_amount: typeof item.total_amount === 'string' ? parseFloat(item.total_amount) : item.total_amount
                })
              })
            } else {
              res.forEach(item => {
                list.push({
                  address: item.address,
                  base_amount: '--',
                  pair: item.pair,
                  relation_amount: '--',
                  token_0: item.token_0,
                  token_1: item.token_1,
                  total_amount: typeof item.total_amount === 'string' ? parseFloat(item.total_amount) : item.total_amount
                })
              })
            }
            this.dealLists = list
          }
          this.dealListsCopy = _.cloneDeep(this.dealLists)
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 根据币的地址获取图标
     */
    getCoinImg (tokenAddress) {
      return `https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/${tokenAddress}.png`
    },
    /**
     * 搜索币对
     */
    handleSearch () {
      let pairInput = this.pairInputValue.replace(/\s/ig, '')
      if (pairInput) {
        this.dealLists = this.dealListsCopy
        let searchResult = []
        this.dealLists.forEach(item => {
          if (item.pair.toUpperCase().indexOf(pairInput.toUpperCase()) !== -1) {
            searchResult.push(item)
          }
        })
        this.dealLists = searchResult
      } else {
        this.dealLists = this.dealListsCopy
      }
    },
    /**
     * 总交易额排序
     */
    handleExchangeSort () {
      this.myBaseSortType = ''
      this.friendSortType = ''
      if (!this.exchangeSortType) {
        this.exchangeSortType = 'down'
        this.dealLists.sort(this.compare('total_amount', 'down'))
      } else if (this.exchangeSortType === 'down') {
        this.exchangeSortType = 'up'
        this.dealLists.sort(this.compare('total_amount', 'up'))
      } else if (this.exchangeSortType === 'up') {
        this.exchangeSortType = ''
        this.dealLists = this.dealListsCopy
      }
    },
    /**
     * 我的基础交易额排序
     */
    handleMyBaseSort () {
      if (!this.myBaseSortType) {
        this.exchangeSortType = ''
        this.friendSortType = ''
        this.myBaseSortType = 'down'
        this.dealLists.sort(this.compare('base_amount', 'down'))
      } else if (this.myBaseSortType === 'down') {
        this.myBaseSortType = 'up'
        this.dealLists.sort(this.compare('base_amount', 'up'))
      } else if (this.myBaseSortType === 'up') {
        this.myBaseSortType = ''
        this.dealLists = this.dealListsCopy
      }
    },
    /**
     * 好友贡献交易额
     */
    handleFriendExchangeSort () {
      if (!this.friendSortType) {
        this.exchangeSortType = ''
        this.myBaseSortType = ''
        this.friendSortType = 'down'
        this.dealLists.sort(this.compare('relation_amount', 'down'))
      } else if (this.friendSortType === 'down') {
        this.friendSortType = 'up'
        this.dealLists.sort(this.compare('relation_amount', 'up'))
      } else if (this.friendSortType === 'up') {
        this.friendSortType = ''
        this.dealLists = this.dealListsCopy
      }
    },
    /**
     * 比较器 -- 降序排列
     */
    compare (propertyName, type) {
      return function (obj1, obj2) {
        var value1 = obj1[propertyName]
        var value2 = obj2[propertyName]
        if (value2 < value1) {
          return type === 'down' ? -1 : 1
        } else if (value2 > value1) {
          return type === 'down' ? 1 : -1
        } else {
          return 0
        }
      }
    },
    /**
     * 防抖
     */
    debounce (fn, delay) {
      let timer = null
      return function () {
        if (timer) {
          clearTimeout(timer)
          timer = setTimeout(fn, delay)
        } else {
          timer = setTimeout(fn, delay)
        }
      }
    },
    /**
     * 去交易
     */
    goTrade (list) {
      window.open(`${process.env.VUE_APP_SWAP_URL}?inputCurrency=${list.token_0}&outputCurrency=${list.token_1}`, '_self')
    },
  },
}
</script>

<style lang="less" scoped>
.list-container {
  width: 1200px;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid #f0f2f6;
  margin-top: 30px;
  padding: 30px;
  .list-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-box {
      display: flex;
      align-items: center;
      padding: 0 11px;
      width: 260px;
      height: 40px;
      line-height: 30px;
      background: #f8fcff;
      border: 1px solid #f0f2f6;
      border-radius: 6px;
      img {
        width: 13px;
        height: 13px;
      }
      input {
        width: 100%;
        height: 38px;
        background: #f8fcff;
        padding: 0 12px 0 6px;
        border-radius: 6px;
        color: #06263c !important;
      }
      input::-webkit-input-placeholder {
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #c5cfd5;
      }
    }
    .search-box:hover {
      border: 1px solid #35bdb1;
      z-index: 99;
    }
  }
  .list-wrap {
    margin-top: 30px;
    .table-wrap {
      width: 100%;
      .table-column {
        display: flex;
        height: 70px;
        align-items: center;
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6a7d8a;
        line-height: 22px;
        padding: 0 30px;
        .column-pair {
          width: 243px;
          text-align: left;
          overflow: hidden;
          display: flex;
          position: relative;
          line-height: 30px;
          .img1 {
            width: 30px;
            height: 30px;
            z-index: 20;
            border: 1px solid #e4e8ea;
            border-radius: 50%;
            background-color: #fff;
          }
          .img2 {
            width: 30px;
            height: 30px;
            z-index: 10;
            position: absolute;
            left: 15px;
            top: 0px;
            border: 1px solid #e4e8ea;
            background-color: #fff;
            border-radius: 50%;
          }
          span {
            margin-left: 30px;
          }
        }
        .title-column-item {
          text-align: left;
          display: flex;
          align-items: center;
          & > img {
            width: 11px;
            height: 18px;
            margin-left: 4px;
            cursor: pointer;
          }
        }
        .column-exchange-total {
          width: 246px;
        }
        .column-my-exchange {
          width: 295px;
        }
        .column-my-exchange {
          width: 258px;
        }
        .column-operator {
          flex: 1;
          text-align: right;
          .btn {
            width: 68px;
            height: 30px;
            border-radius: 6px;
            border: 1px solid #35bdb1;
            background: #fff;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #35bdb1;
            line-height: 20px;
            cursor: pointer;
          }
        }
      }
      .no-data {
        width: 100%;
        height: 100px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #06263c;
      }
      .table-content {
        font-size: 16px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263c;
        line-height: 21px;
        height: 70px;
        background: #fff;
        border-radius: 20px;
      }
      .table-content:hover {
        background: #f8fcff;
        .btn {
          color: #fff;
          background: linear-gradient(72deg, #34bdb0 0%, #0c979c 100%);
        }
      }
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
    width: 212px;
    background: #ffffff;
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
</style>