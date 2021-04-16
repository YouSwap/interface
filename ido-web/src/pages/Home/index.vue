<template>
  <div class="detail-container">
    <div class="top-bg-wrapper">
      <div class="card-wrapper">
        <div class="card-left">
          <p class="card-YouSwap">YouSwap</p>
          <p class="card-title">{{ $t('solgan') }}</p>
          <button class="card-btn" @click="handleWhiteBook">{{ $t('WhitePaper') }}</button>
        </div>
        <div class="card-right">
          <YouSwapCard></YouSwapCard>
        </div>
      </div>
    </div>
    <div class="content-container">
      <div class="content-wrapper">
        <p class="title">{{ $t('ProductsHighlights') }}</p>
        <div class="product-wrapper">
          <div class="product-item" v-for="item in productLists" :key="item.id">
            <img class="product-img" :src="item.imgUrl" alt="">
            <p class="product-title">{{item.title}}</p>
            <p class="pruduct-desc">{{item.desc}}</p>
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <p class="title" style="margin-top: 110px;">{{ $t('Roadmap') }}</p>
        <div class="style-wrapper" style="margin-top: 45px;">
          <load-line v-if="IsPC()"></load-line>
          <LoadLinePhone v-else/>
        </div>
      </div>
      <div class="content-wrapper">  
        <p class="title" style="margin-top: 120px;">{{ $t('TokenEcology') }}</p>
        <div class="style-wrapper" style="margin-top: 50px;">
          <coin-status></coin-status>
        </div>
      </div>
      <div class="content-wrapper">
        <p class="title">{{ $t('Partners') }}</p>
        <div class="style-wrapper">
          <CompanyWith />
        </div>
      </div>
      <div class="content-wrapper">
        <p class="title">{{ $t('media') }}</p>
        <div class="style-wrapper">
          <Medies />
        </div>
      </div>
      <div class="content-wrapper">
        <p class="title">{{ $t('Audit_agency') }}</p>
        <div class="style-wrapper">
          <Audit_agency />
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import YouSwapCard from '../../components/YouSwapCard'
import LoadLine from '../../components/LoadLine'
import LoadLinePhone from '../../components/LoadLinePhone'
import CoinStatus from '../../components/CoinStatus'
import CompanyWith from '../../components/CompanyWith'
import Medies from '../../components/medies'
import Audit_agency from '../../components/Audit_agency'
import Cookies from 'js-cookie'
import Footer from '../../components/Footer'

export default {
  components: {
    YouSwapCard,
    LoadLine,
    CoinStatus,
    CompanyWith,
    Medies,
    Audit_agency,
    LoadLinePhone,
    Footer
  },
  data () {
    return {
      num: '0',
      coinUrl: require('../../assets/default_coin.png'),
      tabs: [
        {
          id: 0,
          tabName: '兑换池详情'
        },
        {
          id: 1,
          tabName: '我的参与'
        }
      ],
    }
  },
  computed: {
    productLists() {
      return[
        {
          id: 0,
          imgUrl: require('../../assets/swap.png'),
          title: this.$t('RapidExchange'),
          desc: this.$t('mechanism'),
        },
        {
          id: 1,
          imgUrl: require('../../assets/muti_link.png'),
          title: this.$t('MultipleChainsDeployment'),
          desc: this.$t('ecologies'),
        },
        {
          id: 2,
          imgUrl: require('../../assets/extend.png'),
          title: this.$t('Scalability'),
          desc: this.$t('performance'),
        },
        {
          id: 3,
          imgUrl: require('../../assets/kuolian.png'),
          title: this.$t('AggregationTrade'),
          desc: this.$t('EachDEX'),
        },
      ]
    },
    lan() {
      return this.$store.state.lan || Cookies.get('lan')
    },
  },
  methods: {
    // 白皮书
    handleWhiteBook () {
      if (Cookies.get('lan') === 'zh') {
        window.open('/white-papper-cn.pdf', '_blank')
      } else {
        window.open('/white-papper-en.pdf', '_blank')
      }
    },
    // 判断是否是PC端
    IsPC() {
      let userAgentInfo = navigator.userAgent;
      let Agents = ["Android", "iPhone",
                  "SymbianOS", "Windows Phone",
                  "iPad", "iPod"];
      let flag = true;
      for (var v = 0; v < Agents.length; v++) {
          if (userAgentInfo.indexOf(Agents[v]) > 0) {
              flag = false;
              break;
          }
      }
      return flag;
    },
  },
}

</script>
<style scoped>
  .detail-container {
    width: 100%;
  }
  .top-bg-wrapper {
    width: 100%;
    /* background-color: rgba(9, 54, 75, 1); */
    /* background: url('../../assets/top-bg.png') no-repeat center; */
    /* position: absolute; */
    left: 0;
    top: 0;
    display: flex;
    justify-content: space-between;
  }
  .card-left {
    margin-top: 118px;
    display: flex;
    flex-direction: column;
  }
  .card-YouSwap,.card-title {
    font-size: 40px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #FFFFFF;
  }
  .card-title {
    font-size: 24px;
    line-height: 55px;
    margin-top: 16px;
  }
  .card-desc {
    margin-top: 23px;
    font-size: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 28px;
    opacity: 0.6;
  }
  .card-btn {
    margin-top: 35px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 300px;
    height: 45px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border-radius: 10px;
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .card-btn:hover {
    opacity: 0.8;
  }
  .card-right {
    margin-top: 82px;
  }
  .card-wrapper {
    width: 1200px;
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    flex-wrap: wrap; 
  }
  .content-container {
    width: 100%;
    /* height: 100%; */
    /* background: #06263C; */
  }
  .content-wrapper {
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 100px auto 50px auto;
  }
  .title {
    font-size: 36px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFDFA;
    line-height: 50px;
  }
  .product-wrapper {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .product-item {
    margin-top: 40px;
    width: 285px;
    background: #0B304A;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    padding: 56px 0 67px 0;
    align-items: center;
  }
  .product-img {
    width: 44px;
    height: 44px;
  }
  .product-title {
    margin-top: 20px;
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    text-align: center;
  }
  .pruduct-desc {
    width: 225px;
    margin-top: 20px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    line-height: 20px;
  }
  .style-wrapper {
    justify-content: center;
    margin-top: 45px;
  }
  /deep/.el-progress__text {
    font-size: 50px!important;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
  }
</style>
<style scoped>
@media screen and (max-width: 1000px) {
  .title {
    font-size: 4.8vw;
    line-height: 5vw;
    margin-bottom: 5vw;
  }
  .product-wrapper {
    width: 86%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
  }
  .content-wrapper {
    width: 100%;
    margin: 30px auto 20px auto;
  }
  .content-wrapper .title{
    margin-top: 30px!important;
  }
  .product-item {
    margin-top: 10px;
    width: 41vw;
    background: #0B304A;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    padding: 20px 0 20px 0;
    align-items: center;
  }
  .product-img {
    width: 44px;
    height: 44px;
  }
  .product-title {
    margin-top: 4vw;
    font-size: 4.2vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    text-align: center;
  }
  .product-img {
    width: 7vw;
    height: 7vw;
  }
  .pruduct-desc {
    width: 80%;
    margin-top: 4vw;
    font-size: 3.2vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    line-height: 5vw;
  }
  .style-wrapper {
    width: 96vw;
    justify-content: center;
    margin: 0 auto;
    margin-top: 10px;
    position: relative;
  }
  .style-wrapper-load {
    min-height: 40vh;
  }
  .card-left {
    width: 80vw;
    margin-top: 2vw;
  }
  .card-right {
    margin-top: 40px;
    width: 88vw;
  }
  .card-YouSwap {
    margin-top:7vw;
    font-size: 23px;
  }
  .card-title {
    font-size: 20px;
    font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 20px;
    margin-top: 20px;
  }
  .card-desc {
    margin-top: 2.6vw;
    font-size: 3.2vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 28px;
    opacity: 0.6;
  }
  .card-btn {
    margin-top: 5.5vw;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 77vw;
    height: 7.8vw;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border-radius: 16px;
    font-size: 3.7vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .card-wrapper {
    width: 100%;
    display: flex;
    justify-content: center!important;
    color: #fff;
    padding: 0 1vw;
    box-sizing: border-box;
  }
}
</style>