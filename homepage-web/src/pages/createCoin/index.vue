<template>
  <div style="height: 100%">
    <div class="container-pc"
         v-if="IsPC()">
      <MiningHeader :balance="balance"
                    :isConnected="isConnected"
                    :account="account"
                    :title="$t('title')"
                    :titleDesc="$t('titleDesc')"
                    :type="type"
                    @connectWallet="connectWallet" />

      <div class="slogn">
        <p>{{$t('boomBoxTitle')}}</p>
        <p>{{$t('boomBoxSlogn1') + $t('boomBoxSlogn2')}}</p>
      </div>
      <div class="content-wrap">
        <div class="content">
          <div class="card1">
            <img :src="cardBgPcImg"
                 alt="">
            <span v-if="!lang"
                  style="margin-top: 10px;">{{$t('cardDes1')}}</span>
            <span v-if="!lang">{{$t('cardDes2')}}</span>
            <span v-if="lang"
                  style="margin-top: 10px;">{{$t('cardDes1') + $t('cardDes2')}}</span>
            <button style="margin-top: 32px"
                    v-if="!lang"
                    @click="handleCreateCoin">{{$t('enter')}}</button>
            <button style="margin-top: 20px"
                    v-if="lang"
                    @click="handleCreateCoin">{{$t('enter')}}</button>
          </div>
          <div class="card">
            <img :src="cardBgPcDefaultImg"
                 alt="">
            <span>{{$t('expect')}}</span>
          </div>
          <div class="card">
            <img :src="cardBgPcDefaultImg"
                 alt="">
            <span>{{$t('expect')}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="container-mobile"
         v-if="!IsPC()">
      <MiningHeader :balance="balance"
                    :isConnected="isConnected"
                    :account="account"
                    :title="$t('title')"
                    :titleDesc="$t('titleDesc')"
                    :type="type"
                    @connectWallet="connectWallet" />

      <div class="slogn"
           v-if="!lang">
        <p class="slogn1">{{$t('boomBoxTitle')}}</p>
        <p class="slogn2">{{$t('boomBoxSlogn1')}}</p>
        <p class="slogn3">{{$t('boomBoxSlogn2')}}</p>
      </div>
      <div class="slogn"
           v-if="lang">
        <p class="slogn1">{{$t('boomBoxTitle')}}</p>
        <p class="slogn2">{{$t('boomBoxSlogn1') + $t('boomBoxSlogn2')}}</p>
      </div>
      <div class="content-wrap">
        <div class="content">
          <div class="card1">
            <img :src="cardBgH5Img"
                 alt="">
            <span v-if="!lang"
                  style="margin-top: 20px;">{{$t('cardDes1')}}</span>
            <span v-if="!lang">{{$t('cardDes2')}}</span>
            <span v-if="lang"
                  style="margin-top: 20px;">{{$t('cardDes1') + $t('cardDes2')}}</span>
            <button v-if="!lang"
                    style="margin-top: 30px"
                    @click="handleCreateCoin">{{$t('enter')}}</button>
            <button v-if="lang"
                    style="margin-top: 20px"
                    @click="handleCreateCoin">{{$t('enter')}}</button>
          </div>
          <div class="card">
            <img :src="cardBgH5DefaultImg"
                 alt="">
            <span>{{$t('expect')}}</span>
          </div>
          <div class="card">
            <img :src="cardBgH5DefaultImg"
                 alt="">
            <span>{{$t('expect')}}</span>
          </div>
        </div>
      </div>

      <MobileFooter class="footer"
                    :balance="balance"
                    :isConnected="isConnected"
                    :account="account"
                    @connectWallet="connectWallet" />

    </div>
  </div>

</template>

<script>
import { getShowAddress } from '../../utils'
import MiningHeader from '../../components/MiningHeader'
import MobileFooter from '../../components/MobileFooter'
import { ethers } from 'ethers'
// import Cookies from 'js-cookie'
export default {
  components: {
    MiningHeader,
    MobileFooter
  },
  data () {
    return {
      network: true,
      account: '',
      isConnected: false,
      balance: '',
      type: 'createCoin',
      cardBgPcImg: require('../../assets/card-bg-pc.png'),
      cardBgPcDefaultImg: require('../../assets/card-bg-pc-default.png'),
      cardBgH5Img: require('../../assets/card-bg-h5.png'),
      cardBgH5DefaultImg: require('../../assets/card-bg-h5-default.png')
    }
  },
  computed: {
    lang () {
      return this.$t('Home') === 'Home'
    }
  },
  mounted () {
    setTimeout(() => {
      this.checkNetwork(); // 检测网络
    }, 100)
    this.accountChanged(); // 监听账户改变
  },
  methods: {
    // 判断是否是PC端
    IsPC () {
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
    handleCreateCoin () {
      window.open(process.env.VUE_APP_CREATE_COIN_URL, '_self')
    },

    /**
     * 切换账户之后的回调
     */
    accountChanged () {
      let that = this
      if (!window.ethereum) return
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          this.initAccount()
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    },
    /**
     * 连接钱包
     */
    async connectWallet () {
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
          .then((accounts) => {
            if (accounts.length === 0) {
              console.log('Please connect to MetaMask.');
            } else {
              this.addHecoChain()
            }
          })
          .catch((err) => {
            if (err.code === 4001) {
              console.log('Please connect to MetaMask.');
            } else {
              console.error(err);
            }
          })
      } else {
        window.open('https://metamask.io/', '_self')
      }
    },
    /**
     * 添加heco公链
     */
    addHecoChain () {
      let param = {
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x80",
          chainName: "Heco Mainnet",
          nativeCurrency: {
            name: "Heco",
            symbol: "HT",
            decimals: 18
          },
          rpcUrls: ["https://http-mainnet-node.huobichain.com"],
          blockExplorerUrls: ["https://hecoinfo.com"]
        }]
      };
      window.ethereum.request(param).then((res) => {
        if (res && res.result === null) {
          window.location.reload()
        }
      }).catch((err) => {
        this.checkNetwork()
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
    /**
     * 检测网络
     */
    checkNetwork () {
      if (!window.ethereum) {
        this.$message.error(this.$t('NoWallet'))
        return
      }
      let provider
      if (!window.ethereum) {
        provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL);
      } else {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      }
      provider.getNetwork().then(Network => {
        this.$store.commit('setChainid', Network.chainId.toString())
        if (Network.chainId != process.env.VUE_APP_HECO_CHAINID) {
          this.$message.error(this.$t('networkError'))
          this.network = false
        } else {
          this.network = true
          this.initCoin(Network.chainId)
          this.initAccount()
        }
      })
    },
    /**
     * 初始化币种
     */
    initCoin (chainId) {
      let coin = 'HT'
      if (chainId == process.env.VUE_APP_CHAINID) {
        coin = 'ETH'
      } else if (chainId == process.env.VUE_APP_HECO_CHAINID) {
        coin = 'HT'
      }
      this.$store.commit('setCoin', coin)
    },
    /**
     * 初始化账户
     */
    initAccount () {
      let that = this
      let param = {
        'method': 'eth_accounts'
      }
      this.sendRequest(param, function (err, res) {
        if (res.result && res.result.length) {
          that.account = res.result[0]
          that.$store.commit('setAccount', res.result[0])
          that.shortAccount = getShowAddress(res.result[0])
          that.isConnected = true
          that.initBalance()
        }
      })
    },
    /**
     * 初始化余额
     */
    initBalance () {
      let that = this
      let param = {
        params: [this.account],
        'method': 'eth_getBalance'
      }
      this.sendRequest(param, function (err, res) {
        if (res.result) {
          that.balance = (parseInt(res.result, 16) / 1e18).toFixed(3)
          that.$store.commit('setBalance', that.balance)
        }
      })
    },
    /**
     * 封装请求
     */
    sendRequest (param, cb) {
      let provider
      if (!window.ethereum) {
        provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL);
      } else {
        provider = new ethers.providers.Web3Provider(window.ethereum);
      }
      provider.provider.sendAsync(param, function (err, res) {
        if (!err && res.error) err = new Error('EthQuery - RPC Error - ' + res.error.message)
        if (err) return cb(err)
        cb(null, res)
      })
    },
  }
}
</script>

<style lang="less" scoped>
.container-pc {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    #000117 0%,
    #27266f 45%,
    #27266f 55%,
    #000117 100%
  );
  padding-bottom: 80px;
  .slogn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 52px;
    & > p:first-child {
      font-size: 40px;
      font-family: DINPro-Bold, DINPro;
      font-weight: bold;
      color: #ffffff;
      line-height: 51px;
    }
    & > p:last-child {
      margin-top: 20px;
      font-size: 24px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #92a0a5;
      line-height: 33px;
    }
  }
  .content-wrap {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    .content {
      margin-top: 80px;
      width: 1200px;
      display: flex;
      justify-content: space-between;
      .card1 {
        width: 380px;
        height: 400px;
        background: #fff;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 40px;
        & > img {
          width: 280px;
          height: 214px;
          margin-top: 30px;
        }
        & > span {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #06263c;
          line-height: 22px;
        }
        & > button {
          width: 320px;
          height: 40px;
          background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
          cursor: pointer;
        }
      }
      .card {
        width: 380px;
        height: 400px;
        background-color: #373946;
        box-shadow: 0px 0px 9px 0px #192126;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        & > img {
          width: 380px;
          height: 275px;
          margin-top: 40px;
        }
        & > span {
          margin-top: 12px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #8f8f8f;
          line-height: 33px;
        }
      }
    }
  }
}
.container-mobile {
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to right,
    #01091f 0%,
    #122363 45%,
    #122363 55%,
    #01091f 100%
  );
  .slogn {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 60px;
    .slogn1 {
      font-size: 24px;
      font-family: DINPro-Bold, DINPro;
      font-weight: bold;
      color: #ffffff;
      line-height: 31px;
    }
    .slogn2 {
      margin-top: 10px;
      padding: 0 30px;
    }
    .slogn2,
    .slogn3 {
      font-size: 12px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #92a0a5;
      line-height: 17px;
    }
  }
  .content-wrap {
    width: 100%;
    display: flex;
    padding: 0 30px;
    flex-direction: column;
    align-items: center;
    padding-bottom: 88px;
    background: linear-gradient(
      to right,
      #01091f 0%,
      #122363 45%,
      #122363 55%,
      #01091f 100%
    );
    .content {
      margin-top: 42px;
      display: flex;
      flex-direction: column;
      align-items: center;
      .card1 {
        width: 345px;
        height: 350px;
        background: #fff;
        box-shadow: 0px 0px 9px 0px #192126;
        border-radius: 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        & > img {
          width: 240px;
          height: 156px;
          margin-top: 30px;
        }
        & > span {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #06263c;
          line-height: 22px;
          padding: 0 30px;
        }
        & > button {
          width: 305px;
          height: 40px;
          background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
        }
      }
      .card {
        width: 345px;
        height: 350px;
        background-color: #373946;
        box-shadow: 0px 0px 8px 0px #192126;
        border-radius: 18px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 20px;
        & > img {
          width: 345px;
          height: 221px;
          margin-top: 30px;
        }
        & > span {
          margin-top: 36px;
          font-size: 24px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #8f8f8f;
          line-height: 33px;
        }
      }
    }
  }
}
</style>