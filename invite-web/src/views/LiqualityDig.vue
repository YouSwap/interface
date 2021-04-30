<!-- 流动性挖矿 -->
<template>
  <div @click="hideToastHandle">
    <div class="pc-container" v-if="platform === 2">
      <Header :isConnected="isConnected"/>
      <div class="content">
        <div class="content-wrapper">
          <div class="data-wrapper">
            <div class="data-show">
              <span>{{$t('pledgeTotole')}}</span>
              <span> {{getDecimalsCoinFn(totolUSDT, 6)}} USDT</span>
            </div>
          </div>
          <div class="title-wrapper">
            <p>{{$t('inviteDig')[6]}}<span @click="handleLinkDetail">{{$t('inviteDig')[7]}}</span></p>
          </div>
          <HeadCard
           style="margin-top: 40px"
          />
          <div class="tab-wrapper">
            <!-- <div class="tab">
              <div class="progress" :class="tabActiveIndex === 0 ? 'active' : ''" @click="handleProgress">{{$t('tabs')[0]}}</div>
              <div class="over" :class="tabActiveIndex === 1 ? 'active' : ''" @click="handleOver">{{$t('tabs')[1]}}</div>
            </div> -->
            <div class="tab-box">
              <div class="list"
                v-for="(item, index) in tabList"
                :key="index"
                :class="curTab == item.id ? 'cur' : ''"
                @click="switchTabHandle(item)"
                >
                  <span>{{item.name}}</span>
                </div>
            </div>
          </div>
          <div v-if="blockbetween > 0" class="startHeight">
            <img class="startHeightImg" :src="blockImg" alt="">
            <span>{{$t('startblock')}}</span>
            <span>{{blockbetween}}</span>
          </div>
          <div class="digcard-wrapper">
            <DigCard 
              :platform="platform" 
              :cardLists="cardLists"
              :loading = "loading"
              @redeemInit="handleRedeemInitClick"
              @pledgeInit="handlePledgeInitClick" />
          </div>
        </div>
      </div>
    </div>
    <div class="h5-container" v-if="platform === 1">
      <MobileHeader />
      <div class="top-box">
        <div class="bg-box">
          <div class="total-value">
            {{$t('pledgeTotole')}} {{getDecimalsCoinFn(totolUSDT, 6)}} USDT
          </div>
        </div>
      </div>
      <div class="content-wrapper">
        <div class="tips">
          <span>{{$t('inviteDig')[6]}}</span>
          <span @click="handleLinkDetail">{{$t('inviteDig')[7]}}</span>
        </div>
        <div class="invote-card">
          <div class="invote-item">
            <img :src="yaoqingH5Url" alt="">
            <span class="item-top">{{$t('inviteDig')[0]}}</span>
            <span class="item-bottom">{{inviteNum}}</span>
          </div>
          <div class="invote-item" style="margin-top: 30px">
            <img :src="shouyiH5Url" alt="">
            <div class="item-top-box">
              <span>{{$t('inviteDig')[1]}}</span>
              <div>
                <a class="toast-box">
                  <img :src="questionUrl" alt="">
                  <div>
                    {{$t('inviteDig')[8]}}
                    <i></i>
                  </div>
                </a>
              </div>
            </div>
            <span class="item-bottom">{{inviteBenefit}}</span>
          </div>
          <div class="invote-bottom">
            <div class="bottom-item">
              <div class="item-title">
                <span :class="lang == 'en' ? 'en-version' : ''">{{$t('inviteDig')[2]}}</span>
                <a class="toast-box" @click.stop="switchShowToast(1)">
                  <img :src="questionUrl" alt="">
                  <div v-if="isShowShareToast">
                    {{$t('notice')[0]}}
                    <i></i>
                  </div>
                </a>
              </div>
              <div
                class="bottom-btn"
                :class="account ? '' : 'disabled'"
                @click="handleGetLine"
              >{{$t('invite')[7]}}</div>
            </div>
            <div class="bottom-item" style="margin-left: 10px">
              <div class="item-title">
                <span :class="lang == 'en' ? 'en-version' : ''">{{$t('inviteDig')[3]}}</span>
                <a class="toast-box" @click.stop="switchShowToast(2)">
                  <img :src="questionUrl" alt="">
                  <div v-if="isShowActivateToast" class="activate-tip">
                    {{$t('notice')[1]}}
                    <i></i>
                  </div>
                </a>
              </div>
              <div
                class="bottom-btn"
                :class="account ? '' : 'disabled'"
                @click="handleActive"
              >{{$t('invite')[8]}}</div>
            </div>
          </div>
        </div>
        <div class="tab-wrapper">
          <div class="tab-box">
            <div class="list"
              v-for="(item, index) in tabList"
              :key="index"
              :class="curTab == item.id ? 'cur' : ''"
              @click="switchTabHandle(item)"
              >
                <span>{{item.name}}</span>
              </div>
          </div>
        </div>
        <div v-if="blockbetween > 0" class="startHeight">
          <img class="startHeightImg" :src="blockImgW" alt="">
          <span>{{$t('startblock')}} </span>
          <span>{{blockbetween}}</span>
        </div>
        <div class="digcard-wrapper">
          <DigCard 
            :platform="platform" 
            :cardLists="cardLists"
            :loading = "loading"
            @redeemInit="handleRedeemInitClick"
            @pledgeInit="handlePledgeInitClick" />
        </div>
        <MobileFooter
          @setLang="setLangHandle" 
          :isConnected="isConnected"/>
      </div>
    </div>
    <template v-if="isShowInviteUrl">
      <InviteUrl
        :account="account"
        :platform="platform"
        @cancel="closeInviteUrlHandle"></InviteUrl>
    </template>
    <div v-show="isShowActivate">
      <Activate
        :platform="platform"
        :account="account"
        @updateAccount="updateAccountHandle"
        @cancel="closeActivateHandle"></Activate>
    </div>
    <div v-show="isShowShare">
      <ShareDialog
        :platform="platform"
        :account="account"
        :shareAddress="shareAddress"
        @connect="connectWallet"
        @inviteSucc="invitedSuccHandle"
        @cancel="closeShareHandle"></ShareDialog>
    </div>
    <template v-if="ifStakedShow">
      <StakedDialog
        @stakedClose="handleStakedClosed" />
    </template>
    <template v-if="ifUnStakedShow">
      <UnstakedDialog
        @stakedClose="handleUnStakedClosed" />
    </template>
  </div>
</template>

<script>
import Header from '../components/Header'
import HeadCard from '../components/Card/HeadCard'
import DigCard from '../components/Card/DigCard'
import MobileHeader from '../components/MobileHeader'
import MobileFooter from '../components/MobileFooter'
import StakedDialog from '../components/Dialog/StakedDialog'
import { request, gql } from 'graphql-request'
// 邀请链接弹窗
import InviteUrl from '../components/InviteUrl';
// 激活弹窗
import Activate from '../components/Activate';
// 邀请提示弹窗
import ShareDialog from '../components/ShareDialog';
import UnstakedDialog from '../components/Dialog/UnstakedDialog'
// import { entropyToMnemonic } from 'ethers/lib/utils'
import bus from '../assets/script/bus'
import { ethers } from 'ethers'
import { getShowAddress, getDecimalsCoin } from '../utils'
import abiUSDT from '../abi-usdt.json'
import abi from '../abi-mining.json'
import { mapState } from 'vuex'

export default {
  components: {
    Header,
    HeadCard,
    DigCard,
    MobileHeader,
    MobileFooter,
    StakedDialog,
    InviteUrl,
    Activate,
    ShareDialog,
    UnstakedDialog
  },
  data () {
    return {
      checkValue: false,
      cardLists: [],
      lang: 'en',
      account: '',
      isConnected: false,
      network: false,
      isShowInviteUrl: false,
      isShowActivate: false,
      isShowShare: false,
      shareAddress: '',
      platform: 2,
      yaoqingUrl: require('../assets/image/yaoqing@2x.png'),
      shouyiUrl: require('../assets/image/shouyi@2x.png'),
      yaoqingH5Url: require('../assets/image/yaoqing-h5.png'),
      shouyiH5Url: require('../assets/image/shouyi-h5.png'),
      questionUrl: require('../assets/image/question-h5.png'),
      ifStakedShow: false,
      allowanceList: [], // 是否授权列表
      totolList: [],     //流动性总额 YOU价格列表
      getYouList: [],     //YOU的收益列表
      loading: false,
      ifUnStakedShow: false,
      isShowShareToast: false,
      isShowActivateToast: false,
      totle: 0,
      totolUSDT: '--',
      currentBlockNumber: 0,
      startblockheight: 0,
      blockImg: require('../assets/image/block.png'),
      blockImgW: require('../assets/image/blockWhite.png'),
      youPrice: 0,
      curTab: 0,
      tabList: [
        {
          name: '主流区',
          id: 0
        },
        {
          name: '开拓区',
          id: 1
        },
        {
          name: '联盟区',
          id: 2
        }
      ]
    }
  },
  computed: {
    ...mapState({
      inviteNum: state => state.inviteNum,
      inviteBenefit: state => state.inviteBenefit
    }),
    blockbetween() {
      return this.startblockheight - this.currentBlockNumber
    },
    YouPrice () {
      return this.youPrice
    }
  },
  created() {
    this.initPlatform()
    // 获取当前块高
    this.getBlockHigh();
    setInterval(() => {
      this.getBlockHigh();
    }, 10000);
    // 获取当前YOU的价格
    this.getYouPrice();
  },
  mounted() {
    // parseFloat(inviteBenefit, 10).toFixed(4)
    setTimeout(() => {
      this.checkNetwork()
    }, 100)
    this.accountChanged()
    
    // 连接钱包
    bus.$on('connectWallet', this.connectWallet)
    // 获取最新余额
    bus.$on('initBalance', this.initBalance)
    // 获取最新LP列表
    bus.$on('initPoolList', this.getList)
    // 获取最新累计邀请挖矿收益
    bus.$on('updateInviteBenefit', this.getInviteBenefit)
    // this.allowanceUser();
    // 激活成功之后更新邀请数据
    bus.$on('updateInvite', this.getInviteData)
  },
  methods: {
    /**
     * 获取当前块高
    */
    getBlockHigh() {
      const provider = new ethers.providers.JsonRpcProvider(process.env.VUE_APP_RPC_URL)
      provider.getBlockNumber().then(BlockNumber => {
        this.currentBlockNumber = BlockNumber
      })
    },

    /**
     * 精度截取
    */
    getDecimalsCoinFn(number, decimals) {
      return getDecimalsCoin(number, decimals)
    },
    /**
     * 点击详情查看
     */
    handleLinkDetail () {
      this.$router.push('invite');
    },
    /**
     * 判断平台
     */
    initPlatform() {
      var userAgentInfo = navigator.userAgent.toLowerCase();
      var Agents = ['android', 'iphone', 'symbianOS', 'windows phone', 'ipad', 'ipod'];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      if (flag) {
        this.platform = 2
      } else {
        this.platform = 1
      }
      this.$store.commit('setPlatform', this.platform)
    },
    /**
     * 关闭质押弹窗
     */
    handleStakedClosed () {
      this.ifStakedShow = false
    },
    /**
     * 点击质押
     */
    handlePledgeInitClick (val) {
      this.ifStakedShow = val
    },
    /**
     * 获取Lp list
     */
    getList() {
      const that = this
      const endpoint = process.env.VUE_APP_MINING_GRAPHQL_URL
      const account = that.$store.state.account?.toLowerCase()
      const query = gql`{
        pools(orderBy: priority, orderDirection: "asc"){
          id
          pool
          type
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
          user(first:999,where: { address: "${account}" }){
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
      this.loading = true
      request(endpoint, query).then((res) => {
        const pools = []
        if (res.pools) {
          res.pools.forEach(item => {
            item.fold = true
            that.allowanceUser(item.lpaddress)
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
              that.allowanceList.forEach(allowance => {
                if (pool.lpaddress.toString() === allowance.id.toString()) {
                  pool.allowance = allowance.allowance
                }
              })
              that.getYouList.forEach(youList => {
                if (pool.id.toString() === youList.id.split('-')[0]) {
                  pool.youPrice = youList.youPrice
                }
              })
            })
            pools.forEach(pool => {
              if (pool.reserveUSD) {
                if (process.env.VUE_APP_YOU_ADDRESS === pool.lpaddress) {
                  totol+= this.YouPrice * (pool.staketotaldnow / 10**6)
                  console.log('this.YouPrice', this.YouPrice)
                } else {
                  totol+= (pool.reserveUSD / pool.totalSupply * (pool.staketotaldnow / 10**18))
                }
              }
            })
            console.log('totol', totol)
            this.totolUSDT = totol
            pools.forEach(pool => {
              if (pool.lpaddress === process.env.VUE_APP_YOU_ADDRESS) {
                pool.decimals = 6
              } else {
                pool.decimals = 18
              }
              const endblockheigh = Number(pool.startblockheight) + Number(Math.ceil(pool.rewardtotal / pool.rewardperblock))
              if (pool.startblockheight > this.currentBlockNumber) {
                pool.isNotStart = true
                this.startblockheight = pool.startblockheight
              }
              if (this.currentBlockNumber >= endblockheigh) {
                pool.isfinshed = true
              } else {
                pool.isfinshed = false
              }
            })
            this.cardLists = pools
            this.loading = false;
          }, 3000)
          
        }
        // that.allowanceUser();
        // if (res.poolUsers) {
        //   const pools = []
        //   res.poolUsers.forEach((poolUser) => {
        //     poolUser.poolsinfo.forEach((pool)=> {
        //       pool.fold = true
        //       pool.ids = poolUser.id.toString()
        //       pools.push(pool)
        //     })
        //   })
        //   pools.forEach((item) => {
        //     that.getTotole(item.ids)
        //   })
        //   that.cardLists = pools
        // }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 点击赎回
     */
    handleRedeemInitClick () {
      this.ifUnStakedShow = true
    },
    /**
     * 关闭赎回
     */
    handleUnStakedClosed () {
      this.ifUnStakedShow = false
    },
    /**
     * 查看当前用户是否授权Lp
     */
    allowanceUser(lpaddress) {
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contractLP = new ethers.Contract(
        lpaddress,
        abiUSDT,
        provider
      );
      contractLP.allowance(
          this.$store.state.account,
          process.env.VUE_APP_MINING_CONTRACT
        ).then((allowance) => {
          if (allowance) {
            let allowances = ''
            if (process.env.VUE_APP_YOU_ADDRESS === lpaddress) {
              allowances = ethers.utils.formatUnits(allowance.toString(), 6) || 0
            } else {
              allowances = ethers.utils.formatUnits(allowance.toString(), 18) || 0
            }
            // console.log('allowance', allowance.toPrecision())
            // const allowances = allowance.toString().toNumber() || 0;
            const list =  {
              id: lpaddress,
              allowance: allowances,
            }
            this.allowanceList.push(list)
          }
        });
    },
    /**
     * 获取流动性总额、You的价格
     */
    getTotole(lpaddress) {
      const endpoint = process.env.VUE_APP_MING_ROPSTEN
      const tokenOrPair = process.env.VUE_APP_YOU_ADDRESS == lpaddress ? 0 : 1
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
            youPrice: ethers.utils.formatUnits(res.toString(), 6) || 0,
            id: `${item.id}-${this.$store.state.account}`
          }
          this.getYouList.push(youList)
        }
      })
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
     * 检测网络
     */
    checkNetwork() {
      if (!window.ethereum) {
        this.$message.error(this.$t('connect')[2])
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getNetwork().then(Network => {
        if (Network.chainId != process.env.VUE_APP_HECO_CHAINID) {
          this.$message.error(this.$t('index')[6])
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
          that.getList(); //获取列表信息
          that.getInviteData()
          that.getInviteBenefit()
        } else {
          that.getList();
        }
        that.checkShare()
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
        // Handle the new accounts, or lack thereof.
        // "accounts" will always be an array, but it can be empty.
        if (accounts.length === 0) {
          // MetaMask is locked or the user has not connected any accounts
          console.log('Please connect to MetaMask.');
          window.location.reload()
        } else if (accounts[0] !== that.account) {
          this.initAccount()
        }
      });
      window.ethereum.on('chainChanged', () => {
        // Handle the new chain.
        // Correctly handling chain changes can be complicated.
        // We recommend reloading the page unless you have good reason not to.
        window.location.reload()
      });
    },
    /**
     * 连接钱包
     */
    async connectWallet () {
      // if (!this.network) {
      //   this.$message.error(this.$t('index')[6])
      //   return
      // }
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts.length === 0) {
            console.log('Please connect to a wallet.');
          } else {
            this.addHecoChain()
          }
        })
        .catch((err) => {
          if (err.code === 4001) {
            console.log('Please connect to a wallet.');
          } else {
            console.error(err);
          }
        })
      } else {
        console.log('Please connect to a wallet.');
      }
    },
    closeShareHandle(data) {
      this.isShowShare = false
      if (data) {
        window.location.href = this.funcUrlDel('address')
      }
    },
    /**
     * 格式化钱包地址
     */
    shortenAddress(address, chars, type) {
      let label = '...'
      if (type == 1) {
        label = '...'
      } else if (type == 2) {
        label = '****'
      }
      return `${address.substring(0, chars)}${label}${address.substring(42 - chars)}`
    },
    /**
     * 删除url的参数
     */
    funcUrlDel(paramKey) {
      var url = window.location.href;    //页面url
      var urlParam = window.location.search.substr(1);   //页面参数
      var beforeUrl = url.substr(0, url.indexOf("?"));   //页面主地址（参数之前地址）
      var nextUrl = "";

      var arr = new Array();
      if (urlParam != "") {
          var urlParamArr = urlParam.split("&"); //将参数按照&符分成数组
          for (var i = 0; i < urlParamArr.length; i++) {
              var paramArr = urlParamArr[i].split("="); //将参数键，值拆开
              //如果键雨要删除的不一致，则加入到参数中
              if (paramArr[0] != paramKey) {
                  arr.push(urlParamArr[i]);
              }
          }
      }
      if (arr.length > 0) {
          nextUrl = "?" + arr.join("&");
      }
      url = beforeUrl + nextUrl;
      return url;
    },
    invitedSuccHandle() {
      this.userAddress = this.shortenAddress(this.shareAddress, 4)
      this.isInvited = true
      this.isShowTip = true
    },
    /**
     * 获取url参数
     */
    getRequest() {
      let url = location.href; //获取url中"?"符后的字串
      let theRequest = {};
      console.log(url)
      if (url.indexOf('?') !== -1) {
          let ind = url.indexOf('?');
          let str = url.substr(ind + 1);
          let strs = str.split('&');
          for (var i = 0; i < strs.length; i++) {
              theRequest[strs[i].split('=')[0]] = unescape(strs[i].split('=')[1]);
          }
      }
      return theRequest;
    },
    /**
     * 检查邀请链接
     */
    checkShare() {
      let shareAddress = this.getRequest().address
      if (shareAddress) {
        this.shareAddress = shareAddress
        if (this.account) {
          let account = this.account.toLowerCase()
          shareAddress = shareAddress.toLowerCase()
          if (account != shareAddress) {
            const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
            const query = gql`
              {
                relationShip(id: "${this.account.toLowerCase()}") {
                  id
                  owner
                }
              }
            `
            request(endpoint, query).then((res) => {
              if (!res.relationShip) {
                this.isShowShare = true
              } else {
                this.isShowShare = false
                if (res.relationShip.owner && res.relationShip.owner != '0x0000000000000000000000000000000000000000') {
                  this.userAddress = this.shortenAddress(res.relationShip.owner, 4)
                  this.isInvited = true
                } else {
                  this.isInvited = false
                }
                this.isShowTip = true
              }
            }).catch((err) => {
              console.log(err)
            })
          }
        } else {
          // this.isShowShare = true
        }
      } else {
        if (this.account) {
          const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
          const query = gql`
            {
              relationShip(id: "${this.account.toLowerCase()}") {
                id
                owner
              }
            }
          `
          request(endpoint, query).then((res) => {
            if (res.relationShip && res.relationShip.owner  && res.relationShip.owner != '0x0000000000000000000000000000000000000000') {
              this.userAddress = this.shortenAddress(res.relationShip.owner, 4)
              this.isInvited = true
            } else {
              this.isInvited = false
            }
            this.isShowTip = true
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    },
    /**
     * graph请求邀请数量
     */
    getInviteData() {
      let formatAddress = this.account.toLowerCase()
      const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
      const query = gql`
        {
          counts(where: {id: "${formatAddress}"}){
            total
            one
            two
          }
        }
      `
      request(endpoint, query).then((res) => {
        let total = 0
        // console.log(data)
        if (res.counts.length) {
          total = res.counts[0].total || 0
          this.$store.commit('setInviteNum', total)
        } else {
          this.$store.commit('setInviteNum', 0)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取挖矿合约实例
     */
    getContract() {
      const contractAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abi, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    /**
     * 获取邀请收益
     */
    async getInviteBenefit() {
      let contract = await this.getContract()
      contract.rewardInfos(this.account).then(data => {
        let inviteBenefit = ethers.utils.formatUnits(data.receiveReward.toString(), 6)
        if (inviteBenefit > 0) {
          inviteBenefit = parseFloat(inviteBenefit, 10).toFixed(4)
          this.$store.commit('setInviteBenefit', inviteBenefit)
        } else {
          this.$store.commit('setInviteBenefit', 0)
        }
        setTimeout(() => {
          this.getInviteBenefit()
        }, 3000)
      }).catch(err => {
        setTimeout(() => {
          this.getInviteBenefit()
        }, 3000)
        console.log(err)
      })
    },
    /**
     * 获取邀请连接
     */
    handleGetLine () {
      if (!this.account) {
        this.connectWallet()
        return
      }
      this.isShowInviteUrl = true
    },
    closeInviteUrlHandle() {
      this.isShowInviteUrl = false
    },
    /**
     * 获取当前YOU的价格
     */
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
          this.youPrice = res.bundle.ethPrice * res.token.derivedETH
        }
      })
    },
    /**
     * 激活
     */
    handleActive () {
      if (!this.account) {
        this.connectWallet()
        return
      }
      this.isShowActivate = true
    },
    updateAccountHandle() {
      this.initBalance()
    },
    closeActivateHandle() {
      this.isShowActivate = false
    },
    setLangHandle(data) {
      this.lang = data
    },
    switchShowToast(id) {
      if (id == 1) {
        this.isShowShareToast = !this.isShowShareToast
      } else {
        this.isShowActivateToast = !this.isShowActivateToast
      }
    },
    hideToastHandle() {
      this.isShowShareToast = false
      this.isShowActivateToast = false
    }
  }
}

</script>
<style lang='less' scoped>
.pc-container {
  width: 100%;
  overflow-x: hidden;
  .content {
    width: 100%;
    height: 100%;
    background-color: #F8FCFF;
    padding-bottom: 54px;
    .content-wrapper {
      width: 1200px;
      height: 100%;
      position: relative;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      .data-wrapper {
        position: absolute;
        left: 50%;
        top: 0;
        transform: translate(-50%, -50%);
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 500px;
        height: 60px;
        padding: 0 10px;
        background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
        border-radius: 20px;
        z-index: 100;
        .data-show {
          width: fit-content;
          span {
            font-size: 24px;
            font-family: DINPro-Medium, DINPro;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 31px;
          }
        }
      }
      .title-wrapper {
        width: 100%;
        margin-top: 96px;
        & > p {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(6, 38, 60, .5);
          line-height: 24px;
          & > span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #06999F;
            line-height: 16px;
            text-decoration: underline;
            cursor: pointer;
          }
          span:hover {
            opacity: 0.8;
          }
        }
      }
      .tab-wrapper {
        width: 100%;
        margin: 71px 0 40px;
        position: relative;
        display: flex;
        justify-content: center;
        .tab {
          display: flex;
          .progress {
            width: 120px;
            height: 45px;
            border-radius: 23px 0 0 23px;
            border: 1px solid #06263C;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #06263C;
            cursor: pointer;
            border-right: none;
          }
          .progress:hover {
            opacity: 0.8;
          }
          .over {
            width: 120px;
            height: 45px;
            border-radius: 0 23px 23px 0;
            border: 1px solid #06263C;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #06263C;
            cursor: pointer;
            border-left: none;
          }
          .over:hover {
            opacity: 0.8;
          }
          .active {
            background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
            border: none;
            color: #FFFFFF;
          }
        }
      }
      .tab-box {
        height: 33px;
        display: flex;
        &>div {
          position: relative;
          margin: 0 30px;
          span {
            display: inline-block;
            font-size: 24px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #06263C;
            cursor: pointer;
          }
        }
        .cur:after {
          position: absolute;
          left: 0;
          bottom: -14px;
          content: '';
          display: block;
          width: 100%;
          height: 4px;
          background: #35BDB1;
          border-radius: 3px;
        }
      }
      .startHeight {
        display: flex;
        align-items: center;
        line-height: 30px;
        >span {
          padding-left: 8px;
        }
        .startHeightImg {
          width: 30px;
          height: 30px;
        }
      }
    }
  }
}
.h5-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  background: #F8FCFF;
  padding-bottom: 60px;
  overflow-x: hidden;
  .top-box {
    width: 100%;
    height: 40px;
    
    background: #06263c;
    
    .bg-box {
      padding: 20px 15px 0;
      background: #F8FCFF;
      border-radius: 20px 20px 0px 0px;
    }
    .total-value {
      width: 100%;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
      border-radius: 8px;
      white-space: nowrap;
      font-size: 14px;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFFFF;
      line-height: 21px;
      z-index: 11;
    }
  }
  .content-wrapper {
    width: 92vw;
    display: flex;
    flex-direction: column;
    .tips {
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #82929D;
      line-height: 24px;
      margin-top: 30px;
      & > span:last-child {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #35BDB1;
        line-height: 16px;
        text-decoration: underline;
      }
    }
    .invote-card {
      width: 100%;
      padding: 20px;
      background: #fff;
      border-radius: 10px;
      margin-top: 20px;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      .invote-item {
        display: flex;
        flex-direction: column;
        margin-left: 33px;
        position: relative;
        & > img {
          width: 24px;
          height: 24px;
          position: absolute;
          left: -30px;
          top: 0;
        }
        .item-top {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #6A7D8A;
          line-height: 20px;
        }
        .item-top-box {
          display: flex;
          align-items: center;
          & > span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #82929D;
            line-height: 20px;
          }
          .toast-box {
            position: relative;
            display: block;
            width: 16px;
            height: 16px;
            margin-left: 6px;
            img {
              width: 16px;
              height: 16px;
            }
            div {
              position: absolute;
              right: -13px;
              bottom: 26px;
              width: 180px;
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
                right: 15px;
                border: 6px solid transparent;
                border-top: 8px solid #fff;
                width: 0;
                height: 0px;
              }
            }
          }
          .toast-box:hover {
            div {
              display: block;
            }
          }
        }
        .item-bottom {
          margin-top: 6px;
          font-size: 20px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263C;
          line-height: 20px;
        }
      }
      .invote-bottom {
        display: flex;
        justify-content: space-between;
        margin-top: 30px;
        .bottom-item {
          display: flex;
          flex-direction: column;
          .item-title {
            display: flex;
            align-items: center;
            & > span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #82929D;
              line-height: 20px;
            }
            .en-version {
              font-size: 12px;
            }
            .toast-box {
              position: relative;
              display: block;
              width: 16px;
              height: 16px;
              margin-left: 6px;
              img {
                width: 16px;
                height: 16px;
              }
              div {
                position: absolute;
                left: -13px;
                bottom: 26px;
                width: 200px;
                background: #FFFFFF;
                box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
                border-radius: 10px;
                padding: 10px;
                font-size: 12px;
                line-height: 16px;
                text-align: left;
                color: rgba(6, 38, 60, 0.5);
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
                left: auto;
                right: -13px;
                bottom: 26px;
                i {
                  left: auto;
                  right: 15px;
                }
              }
            }
          }
          .bottom-btn {
            margin-top: 10px;
            width: 35vw;
            height: 45px;
            background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 20px;
            text-align: center;
          }
          .bottom-btn.disabled {
            background: #F1F2F5;
            color: rgba(6, 38, 60, .2);
          }
        }
      }
    }
    .tab-wrapper {
      width: 100%;
      margin: 25px 0 10px;
      display: flex;
      justify-content: center;
      position: relative;
      .tab-box {
        display: flex;
        &>div {
          position: relative;
          margin: 0 10px;
          span {
            display: inline-block;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #06263C;
            cursor: pointer;
          }
        }
        .cur {
          span {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #35BDB1;
          }
        }
        .cur:after {
          position: absolute;
          left: 0;
          bottom: -8px;
          content: '';
          display: block;
          width: 100%;
          height: 2px;
          background: #35BDB1;
          border-radius: 3px;
        }
      }
    }
    .digcard-wrapper {
      margin-top: 16px;
    }
    .startHeight {
      font-size: 14px;
      margin-top: 20px;
      display: flex;
      align-items: center;
      line-height: 30px;
      color: #fff;
      >span {
        padding-left: 8px;
      }
      .startHeightImg {
        width: 20px;
        height: 20px;
      }
    }
  }
}
  
</style>