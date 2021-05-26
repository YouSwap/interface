<template>
  <div class="main-container">
    <template v-if="isPc()">
      <CardPc @connectWallet="connetWallet"
              @addBSCChain="addBSCChain"
              @addHecoChain="addHecoChain" />
    </template>
    <div class="mobile-container"
         v-if="!isPc()">
      <CardMobile @connectWallet="connetWallet"
                  @addBSCChain="addBSCChain"
                  @addHecoChain="addHecoChain" />
    </div>

  </div>
</template>

<script>


import CardPc from '../../components/card/CardPc'
import CardMobile from '../../components/card/CardMobile'
import { getShowAddress, IsPC } from '../../utils/index'



export default {
  components: { CardPc, CardMobile },
  data () {
    return {
      network: true,
      account: '',
      isConnected: false,
      balance: '--',
      disWalletAddress: ''
    }
  },
  mounted () {
    this.accountChanged() // 监听账户改变
    setTimeout(() => {
      this.checkNetwork() // 检测网路
    }, 500)
  },
  methods: {
    /**
     * 判断是否是PC端
     */
    isPc () {
      return IsPC()
    },
    /**
     * 连接钱包
    */
    connetWallet () {
      if (typeof window.ethereum !== 'undefined') {
        window.ethereum.request({ method: 'eth_requestAccounts' }).then(res => {
          this.walletAddress = res[0]
          this.$store.commit('setAccount', this.walletAddress)
          localStorage.setItem('account', this.walletAddress)
          this.disWalletAddress = getShowAddress(res[0])
          this.walletShow = true
        })
      } else {
        this.$store.commit('setAccount', '')
        localStorage.setItem('account', '')
        window.open('https://metamask.io/', '_self')
      }
    },


    /**
     * 切换账户之后的回调
     */
    accountChanged () {
      let that = this
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          that.account = accounts[0]
          that.$store.commit('setAccount', accounts[0])
          localStorage.setItem('account', accounts[0])
          that.shortAccount = getShowAddress(accounts[0])
          window.location.reload()
        }
      });
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
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
        setTimeout(() => {
          this.checkNetwork() // 检测网路
        }, 500)
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
    /**
     * 添加BSC公链
     */
    addBSCChain () {
      let param = {
        method: "wallet_addEthereumChain",
        params: [{
          chainId: "0x38",
          chainName: "BSC Mainnet",
          nativeCurrency: {
            name: "BNB",
            symbol: "bnb",
            decimals: 18
          },
          rpcUrls: ["https://bsc-dataseed1.ninicoin.io"],
          blockExplorerUrls: ["https://bscscan.com/"]
        }]
      };
      window.ethereum.request(param).then((res) => {
        if (res && res.result === null) {
          window.location.reload()
        }
      }).catch((err) => {
        setTimeout(() => {
          this.checkNetwork() // 检测网路
        }, 500)
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
    },
  }
};
</script>
<style lang='less' scoped>
.main-container {
  width: 100%;
  height: 100%;
  .mobile-container {
    display: flex;
    flex-direction: column;
  }
}
</style>