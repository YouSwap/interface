<template>
  <div class="container">
    <div class="content-wrap-mobile">
      <div class="create_coin_mobile">
        <div class="header-title"
             :class="currentChainId == 56 ? 'header-title-bsc' : ''">
          <p :class="currentChainId == 56 ? 'title-img-bsc' : 'title-img-heco'">
            <img v-if="currentChainId == 56"
                 :src="bscImg"
                 alt="">
            <img :src="hecoImg"
                 alt=""
                 v-else>
          </p>
          <div class="title-text">
            <span class="spanTop">{{$t('create') + coinContentType + $t('token')}}</span>
            <span class="spanBottom">{{$t('leftDes')}}</span>
            <div class="desc-wrap"
                 @click="handleCoinTypeClick">
              <span class="desc">{{$t('coinTypeDesc')}}</span>
              <img class="desc-img"
                   :src="nextImg"
                   alt="">
            </div>
          </div>
        </div>
        <div class="input-content">
          <div class="input-list">
            <span>{{$t('tokenType')}}</span>
            <p @click="handleTokenTypeClick"><span>{{coinType}}</span>
              <img :src="changeImg"
                   alt="">
            </p>
          </div>
          <div class="input-list">
            <span>{{$t('tokenName')}}</span>
            <el-input v-model="name"
                      maxlength="64"
                      :placeholder="$t('charactorsTips')"></el-input>
          </div>
          <div class="input-list">
            <span>{{$t('tokenAbbreviation')}}</span>
            <el-input v-model="symbol"
                      maxlength="11"
                      :placeholder="$t('charactorsTipsSymbol')"></el-input>
          </div>
          <div class="input-list">
            <span>{{$t('totalSupplay')}}</span>
            <el-input v-model="totalSupply"
                      maxlength="15"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="0-999,999,999,999,999"></el-input>
          </div>
          <div class="input-list">
            <span>{{$t('decimal')}}</span>
            <el-input v-model="decimals"
                      oninput="value=value.replace(/[^\d]/g,'')"
                      placeholder="18"></el-input>
          </div>
          <div class="moon-select"
               v-if="tokenSelectType === 3">
            <span class="moon-title">{{$t('settings')}}</span>
            <div class="arg-card">
              <div class="card-left">
                <span>{{$t('feeRatio')}}</span>
                <span>{{poundage}}%</span>
              </div>
              <div class="card-right">
                <div class="card-right-left">
                  <span>{{$t('dividendsRatio')}}</span>
                  <div class="card-input">
                    <input placeholder="5"
                           maxlength="2"
                           type="tel"
                           v-model="bonusPercent" />
                    <span>%</span>
                  </div>

                </div>
                <div class="card-right-middle">+</div>
                <div class="card-right-right">
                  <span>{{$t('liquidityRatio')}}</span>
                  <div class="card-input">
                    <input placeholder="5"
                           maxlength="2"
                           type="tel"
                           v-model="liquidityPercent" />
                    <span>%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="input-list disabled-input address-line">
            <div><span>{{$t('receivAddress')}}</span></div>
            <el-input type="textarea"
                      disabled="disabled"
                      class="twoLine"
                      v-model="account"></el-input>
          </div>
          <div class="input-list handling-fee lastStyle">
            <span>{{$t('fee')}}</span>
            <el-radio-group v-model="radio"
                            @change="handleFeeChange">
              <el-radio v-model="radio"
                        :label="1">{{fee_you}} YOU</el-radio>
              <el-radio v-model="radio"
                        :label="2">{{fee_usdt}} USDT</el-radio>
            </el-radio-group>
          </div>
          <div class="tips"
               v-if="isZh && ifBanlanceEmptyTipsShow">{{coinBanlanceEmpty}}余额不足请先<span @click="handleSwapClick"> 兑换 </span></div>
          <div class="tips"
               v-if="!isZh && ifBanlanceEmptyTipsShow"
               @click="handleSwapClick">Balance insufficient,
            please <span @click="handleSwapClick"
                  class="space-style">swap</span> first.</div>
          <div v-if="account"
               class="submit">
            <el-button :loading="progressLoading"
                       :disabled="allowances"
                       :style="allowances ? 'opacity: 0.5': 'opacity: 1'"
                       @click="requestApproval">{{$t('authorize')}}
            </el-button>
            <el-button :loading="createLoading"
                       :disabled="!allowances || ifBanlanceEmptyTipsShow"
                       :style="!allowances || ifBanlanceEmptyTipsShow ? 'opacity: 0.5': 'opacity: 1'"
                       style="margin-left: 20px"
                       @click="createToken">{{$t('create')}}</el-button>
          </div>
          <div v-else>
            <el-button v-if="network"
                       class="connetWallet"
                       @click="connetWallet">{{$t('connectWallet')}}</el-button>
            <el-button class="connetWallet"
                       v-if="!network"
                       @click="handleConnectCurrentNet">
              {{$t('connect')}}{{currentChainId == 56 ? 'BSC' : 'HECO'}}{{$t('netWork')}}</el-button>
          </div>
        </div>
      </div>
    </div>

    <div class="mask"
         v-show="ifTokenSeleckShow"
         @click.stop="handleMaskClick">
      <div class="token-type-select">
        <div class="select-item"
             @click="handleItemClick(1)">
          <div class="dot"
               :class="tokenSelectType == 1 ? 'dot-active' : ''"></div>
          <span>{{$t('fixedSupply')}}</span>
        </div>
        <div class="select-item"
             @click="handleItemClick(2)">
          <div class="dot"
               :class="tokenSelectType == 2 ? 'dot-active' : ''"></div>
          <span>{{$t('issuanceOrBurn')}}</span>
        </div>
        <div class="select-item"
             @click="handleItemClick(3)">
          <div class="dot"
               :class="tokenSelectType == 3 ? 'dot-active' : ''"></div>
          <span>{{$t('moonMode')}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { IsPC } from '../../utils'
import { ethers } from 'ethers'
import abiUSDT from '../../utils/abiUSDT.json'
import abiYOU from '../../utils/abiYOU.json'
import abiCoin from '../../utils/abiCoin.json'
import Cookies from 'js-cookie'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      totalSupply: '',
      name: '',
      symbol: '',
      decimals: '18',
      radio: 1,
      progressLoading: false,
      createLoading: false,
      allowances: false,
      disabled: false,
      fee_usdt: '--',
      fee_you: '--',
      hecoImg: require('../../assets/image/heco_icon.png'),
      bscImg: require('../../assets/image/bsc_icon.png'),
      nextImg: require('../../assets/image/next.png'),
      yesImg: require('../../assets/image/yes.png'),
      changeImg: require('../../assets/image/change_type.png'),
      coinType: Cookies.get('lang') === 'ZH' ? '固定数量' : 'Fixed supply',
      bonusPercent: '',
      liquidityPercent: '',
      YOU_Balance: 0,
      USDT_Balance: 0,
      ifTokenSeleckShow: false, // 代币类型选择弹窗是否显示
      tokenSelectType: 1, // 代币类型选择判断
      coinBanlanceEmpty: 'YOU',
      ifBanlanceEmptyTipsShow: false
    };
  },
  mounted () {
    this.getFee()
    // let i = 1
    // let timer = setInterval(() => {
    //   this.getFee()
    //   i++
    //   if (i > 5) {
    //     clearInterval(timer)
    //   }
    // }, 1000);
  },
  computed: {
    ...mapState({
      account: state => state.account
    }),
    /**
     * 手续费比例计算
     */
    poundage () {
      if (!this.bonusPercent && !this.liquidityPercent) {
        return 10
      } else if (!this.bonusPercent) {
        return parseInt(this.liquidityPercent) + 5
      } else if (!this.liquidityPercent) {
        return parseInt(this.bonusPercent) + 5
      } else {
        return parseInt(this.bonusPercent) + parseInt(this.liquidityPercent)
      }
    },
    currentChainId () {
      return localStorage.getItem('currentChainIdSelect')
    },
    network () {
      return this.$store.state.network
    },
    coinContentType () {
      if (this.currentChainId == 56) {
        return 'BEP20'
      } else {
        return 'HRC20'
      }
    },
    /**
     * 当前合约地址
     */
    NOW_CONTRACT () {
      if (this.currentChainId == 56) {
        return process.env.VUE_APP_CREATE_COIN_BSC_CONTRACT
      } else {
        return process.env.VUE_APP_CREATE_COIN_CONTRACT
      }
    },
    /**
     * USDT合约地址
     */
    USDT_CONTRACT () {
      if (this.currentChainId == 56) {
        return process.env.VUE_APP_USDT_BSC_CONTRACT
      } else {
        return process.env.VUE_APP_USDT_CONTRACT
      }
    },
    /**
     * YOU合约地址
     */
    YOU_CONTRACT () {
      if (this.currentChainId == 56) {
        return process.env.VUE_APP_YOU_BSC_CONTRACT
      } else {
        return process.env.VUE_APP_YOU_CONTRACT
      }
    },
    /**
     * 是否为中文
     */
    isZh () {
      return Cookies.get('lang') === 'ZH'
    }
  },
  methods: {
    /**
     * 创建时表单校验
     */
    check () {
      let name = new RegExp(/^[A-Za-z0-9]/).test(this.name);
      if (this.name == '') {
        this.$message.warning(this.$t('waring')[0]);
        return false;
      } else if (!name) {
        this.$message.warning(this.$t('waring')[1]);
        return false;
      }
      let symbol = new RegExp(/^[A-Za-z0-9]/).test(this.symbol);
      if (this.symbol == '') {
        this.$message.warning(this.$t('waring')[2]);
        return false;
      } else if (!symbol) {
        this.$message.warning(this.$t('waring')[3]);
        return false;
      }
      let totalSupply = new RegExp("^[1-9][0-9]*$").test(this.totalSupply);
      if (this.totalSupply == '') {
        this.$message.warning(this.$t('waring')[4]);
        return false;
      } else if (!totalSupply) {
        this.$message.warning(this.$t('waring')[5]);
        return false;
      }
      let decimals = new RegExp("^[1-9][0-9]*$").test(this.decimals);
      if (this.decimals == '') {
        this.$message.warning(this.$t('waring')[6]);
        return false;
      } else if (!decimals) {
        this.$message.warning(this.$t('waring')[7]);
        return false;
      } else if (Number(this.decimals) > 18) {
        this.$message.warning(this.$t('waring')[8]);
        return false;
      }
      return true;
    },
    /**
     * 连接当前页面对应网络
     */
    handleConnectCurrentNet () {
      if (this.currentChainId == 56) {
        this.$emit('addBSCChain')
      } else {
        this.$emit('addHecoChain')
      }
    },
    /**
     * 点击遮罩关闭弹窗
     */
    handleMaskClick () {
      this.ifTokenSeleckShow = false
    },
    /**
     * 代币类型选择
     */
    handleItemClick (idx) {
      this.reset();
      if (idx == 3) {
        this.getMoonFee()
        this.coinType = this.$t('moonMode')
        this.ifTokenSeleckShow = false
        this.tokenSelectType = 3
      } else if (idx == 2) {
        this.getMintableFee()
        this.coinType = this.$t('issuanceOrBurn')
        this.ifTokenSeleckShow = false
        this.tokenSelectType = 2
      } else {
        this.getFee()
        this.coinType = this.$t('fixedSupply')
        this.ifTokenSeleckShow = false
        this.tokenSelectType = 1
      }
    },
    /**
     * 点击代币类型
     */
    handleTokenTypeClick () {
      this.ifTokenSeleckShow = true
    },
    /**
     * 跳转兑换
     */
    handleSwapClick () {
      if (this.currentChainId == 56) {
        window.open(`${process.env.VUE_APP_BSC_SWAP_URL}?inputCurrency=${this.YOU_CONTRACT}&outputCurrency=${this.USDT_CONTRACT}`, '_self')
      } else {
        window.open(`${process.env.VUE_APP_HECO_SWAP_URL}?inputCurrency=${this.YOU_CONTRACT}&outputCurrency=${this.USDT_CONTRACT}`, '_self')
      }
    },
    connetWallet () {
      this.$emit('connectWallet')
    },
    IsPC () {
      return IsPC()
    },
    /**
     * 获取YOU余额
     */
    getYOUBalance () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.YOU_CONTRACT, abiYOU, provider)
      contract.balanceOf(this.account).then(res => {
        if (res) {
          this.YOU_Balance = res / (10 ** 6)
          this.handleBanlanceTipShow()
          this.initFeeShow()
        }
      })
    },
    /**
     * 手续费变更
     */
    handleFeeChange () {
      this.handleBanlanceTipShow()
    },
    /**
     * 余额不足提示
     */
    handleBanlanceTipShow () {
      if (this.radio === 1) {
        if (this.YOU_Balance < this.fee_you) {
          this.coinBanlanceEmpty = 'YOU'
          this.ifBanlanceEmptyTipsShow = true
        } else {
          this.ifBanlanceEmptyTipsShow = false
        }
      }
      if (this.radio === 2) {
        if (this.USDT_Balance < this.fee_usdt) {
          this.coinBanlanceEmpty = 'USDT'
          this.ifBanlanceEmptyTipsShow = true
        } else {
          this.ifBanlanceEmptyTipsShow = false
        }
      }
    },
    /**
     * 初始化手续费显示
     */
    initFeeShow () {
      let feeUSDT = this.fee_usdt === '--' ? 0 : this.fee_usdt
      let feeYOU = this.fee_you === '--' ? 0 : this.fee_you
      if (feeUSDT > this.USDT_Balance && (feeYOU < this.YOU_Balance || feeYOU == this.YOU_Balance)) { // YOU余额足够，USDT余额不足
        // this.coinBanlanceEmpty = 'YOU'
        this.ifBanlanceEmptyTipsShow = false
        this.radio = 1
      } else if ((feeUSDT < this.USDT_Balance || feeUSDT == this.USDT_Balance) && feeYOU > this.YOU_Balance) { // USDT余额足够，YOU余额不足
        this.ifBanlanceEmptyTipsShow = false
        this.radio = 2
      } else if (feeUSDT > this.USDT_Balance && feeYOU > this.YOU_Balance) {
        this.coinBanlanceEmpty = 'USDT'
        this.ifBanlanceEmptyTipsShow = true
        this.radio = 2
      } else {
        this.ifBanlanceEmptyTipsShow = false
        this.radio = 2
      }
    },
    /**
     * 获取USDT余额
     */
    getUSDTBalance () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.USDT_CONTRACT, abiUSDT, provider)
      contract.balanceOf(this.account).then(res => {
        if (res) {
          this.USDT_Balance = res / (10 ** 18)
          this.handleBanlanceTipShow()
          this.initFeeShow()
        }
      })
    },
    /**
     * 获取YOU USDT的手续费
    */
    getFee () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      contract.usdtFeeForStd().then(res => {
        this.fee_usdt = res / (10 ** 18)
        this.getUSDTBalance() // 获取USDT余额
      })
      contract.youFeeForStd().then(res => {
        this.fee_you = res / (10 ** 6)
        this.getYOUBalance() // 获取YOU余额
      })
      if (this.account) {
        this.allowanceUser()
      } else {
        let i = 1
        let timer = setInterval(() => {
          this.allowanceUser()
          i++
          if (i > 10) {
            clearInterval(timer)
          }
        }, 200);
      }
    },
    /**
     * 获取Mintable手续费
     */
    getMintableFee () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      contract.usdtFeeForMintable().then(res => {
        this.fee_usdt = res / (10 ** 18)
        console.log('可销毁手续费:====', this.fee_usdt)
        this.getUSDTBalance() // 获取USDT余额
      })
      contract.youFeeForMintable().then(res => {
        this.fee_you = res / (10 ** 6)
        console.log('可销毁手续费:====', this.fee_usdt)
        this.getYOUBalance() // 获取YOU余额
      })
      if (this.account) {
        this.allowanceUser()
      } else {
        let i = 1
        let timer = setInterval(() => {
          this.allowanceUser()
          i++
          if (i > 10) {
            clearInterval(timer)
          }
        }, 200);
      }
    },
    /**
     * 获取Moon模式的YOU USDT的手续费
    */
    getMoonFee () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      contract.usdtFeeForMoon().then(res => {
        this.fee_usdt = res / (10 ** 18)
        this.getUSDTBalance() // 获取USDT余额
      })
      contract.youFeeForMoon().then(res => {
        this.fee_you = res / (10 ** 6)
        this.getYOUBalance() // 获取YOU余额
      })
      if (this.account) {
        this.allowanceUser()
      } else {
        let i = 1
        let timer = setInterval(() => {
          this.allowanceUser()
          i++
          if (i > 10) {
            clearInterval(timer)
          }
        }, 200);
      }
    },
    /**
     * 查看当前用户是否授权
     */
    allowanceUser () {
      let contractAddress = ''
      let abiAddress = ''
      if (this.radio == 1) {
        contractAddress = this.YOU_CONTRACT
        abiAddress = abiYOU
      } else {
        contractAddress = this.USDT_CONTRACT
        abiAddress = abiUSDT
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(
        contractAddress,
        abiAddress,
        provider
      );
      contract.allowance(
        this.account,
        this.NOW_CONTRACT
      ).then((allowance) => {
        if (allowance) {
          if (contractAddress == this.USDT_CONTRACT) {
            if (allowance.toString() > this.fee_usdt * (10 ** 18)) {
              this.allowances = true
            } else {
              this.allowances = false
            }
          } else if (contractAddress == this.YOU_CONTRACT) {
            if (allowance.toString() > this.fee_you * (10 ** 6)) {
              this.allowances = true
            } else {
              this.allowances = false
            }
          }

        }
      });
    },
    /**
     * 请求授权
     */
    requestApproval () {
      let overrides = {
        gasLimit: '210000',
        gasPrice: this.currentChainId == 56 ? ethers.utils.parseUnits('6', 'gwei') : ethers.utils.parseUnits('3', 'gwei')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      let contractAddress = ''
      let abiAddress = ''
      if (this.radio === 1) {
        contractAddress = this.YOU_CONTRACT
        abiAddress = abiYOU
      } else {
        contractAddress = this.USDT_CONTRACT
        abiAddress = abiUSDT
      }
      const contract = new ethers.Contract(contractAddress, abiAddress, provider)
      const BigNumbers = ethers.utils.parseUnits('100000000', 18)
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.approve(this.NOW_CONTRACT, BigNumbers, overrides).then((res) => {
        this.progressLoading = true
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            if (receipt) {
              setTimeout(() => {
                this.$message.success('授权成功')
                this.progressLoading = false
                this.allowanceUser()
              }, 2000)
              clearInterval(timer)
            }
          }).catch((err) => {
            this.progressLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        this.progressLoading = false
        if (err.code == 4001) {
          this.$message.warning('请求被拒绝')
        } else {
          this.$message.warning(err.code)
        }
      })
    },
    /**
     * 调用对应合约
     */
    createToken () {
      if (this.tokenSelectType === 1) {
        this.createCoin()
      } else if (this.tokenSelectType === 2) {
        this.createMintableCoin()
      } else {
        this.createMoonCoin()
      }
    },
    /**
     * 固定数量模式创建
    */
    createMintableCoin () {
      if (!this.check()) {
        return
      }
      let overrides = {
        gasLimit: '800000',
        gasPrice: this.currentChainId == 56 ? ethers.utils.parseUnits('6', 'gwei') : ethers.utils.parseUnits('3', 'gwei')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.createMintableERC20(ethers.utils.parseUnits(this.totalSupply, this.decimals), this.name, this.symbol, this.decimals, this.radio, overrides).then((response) => {
        this.createLoading = true
        let timer = setInterval(() => {
          provider.getTransactionReceipt(response.hash).then((receipt) => {
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  this.$message.success('创建成功')
                  this.createLoading = false
                  this.$router.push('/list')
                }, 2000)
              } else {
                this.$message.warning('创建失败')
                this.createLoading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            this.createLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        this.createLoading = false
        if (err.code == 4001) {
          this.$message.warning('创建失败')
        } else {
          this.$message.warning('创建失败')
        }
      })

    },
    /**
     * 创建
    */
    createCoin () {
      if (!this.check()) {
        return
      }
      let overrides = {
        gasLimit: '800000',
        gasPrice: this.currentChainId == 56 ? ethers.utils.parseUnits('6', 'gwei') : ethers.utils.parseUnits('3', 'gwei')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.createStdERC20(ethers.utils.parseUnits(this.totalSupply, this.decimals), this.name, this.symbol, this.decimals, this.radio, overrides).then((response) => {
        this.createLoading = true
        let timer = setInterval(() => {
          provider.getTransactionReceipt(response.hash).then((receipt) => {
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  this.$message.success('创建成功')
                  this.createLoading = false
                  this.$router.push('/list')
                }, 2000)
              } else {
                this.$message.warning('创建失败')
                this.createLoading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            this.createLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        this.createLoading = false
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning('创建失败')
        } else {
          this.$message.warning('创建失败')
        }
      })
    },
    /**
     * 创建Moon模式代币
     */
    createMoonCoin () {
      if (!this.check()) {
        return
      }
      let overrides = {
        gasLimit: '7000000',
        gasPrice: this.currentChainId == 56 ? ethers.utils.parseUnits('6', 'gwei') : ethers.utils.parseUnits('3', 'gwei')
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      const contractWithSigner = contract.connect(provider.getSigner())
      contractWithSigner.createMoonERC20(ethers.utils.parseUnits(this.totalSupply, this.decimals), this.name, this.symbol, this.decimals, this.bonusPercent ? this.bonusPercent : '5', this.liquidityPercent ? this.liquidityPercent : '5', this.radio, overrides).then((response) => {
        this.createLoading = true
        let timer = setInterval(() => {
          provider.getTransactionReceipt(response.hash).then((receipt) => {
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  this.$message.success('创建成功')
                  this.createLoading = false
                  this.$router.push('/list')
                }, 2000)
              } else {
                this.$message.warning('创建失败')
                this.createLoading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            this.createLoading = false
            console.log(err)
          });
        }, 1000)
      }).catch(err => {
        this.createLoading = false
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning('创建失败')
        } else {
          this.$message.warning('创建失败')
        }
      })

    },
    /**
     * 点击进入代币类型详情
     */
    handleCoinTypeClick () {
      this.$router.push('/introduct')
    },
    /**
     * 重置表单
     */
    reset () {
      this.name = '';
      this.symbol = '';
      this.totalSupply = '';
      let decimals = '18';
      this.decimals = decimals;
      this.bonusPercent = '';
      this.liquidityPercent = '';
    },
    /**
     * 代币类型改变
     */
    handleCoinTypeChange () {
      if (this.tokenSelectType === 1) { // 固定数量
        this.getFee()
      } else if (this.tokenSelectType === 2) { // 可增发销毁
        this.getMintableFee()
      } else {
        this.getMoonFee()
      }
    }
  },
  watch: {
    bonusPercent: function () {
      this.bonusPercent = this.bonusPercent.replace(/[^\d]/g, '');
      let totalNumber = Number(this.bonusPercent) + Number(this.liquidityPercent);
      if (totalNumber > 99 || Number(this.bonusPercent) == 99) {
        this.bonusPercent = '';
      }
    },
    liquidityPercent: function () {
      this.liquidityPercent = this.liquidityPercent.replace(/[^\d]/g, '');
      let totalNumber = Number(this.bonusPercent) + Number(this.liquidityPercent);
      if (totalNumber > 99 || Number(this.liquidityPercent) == 99) {
        this.liquidityPercent = '';
      }
    },
    symbol: function () {
      this.symbol = this.symbol.replace(/[\u4E00-\u9FA5]/g, '').replace(/[`~!@#$%^&*()+=<>?:"{}|,./;[\]·~！@#￥%……&*（）+={}|《》？：“”【】、；‘’、，。「」『』]/g, '');
    },
    name: function () {
      this.name = this.name.replace(/[\u4E00-\u9FA5]/g, '').replace(/[`~!@#$%^&*()+=<>?:"{}|,./;[\]·~！@#￥%……&*（）+={}|《》？：“”【】、；‘’、，。「」『』]/g, '');
    },
    totalSupply: function () {
      this.totalSupply = this.totalSupply.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
    },
    decimals: function () {
      this.decimals = this.decimals.replace(/[^\d]/g, '').replace(/^0{1,}/g, '');
      if (this.decimals > 18) {
        this.decimals = '';
      }
    },
    radio: {
      handler () {
        this.allowanceUser()
      },
      deep: true,
      immediate: true
    },
    account: {
      handler () {
        this.getFee()
      },
      deep: true,
      immediate: true
    }
  }
};
</script>
<style lang="less" scoped>
/deep/.el-input__inner:focus {
  border: 1px solid #e6bbff;
}

/deep/.el-input__inner {
  border-radius: 10px;
  border: 1px solid #e6e9eb;
}

/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #14181f;
  font-weight: 500;
  font-size: 16px;
}

/deep/.el-radio__label {
  color: #14181f;
  font-weight: 500;
  font-size: 16px;
  line-height: 22px;
}

/deep/.el-radio__inner {
  border-color: #c154ff;
}

/deep/.el-radio__input.is-checked .el-radio__inner {
  border-color: #c154ff;
  background: #f1f1f1;
}

/deep/.el-radio__input.is-checked .el-radio__inner::after {
  width: 8px;
  height: 8px;
  background: #c154ff;
}

/deep/.el-input.is-disabled .el-input__inner {
  background-color: #f1f1f1;
}

/deep/.el-input__inner {
  font-weight: 500;
  color: #14181f !important;
}

/deep/.disabled-input .el-input__inner {
  font-weight: 500;
  color: #999999 !important;
}

/deep/.el-input__inner::placeholder {
  color: #c5cfd5;
  font-size: 14px;
}
</style>
<style scoped lang='less'>
.connetWallet {
  color: #fff;
  border: none;
  background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
  border-radius: 6px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  margin: 20px 10%;
}

.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .mask {
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    position: fixed;
    left: 0;
    top: 0;
    z-index: 120;

    .token-type-select {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px 10px 0px 0px;
      display: flex;
      flex-direction: column;

      .select-item {
        width: 100%;
        height: 50px;
        padding-left: 15px;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #f8f8f8;

        & > .dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #bfc6cb;
        }

        .dot-active {
          background-color: #c154ff;
        }

        & > span {
          margin-left: 8px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263c;
          line-height: 20px;
        }
      }
    }
  }

  .content-wrap-mobile {
    width: 100%;
    padding: 20px 15px;
    padding-bottom: 88px;

    .create_coin_mobile {
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;

      .el-input {
        width: 80%;
        font-size: 14px;
      }

      .header-title {
        padding: 20px;
        background: #d4e2fd;
        display: flex;
        .title-img-bsc {
          width: 25px;
          height: 28px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .title-img-heco {
          width: 20px;
          height: 30px;

          img {
            width: 100%;
            height: 100%;
          }
        }

        .title-text {
          display: flex;
          flex-direction: column;
          margin-left: 10px;
          width: calc(100% - 35px);
          .spanTop {
            font-size: 16px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #14181f;
            line-height: 16px;
            text-align: left;
          }

          .spanBottom {
            margin-top: 4px;
            font-size: 12px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #14181f;
            line-height: 17px;
            text-align: left;
          }

          .desc-wrap {
            display: flex;
            align-items: center;
            margin-top: 10px;

            .desc {
              font-size: 12px;
              font-family: PingFangSC-Medium, PingFang SC;
              font-weight: 500;
              color: #14181f;
              text-align: left;
              line-height: 17px;
              text-decoration: underline;
            }

            .desc-img {
              width: 7px;
              height: 12px;
              margin-left: 4px;
            }
          }
        }
      }

      .header-title-bsc {
        background: #fdf5dd;
      }

      .input-content {
        width: 100%;
        display: flex;
        flex-direction: column;

        // .supply-total {
        //   background-color: #f7f7fc !important;
        //   /deep/.el-input__inner {
        //     background-color: #f7f7fc !important;
        //   }
        // }
        .input-list {
          margin-top: 0;
          padding: 0 20px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid #f8f8f8;

          p {
            display: flex;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #14181f;
            line-height: 22px;

            img {
              width: 16px;
              height: 16px;
              margin: 4px 0 0 8px;
            }
            span {
              font-size: 14px;
            }
          }

          .el-input {
            border: none;
          }

          .twoLine {
            width: 70%;
            display: block;
            word-wrap: break-word;
            word-break: normal;
          }

          .twoLine/deep/ .el-textarea__inner {
            font-size: 14x;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #999999;
            line-height: 22px;
            border: none;
            padding: 0;
            background: #f7f7fc;
            resize: none;
          }

          /deep/.el-input__inner {
            border: none;
            text-align: right;
            padding: 0;
          }

          > span {
            display: block;
            line-height: 40px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #565b64;
            text-align: left;
            margin-right: 20px;
            white-space: nowrap;
          }
        }

        .moon-select {
          margin-top: 0;
          padding: 15px 20px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          border-bottom: 1px solid #f8f8f8;

          .moon-title {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #565b64;
            line-height: 20px;
          }

          & > span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #565b64;
            line-height: 20px;
          }

          .arg-card {
            display: flex;
            margin-top: 5px;
            width: 305px;
            height: 62px;
            border-radius: 10px;
            border: 1px solid #e6e9eb;

            .card-left {
              display: flex;
              flex-direction: column;
              width: 100px;
              align-items: center;
              justify-content: center;
              background-color: #e6e9eb;
              border-top-left-radius: 10px;
              border-bottom-left-radius: 10px;

              & > span:first-child {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
                line-height: 17px;
              }

              & > span:last-child {
                margin-top: 4px;
                font-size: 16px;
                font-family: DINPro-Medium, DINPro;
                font-weight: 500;
                color: #000000;
                line-height: 21px;
              }
            }

            .card-right {
              display: flex;
              flex: 1;
              padding: 10px 0;
              justify-content: space-around;
              .card-right-left,
              .card-right-right {
                display: flex;
                flex-direction: column;
                align-items: center;

                & > span {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #14181f;
                  line-height: 17px;
                  white-space: nowrap;
                }

                .card-input {
                  display: flex;
                  margin-top: 4px;

                  & > input {
                    width: 20px;
                    height: 20px;
                    font-size: 14px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: #000000;
                    line-height: 21px;
                    text-align: right;
                  }

                  & > span {
                    font-size: 14px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: #c5cfd5;
                    line-height: 21px;
                  }

                  input::-webkit-input-placeholder {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                  }

                  input::-moz-placeholder {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                  }

                  input:-ms-input-placeholder {
                    font-size: 16 px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                  }
                }
              }

              .card-right-middle {
                width: 12px;
                height: 12px;
              }

              .card-right-right {
                display: flex;
                flex-direction: column;
                align-items: center;
              }
            }
          }
        }

        .lastStyle {
          border: none;
          height: 47px;
        }

        .tips {
          display: flex;
          justify-content: center;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #14181f;
          line-height: 20px;
          margin-bottom: 20px;
          & > span {
            color: #c154ff;
            text-decoration: underline;
            cursor: pointer;
          }
          .space-style {
            margin: 0 5px;
          }
        }

        .address-line {
          height: 74px;
          div {
            width: 80px;
            display: flex;
            flex-wrap: wrap;
            span {
              text-align: left;
              color: #565b64;
            }
          }
        }

        .handling-fee {
          display: flex;
          justify-content: flex-start;
        }

        .submit {
          display: flex;
          justify-content: space-between;
          padding: 0 20px 20px 20px;
          .el-button {
            width: 50%;
            height: 40px;
            background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
            border-radius: 10px;
            font-size: 14px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #ffffff;
            border: none;
          }

          .el-button:last-child {
            opacity: 0.5;
          }
        }

        .disabled-input {
          background-color: #f7f7fc !important;
        }

        .el-radio-group {
          padding-top: 0px;
        }
      }

      .title {
        text-align: left;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #14181f;
        line-height: 25px;
        padding: 20px;
      }
    }
  }
}
</style>