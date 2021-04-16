<template>
  <div class="mining-container">
    <MiningHeader 
      :balance="balance" 
      :isConnected="isConnected"
      :account="account"
      @connectWallet="connectWallet"/>
    <div class="content-wrapper">
      <div class="content-center">
        <div class="content-top">
          <PledgeCard :pledgeObj="pledgeObj" :totalUSDT="totalUSDT" :realTimeDeflationRate="realTimeDeflationRate"/>
          <div class="list-card">
            <YouDestory :dataObj="youObj"/>
            
          </div>
          <div class="list-card" style="margin-left: 20px;">
            <YouHouse :dataObj="liqualityObj"/>
            
          </div>
        </div>
        <div class="content-bottom-max">
          <AuditCard />
          <div class="list-card">
            <DigProduct class="dig-max" :digObj="youDigObj" :digImgUrl="digImgUrl1"/>
            <ExchangeCard :exchangeObj="exchangeObj1"/>
          </div>
          <div class="list-card">
            <DigProduct :digObj="liqualityDigObj" :digImgUrl="digImgUrl2"/>
            <DigProduct class="dig-min" :digObj="youDigObj" :digImgUrl="digImgUrl1"/>
            <ExchangeCard :exchangeObj="exchangeObj2"/>
          </div>
        </div>
        <div class="content-bottom-min">
          <DigProduct class="dig-min" :digObj="youDigObj" :digImgUrl="digImgUrl1"/>
          <DigProduct :digObj="liqualityDigObj" :digImgUrl="digImgUrl2"/>
          <ExchangeCard :exchangeObj="exchangeObj2"/>
          <ExchangeCard :exchangeObj="exchangeObj1"/>
          <AuditCard />
        </div>
      </div>
      <MobileFooter 
        class="footer"
        :balance="balance" 
        :isConnected="isConnected"
        :account="account"
        @showNet="showNetHandle"
        @connectWallet="connectWallet" />
      <MobileChain 
        v-if="isShowNet"
        @close="closeNetHandle"/>
      <PcFooter class="pc-footer"/>
    </div>
  </div>
</template>

<script>
import MiningHeader from '../../components/MiningHeader'
import PledgeCard from '../../components/PledgeCard'
import YouHouse from '../../components/YouHouseCard'
import YouDestory from '../../components/YouDestoryCard'
import DigProduct from '../../components/DigProduct'
import AuditCard from '../../components/AuditCard'
import ExchangeCard from '../../components/ExchangeCard'
import MobileFooter from '../../components/MobileFooter'
import MobileChain from '../../components/MobileChain'
import PcFooter from '../../components/PcFooter'
import { request, gql } from 'graphql-request'
import { ethers } from 'ethers'
import youabi from '../../youabi.json'
import abi from '../../abi-mining.json'
import { getDecimalsCoin, getShowAddress } from '../../utils'
export default {
  components: {
    MiningHeader,
    PledgeCard,
    YouHouse,
    DigProduct,
    AuditCard,
    ExchangeCard,
    MobileFooter,
    MobileChain,
    PcFooter,
    YouDestory
  },
  async mounted() {
    this.getTotalAmmount(); //当前流动性质押
    this.getBlockHigh(); // 获取当前块高
    this.getBuyBackFee();
    this.sendAsyncTotal();
    this.getDestoryLists();
    setTimeout(() => {
      this.checkNetwork(); // 检测网络
    }, 100)
    this.accountChanged(); // 监听账户改变
    setInterval(() => {
      this.getBlockHigh();
    }, 10000);
  },
  data () {
    return {
      network: true,
      account: '',
      isConnected: false,
      balance: '',
      pledgeObj: {
        nowPrice: '--',
        youBalance: '--',
        rewardAmount: '--',
        buyDestoryTotalCount: '--',
        totalCurrentAmmount: '--'
      },
      youObj: {
        title: '平台币销毁列表',
        lists: [],
      },
      liqualityObj: {
        title: '流动性挖矿',
        lists: [],
        totalLists: []
      },
      youDigObj: {
        title: '当前挖矿产出',
        count: '--'
      },
      liqualityDigObj: {
        title: '挖矿产出市值',
        count: '--'
      },
      exchangeObj1: {
        title1: '24H交易额',
        content1: '--',
        title2: '累积交易总额',
        content2: '--'
      },
      exchangeObj2: {
        title1: '24H手续费',
        content1: '--',
        title2: '累积手续费',
        content2: '--'
      },
      digImgUrl1: require('../../assets/mining-img/dig_img1.png'),
      digImgUrl2: require('../../assets/mining-img/dig_img2.png'),
      getYouList: [],
      youTotal: 0,
      cardLists: [],
      totolList: [],     //流动性总额 YOU价格列表
      currentBlockNumber: '', // 当前块高
      isShowNet: false,
      youPrice: 0,
      totalUSDT: '--'
    }
  },
  computed: {
    realTimeDeflationRate () {
      if (this.youTotal === 0 || this.pledgeObj.buyDestoryTotalCount === '--') {
        return '--'
      }
      return getDecimalsCoin((this.pledgeObj.buyDestoryTotalCount / this.youTotal).toFixed(8), 5) + '%'
    },
    totalAmmount () {
      let total = 0
      this.liqualityObj.totalLists.forEach(item => {
        total = total + (item.reserveUSD / item.totalSupply * (item.staketotaldnow / 10**18))
      })
      return total
    },
    blockNumberInt () {
      return this.currentBlockNumber - 1200*24
    },
  },
  methods: {
    /**
     * 检测网络
     */
    checkNetwork() {
      if (!window.ethereum) {
        this.$message.error(this.$t('NoWallet'))
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getNetwork().then(Network => {
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
    initCoin(chainId) {
      let coin = 'HT'
      if (chainId == process.env.VUE_APP_CHAINID) {
        coin = 'ETH'
      } else if (chainId == process.env.VUE_APP_HECO_CHAINID) {
        coin = 'HT'
      }
      this.$store.commit('setCoin', coin)
    },
    /**
     * 添加heco公链
     */
    addHecoChain() {
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
     * 初始化账户
     */
    initAccount() {
      let that = this
      let param = {
        'method': 'eth_accounts'
      }
      this.sendRequest(param, function(err, res){
        if (res.result && res.result.length) {
          that.account = res.result[0]
          that.$store.commit('setAccount', res.result[0])
          that.shortAccount = getShowAddress(res.result[0])
          that.isConnected = true
          that.initBalance()
          that.sendAsync()
        }
      })
    },
    /**
     * 初始化余额
     */
    initBalance() {
      let that = this
      let param = {
        params: [this.account],
        'method': 'eth_getBalance'
      }
      this.sendRequest(param, function(err, res){
        if (res.result) {
          that.balance = (parseInt(res.result, 16) / 1e18).toFixed(3)
          that.$store.commit('setBalance', that.balance)
        }
      })
    },
    /**
     * 切换账户之后的回调
     */
    accountChanged() {
      let that = this
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          this.initAccount()
          // that.account = accounts[0]
          // that.$store.commit('setAccount', accounts[0])
          // that.shortAccount = getShowAddress(accounts[0])
          // that.sendAsync()
          // window.location.reload()
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
      // if (!this.network) {
      //   this.$message.error('网络错误')
      //   return
      // }
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          console.log('连接钱包返回结果：====', accounts)
          if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
          } else {
            this.addHecoChain()
            // this.account = accounts[0]
            // this.$store.commit('setAccount', accounts[0])
            // this.shortAccount = getShowAddress(accounts[0])
            // this.isConnected = true
            // this.sendAsync()
            // const provider = new ethers.providers.Web3Provider(window.ethereum)
            // provider.getBalance(this.account).then((balance) => {
            //   let etherString = ethers.utils.formatEther(balance)
            //   this.balance = parseFloat(etherString, 10).toFixed(3)
            // })
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
        console.log('')
      }
    },
    /**
     * 获取当前块高
     */
    getBlockHigh() {
      const provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL);
      // const provider = new ethers.providers.Web3Provider(window.ethereum);
      provider.getBlockNumber().then(BlockNumber => {
        this.currentBlockNumber = BlockNumber
        this.getExchange()
        const startBlock = parseInt(12043919 - BlockNumber) * 15
        const endBlock = parseInt(12045359 - BlockNumber) * 15
        const nowTime = parseInt(new Date().getTime()/1000)
        this.$store.commit('startTime', nowTime + startBlock)
        this.$store.commit('endTime', nowTime + endBlock)
        this.$store.commit('RemainingBlockchain', 12043919 - BlockNumber)
        this.$store.commit('startBlock', '12043919')
        this.$store.commit('endBlock', '12045359')
        this.getLiquidity(); // 流动性质押
      })
    },
    /**
     * 获取合约实例
     */
    async getContract() {
      const contractAddress = process.env.VUE_APP_YOU_CONTRACT_ADDRESS
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, youabi, provider)
      // let contractWithSigner = contract.connect(provider.getSigner())
      return contract
    },
    /**
     * 封装请求
     */
    sendRequest(param, cb) {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.provider.sendAsync(param, function(err, res){
        if (!err && res.error) err = new Error('EthQuery - RPC Error - '+res.error.message)
        if (err) return cb(err)
        cb(null, res)
      })
    },
    /**
     * 获取当前用户YOU数量
     */
    async sendAsync() {
      const contract = await this.getContract()
      if (this.account) {
        contract.balanceOf(this.account).then((res) => {
          this.pledgeObj.youBalance = ethers.utils.formatUnits(res, 6) || 0
        }).catch((err) => {
          console.log(err)
        });
      }
    },
    /**
     * 获取YOU总余额
     */
    async sendAsyncTotal() {
      const contract = await this.getContract()
      contract.totalSupply().then((res) => {
        this.youTotal = ethers.utils.formatUnits(res, 6) || 0
      }).catch((err) => {
        console.log(err)
      });
    },
    /**
     * 获取Lp list
     */
    getList() {
      const that = this
      const endpoint = process.env.VUE_APP_MINING_GRAPHQL_URL
      const query = gql`{
        pools{
          id
          pool
          lpaddress
          poolname
          startblockheight
          rewardtotal
          rewardperblock
          rewardmultiple 
          priority
          isfinshed
          staketotaldnow
          rewardcanwithdrawnow
          totalpower
          user(first:999,where: { address: "${that.$store.state.account}" }){
            address
            poolsinfo{
              id
              pool{
                id
                pool
                lpaddress
                poolname
                startblockheight
                rewardtotal
                rewardperblock
                rewardmultiple 
                priority
                isfinshed
                staketotaldnow
                rewardcanwithdrawnow
                totalpower
              }
              stake
              stakepower
              invitepower
              rewardbalance
              rewardsT
              rewardwithdrawT
            }
          }
        }
      }`
      request(endpoint, query).then((res) => {
        const pools = []
        if (res) {
          res.pools.forEach(item => {
            that.getTotole(item.lpaddress);
            that.getYOU(item)
            pools.push(item)
          })
          
          setTimeout(() => {
            let totol = 0
            pools.forEach(pool => {
              that.totolList.forEach(totolList =>{
                if (pool.lpaddress.toString() === totolList.id.toString()) {
                  pool.reserveUSD = totolList.reserveUSD
                  pool.totalSupply = totolList.totalSupply
                }
              })
              that.getYouList.forEach(youList => {
                if (pool.lpaddress.toString() === youList.lpaddress.toString()) {
                  pool.youPrice = youList.youPrice
                }
              })
            })
            let liquidityLists = []
            pools.forEach(pool => {
              if (pool.reserveUSD) {
                if (process.env.VUE_APP_YOU_CONTRACT_ADDRESS === pool.lpaddress) {
                  totol+= this.youPrice * (pool.staketotaldnow / 10**6)
                } else {
                  totol+= (pool.reserveUSD / pool.totalSupply * (pool.staketotaldnow / 10**18))
                }
              }
              if (pool.lpaddress === process.env.VUE_APP_YOU_CONTRACT_ADDRESS) {
                pool.decimals = 6
              } else {
                pool.decimals = 18
              }
              liquidityLists.push(pool)
            })
            this.totalUSDT = totol
            this.liqualityObj.totalLists = liquidityLists;
            this.liqualityObj.lists = liquidityLists;
            if (this.liqualityObj.totalLists[0].startblockheight) {
              let productCount = 0
              // 计算当前挖矿产出
              productCount = getDecimalsCoin(1.388888888*(this.currentBlockNumber - this.liqualityObj.totalLists[0].startblockheight), 3)
              this.youDigObj.count = Number(productCount) > 0 ? productCount : '0'
              // this.youDigObj.count = Number(productCount) >  2399999.99999998 ?  2399999.99999998 : productCount
              this.liqualityDigObj.count = getDecimalsCoin(this.youDigObj.count*this.pledgeObj.nowPrice, 3)
            }
          }, 3000)
          
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取流动性总额、You的价格
     */
    getTotole(lpaddress) {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const tokenOrPair = process.env.VUE_APP_YOU_CONTRACT_ADDRESS == lpaddress ? 0 : 1
      const query = tokenOrPair ?gql`
        {
          pair (id: "${lpaddress}"){
            id
            reserveUSD
            totalSupply
          }
        }` : gql`{
        token(id: "${lpaddress}"){
          id
          totalSupply
          derivedETH
        }
          bundle(id: "1"){
            ethPrice
          }
        }`
        request(endpoint, query).then((res) => {
          if (!tokenOrPair) {
            res.pair = {
              id: res.token.id,
              totalSupply: res.token.totalSupply,
              reserveUSD: res.bundle.ethPrice * res.token.derivedETH
            }
          }
          if (res.pair) {
            this.totolList.push(res.pair)
          }
        }).catch((err) => {
        console.log(err)
      })
    },

    /**
     * YOU的收益数量
     */
    getYOU(item) { 
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        process.env.VUE_APP_MINING_CONTRACT,
        abi,
        provider
      );
      contract.pendingReward(item.id, this.$store.state.account).then(res => {
        if (res) {
          const youList = {
            lpaddress: item.lpaddress,
            youPrice: ethers.utils.formatUnits(res, 6) || 0
          }
          this.getYouList.push(youList)
        }
      })
    },
    /**
     * 获取流动性质押
     */
    getLiquidity() {
      const that = this
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        token(id : "${process.env.VUE_APP_YOU_CONTRACT_ADDRESS}"){
          derivedETH
        }
        bundle(id : "1"){
          ethPrice
        }
        buyBack(id : "${process.env.VUE_APP_PAIR_ADDRESS}"){
          totalUSD
          totalToken
        }
      }`
      request(endpoint, query).then((res) => {
        // 总回购销毁数量
        if (res.buyBack) {
          that.pledgeObj.buyDestoryTotalCount = res.buyBack.totalToken;
        }
        // 当前价格
        if (res.bundle && res.token) {
          that.pledgeObj.nowPrice = res.bundle.ethPrice*res.token.derivedETH;
          that.youPrice = that.pledgeObj.nowPrice
          // that.getDigProduct();
        }
        this.getList(); // 流动性挖矿列表
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取销毁回购列表
     */
    getDestoryLists () {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        swaps (orderBy: timestamp orderDirection: desc first: 5 where: {to: "${process.env.VUE_APP_HEIDONG_ADDRESS}"}){
          id
          amount1In
          amountUSD
          amount0Out
          timestamp
          pair{
            token0 {
              symbol
            }
            token1 {
              symbol
            }
          }
        }
      }`
      request(endpoint, query).then((res) => {
        if (res.swaps) {
          this.youObj.lists = res.swaps.slice(0, 5)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取当前挖矿产出
     */
    getDigProduct() {
      const endpoint = process.env.VUE_APP_LIQUIDITY_PRODUCT
      const query = gql`{
        allPoolInfo(id: "0"){
          rewardstotal
          rewardswithdrawT
        }
      }`
      request(endpoint, query).then((res) => {
        if (res.allPoolInfo) {
          this.youDigObj.count = res.allPoolInfo.rewardstotal/1e18;
          this.liqualityDigObj.count = this.youDigObj.count*this.pledgeObj.nowPrice
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 当前流动性质押
     */
    getTotalAmmount() {
      let that = this
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        uniswapFactories {
          totalLiquidityETH
        },
        bundles {
            ethPrice
        }

      }`
      request(endpoint, query).then((res) => {
        that.pledgeObj.totalCurrentAmmount = res.bundles[0].ethPrice*res.uniswapFactories[0].totalLiquidityETH
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 总回购手续费
     */
    getBuyBackFee() {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        buyBack(id: "${process.env.VUE_APP_PAIR_ADDRESS}"){
          totalUSD
          totalToken
        }
      }`
      request(endpoint, query).then((res) => {
        if (res.buyBack) {
          this.pledgeObj.rewardAmount = res.buyBack.totalUSD;
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取交易额、手续费
     */
    getExchange() {
      // const that = this
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const query = gql`{
        total: uniswapFactories(where: {id: "${process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS}"}) {
          totalVolumeUSD
        }
        day: uniswapFactories( block: {number: ${this.blockNumberInt}} where: {id: "${process.env.VUE_APP_FACTORY_CONTRACT_ADDRESS}"}) {
          totalVolumeUSD
        }
      }`
      this.loading = true
      request(endpoint, query).then((res) => {
        if (res.total[0]) {
          this.exchangeObj1.content2 = getDecimalsCoin((res.total[0].totalVolumeUSD), 3)
          this.exchangeObj2.content2 = getDecimalsCoin((res.total[0].totalVolumeUSD*0.003), 3)
        }
        if (res.total[0] && res.day[0]) {
          this.exchangeObj1.content1 = getDecimalsCoin((res.total[0].totalVolumeUSD - res.day[0].totalVolumeUSD), 3)
          this.exchangeObj2.content1 = getDecimalsCoin((this.exchangeObj1.content1*0.003), 3)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    showNetHandle() {
      this.isShowNet = true
    },
    closeNetHandle() {
      this.isShowNet = false
    }
  }
}

</script>
<style lang='less' scoped>
.mining-container {
  width: 100%;
  .content-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    position: relative;
    margin-top: -50px;
    .footer {
      display: none;
    }
    .content-center {
      width: 1200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 auto;
      z-index: 100;
      .content-top {
        display: flex;
        .list-card {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .dig-min {
            display: none;
          }
        }
      }
      .content-bottom-max {
        width: 1200px;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .list-card {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .dig-min {
            display: none;
          }
        }
      }
      .content-bottom-min {
        display: none !important;
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        .list-card {
          display: flex;
          flex-direction: column;
          margin-left: 20px;
          .dig-min {
            display: none;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 1000px) {
  .mining-container {
    width: 100%;
    .content-wrapper {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-bottom: 0;
      .footer {
        display: flex;
      }
      .content-center {
        width:90vw;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-bottom: 83px;
        .content-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          .list-card {
            display: flex;
            flex-direction: column;
            margin-top: 15px;
            margin-left: 0 !important;
            .dig-max {
              display: none;
            }
            .dig-min {
              display: flex;
            }
          }
        }
        .content-bottom-max {
          display: none !important;
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
        .content-bottom-min {
          display: block !important;
          margin-top: 20px;
          display: flex;
          justify-content: space-between;
        }
      }
    }
    .pc-footer {
      display: none;
    }
  }
}
  
</style>