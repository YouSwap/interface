<template>
  <div class="invite" @click="hideLangHandle">
    <div class="pc-wrap" v-if="platform == 2">
      <header>
        <div class="header-left">
          <a :href="homeUrl" class="logo">
            <div><img src="../assets/image/youlogo.svg" alt=""></div>
          </a>
          <div class="nav">
            <a :href="homeUrl">{{$t('header')[0]}}</a>
            <a :href="swapUrl">{{ $t('navs')[1] }}</a>
            <a :href="poolUrl">{{ $t('navs')[2] }}</a>
            <a class="active" href="/">{{ $t('navs')[3] }}</a>
            <a :href="chartUrl">{{ $t('navs')[4] }}</a>
            <a :href="acrossChainUrl">{{ $t('navs')[7] }}</a>
            <!-- <a :href="idoUrl">{{ $t('navs')[6] }}</a> -->
          </div>
        </div>
        <div class="header-right">
          <template v-if="!isConnected">
            <a href="javascript:;" class="connect" @click="connectWallet">{{$t('connect')[0]}}</a>
          </template>
          <template v-else>
            <div class="account">
              <div class="account-num">{{balance}}{{this.$store.state.coin}}</div>
              <template v-if="loading">
                <div class="loading-box"><span>Pending</span><loading></loading></div>
              </template>
              <template v-else>
                <div class="address" :title="account">{{shortenAddress(account, 4)}}</div>
              </template>
            </div>
          </template>
          <!-- <div class="theme"></div> -->
          <div class="language-wrapper" @click="changeLangHandle">
            {{langTxt}}
          </div>
        </div>
      </header>
      <div class="content">
        <div class="info">
          <h1 class="title">{{$t('invite')[0]}}</h1>
          <div class="desc">{{$t('desc')[0]}}<br/>
          {{$t('desc')[1]}}<br/>
          {{$t('desc')[2]}}<br/>
          {{$t('desc')[3]}}<br/>
          {{$t('desc')[4]}}</div>
        </div>
        <div class="about">
          <div class="count">
            <div class="block-title">
              {{$t('inviteDig')[1]}}<span>{{inviteBenefit}}</span> YOU
              <a class="toast-box">
                <img src="../assets/image/icon-question.png" alt="">
                <div>
                  {{$t('inviteDig')[8]}}
                  <i></i>
                </div>
              </a>
              <!-- {{$t('invite')[1]}}<span>{{totalNum}}</span>{{$t('invite')[2]}} -->
            </div>
            <div class="num-box">
              <div class="num-left">
                <span>{{$t('invite')[3]}}</span>
                <p>{{levelOneNum}}{{$t('invite')[2]}}</p>
              </div>
              <div class="num-right">
                <span>{{$t('invite')[4]}}</span>
                <p>{{levelTwoNum}}{{$t('invite')[2]}}</p>
              </div>
            </div>
            <div class="list">
              <div>{{$t('invite')[5]}}
                <a class="toast-box">
                  <img src="../assets/image/icon-question.png" alt="">
                  <div>
                    {{$t('notice')[0]}}
                    <i></i>
                  </div>
                </a>
              </div>
              <a href="javascript:;" :class="account ? '' : 'disabled'" @click="getInviteUrlHandle">
                <template v-if="account">
                  {{$t('invite')[7]}}
                </template>
                <template v-else>
                  {{$t('invite')[17]}}
                </template>
              </a>
              <!-- <p class="warn" v-if="isShowWarn">{{$t('invite')[17]}}</p> -->
            </div>
            <div class="list">
              <div>{{$t('invite')[6]}}
                <a class="toast-box">
                  <img src="../assets/image/icon-question.png" alt="">
                  <div class="activate-tip">
                    {{$t('notice')[1]}}
                    <i></i>
                  </div>
                </a>
              </div>
              <a href="javascript:;" :class="account ? '' : 'disabled'" @click="activateHandle">
                <template v-if="account">
                  {{$t('invite')[8]}}
                </template>
                <template v-else>
                  {{$t('index')[0]}}
                </template>
              </a>
            </div>
            <p class="tip" v-if="isShowTip">
              <template v-if="isInvited">
                {{$t('invite')[14]}} {{selfReward}}
              </template>
            </p>
          </div>
          <div class="my-invite">
            <MyInvitation
            :account="account"
            :platform="platform"
            @submit="showInviteHandle"
            @showSelfReward="showSelfRewardHandle"
            ></MyInvitation>
          </div>
        </div>
        <div class="intro">
          <h2>{{$t('intro')[0]}}</h2>
          <div class="question">
            <span>{{$t('intro')[1]}}</span>
            <p>{{$t('intro')[2]}}</p>
            <p>{{$t('intro')[3]}}</p>
          </div>
          <div class="question">
            <span>{{$t('intro')[4]}}</span>
            <p>{{$t('intro')[5]}}</p>
            <p>{{$t('intro')[6]}}</p>
            <p>{{$t('intro')[7]}}</p>
            <p>{{$t('intro')[8]}}</p>
          </div>
          <div class="question">
            <span>{{$t('intro')[9]}}</span>
            <p>{{$t('intro')[10]}}</p>
            <p>{{$t('intro')[11]}}</p>
            <p>{{$t('intro')[12]}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="h5-wrap" v-if="platform == 1">
      <header>
        <div class="header-left">
          <a :href="homeUrl" class="logo">
            <img src="../assets/image/logoPhone.png" alt="">
          </a>
          <div class="nav">
            <a :href="homeUrl">{{$t('header')[0]}}</a>
            <a :href="swapUrl">{{ $t('navs')[1] }}</a>
            <a :href="poolUrl">{{ $t('navs')[2] }}</a>
            <a class="active" href="/">{{ $t('navs')[3] }}</a>
            <a :href="chartUrl">{{ $t('navs')[4] }}</a>
            <a :href="acrossChainUrl">{{ $t('navs')[7] }}</a>
            <!-- <a :href="idoUrl">{{ $t('navs')[6] }}</a> -->
          </div>
        </div>
      </header>
      <div class="content">
        <div class="info">
          <h1 class="title">{{$t('invite')[0]}}</h1>
          <div class="desc">{{$t('desc')[0]}}</div>
        </div>
        <div class="rule">
          <img src="../assets/image/icon-mine.png" alt="">
          <h3>{{$t('desc')[1]}}</h3>
          <h3>{{$t('desc')[2]}}</h3>
          <h3>{{$t('desc')[3]}}</h3>
          <p>{{$t('desc')[4]}}</p>
        </div>
        <div class="count">
          <div class="block-title">
            {{$t('inviteDig')[1]}}<span>{{inviteBenefit}}</span> YOU
            <a class="toast-box">
              <img src="../assets/image/icon-question-h5.png" alt="">
              <div>
                {{$t('inviteDig')[8]}}
                <i></i>
              </div>
            </a>
            <!-- {{$t('invite')[1]}}<span>{{totalNum}}</span>{{$t('invite')[2]}} -->
          </div>
          <div class="num-box">
            <div class="num-left">
              <span>{{$t('invite')[3]}}</span>
              <p>{{levelOneNum}}{{$t('invite')[2]}}</p>
            </div>
            <p class="divide" :class="lang == 'en' ? 'divide-en' : ''"></p>
            <div class="num-right">
              <span>{{$t('invite')[4]}}</span>
              <p>{{levelTwoNum}}{{$t('invite')[2]}}</p>
            </div>
          </div>
          <div class="list">
            <div>{{$t('invite')[5]}}
              <a class="toast-box">
                <img src="../assets/image/icon-question-h5.png" alt="">
                <div>
                  {{$t('notice')[0]}}
                  <i></i>
                </div>
              </a>
            </div>
            <a href="javascript:;" :class="account ? '' : 'disabled'" @click="getInviteUrlHandle">
              <template v-if="account">
                {{$t('invite')[7]}}
              </template>
              <template v-else>
                {{$t('invite')[17]}}
              </template>
            </a>
            <!-- <p class="warn" v-if="isShowWarn">{{$t('invite')[17]}}</p> -->
          </div>
          <div class="list">
            <div>{{$t('invite')[6]}}
              <a class="toast-box">
                <img src="../assets/image/icon-question-h5.png" alt="">
                <div class="activate-tip">
                  {{$t('notice')[1]}}
                  <i></i>
                </div>
              </a>
            </div>
            <a href="javascript:;" :class="account ? '' : 'disabled'" @click="activateHandle">
              <template v-if="account">
                  {{$t('invite')[8]}}
                </template>
                <template v-else>
                  {{$t('index')[0]}}
                </template>
            </a>
          </div>
          <!-- <p class="tip" v-if="isShowTip">{{$t('invite')[12]}}{{userAddress}}{{$t('invite')[13]}}</p> -->
          <p class="tip" v-if="isShowTip">
              <template v-if="isInvited">
                {{$t('invite')[14]}} {{selfReward}}
              </template>
            </p>
        </div>
        <div class="my-invite">
          <MyInvitation
          :account="account"
          :platform="platform"
          @submit="showInviteHandle"
          @showSelfReward="showSelfRewardHandle"
          ></MyInvitation>
        </div>
        <div class="intro">
          <h2>{{$t('intro')[0]}}</h2>
          <div class="question">
            <span>{{$t('intro')[1]}}</span>
            <p>{{$t('intro')[2]}}</p>
            <p>{{$t('intro')[3]}}</p>
          </div>
          <div class="question">
            <span>{{$t('intro')[4]}}</span>
            <p>{{$t('intro')[5]}}</p>
            <p>{{$t('intro')[6]}}</p>
            <p>{{$t('intro')[7]}}</p>
            <p>{{$t('intro')[8]}}</p>
          </div>
          <div class="question">
            <span>{{$t('intro')[9]}}</span>
            <p>{{$t('intro')[10]}}</p>
            <p>{{$t('intro')[11]}}</p>
            <p>{{$t('intro')[12]}}</p>
          </div>
        </div>
        <MobileFooter
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
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { ethers } from 'ethers'
import bus from '../assets/script/bus'
// 邀请链接弹窗
import InviteUrl from '../components/InviteUrl';
// 激活弹窗
import Activate from '../components/Activate';
// 我的邀请
import MyInvitation from '../components/MyInvitation';
// 邀请提示弹窗
import ShareDialog from '../components/ShareDialog';
import loading from '../components/loading';
import MobileFooter from '../components/MobileFooter'

import { request, gql } from 'graphql-request';


export default {
  name: 'invite',
  components: {
    InviteUrl,
    Activate,
    MyInvitation,
    ShareDialog,
    loading,
    MobileFooter
  },
  data () {
    return {
      lang: '',
      langTxt: '',
      isShowLang: false,
      platform: 1, // 1代表h5,2代表pc
      network: true,
      isShowInviteUrl: false, // 是否显示邀请链接弹窗
      isShowActivate: false, // 是否显示激活弹窗
      isShowShare: false,
      shareAddress: '',
      isConnected: false,
      userAddress: '', // 受邀请的矿工地址
      isShowTip: false,
      isInvited: false, // 是否被邀请者
      isShowWarn: false,
      account: '',
      balance: '',
      levelOneNum: '--',
      levelTwoNum: '--',
      totalNum: 0,
      dataList: [],
      loading: false,
      homeUrl: process.env.VUE_APP_HOME_URL,
      idoUrl: process.env.VUE_APP_IDO_URL,
      swapUrl: process.env.VUE_APP_SWAP_URL,
      poolUrl: process.env.VUE_APP_POOL_URL,
      chartUrl: process.env.VUE_APP_CHART_URL,
      acrossChainUrl: process.env.VUE_APP_ACROSSCHAIN_URL,
      selfReward: 0
    }
  },
  computed: {
    ...mapState({
      inviteBenefit: state => state.inviteBenefit,
      pledgeBenefit: state => state.pledgeBenefit
    })
  },
  created() {
    let platform = this.isPC()
    if (platform) {
      this.platform = 2
    } else {
      this.platform = 1
    }
  },
  async mounted () {
    // 激活成功之后更新邀请数据
    bus.$on('showLoading', this.showLoadingHandle)
    bus.$on('closeLoading', this.closeLoadingHandle)
    this.initLangHandle()
    this.checkNetwork()
    this.accountChanged()
  },
  methods: {
    /**
     * 判断是否h5
     */
    isPC() {
      var userAgentInfo = navigator.userAgent.toLowerCase();
      var Agents = ['android', 'iphone', 'symbianOS', 'windows phone', 'ipad', 'ipod'];
      var flag = true;
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      return flag;
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
    showLoadingHandle() {
      this.loading = true
    },
    closeLoadingHandle() {
      this.loading = false
    },
    /**
     * 设置初始语言
     */
    initLangHandle() {
      let lang = 'en'
      let langTxt = 'EN'
      const localLang = localStorage.getItem('lang')
      if (localLang) {
        if (localLang == 'zh') {
          lang = 'zh'
          langTxt = 'ZH'
        }
      } else {
        // if ((navigator.language || navigator.systemLanguage).toLowerCase().indexOf('zh-cn') == -1) {
        //   lang = 'en'
        //   langTxt = 'English'
        // }
      }
      this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      localStorage.setItem('lang', lang)
      document.title = this.$t('invite')[0]
    },
    getRequest() {
      let url = location.href; //获取url中"?"符后的字串
      let theRequest = {};
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
                  this.isShowTip = true
                }
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
              this.isShowTip = true
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }
      // console.log(getUrlKey('address'))
      // if (GetRequest().share) {
      //   console.log(1)
      // }
    },
    hideLangHandle() {
      this.isShowLang = false
    },
    changeLangHandle() {
      let lang = ''
      let langTxt = ''

      if (this.langTxt === 'EN') {
        lang = "zh"
        langTxt = "ZH"
      } else if (this.langTxt === 'ZH') {
        lang = "en"
        langTxt = "EN"
      }
      this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      localStorage.setItem('lang', lang)
      document.title = this.$t('invite')[0]
    },
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
          that.isConnected = true
          that.initBalance()
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
        window.location.reload();
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
      // console.log(window.ethereum.isMetaMask)
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
        console.log('')
      }
    },
    showInviteHandle(data) {
      this.levelOneNum = data ? data.one : 0
      this.levelTwoNum = data ? data.two : 0
      this.totalNum = data ? data.total : 0
    },
    showSelfRewardHandle(data) {
      this.selfReward = data
    },
    /**
     * graph请求邀请数量
     */
    getInviteData() {
      const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
      const query = gql`
        {
          relationShips(first: 7 skip: 0, where: {owner: "${this.account.toLowerCase()}"}) {
            address
            type0
          }
          counts(where: {id: "${this.account.toLowerCase()}"}){
            total
            one
            two
          }
        }
      `
      request(endpoint, query).then((res) => {
        let data = res
        // console.log(data)
        if (data.counts.length) {
          this.levelOneNum = data.counts[0].one || 0
          this.levelTwoNum = data.counts[0].two || 0
          this.totalNum = data.counts[0].total || 0
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    activateHandle() {
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
    funcUrlDel(paramKey){
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
    closeShareHandle(data) {
      this.isShowShare = false
      if (data) {
        window.location.href = this.funcUrlDel('address')
      }
    },
    invitedSuccHandle() {
      this.userAddress = this.shortenAddress(this.shareAddress, 4)
      this.isInvited = true
      this.isShowTip = true
    },
    // successNoticeHandle(data) {
    //   this.userAddress = this.shortenAddress(data, 4)
    //   this.isShowTip = false
    // },
    getInviteUrlHandle() {
      if (!this.account) {
        this.connectWallet()
        // this.isShowWarn = true
        return
      }
      this.isShowInviteUrl = true
    },
    closeInviteUrlHandle() {
      this.isShowInviteUrl = false
    }
  }
}

</script>

<style lang="less" scoped>
  .invite {
    height: 100%;
    .pc-wrap {
      width: 100%;
      height: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      background: #F8FCFF;
      background: url('../assets/image/bg-pc.png') 0 0 no-repeat;
      background-size: 100% 381px;
      header {
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 15px 30px 0 30px;
        font-size: 16px;
        .header-left {
          display: flex;
          justify-content: center;
          .logo {
            position: relative;
            top: 3px;
          }
          .nav {
            display: flex;
            align-items: center;
            margin-left: 20px;
            a {
              font-size: 14px;
              font-weight: 600;
              color: #BFC6CB;
              margin: 0 20px;
            }
            a:hover {
              color: #fff;
            }
            .active {
              color: #fff;
            }
          }
        }
        .header-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .connect {
            height: 38px;
            line-height: 38px;
            text-align: center;
            padding: 0 15px;
            background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
            border-radius: 10px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            cursor: pointer;
          }
          .connect:hover {
            opacity: .9;
          }
          .account {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 38px;
            background: #fff;
            border-radius: 12px;
            .account-num {
              width: 92px;
              padding: 0 8px 0 12px;
              box-sizing: border-box;
              font-size: 16px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #06263C;
            }
            .address {
              width: 112px;
              height: 38px;
              line-height: 38px;
              padding: 0 16px 0 12px;
              box-sizing: border-box;
              box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
              background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
              border-radius: 12px;
              font-size: 16px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #fff;
            }
            .loading-box {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 99px;
              height: 38px;
              padding: 0 15px;
              background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
              border-radius: 12px;
              box-sizing: border-box;
              span {
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 38px;
              }
            }
          }
          .language-wrapper {
            margin-left: 10px;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            color: #06263C;
            font-weight: 500;
            background-color: #FFFDFA;
            border-radius: 10px;
            cursor: pointer;
          }
          .language-wrapper:hover {
            opacity: 0.8;
          }
        }
      }
      .content {
        flex: 1;
        .info {
          height: 328px;
          padding-top: 67px;
          box-sizing: border-box;
          width: 1200px;
          margin: 0 auto;
          .title {
            font-size: 36px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 50px;
          }
          .desc {
            margin-top: 16px;
            width: 514px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #FFFFFF;
            line-height: 24px;
          }
        }
        .about {
          width: 1200px;
          margin: 33px auto 20px;
          display: flex;
          justify-content: space-between;
          .count, .my-invite {
            width: 590px;
            height: 565px;
            padding: 40px 30px 30px;
            box-sizing: border-box;
            background: #FFFFFF;
            box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
            border-radius: 20px;
            .block-title {
              font-size: 26px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #06263C;
              span {
                margin: 0 5px 0 15px;
                font-size: 36px;
                font-family: DINPro-Bold, DINPro;
                font-weight: bold;
                line-height: 36px;
              }
              .toast-box {
                position: relative;
                display: inline-block;
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
                  bottom: 18px;
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
              }
              .toast-box:hover {
                div {
                  display: block;
                }
              }
            }
          }
          .count {
            .num-box {
              margin: 30px 0 40px;
              display: flex;
              justify-content: space-between;
              &> div {
                width: 260px;
                height: 87px;
                padding: 20px 0 0 30px;
                box-sizing: border-box;
                background: rgba(4, 67, 163, .06);
                border-radius: 11px;
                span {
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #06263C;
                  line-height: 20px;
                }
                p {
                  margin-top: 5px;
                  font-size: 16px;
                  font-family: DINPro-Medium, DINPro;
                  font-weight: 500;
                  color: #06263C;
                  line-height: 21px;
                }
              }
            }
            .list {
              margin-bottom: 30px;
              &> div {
                display: flex;
                align-items: center;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #06263C;
                line-height: 20px;
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
              }
              &> a {
                display: block;
                margin-top: 10px;
                width: 360px;
                height: 45px;
                line-height: 45px;
                text-align: center;
                background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
                border-radius: 10px;
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                cursor: pointer;
              }
              &> a:hover {
                opacity: .9;
              }
              &> a.disabled {
                background: rgba(6,38,60, .06);
                color: rgba(6, 38, 60, .5);
              }
              .warn {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #FE535B;
                line-height: 20px;
              }
            }
            .tip {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #06263C;
              line-height: 20px;
              opacity: .5;
            }
          }
        }
        .intro {
          width: 1200px;
          margin: 0 auto 90px;
          padding: 30px;
          background: #FFFFFF;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 20px;
          h2 {
            font-size: 26px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #06263C;
            line-height: 37px;
          }
          .question {
            margin-top: 20px;
            font-size: 14px;
            font-family: Avenir, Helvetica, Arial, sans-serif;
            font-weight: 500;
            color: rgba(6, 38, 60, .5);
            line-height: 24px;
          }
        }
      }
    }
    .h5-wrap {
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      background: rgba(6, 38, 60, 1);
      background: url('../assets/image/bg-h5.png') 0 0 no-repeat;
      background-size: 100% 688px;
      background-color: rgba(6, 38, 60, 1);
      padding: 31px 20px 0;
      header {
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        .header-left {
          display: flex;
          justify-content: center;
          align-items: center;
          .logo {
            width: 22px;
            height: 22px;
            img {
              width: 22px;
              height: 22px;
            }
          }
          .nav {
            display: flex;
            align-items: center;
            a {
              font-size: 14px;
              color: #BFC6CB;
              margin-left: 13px;
              opacity: .6;
              font-family: PingFangSC-Regular, PingFang SC;
            }
            a:hover {
              color: #fff;
            }
            .active {
              color: #fff;
            }
          }
        }
        .header-right {
          display: flex;
          justify-content: space-between;
          align-items: center;
          .account {
            display: flex;
            align-items: center;
            justify-content: space-between;
            height: 36px;
            background: #FFFFFF;
            border-radius: 6px;
            .connect {
              height: 36px;
              line-height: 36px;
              padding: 0 3px;
              box-sizing: border-box;
              background: linear-gradient(
        80deg
        , #35BEB1 0%, #0C979C 100%);
              box-shadow: 0px 0px 2px 0px rgba(157, 157, 158, 0.5);
              border-radius: 6px;
              font-size: 12px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #fff;
              text-align: center;
            }
            .account-num {
              width: 86px;
              padding: 0 6px;
              box-sizing: border-box;
              font-size: 12px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #06263C;
            }
            .loading-box {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 99px;
              height: 38px;
              padding: 0 15px;
              background: linear-gradient(
          80deg
          , #35BEB1 0%, #0C979C 100%);
              border-radius: 6px;
              box-sizing: border-box;
              span {
                font-size: 16px;
                font-family: PingFangSC-Medium, PingFang SC;
                font-weight: 500;
                color: #FFFFFF;
                line-height: 38px;
              }
            }
            .address {
              height: 36px;
              line-height: 36px;
              padding: 0 5px;
              box-sizing: border-box;
              box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
              background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
              border-radius: 6px;
              font-size: 12px;
              font-family: DINPro-Medium, DINPro;
              font-weight: 500;
              color: #fff;
            }
          }
          .lang-box {
            position: relative;
            margin-left: 10px;
            cursor: pointer;
            text-align: center;
            span {
              width: 67px;
              height: 36px;
              display: block;
              box-sizing: border-box;
              background: #FFFFFF;
              border-radius: 3px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #06263C;
              line-height: 36px;
            }
            div {
              width: 67px;
              position: absolute;
              left: 0;
              top: 38px;
              background: #fff;
              border-radius: 3px;
              font-size: 12px;
              p {
                height: 36px;
                line-height: 36px;
              }
            }
          }
        }
      }
      .content {
        flex: 1;
        .info {
          margin-top: 43px;
          .title {
            font-size: 30px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #FFFFFF;
            line-height: 42px;
          }
          .desc {
            margin: 14px 0 16px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(255, 255, 255, .5);
            line-height: 24px;
          }
        }
        .rule {
          position: relative;
          padding: 30px 20px;
          border-radius: 16px;
          background: linear-gradient(180deg, #11476E 0%, #0B304A 100%, #0B304A 100%);
          img {
            position: absolute;
            right: 0;
            bottom: 0;
            width: 108px;
            height: 108px;
          }
          h3 {
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #FFFFFF;
            line-height: 26px;
          }
          p {
            margin-top: 10px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(255, 255, 255, .5);
            line-height: 24px;
          }
        }
        .count, .my-invite {
          margin-top: 10px;
          padding: 27px 20px 30px;
          background: #0B304A;
          border-radius: 16px;
          .block-title {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #fff;
            line-height: 25px;
            span {
              margin: 0 5px 0 15px;
              font-size: 36px;
              font-family: DINPro-Bold, DINPro;
              font-weight: bold;
              line-height: 36px;
            }
            .toast-box {
              position: relative;
              display: inline-block;
              width: 16px;
              height: 16px;
              margin-left: 6px;
              img {
                width: 16px;
                height: 16px;
              }
              div {
                position: absolute;
                right: -42px;
                bottom: 23px;
                width: 100px;
                background: #FFFFFF;
                box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
                border-radius: 10px;
                padding: 10px;
                font-size: 12px;
                line-height: 16px;
                text-align: left;
                color: rgba(6, 38, 60, 0.5);
                display: none;
                i {
                  position: absolute;
                  bottom: -12px;
                  right: 43px;
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
        }
        .count {
          .num-box {
            margin: 30px 0 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 63px;
            background: #FFFDFC;
            border-radius: 10px;
            &> div {
              // padding: 8px 0 0 20px;
              border-radius: 11px;
              span {
                font-size: 15px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: rgba(11, 48, 74, .5);
                line-height: 20px;
              }
              p {
                margin-top: 5px;
                font-size: 16px;
                font-family: DINPro-Medium, DINPro;
                font-weight: 500;
                color: #0B304A;
                line-height: 21px;
              }
            }
            &> p {
              margin: 0 30px 0 30px;
              width: 1px;
              height: 31px;
              background: rgba(11, 48, 74, .15)
            }
            &> .divide-en {
              margin: 0 10px 0 10px;
            }
          }
          .list {
            margin-top: 32px;
            &> div {
              display: flex;
              align-items: center;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #fff;
              line-height: 20px;
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
                  bottom: 26px;
                }
              }
              .toast-box:hover {
                div {
                  display: block;
                }
              }
            }
            &> a {
              display: block;
              margin-top: 10px;
              height: 45px;
              line-height: 45px;
              text-align: center;
              background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
              border-radius: 10px;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #FFFFFF;
            }
            &> a.disabled {
              background: rgba(255, 255, 255, .5);
              color: rgba(6, 38, 60, 1);
            }
            .warn {
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                color: #FE535B;
                line-height: 20px;
              }
          }
          .tip {
            margin-top: 20px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: rgba(255, 255, 255, .5);
            line-height: 17px;
          }
        }
        .intro {
          margin: 10px auto 42px;
          padding: 30px 20px 24px;
          background: #0B304A;
          border-radius: 16px;
          h2 {
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #fff;
            line-height: 25px;
          }
          .question {
            margin-top: 12px;
            font-size: 14px;
            font-family: Avenir, Helvetica, Arial, sans-serif;
            font-weight: 500;
            color: rgba(255, 255, 255, .5);
            line-height: 24px;
          }
        }
      }
    }
  }
</style>
