<!-- 头部导航栏 -->
<template>
  <div class="container">
    <div class="head-container">
      <div class="head-left">
        <img :src="IsPC() ? logoUrl : logoUrlPhone" alt="">
        <ul>
          <li style="margin-left: 20px;" @click="handleLinkHome" :class="active === 1? 'active': ''">{{ $t('Home') }}</li>
          <li @click="handleLinkMining" :class="active === 2? 'active': ''">{{$t('mining')}}</li>
          <li @click="handleLinkDetail" :class="active === 3? 'active': ''">{{$t('IDO')}}</li>
        </ul>
      </div>
      <div class="head-right">
        <div class="wallet-unconnect" v-if="!walletShow" @click="handleConnectWallet">{{ $t('ConnectWallet_add') }}</div>
        <div class="wallet-info-wrapper" v-if="walletShow">
          <div class="wallet-right">{{ disWalletAddress }}</div>
        </div>
        <el-select class="language"  @change="handleLanguageChange(language)" v-model="language">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            :disabled="item.disabled">
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { getShowAddress, getDecimalsCoin } from '../../utils'
import { abi } from '../../utils/abi'
import { abi_usdt } from '../../utils/abi_usdt'
import { abi_you_token } from '../../utils/abi_you_token'
import Cookie from 'js-cookie'

const contractAddress = process.env.VUE_APP_IDO_ADDRESS;
// const provider = ethers.getDefaultProvider('ropsten');
const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
const contract = new ethers.Contract(contractAddress, abi, provider);

export default {
  data () {
    return {
      walletShow: false,
      disWalletAddress: '',
      walletAddress: '',
      symbol: '',
      options: [
        {
          value: 'English',
          lan: 'en',
        },
        {
          value: '简体中文',
          lan: 'zh',
        }
      ],
      language: 'English',
      Balance: '',
      currentBlockNumber: '', // 当前块高
      startHeightOfPriIEO: '', // 私募开始时间
      endHeightOfPriIEO: '', // 私募结束时间
      accountsAddress: '',
      logoUrl: require('../../assets/logo@2x.png'),
      logoUrlPhone: require('../../assets/logoPhone.png'),
      network: true,
      active: 1
    }
  },
  mounted () {
    if (Cookie.get('lan')) {
      this.options.forEach(item => {
        if (item.language === Cookie.get('lan')) {
          this.languages_value = item.value
        }
      })
    } else {
      this.languages_value = 'English'
      Cookie.set('lan', 'en')
    }
    // 获取当前路由
    if (this.$route.path.includes('detail')) {
      this.active = 3
    } else {
      this.active = 1
    }
    // 获取当前块高
    this.getBlockHigh();
    setInterval(() => {
      this.getBlockHigh();
    }, 2000);

    // 获取当前语言
    const defaultLan = Cookie.get('lan') || 'en'
    this.options.forEach(item => {
      if (defaultLan === item.lan) {
        this.language = item.value
      }
    })
    // 判断是否已经连接钱包
    if (typeof window.ethereum !== 'undefined'){
      const param = {
        'method': 'eth_accounts'
      }
      const that = this
      const provider  = new ethers.providers.Web3Provider(window.ethereum);
      provider.provider.sendAsync(param, function(err, res){
        if (res.result.length > 0) {
          that.walletShow = true
          that.walletAddress = res.result[0]
          that.$store.commit('walletAddress', res.result[0])
          that.disWalletAddress = getShowAddress(res.result[0])
        } else {
          that.walletShow = false
        }
      })
      // 监听切换钱包账户
      window.ethereum.on('accountsChanged', () => {
        window.location.reload()
      });
      // 监听切换网络
      window.ethereum.on('networkChanged', (network) => {
        if (network.toString() !== process.env.VUE_APP_NETWORK) {
          this.$messages.error(this.$t('Wrongnetwork'));
          this.walletShow = false;
          this.network = false
          this.$store.commit('network', false)
        } else {
          this.network = true
          this.$store.commit('network', true)
        }
      });
       
    } else {
       console.log('没有安装mateMask')
    }
    
    // 获取当前网络
    provider.getNetwork().then(Network => {
      if (Network.chainId.toString() !== process.env.VUE_APP_NETWORK) {
        this.$messages.error(this.$t('Wrongnetwork'));
        this.walletShow = false;
        this.network = false
        this.$store.commit('network', false)
      } else {
        this.network = true
        this.$store.commit('network', true)
      }
    })
    // 连接合约
    this.connectContract();
    setInterval(() => {
      this.connectContract();
    }, 3000)
    
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
    // 跳转首页
    handleLinkHome () {
      this.active = 1
      this.$router.push('/home')
    },
    // 跳转详情页面
    handleLinkDetail() {
      this.active = 3
      this.$router.push('/detail')
    },
    // 跳转邀请关系
    handleLinkMining() {
      this.active = 2
      window.open(process.env.VUE_APP_MINING_LINK, "_self")
    },
    getBlockHigh() {
      const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      // const provider = ethers.getDefaultProvider('ropsten');
      provider.getBlockNumber().then(BlockNumber => {
        this.currentBlockNumber = BlockNumber
        this.getStatus(BlockNumber)
      })
    },
    handleConnectWallet() {
      if (typeof window.ethereum !== 'undefined'){
        // 连接钱包
        if (this.network) {
          window.ethereum.request({ method: 'eth_requestAccounts'}).then(res => {
            // console.log(res)
            this.walletAddress = res[0]
            this.disWalletAddress = getShowAddress(res[0])
            this.walletShow = true
          })
        } else {
          this.$messages.error(this.$t('Wrongnetwork'));
        }
      } else {
        window.open('https://metamask.io/', '_blank')
      }
    },
    connectContract() {
      // 开始时间
      contract.startHeightOfPubIDO().then(startHeightOfPriIEO => {
        this.startHeightOfPriIEO = startHeightOfPriIEO.toNumber()
        this.$store.commit('startHeightOfPriIEO', startHeightOfPriIEO.toNumber())
        if (this.currentBlockNumber > 0) {
          if (this.startHeightOfPriIEO >= this.currentBlockNumber) {
            const toStartTimes = (this.startHeightOfPriIEO - this.currentBlockNumber)*10;
            const nowTime = parseInt(new Date().getTime()/1000)
            const startTime = toStartTimes + nowTime;
            this.$store.commit('startTime', startTime)
            this.$store.commit('RemainingBlockchain', this.startHeightOfPriIEO - this.currentBlockNumber)
          } else {
            provider.getBlock(startHeightOfPriIEO.toNumber()).then(startTime => {
              this.$store.commit('startTime', startTime.timestamp)
            })
          }
        }
      });
      
      // 结束时间
      contract.endHeightOfPubIDO().then(endHeightOfPriIEO => {
        this.endHeightOfPriIEO = endHeightOfPriIEO.toNumber()
        this.$store.commit('endHeightOfPriIEO', endHeightOfPriIEO.toNumber())
        if (this.currentBlockNumber > 0) {
          if (this.endHeightOfPriIEO > this.currentBlockNumber) {
            const toEndTimes = (this.endHeightOfPriIEO - this.currentBlockNumber)*10;
            const nowTime = parseInt(new Date().getTime()/1000)
            const endTime = toEndTimes + nowTime;
            this.$store.commit('endTime', endTime)
            this.$store.commit('RemainingBlockchainEnd', this.endHeightOfPriIEO - this.currentBlockNumber)
          } else {
            provider.getBlock(endHeightOfPriIEO.toNumber()).then(endTime => {
              this.$store.commit('endTime', endTime.timestamp)
            })
          }
        }
      });
      
      //获取总募集资金(USDT)
      contract.targetUsdtAmountOfPubIDO().then(targetUsdtAmountOfPubIDO => {
        const total = targetUsdtAmountOfPubIDO.toNumber()/10**6
        this.$store.commit('targetUsdtAmountOfPubIDO', total)
      })

      //最低参与资金
      contract.bottomLimitUsdtOfPubIDO().then(bottomLimitUsdtOfPubIDO => {
        const total = bottomLimitUsdtOfPubIDO.toNumber()/10**6
        this.$store.commit('bottomLimitUsdtOfPubIDO', total)
      })

      // 获取已经募集到的资金
      contract.totalUsdtAmountOfPubIDO().then(totalUsdtAmountOfPubIDO => {
        const total = totalUsdtAmountOfPubIDO.toNumber()/(10**6);
        this.$store.commit('totalUsdtAmountOfPubIDO', total)
      });


      // 最高参与资金
      // contract.upperLimitUsdtOfPriIDO().then(upperLimitYouOfPriIEO => {
      //   const total = upperLimitYouOfPriIEO.div(1000000).toNumber()
      //   this.$store.commit('upperLimitYouOfPriIEO', total)
      // });
      // this.$store.commit('upperLimitYouOfPriIEO', 500)
      // this.$store.commit('upperLimitYouOfPriIEO', 500)
      // YouSwap Token地址
      this.$store.commit('_youAddress', process.env.VUE_APP_You_ADDRESS)
      // You的价格(xxx/USDT)
      // contract.youPriceOfPriIDO().then(youPriceOfPriIEO => {
      //   this.youPriceOfPriIEO = youPriceOfPriIEO / 10
      //   this.$store.commit('youPriceOfPriIEO', this.youPriceOfPriIEO)
      // })
      this.$store.commit('youPriceOfPriIEO', 0.1)
      // You的总兑换数量
      contract.supplyYouForPriIDO().then(supplyYouForPriIEO => {
        this.supplyYouForPriIEO = supplyYouForPriIEO.toNumber()/(10**6)
        this.$store.commit('supplyYouForPriIEO', supplyYouForPriIEO.toNumber()/(10**6))
      })
      // 持币人数
      const contractYou = new ethers.Contract(process.env.VUE_APP_You_ADDRESS, abi_you_token, provider);
      contractYou.holders().then(holders => {
        this.$store.commit('holders', holders.toNumber())
      })
      // YOU总供应量
      contractYou.totalSupply().then(totalSupply => {
        this.$store.commit('totalSupply', totalSupply.toNumber()/10**6)
      })
      // 交易笔数
      contractYou.transfers().then(transfers => {
        this.$store.commit('transfers', transfers.toNumber())
      })
      const timer = setInterval(() => {
        if (this.walletAddress) {
            // 当前账户USDT的余额
            const contractUSDT = new ethers.Contract(process.env.VUE_APP_USDT_ADDRESS, abi_usdt, provider);
            contractUSDT.balanceOf(this.walletAddress).then(balanceOf => {
              this.$store.commit('usdtBalanceOf', parseFloat(getDecimalsCoin(balanceOf.toNumber()/10**6, 2)))
            })
          } else {
            clearInterval(timer)
          }
      }, 2000)
      
    },
    // 切换语言
    handleLanguageChange (value) {
      this.options.forEach(item => {
        if (item.value === value) {
          this.$i18n.locale = item.lan
          Cookie.set('lan', item.lan)
          this.$store.commit('lan', item.lan)
          location.reload();
        }
      })
    },
    handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        console.log('Please connect to MetaMask.');
      }
    },
    getStatus(val) {
      if (this.startHeightOfPriIEO === '' || this.endHeightOfPriIEO === '') {
        this.$store.commit('status', 3);
      } else if (val < this.startHeightOfPriIEO) {
        this.$store.commit('status', 0);
      } else if (val > this.startHeightOfPriIEO && val < this.endHeightOfPriIEO) {
        this.$store.commit('status', 1);
      } else if (val > this.endHeightOfPriIEO) {
        this.$store.commit('status', 2);
      }
    },
    changeLanguage() {
      this.languages.forEach(item => {
        if (this.languages_value === item.value) {
          this.$i18n.locale = item.language
          Cookie.set('lan', item.language)
        }
      })
    }
  },
  watch: {
    currentBlockNumber: {
      handler (val, olaVal) {
        if (olaVal !== val) {
          this.getStatus(val)
        }
      },
      deep: true, 
    }
  },
}

</script>
<style scoped>
  .container {
    width: 100%;
    height: 60px;
    /* position: fixed; */
    left: 0;
    top: 0;
    z-index: 100;
  }
  .head-container {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
  }
  .head-left {
    height: 60px;
    display: flex;
    align-items: center;
  }
  .head-left > img {
    height: 30px;
  }
  
  .head-container ul {
    display: flex;
  }
  .head-container li {
    font-size: 14px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #BFC6CB;
    line-height: 20px;
    padding: 0 20px;
    cursor: pointer;
  }
  .head-container .active {
    color: #FFFFFF!important;
  }
  .head-container li:hover {
    color: #FFFFFF
  }
  .head-right {
    display: flex;
    align-items: center;
  }
  .wallet-info-wrapper {
    display: flex;
    background: #FFFFFF;
    height: 40px;
    padding: 4px 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    color: #fff;
  }
  .wallet-unconnect {
    display: flex;
    background: #FFFFFF;
    height: 46px;
    padding: 0 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    color: #fff;
  }
  .wallet-unconnect:hover {
    opacity: 0.8;
  }
  .wallet-left {
    padding-right: 4px;
  }
  .wallet-right:hover {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    opacity: 0.6;
  }
  .toggle-light {
    width: 38px;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .toggle-light:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  .language {
    width: 117px;
    height: 48px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    margin-left: 10px;
    cursor: pointer;
  }
  .language:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  /deep/.el-select .el-input__inner {
    border: 1px solid transparent
  }

@media screen and (max-width: 1000px) {
  .container {
    width: 100%;
    height: 10vw;
    /* position: fixed; */
    left: 0;
    top: 0;
    z-index: 100;
  }
  .head-container {
    height: 15vw;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
  }
  .head-left {
    height: 10vw;
    display: flex;
    align-items: center;
  }
  .head-left > img {
    height: 6vw;
  }
  
  .head-container ul {
    display: flex;
  }
  .head-container li {
    margin-left: 6px!important;
    font-size: 12px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #BFC6CB;
    line-height: 20px;
    padding: 0 5px;
    cursor: pointer;
  }
  .head-container .active {
    color: #FFFFFF!important;
  }
  .head-container li:hover {
    color: #FFFFFF
  }
  .head-right {
    display: flex;
    align-items: center;
  }
  .wallet-info-wrapper {
    display: flex;
    background: #FFFFFF;
    height: 30px;
    padding: 0 12px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    color: #fff;
    font-size: 3vw;
  }
  .wallet-unconnect {
    display: flex;
    background: #FFFFFF;
    height: 5vw;
    padding: 6px 8px;
    align-items: center;
    border-radius: 6px;
    cursor: pointer;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    color: #fff;
    font-size: 3vw;
  }
  .wallet-unconnect:hover {
    opacity: 0.8;
  }
  .wallet-left {
    padding-right: 4px;
  }
  .wallet-right {
    padding-left: 0;
    color: #fff;
  }
  .wallet-right:hover {
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
    opacity: 0.6;
  }
  .toggle-light {
    width: 38px;
    height: 5vw;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    border-radius: 6px;
    margin-left: 10px;
    cursor: pointer;
  }
  .toggle-light:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  .language {
    width: 60px;
    height: 5vw;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #FFFFFF;
    margin-left: 10px;
    cursor: pointer;
  }
  /deep/.el-input__inner {
    height: 30px;
    padding: 0 4px;
    font-size: 10px;
  }
  /deep/.el-input--suffix .el-input__inner {
    padding-right: 0;
  }
  /deep/.el-select .el-input .el-select__caret {
    display: none;
  }
  .language:hover {
    background-color: #FFFFFF;
    opacity: 0.8;
  }
  /deep/.el-select .el-input__inner {
    border: 1px solid transparent;
    line-height: 30px;
  }
}
</style>
