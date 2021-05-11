<template>
  <div class="invite"
       @click="hideLangHandle">
    <div class="pc-wrap"
         v-if="platform == 2">
      <header>
        <youswap-header :nowEnv="nowEnv"
                        :actived="actived"
                        :chainId="headChainId"></youswap-header>
        <div class="header-right">
          <template v-if="!isConnected">
            <a href="javascript:;"
               class="connect"
               @click="connectWallet">{{$t('connect')[0]}}</a>
          </template>
          <template v-else>
            <div class="account">
              <div class="account-num">{{balance}}{{this.$store.state.coin}}</div>
              <template v-if="loading">
                <div class="loading-box"><span>Pending</span>
                  <loading></loading>
                </div>
              </template>
              <template v-else>
                <div class="address"
                     :title="account">{{shortenAddress(account, 4)}}</div>
              </template>
            </div>
          </template>
          <!-- <div class="theme"></div> -->
          <div class="language-wrapper"
               @click="changeLangHandle">
            {{langTxt}}
          </div>
        </div>
      </header>
      <div class="content">
        <div class="info">
          <div class="info-left">
            <h1 class="title">{{$t('invite')[0]}}</h1>
            <div class="desc">{{$t('exchangeDig')[0]}}<br />
              {{$t('exchangeDig')[1]}}<br />
              {{$t('exchangeDig')[2]}}<br />
              {{$t('exchangeDig')[3]}}<br />
            </div>
            <a href="javascript:;"
               class="btn-poster"
               :class="[account ? '' : 'disabled', lang == 'en' ? 'en-version' : '']"
               @click="getInviteUrlHandle">
              <template v-if="account">
                <span>
                  {{$t('exchangeDig')[4]}}
                </span>
                <img src="../assets/image/btn-arrow.png"
                     alt="">
              </template>
              <template v-else>
                {{$t('invite')[17]}}
              </template>
            </a>
          </div>
          <div class="info-right">
            <img src="../assets/image/banner.png"
                 alt="">
          </div>
        </div>
        <div class="my-benefit">
          <h3>{{$t('exchangeDig')[5]}}</h3>
          <div class="benefit-content">
            <div class="chart">
              <div id="chart-box"></div>
            </div>
            <div class="list-box">
              <div class="list-top">
                <div>
                  <span><template v-if="selfBenefitPlus != '--'">$</template>{{getDecimalsCoinFn(selfBenefitPlus, 2)}}</span>
                  <p>{{$t('exchangeDig')[7]}}
                    <a class="toast-box">
                      <img src="../assets/image/question-pc.png"
                           alt="">
                      <div>
                        {{$t('exchangeDig')[10]}}
                        <i></i>
                      </div>
                    </a>
                  </p>
                </div>
                <div class="second">
                  <span><template v-if="invitePledgeBenefit != '--'">$</template>{{getDecimalsCoinFn(invitePledgeBenefit, 2)}}</span>
                  <p>{{$t('exchangeDig')[8]}}</p>
                </div>
                <div class="third">
                  <span><template v-if="inviteExchangeBenefit != '--'">$</template>{{getDecimalsCoinFn(inviteExchangeBenefit, 2)}}</span>
                  <p>{{$t('exchangeDig')[9]}}</p>
                </div>
              </div>
              <p>{{$t('exchangeDig')[11]}}</p>
              <a href="javascript:;"
                 :class="[account ? '' : 'disabled']"
                 @click="activateHandle">
                <template v-if="account">
                  {{$t('invite')[8]}}
                </template>
                <template v-else>
                  {{$t('index')[0]}}
                </template>
              </a>
            </div>
          </div>
        </div>
        <div class="my-invitation">
          <MyInvitation :account="account"
                        :platform="platform"></MyInvitation>
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
            <p>{{$t('intro')[9]}}</p>
            <p>{{$t('intro')[10]}}</p>
            <p>{{$t('intro')[11]}}</p>
            <p>{{$t('intro')[12]}}</p>
          </div>
          <div class="question">
            <p>{{$t('intro')[13]}}</p>
            <p>{{$t('intro')[14]}}</p>
            <p>{{$t('intro')[15]}}</p>
            <p>{{$t('intro')[16]}}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="h5-wrap"
         v-if="platform == 1">
      <header>
        <youswap-header :nowEnv="nowEnv"
                        :actived="actived"
                        :chainId="headChainId" />
      </header>
      <div class="content">
        <div class="info">
          <div class="info-left">
            <h1 class="title">{{$t('invite')[0]}}</h1>
            <div class="desc">
              <p class="ellipsis2">{{$t('exchangeDig')[0]}}</p>
              <a class="toast-box">
                <span><i>...</i><strong>{{$t('exchangeDig')[18]}}</strong></span>
                <div>
                  {{$t('exchangeDig')[0]}}<br />
                  {{$t('exchangeDig')[1]}}<br />
                  {{$t('exchangeDig')[2]}}<br />
                  {{$t('exchangeDig')[3]}}<br />
                  <!-- <i></i> -->
                </div>
              </a>
            </div>
            <a href="javascript:;"
               class="btn-poster"
               :class="[account ? '' : 'disabled', lang == 'en' ? 'en-version' : '']"
               @click="getInviteUrlHandle">
              <template v-if="account">
                <span>
                  {{$t('exchangeDig')[4]}}
                </span>
                <img src="../assets/image/btn-arrow.png"
                     alt="">
              </template>
              <template v-else>
                {{$t('invite')[17]}}
              </template>
            </a>
          </div>
          <div class="info-right">
            <img src="../assets/image/banner-h5.png"
                 alt="">
          </div>
        </div>
        <!-- <div class="rule">
          <img src="../assets/image/icon-mine.png"
               alt="">
          <h3>{{$t('exchangeDig')[1]}}</h3>
          <h3>{{$t('exchangeDig')[2]}}</h3>
          <h3>{{$t('exchangeDig')[3]}}</h3>
        </div> -->
        <div class="main-content">
          <div class="my-benefit">
            <h3>{{$t('exchangeDig')[5]}}</h3>
            <div class="benefit-content">
              <div class="chart">
                <div id="chart-box"></div>
              </div>
              <div class="list-box">
                <div class="list-top">
                  <div>
                    <p>{{$t('exchangeDig')[7]}}
                      <a class="toast-box">
                        <img src="../assets/image/question-h5.png"
                             alt="">
                        <div>
                          {{$t('exchangeDig')[10]}}
                          <i></i>
                        </div>
                      </a>
                    </p>
                    <span><template v-if="selfBenefitPlus != '--'">$</template>{{getDecimalsCoinFn(selfBenefitPlus, 2)}}</span>
                  </div>
                  <div class="second">
                    <p>{{$t('exchangeDig')[8]}}</p>
                    <span><template v-if="invitePledgeBenefit != '--'">$</template>{{getDecimalsCoinFn(invitePledgeBenefit, 2)}}</span>
                  </div>
                  <div class="third">
                    <p>{{$t('exchangeDig')[9]}}</p>
                    <span><template v-if="inviteExchangeBenefit != '--'">$</template>{{getDecimalsCoinFn(inviteExchangeBenefit, 2)}}</span>
                  </div>
                </div>
                <p>{{$t('inviteDig')[3]}}
                  <a class="toast-box">
                    <img src="../assets/image/question-h5.png"
                         alt="">
                    <div>
                      {{$t('exchangeDig')[11]}}
                      <i></i>
                    </div>
                  </a>
                </p>
                <a href="javascript:;"
                   :class="[account ? '' : 'disabled']"
                   @click="activateHandle">
                  <template v-if="account">
                    {{$t('invite')[8]}}
                  </template>
                  <template v-else>
                    {{$t('index')[0]}}
                  </template>
                </a>
              </div>
            </div>
          </div>
          <div class="my-invitation">
            <MyInvitation :account="account"
                          :platform="platform"></MyInvitation>
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
              <p>{{$t('intro')[9]}}</p>
              <p>{{$t('intro')[10]}}</p>
              <p>{{$t('intro')[11]}}</p>
              <p>{{$t('intro')[12]}}</p>
            </div>
            <div class="question">
              <p>{{$t('intro')[13]}}</p>
              <p>{{$t('intro')[14]}}</p>
              <p>{{$t('intro')[15]}}</p>
              <p>{{$t('intro')[16]}}</p>
            </div>
          </div>
        </div>
        <MobileFooter :isConnected="isConnected" />
      </div>
    </div>
    <template v-if="isShowInviteUrl">
      <InviteUrl :account="account"
                 :platform="platform"
                 @cancel="closeInviteUrlHandle"></InviteUrl>
    </template>
    <div v-show="isShowActivate">
      <Activate :platform="platform"
                :account="account"
                @updateAccount="updateAccountHandle"
                @cancel="closeActivateHandle"></Activate>
    </div>
    <div v-show="isShowShare">
      <ShareDialog :platform="platform"
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
import Cookies from 'js-cookie'
import * as echarts from 'echarts'

import abiMining from '../abi-mining.json'
import { getDecimalsCoin } from '../utils'


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
      dataList: [],
      loading: false,
      actived: 2,
      nowEnv: process.env.VUE_APP_ENV,
      pledgeBenefit: 0,
      invitePledgeBenefit: '--',
      inviteExchangeBenefit: '--',
      inviteExchangeBenefitBonus: '--',
      YouPrice: '',
      headChainId: '128'
    }
  },
  computed: {
    selfBenefitPlus () {
      if (this.invitePledgeBenefit != '--' && this.inviteExchangeBenefit != '--' && this.inviteExchangeBenefitBonus != '--' && this.YouPrice) {
        let num = this.pledgeBenefit * this.YouPrice / 20 + this.inviteExchangeBenefitBonus
        this.initChart(num, this.invitePledgeBenefit, this.inviteExchangeBenefit)
        return num
      } else {
        return '--'
      }
    },
    ...mapState({
      chainId: state => state.chainId
    })
  },
  created () {
    let platform = this.isPC()
    if (platform) {
      this.platform = 2
    } else {
      this.platform = 1
    }
  },
  async mounted () {
    // 连接钱包
    bus.$on('connectWallet', this.connectWallet)
    // 激活成功之后更新邀请数据
    bus.$on('showLoading', this.showLoadingHandle)
    bus.$on('closeLoading', this.closeLoadingHandle)

    this.initLangHandle()
    setTimeout(() => {
      this.checkNetwork()
    }, 500)
    this.accountChanged()
  },
  methods: {
    /**
     * 判断是否h5
     */
    isPC () {
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
    shortenAddress (address, chars, type) {
      let label = '...'
      if (type == 1) {
        label = '...'
      } else if (type == 2) {
        label = '****'
      }
      return `${address.substring(0, chars)}${label}${address.substring(42 - chars)}`
    },
    showLoadingHandle () {
      this.loading = true
    },
    closeLoadingHandle () {
      this.loading = false
    },
    /**
     * 截取小数精度
     */
    getDecimalsCoinFn (number, decimal) {
      return getDecimalsCoin(number, decimal)
    },
    /**
     * 设置初始语言
     */
    initLangHandle () {
      let lang = 'en'
      let langTxt = 'EN'
      const localLang = Cookies.get('lang') && typeof Cookies.get('lang') === 'string' ? Cookies.get('lang').toLowerCase() : ''
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
      Cookies.set('lang', lang.toUpperCase(), { domain: `${process.env.VUE_APP_DOMAIN}` })
      document.title = this.$t('invite')[0]
    },
    getRequest () {
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
    checkShare () {
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
              this.getYouPrice()
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
            if (res.relationShip && res.relationShip.owner && res.relationShip.owner != '0x0000000000000000000000000000000000000000') {
              this.userAddress = this.shortenAddress(res.relationShip.owner, 4)
              this.isInvited = true
              this.isShowTip = true
            }
            this.getYouPrice()
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
    hideLangHandle () {
      this.isShowLang = false
    },
    changeLangHandle () {
      let lang = ''
      let langTxt = ''

      if (this.langTxt === 'EN') {
        lang = "zh"
        langTxt = "ZH"
      } else if (this.langTxt === 'ZH') {
        lang = "en"
        langTxt = "EN"
      }
      // this.$i18n.locale = lang
      this.lang = lang
      this.langTxt = langTxt
      Cookies.set('lang', lang.toUpperCase(), { domain: `${process.env.VUE_APP_DOMAIN}` })
      localStorage.setItem('lang', lang)
      document.title = this.$t('invite')[0]
      location.reload();
    },
    sendRequest (param, cb) {
      let provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.provider.sendAsync(param, function (err, res) {
        if (!err && res.error) err = new Error('EthQuery - RPC Error - ' + res.error.message)
        if (err) return cb(err)
        cb(null, res)
      })
    },
    /**
     * 检测网络
     */
    checkNetwork () {
      if (!window.ethereum) {
        this.$message.error(this.$t('connect')[2])
        return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      provider.getNetwork().then(Network => {
        if (Network.chainId.toString() != process.env.VUE_APP_HECO_CHAINID) {
          this.$message.error(this.$t('index')[6])
          this.network = false
          this.initChart('--')
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
        if (err && err.code == 4001) {
          window.location.reload()
        }
      })
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
          that.isConnected = true
          that.initBalance()
        } else {
          that.initChart('--')
        }
        that.checkShare()
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
        }
      })
    },
    /**
     * 切换账户之后的回调
     */
    accountChanged () {
      let that = this
      if (!window.ethereum) return
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
        window.open('https://metamask.io/', '_self')
      }
    },
    activateHandle () {
      if (!this.account) {
        this.connectWallet()
        return
      }
      this.isShowActivate = true
    },
    updateAccountHandle () {
      this.initBalance()
    },
    closeActivateHandle () {
      this.isShowActivate = false
    },
    funcUrlDel (paramKey) {
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
    closeShareHandle (data) {
      this.isShowShare = false
      if (data) {
        window.location.href = this.funcUrlDel('address')
      }
    },
    invitedSuccHandle () {
      this.userAddress = this.shortenAddress(this.shareAddress, 4)
      this.isInvited = true
      this.isShowTip = true
    },
    // successNoticeHandle(data) {
    //   this.userAddress = this.shortenAddress(data, 4)
    //   this.isShowTip = false
    // },
    getInviteUrlHandle () {
      if (!this.account) {
        this.connectWallet()
        // this.isShowWarn = true
        return
      }
      this.isShowInviteUrl = true
    },
    closeInviteUrlHandle () {
      this.isShowInviteUrl = false
    },
    // 获取YOU的折UDST价格
    getYouPrice () {
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
          console.log(this.YouPrice)
          this.getExchangeBenefit()
          this.getExchangeBenefitBonus()
          this.getInviteBenefit()
        }
      })
    },
    /**
     * 获取挖矿合约实例
     */
    getContract () {
      const contractAddress = process.env.VUE_APP_MINING_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abiMining, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    /**
     * 获取质押收益
     */
    async getInviteBenefit () {
      let contract = await this.getContract()
      contract.rewardInfos(this.account).then(data => {
        let inviteBenefit = ethers.utils.formatUnits(data.inviteReward.toString(), 6)
        let pledgeBenefit = ethers.utils.formatUnits(data.pledgeReward.toString(), 6)
        let dis
        console.log(inviteBenefit)
        console.log(pledgeBenefit)
        this.pledgeBenefit = pledgeBenefit
        if (this.isInvited) {
          dis = inviteBenefit - pledgeBenefit / 20
        } else {
          dis = inviteBenefit
        }
        this.invitePledgeBenefit = dis > 0 ? dis : 0

        this.invitePledgeBenefit = this.invitePledgeBenefit * this.YouPrice
      }).catch(err => {
        console.log(err)
      })
    },
    /**
     * 获取邀请交易收益
     */
    getExchangeBenefit () {
      let param = {
        address: this.account,
        chain: 'heco'
      }
      this.$post(process.env.VUE_APP_INVITE_API + 'v1/airdrop/Friend', param).then(res => {
        this.inviteExchangeBenefit = isNaN(res.friend) ? '--' : res.friend
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * 获取交易收益加成
     */
    getExchangeBenefitBonus () {
      let param = {
        address: this.account,
        chain: 'heco'
      }
      this.$post(process.env.VUE_APP_INVITE_API + 'v1/airdrop/Bonus', param).then(res => {
        this.inviteExchangeBenefitBonus = isNaN(res.bonus) ? '--' : res.bonus * this.YouPrice
      }).catch((err) => {
        console.log(err)
      })
    },
    initChart (num1, num2, num3) {
      var chartDom = document.getElementById('chart-box');
      var myChart = echarts.init(chartDom);
      var option;
      var total;

      if (isNaN(num1) || isNaN(num2) || isNaN(num3)) {
        option = {
          title: {
            text: '--',
            subtext: this.$t('exchangeDig')[6],
            x: 'center',
            y: this.platform == 2 ? '40%' : '38%',
            textStyle: {
              fontFamily: 'DINPro-Medium, DINPro'
            },
            subtextStyle: {
              color: '#6A7D8A',
              width: this.platform == 2 ? '200' : '80',
              overflow: 'breakAll'
            },
          },
          color: [
            '#dcdfe6',
          ],
          tooltip: {
            trigger: 'item',
            formatter: () => {
              return this.$t('exchangeDig')[6] + ': --';
            },
            position: 'inside',
            textStyle: {
              fontSize: 12
            },
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 5
              },
              minAngle: 7,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 0, name: this.$t('exchangeDig')[6] },
              ]
            }
          ]
        };
      } else {
        total = parseFloat(num1, 10) + parseFloat(num2, 10) + parseFloat(num3, 10)
        option = {
          title: {
            text: '$' + this.getDecimalsCoinFn(total, 2),
            subtext: this.$t('exchangeDig')[6],
            x: 'center',
            y: this.platform == 2 ? '40%' : '38%',
            textStyle: {
              fontFamily: 'DINPro-Medium, DINPro'
            },
            subtextStyle: {
              color: '#6A7D8A',
              width: this.platform == 2 ? '200' : '80',
              overflow: 'breakAll'
            },
          },
          color: [
            '#FE535B',
            '#FB9410',
            '#35BDB1'
          ],
          tooltip: {
            trigger: 'item',
            formatter: "{b} : {d}%",
            position: 'inside',
            textStyle: {
              fontSize: 12
            },
          },
          series: [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 5
              },
              minAngle: 7,
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: num1 / total, name: this.$t('exchangeDig')[7] },
                { value: num2 / total, name: this.$t('exchangeDig')[8] },
                { value: num3 / total, name: this.$t('exchangeDig')[9] }
              ]
            }
          ]
        };
        if (total <= 0) {
          option.color = [
            '#35BDB1'
          ];
          option.series = [
            {
              type: 'pie',
              radius: ['50%', '70%'],
              itemStyle: {
                borderColor: '#fff',
                borderWidth: 5
              },
              avoidLabelOverlap: false,
              label: {
                show: false,
                position: 'center'
              },
              labelLine: {
                show: false
              },
              data: [
                { value: 0, name: this.$t('exchangeDig')[6] },
              ]
            }
          ];
        }
      }

      option && myChart.setOption(option);
    }
  }
}

</script>

<style lang="less" scoped>
.invite {
  height: 100%;
  background-color: #f8fcff;
  .pc-wrap {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background: url("../assets/image/bg-pc-new.png") 0 0 no-repeat;
    background-size: 100% 400px;
    header {
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 30px 0 30px;
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
            color: #bfc6cb;
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
        padding: 15px 0 0 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .connect {
          height: 38px;
          line-height: 38px;
          text-align: center;
          padding: 0 15px;
          background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
          border-radius: 10px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          cursor: pointer;
        }
        .connect:hover {
          opacity: 0.9;
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
            color: #06263c;
          }
          .address {
            width: 112px;
            height: 38px;
            line-height: 38px;
            padding: 0 16px 0 12px;
            box-sizing: border-box;
            box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
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
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
            border-radius: 12px;
            box-sizing: border-box;
            span {
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
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
          color: #06263c;
          font-weight: 500;
          background-color: #fffdfa;
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
        width: 1200px;
        height: 351px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        .info-left {
          width: 440px;
          padding: 59px 0 0 0;
          box-sizing: border-box;
          .title {
            font-size: 40px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            line-height: 50px;
          }
          .desc {
            margin-top: 16px;
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(228, 232, 234, 0.8);
            line-height: 22px;
          }
          .btn-poster {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 30px;
            width: 260px;
            height: 50px;
            background: linear-gradient(72deg, #34bdb0 0%, #0c979c 100%);
            border-radius: 35px;
            padding: 0 30px;
            box-sizing: border-box;
            span {
              font-size: 20px;
              font-family: PingFangSC-Medium, PingFang SC;
              color: #ffffff;
            }
            img {
              width: 30px;
              height: 30px;
            }
          }
          .btn-poster:hover {
            opacity: 0.9;
          }
          .disabled {
            background: rgba(255, 255, 255, 0.5);
            color: rgba(6, 38, 60, 1);
            justify-content: center;
          }
        }
        .info-right {
          img {
            width: 572px;
            height: 358px;
          }
        }
      }
      .my-benefit {
        width: 1200px;
        height: 405px;
        padding: 30px;
        box-sizing: border-box;
        margin: 30px auto 0;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid #f0f2f6;
        h3 {
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #06263c;
          line-height: 25px;
        }
        .benefit-content {
          margin-top: 30px;
          display: flex;
          justify-content: space-between;
          .chart {
            margin-left: 62px;
            width: 300px;
            height: 300px;
            position: relative;
            #chart-box {
              position: absolute;
              top: -15px;
              width: 300px;
              height: 300px;
            }
          }
          .list-box {
            width: 640px;
            .list-top {
              height: 125px;
              display: flex;
              justify-content: space-between;
              & > div {
                width: 200px;
                height: 125px;
                background: #ffffff;
                box-shadow: 0px 2px 8px 3px rgba(0, 0, 0, 0.08);
                border-radius: 20px;
                padding: 30px 0 0;
                box-sizing: border-box;
                text-align: center;
                span {
                  font-size: 26px;
                  font-family: DINPro-Medium, DINPro;
                  font-weight: 500;
                  color: #fe535b;
                  line-height: 33px;
                }
                p {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  margin-top: 12px;
                  font-size: 14px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  color: #6a7d8a;
                  .toast-box {
                    position: relative;
                    display: inline-block;
                    width: 14px;
                    height: 14px;
                    margin-left: 6px;
                    img {
                      width: 14px;
                      height: 14px;
                    }
                    div {
                      position: absolute;
                      left: -14px;
                      bottom: 21px;
                      width: 316px;
                      background: #ffffff;
                      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
                      border-radius: 10px;
                      padding: 10px;
                      font-size: 12px;
                      color: rgba(6, 38, 60, 0.5);
                      display: none;
                      text-align: left;
                      line-height: 20px;
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
              & > div.second {
                span {
                  color: #fb9410;
                }
              }
              & > div.third {
                span {
                  color: #35bdb1;
                }
              }
            }
            & > p {
              margin: 30px 0 20px;
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #6a7d8a;
              line-height: 20px;
            }
            & > a {
              display: block;
              width: 640px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              background: linear-gradient(72deg, #34bdb0 0%, #0c979c 100%);
              border-radius: 10px;
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              color: #ffffff;
            }
            & > a:hover {
              opacity: 0.9;
            }
            & > a.disabled {
              background: rgba(6, 38, 60, 0.06);
              color: rgba(6, 38, 60, 0.5);
            }
          }
        }
      }
      .my-invitation {
        width: 1200px;
        max-height: 510px;
        padding: 30px 0 30px;
        box-sizing: border-box;
        margin: 30px auto 30px;
        background: #ffffff;
        border-radius: 20px;
        border: 1px solid #f0f2f6;
      }
      .intro {
        width: 1200px;
        margin: 0 auto 90px;
        padding: 30px;
        border: 1px solid #f0f2f6;
        background: #ffffff;
        border-radius: 20px;
        h2 {
          font-size: 18px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #06263c;
          line-height: 25px;
        }
        .question {
          margin-top: 20px;
          font-size: 14px;
          font-family: Avenir, Helvetica, Arial, sans-serif;
          font-weight: 500;
          color: rgba(6, 38, 60, 0.5);
          line-height: 24px;
          span {
            color: #385163;
          }
        }
      }
    }
  }
  .h5-wrap {
    width: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background: linear-gradient(90deg, #122363 0%, #01091f 100%);
    header {
      padding: 0 20px;
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
            color: #bfc6cb;
            margin-left: 13px;
            opacity: 0.6;
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
          background: #ffffff;
          border-radius: 6px;
          .connect {
            height: 36px;
            line-height: 36px;
            padding: 0 3px;
            box-sizing: border-box;
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
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
            color: #06263c;
          }
          .loading-box {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 99px;
            height: 38px;
            padding: 0 15px;
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
            border-radius: 6px;
            box-sizing: border-box;
            span {
              font-size: 16px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #ffffff;
              line-height: 38px;
            }
          }
          .address {
            height: 36px;
            line-height: 36px;
            padding: 0 5px;
            box-sizing: border-box;
            box-shadow: 0px 0px 4px 0px rgba(157, 157, 158, 0.5);
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
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
            background: #ffffff;
            border-radius: 3px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #06263c;
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
          .toast-box:hover {
            div {
              display: block;
            }
          }
        }
      }
    }
    .content {
      flex: 1;
      border-radius: 20px 20px 0px 0px;
      .info {
        margin: 10px auto 0;
        display: flex;
        justify-content: space-between;
        .info-left {
          width: 44%;
          box-sizing: border-box;
          padding: 17px 0 0 15px;
          .title {
            font-size: 20px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #ffffff;
            line-height: 28px;
          }
          .desc {
            position: relative;
            margin-top: 4px;
            p {
              width: 88%;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: rgba(255, 255, 255, 0.6);
              line-height: 17px;
            }
            .toast-box {
              position: absolute;
              right: 0;
              bottom: 0;
              line-height: 16px;
              span {
                padding-left: 5px;
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                background: #0b1744;
                i {
                  color: rgba(255, 255, 255, 0.6);
                }
                strong {
                  color: #35bdb1;
                  text-decoration: underline;
                }
              }
              div {
                position: absolute;
                left: -103px;
                top: 26px;
                width: 246px;
                background: #ffffff;
                box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
                border-radius: 10px;
                padding: 10px;
                font-size: 12px;
                line-height: 17px;
                text-align: left;
                color: #565656;
                font-family: PingFangSC-Regular, PingFang SC;
                z-index: 100;
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
          .btn-poster {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 10px;
            width: 144px;
            height: 30px;
            background: linear-gradient(71deg, #35beb1 0%, #0c979c 100%);
            border-radius: 15px;
            padding: 0 10px;
            box-sizing: border-box;
            span {
              font-size: 14px;
              font-family: PingFangSC-Regular, PingFang SC;
              color: #ffffff;
              line-height: 20px;
            }
            img {
              width: 14px;
              height: 14px;
            }
          }
          .btn-poster.en-version {
            width: 150px;
          }
          .btn-poster:hover {
            opacity: 0.9;
          }
          .disabled {
            background: rgba(255, 255, 255, 0.5);
            color: rgba(6, 38, 60, 1);
            font-size: 12px;
          }
        }
        .info-right {
          width: 56%;
          height: 151px;
          img {
            width: 100%;
          }
        }
      }
      .main-content {
        background: #f8fcff;
        padding: 20px 15px 100px;
        border-radius: 20px 20px 0px 0px;
        .my-benefit {
          background: #ffffff;
          border-radius: 10px;
          border: 1px solid #f0f2f6;
          padding: 20px 20px 20px 0;
          h3 {
            margin: 0 0 0 20px;
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            color: #06263c;
            line-height: 22px;
          }
          .benefit-content {
            display: flex;
            justify-content: space-between;
          }
          .chart {
            position: relative;
            width: 170px;
            #chart-box {
              position: absolute;
              left: -10px;
              top: 7px;
              width: 230px;
              height: 230px;
            }
            @media screen and (max-width: 375px) {
              #chart-box {
                position: absolute;
                left: -10px;
                top: 15px;
                width: 200px;
                height: 200px;
              }
            }
            @media screen and (max-width: 320px) {
              #chart-box {
                position: absolute;
                left: -10px;
                top: 38px;
                width: 160px;
                height: 160px;
              }
            }
          }
          .list-box {
            margin: 20px 0 0 0;
            .list-top {
              & > div {
                margin-bottom: 10px;
                p {
                  display: flex;
                  position: relative;
                  font-size: 12px;
                  padding-left: 20px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #06263c;
                  line-height: 17px;
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
                      width: 200px;
                      background: #ffffff;
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
                        right: 15px;
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
                p:before {
                  content: "";
                  position: absolute;
                  top: 7px;
                  left: 10px;
                  display: block;
                  width: 4px;
                  height: 4px;
                  background: #fe535b;
                  border-radius: 1px;
                }
                & > span {
                  margin: 4px 0 0 20px;
                  font-size: 14px;
                  font-family: DINPro-Medium, DINPro;
                  font-weight: 500;
                  color: #fe535b;
                  line-height: 18px;
                }
              }
              .second {
                p:before {
                  background: #fb9410;
                }
                & > span {
                  color: #fb9410;
                }
              }
              .third {
                p:before {
                  background: #35bdb1;
                }
                & > span {
                  color: #35bdb1;
                }
              }
            }
            & > p {
              display: flex;
              margin-left: 20px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #06263c;
              line-height: 17px;
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
                  width: 200px;
                  background: #ffffff;
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
                    right: 15px;
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
            & > a {
              margin: 5px 0 0 20px;
              display: block;
              width: 110px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              background: linear-gradient(71deg, #35beb1 0%, #0c979c 100%);
              border-radius: 10px;
              font-size: 14px;
              font-family: PingFangSC-Medium, PingFang SC;
              color: #ffffff;
            }
            & > a:hover {
              opacity: 0.9;
            }
            & > a.disabled {
              display: flex;
              align-items: center;
              justify-content: center;
              background: rgba(6, 38, 60, 0.06);
              color: rgba(6, 38, 60, 0.5);
              font-size: 12px;
              line-height: 14px;
            }
          }
        }
      }
      .my-invitation {
        padding: 20px 0 20px;
        box-sizing: border-box;
        margin: 20px auto 20px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #f0f2f6;
      }
      .intro {
        margin: 0 auto 0;
        padding: 20px 20px 24px;
        background: #ffffff;
        border-radius: 10px;
        border: 1px solid #f0f2f6;
        h2 {
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #06263c;
          line-height: 22px;
        }
        .question {
          margin-top: 12px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #6a7d8a;
          line-height: 20px;
          span {
            font-family: PingFangSC-Medium, PingFang SC;
            color: #385163;
          }
        }
      }
    }
  }
}
</style>
