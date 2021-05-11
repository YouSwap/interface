<template>
  <div class="list-wrap">
    <div class="title-wrap">
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
    <div class="no-data"
         v-if="dealCardLists.length === 0 && !loading">
      {{$t('noDataText')}}
    </div>
    <li class="no-data"
        v-if="dealCardLists.length === 0 && loading">{{$t('loading')}}</li>
    <div class="deal-card-wrap"
         v-for="(item, index) in dealCardLists"
         :key="index"
         v-else>
      <div class="list-first">
        <div class="first-left">
          <div class="img-wrap">
            <img class="pair-img1"
                 :src="getCoinImg(item.token_0)"
                 alt=""
                 :onerror="defaultLogo">
            <img class="pair-img2"
                 :src="getCoinImg(item.token_1)"
                 alt=""
                 :onerror="defaultLogo">
          </div>

          <span class="pair">{{item.pair}}</span>
        </div>
        <button class="deal-btn"
                @click="goTrade(item)">{{$t('trade')}}</button>
      </div>
      <div class="list-item"
           style="margin-top: 20px;">
        <div class="item-left">
          <span>{{$t('exchangeTotal')}}</span>
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
        <div class="item-right">
          <span v-if="item.total_amount">$</span>{{item.total_amount || '--'}}
        </div>
      </div>
      <div class="list-item">
        <div class="item-left">
          <span>{{$t('myBaseExchange')}}</span>
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
        <div class="item-right">
          <span v-if="item.base_amount">$</span>{{item.base_amount}}
        </div>
      </div>
      <div class="list-item">
        <div class="item-left">
          <span>{{$t('referralVolume')}}</span>
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
        <div class="item-right">
          <span v-if="item.relation_amount">$</span>{{item.relation_amount}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { post } from '../../assets/script/http'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      questionImgUrl: require('../../assets/image/question-h5.png'),
      defaultLogo: 'this.src="' + require('../../assets/image/logo_default.png') + '"; this.onerror=null',
      pairInputValue: '', // 搜索输入值
      dealCardLists: [],
      dealCardListsCopy: [],
      loading: true
    }
  },
  mounted () {
    setInterval(() => {
      this.getShowData()
    }, 5000)
  },
  watch: {
    pairInputValue () {
      this.debounce(this.handleSearch(), 500)
    },
    account (val) {
      if (val.length > 0) {
        this.getShowData()
      }
    }
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
          this.dealCardLists = res
          this.dealCardListsCopy = res
        }
      }).catch(() => {
        this.loading = false
      })
    },
    /**
     * 搜索币对
     */
    handleSearch () {
      let pairInput = this.pairInputValue.replace(/\s/ig, '')
      if (pairInput) {
        this.dealCardLists = this.dealCardListsCopy
        let searchResult = []
        this.dealCardLists.forEach(item => {
          if (item.pair.toUpperCase().indexOf(pairInput.toUpperCase()) !== -1) {
            searchResult.push(item)
          }
        })
        this.dealCardLists = searchResult
      } else {
        this.getShowData()
      }
    },
    /**
     * 根据币的地址获取图标
     */
    getCoinImg (tokenAddress) {
      return `https://youswap.oss-cn-shanghai.aliyuncs.com/YouSwap/${tokenAddress}.png`
    },
    /**
     * 去交易
     */
    goTrade (list) {
      window.open(`${process.env.VUE_APP_SWAP_URL}?inputCurrency=${list.token_0}&outputCurrency=${list.token_1}`)
    },
    /*
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
  }
}
</script>

<style lang="less" scoped>
.list-wrap {
  width: 100%;
  margin-top: 20px;
  background: #ffffff;
  border-radius: 10px;
  border: 1px solid #f0f2f6;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .search-box {
      display: flex;
      align-items: center;
      padding: 0 11px;
      width: 200px;
      height: 30px;
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
        height: 30px;
        background: #f8fcff;
        padding: 0 12px 0 6px;
        border-radius: 6px;
        font-size: 12px;
        border-top: 1px solid #f0f2f6;
        border-bottom: 1px solid #f0f2f6;
        color: #06263c !important;
      }
      input::-webkit-input-placeholder {
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #c5cfd5;
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
  .deal-card-wrap {
    margin-top: 10px;
    width: 100%;
    padding: 20px 10px;
    border-radius: 10px;
    border: 1px solid #f0f2f6;
    display: flex;
    flex-direction: column;
    .list-first {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .first-left {
        display: flex;
        align-items: center;
        .img-wrap {
          width: 33px;
          height: 22px;
          position: relative;
          margin-right: 4px;
          .pair-img1 {
            width: 22px;
            height: 22px;
            position: absolute;
            left: 0;
            top: 0;
            z-index: 10;
            border: 1px solid #e4e8ea;
            background-color: #fff;
            border-radius: 50%;
          }
          .pair-img2 {
            width: 22px;
            height: 22px;
            position: absolute;
            left: 11px;
            top: 0;
            z-index: 9;
            border: 1px solid #e4e8ea;
            background-color: #fff;
            border-radius: 50%;
          }
        }

        .pair {
          max-width: 150px;
          font-size: 14px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263c;
          line-height: 18px;
          overflow: hidden;
        }
      }
      .deal-btn {
        width: 44px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        background: linear-gradient(71deg, #35beb1 0%, #0c979c 100%);
        border-radius: 6px;
        font-size: 12px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        line-height: 17px;
      }
    }
    .list-item {
      display: flex;
      justify-content: space-between;
      margin-top: 10px;
      .item-left {
        display: flex;
        align-items: center;
        & > span {
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6a7d8a;
          line-height: 17px;
        }
      }
      .item-right {
        font-size: 14px;
        font-family: DINPro-Medium, DINPro;
        font-weight: 500;
        color: #06263c;
        line-height: 18px;
      }
    }
    .list-second {
      margin-top: 28px;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #06263c;
      line-height: 18px;
      .second-left {
        width: 84px;
        text-align: left;
      }
      .second-middle {
        width: 115px;
        text-align: left;
      }
      .second-right {
        flex: 1;
        text-align: left;
      }
    }
    .list-third {
      margin-top: 12px;
      display: flex;
      align-items: center;
      text-align: left;
      .third {
        span {
          font-size: 10px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6a7d8a;
          line-height: 14px;
        }
      }
      .third-left {
        display: flex;
        align-items: center;
        width: 84px;
        white-space: nowrap;
      }
      .third-middle {
        display: flex;
        align-items: center;
        width: 115px;
        white-space: nowrap;
      }
      .third-right {
        display: flex;
        align-items: center;
        flex: 1;
        white-space: nowrap;
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