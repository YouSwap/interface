<template>
  <div class="container">
    <div class="content-wrap">
      <div v-if="IsPC()"
           class="content-left"
           :class="currentChainId == 56 ? 'content-left-bsc' : ''">
        <img v-if="currentChainId == 56"
             class="img-bsc"
             :src="bscImg"
             alt="">
        <img class="img"
             :src="hecoImg"
             alt=""
             v-else>
        <p class="left-title">{{$t('create') + coinContentType + $t('token')}}</p>
        <p class="left-content">{{$t('leftDes')}}</p>
      </div>
      <div class="create_coin">
        <div class="link-des"
             @click="handleLinkClick">
          <span>{{$t('typeText1')}}</span>
          <img :src="nextImg"
               alt="">
        </div>
        <div class="input-contant">
          <div v-if="IsPC()"
               class="input-list"
               style="margin-top: 0px;">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('tokenType')}}</span>
            <el-radio-group v-model="radioCoinType"
                            @change="handleCoinTypeChange">
              <el-radio :label="1">{{$t('fixedSupply')}}</el-radio>
              <el-radio :label="2">{{$t('issuanceOrBurn')}}</el-radio>
              <el-radio :label="3">{{$t('moonMode')}}</el-radio>
            </el-radio-group>
          </div>
          <div class="input-list">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('tokenName')}}</span>
            <el-input v-model="name"
                      maxlength="64"
                      :placeholder="$t('charactorsTips')"></el-input>
          </div>
          <div class="input-list">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('tokenAbbreviation')}}</span>
            <el-input v-model="symbol"
                      maxlength="11"
                      :placeholder="$t('charactorsTipsSymbol')"></el-input>
          </div>
          <div class="input-list">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('totalSupplay')}}</span>
            <el-input v-model="totalSupply"
                      maxlength="15"
                      placeholder="0-999,999,999,999,999"></el-input>
          </div>
          <div class="input-list">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('decimal')}}</span>
            <el-input v-model="decimals"
                      placeholder="18"></el-input>
          </div>
          <div class="input-list"
               v-if="radioCoinType === 3">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('settings')}}</span>
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
          <div class="input-list disabled-input">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('receivAddress')}}</span>
            <el-input type="text"
                      disabled="disabled"
                      v-model="account"></el-input>
          </div>
          <div class="input-list handling-fee lastStyle">
            <span :class="!isZh ? 'input-list-en' : ''">{{$t('fee')}}</span>
            <el-radio-group v-model="radio"
                            @change="handleFeeChange">
              <el-radio v-model="radio"
                        :label="1">{{fee_you}} YOU</el-radio>
              <el-radio v-model="radio"
                        :label="2">{{fee_usdt}} USDT</el-radio>
            </el-radio-group>
          </div>
          <div class="tips"
               style="marginLeft: 120px"
               v-if="isZh && ifBanlanceEmptyTipsShow">{{coinBanlanceEmpty}}余额不足请先<span @click="handleSwapClick"> 兑换 </span></div>
          <div class="tips"
               style="marginLeft: 160px"
               v-if="!isZh && ifBanlanceEmptyTipsShow"
               @click="handleSwapClick">Balance is insufficient, please <span @click="handleSwapClick"> swap </span> first.</div>
        </div>
        <div v-if="account"
             class="submit">
          <el-button :loading="progressLoading"
                     :disabled="allowances"
                     :style="{opacity: allowances ? '0.5': '1', marginLeft: isZh ? '120px' : '160px'}"
                     @click="requestApproval">{{$t('authorize')}}</el-button>
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
                     @click="handleConnectCurrentNet">{{$t('connect')}}{{currentChainId == 56 ? 'BSC' : 'HECO'}}{{$t('netWork')}}</el-button>
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
  name: 'CardPc',
  data () {
    return {
      bonusPercent: '',
      liquidityPercent: '',
      YOU_Balance: 0,
      USDT_Balance: 0,
      totalSupply: '',
      name: '',
      symbol: '',
      decimals: '18',
      radio: 1,
      radioCoinType: 1,
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
      coinType: '固定数量',
      coinBanlanceEmpty: 'YOU',
      ifBanlanceEmptyTipsShow: false,
      lable1: 1,
      lable2: 2,
      lable3: 3,
    };
  },
  mounted () {
    /**
     * 获取手续费
     */
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
    /**
     * 当前页面显示都链ID
     */
    currentChainId () {
      return localStorage.getItem('currentChainIdSelect')
    },
    /**
     * 当前网络
     */
    network () {
      return this.$store.state.network
    },
    /**
     * 创建代币显示类型
     */
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
     * 跳转介绍页面
     */
    handleLinkClick () {
      this.$router.push('/introduct/pc')
    },
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
        console.log(Number(this.decimals))
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
     * 初始化手续费显示
     */
    initFeeShow () {
      let feeUSDT = this.fee_usdt === '--' ? 0 : this.fee_usdt
      let feeYOU = this.fee_you === '--' ? 0 : this.fee_you
      console.log('usdt手续费：==', feeUSDT, 'you手续费：==', feeYOU, 'you余额:===', this.YOU_Balance, 'usdt余额：==', this.USDT_Balance)
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
     * 跳转兑换
     */
    handleSwapClick () {
      if (this.currentChainId == 56) {
        window.open(`${process.env.VUE_APP_BSC_SWAP_URL}?inputCurrency=${this.YOU_CONTRACT}&outputCurrency=${this.USDT_CONTRACT}`, '_self')
      } else {
        window.open(`${process.env.VUE_APP_HECO_SWAP_URL}?inputCurrency=${this.YOU_CONTRACT}&outputCurrency=${this.USDT_CONTRACT}`, '_self')
      }
      this.radioCoinType = 1
    },
    /**
     * 连接钱包
     */
    connetWallet () {
      this.$emit('connectWallet')
    },
    /**
     * 判断是否是PC端
     */
    IsPC () {
      return IsPC()
    },
    /**
     * 获取固定数量、可增发销毁模式的YOU USDT的手续费
    */
    getFee () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      console.log("当前合约地址", this.NOW_CONTRACT)
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
        this.getUSDTBalance() // 获取USDT余额
      })
      contract.youFeeForMintable().then(res => {
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
     * 获取YOU余额
     */
    getYOUBalance () {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.YOU_CONTRACT, abiYOU, provider)
      console.log('用户钱包地址11111======', this.account)
      contract.balanceOf(this.account).then(res => {
        console.log(res)
        if (res) {
          this.YOU_Balance = res / (10 ** 6)
          this.handleBanlanceTipShow()
          this.initFeeShow()
          console.log('you余额：=========', this.YOU_Balance)
        }
      })
    },
    /**
     * 获取USDT余额
     */
    getUSDTBalance () {
      console.log('用户钱包地址22222======', this.account)
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.USDT_CONTRACT, abiUSDT, provider)
      contract.balanceOf(this.account).then(res => {
        console.log(res)
        if (res) {
          this.USDT_Balance = res / (10 ** 18)
          this.handleBanlanceTipShow()
          this.initFeeShow()
          console.log('usdt余额：=========', this.USDT_Balance)
        }
      })
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
          console.log('allowance:========', allowance.toString())
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
      if (this.radioCoinType === 1) {
        this.createCoin()
      } else if (this.radioCoinType === 2) {
        this.createMintableCoin()
      } else {
        this.createMoonCoin()
      }
    },
    /**
     * 固定数量模式创建
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
      console.log(ethers.utils.parseUnits(this.totalSupply, this.decimals), 'name:==', this.name, 'symbol:==', this.symbol, 'decimals:==', this.decimals, 'radio:==', this.radio, 'overrides:==', overrides)
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
      console.log(ethers.utils.parseUnits(this.totalSupply, this.decimals), 'name:==', this.name, 'symbol:==', this.symbol, 'decimals:==', this.decimals, 'bonusPercent:==', this.bonusPercent ? this.bonusPercent : '5', 'liquidityPercent:==', this.liquidityPercent ? this.liquidityPercent : '5', 'radio:==', this.radio, 'overrides:==', overrides)
      contractWithSigner.createMoonERC20(ethers.utils.parseUnits(this.totalSupply, this.decimals), this.name, this.symbol, this.decimals, this.bonusPercent ? this.bonusPercent : '5', this.liquidityPercent ? this.liquidityPercent : '5', this.radio, overrides).then((response) => {
        this.createLoading = true
        let timer = setInterval(() => {
          provider.getTransactionReceipt(response.hash).then((receipt) => {
            if (receipt) {
              console.log('提示信息：====', receipt)
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
      this.reset();
      if (this.radioCoinType === 1) { // 固定数量
        this.getFee()
      } else if (this.radioCoinType === 2) { // 可增发销毁
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
      console.log(typeof this.decimals)
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
    radioCoinType: {
      handler (val) {
        this.val = 1
        console.log('valvalvalval', val)
      },
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  .content-wrap {
    display: flex;
    width: 1200px;
    margin-top: 40px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    .content-left {
      width: 360px;
      background-color: rgba(44, 114, 245, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      border-top-left-radius: 10px;
      border-bottom-left-radius: 10px;
      & > .img {
        width: 107px;
        height: 160px;
        margin-top: 148px;
      }
      & > .img-bsc {
        width: 138px;
        height: 156px;
        margin-top: 148px;
      }
      & > .left-title {
        margin-top: 60px;
        font-size: 24px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #1d2243;
        line-height: 33px;
      }
      & > .left-content {
        margin-top: 20px;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(29, 34, 67, 0.8);
        line-height: 22px;
        text-align: left;
        margin: 10px 20px;
      }
    }
    .content-left-bsc {
      background-color: rgba(240, 185, 9, 0.13);
    }
    .create_coin {
      width: 840px;
      background: #ffffff;
      padding: 60px 100px;
      border-top-right-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: left;
      position: relative;
      .link-des {
        position: absolute;
        right: 30px;
        top: 23px;
        display: flex;
        align-items: center;
        cursor: pointer;
        & > span {
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: rgba(29, 34, 67, 0.8);
          line-height: 17px;
          text-decoration: underline;
        }
        & > img {
          width: 7px;
          height: 12px;
          margin-left: 4px;
        }
      }
      .title {
        text-align: left;
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #14181f;
        line-height: 25px;
      }
      .el-input {
        width: 360px;
        height: 40px;
        border-radius: 10px;
        font-size: 14px;
      }
      /deep/.el-input__inner::placeholder {
        color: #c5cfd5;
        font-size: 14px;
      }
      .input-contant {
        .input-list {
          margin-top: 20px;
          display: flex;
          .input-list-en {
            width: 140px;
          }
          > span {
            display: block;
            line-height: 40px;
            width: 100px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #14181f;
            text-align: right;
            margin-right: 20px;
          }
          .arg-card {
            display: flex;
            width: 360px;
            height: 63px;
            border-radius: 10px;
            border: 1px solid #e6e9eb;
            .card-left {
              width: 133px;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: space-between;
              padding: 10px 0;
              border-radius: 10px 0 0 10px;
              background: #f8fcff;
              border-right: 1px solid #e6e9eb;
              & > span:first-child {
                font-size: 12px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #000000;
                line-height: 17px;
                white-space: nowrap;
              }
              & > span:last-child {
                font-size: 16px;
                font-family: DINPro-Medium, DINPro;
                font-weight: 500;
                color: #000000;
                line-height: 21px;
              }
            }
            .card-right {
              display: flex;
              width: 267px;
              align-items: center;
              justify-content: space-between;
              .card-right-left,
              .card-right-right {
                width: 120px;
                display: flex;
                flex-direction: column;
                align-items: center;
                & > span:first-child {
                  font-size: 12px;
                  font-family: PingFangSC-Regular, PingFang SC;
                  font-weight: 400;
                  color: #14181f;
                  line-height: 17px;
                }
                & > span:last-child {
                  font-size: 16px;
                  font-family: DINPro-Medium, DINPro;
                  font-weight: 500;
                  color: #c5cfd5;
                  line-height: 21px;
                }
                .card-input {
                  display: flex;
                  align-items: center;
                  input {
                    width: 20px;
                    height: 20px;
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    color: #000000;
                    font-weight: 500;
                    line-height: 21px;
                    text-align: right;
                  }
                  input::-webkit-input-placeholder {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                    text-decoration: underline;
                  }
                  input::-moz-placeholder {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                    text-decoration: underline;
                  }
                  input:-ms-input-placeholder {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: rgba(197, 207, 213, 1);
                    line-height: 21px;
                    text-decoration: underline;
                  }
                  & > span {
                    font-size: 16px;
                    font-family: DINPro-Medium, DINPro;
                    font-weight: 500;
                    color: #14181f;
                    line-height: 21px;
                  }
                }
              }
              .card-right-middle {
                font-size: 20px;
                color: #c5cfd5;
              }
            }
          }
        }
        .tips {
          margin-left: 120px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #14181f;
          line-height: 20px;
          & > span {
            color: #c154ff;
            text-decoration: underline;
            cursor: pointer;
          }
        }
      }
      .submit {
        margin-top: 20px;
        padding: 0;
        display: flex;
        .el-button {
          width: 170px;
          height: 40px;
          background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
          border-radius: 10px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
        }
        // .el-button:first-child {
        //   margin-left: 120px;
        // }
        .el-button:last-child {
          margin-left: 20px !important;
        }
      }
      .el-radio-group {
        padding-top: 12px;
      }
    }
  }
}

.connetWallet {
  color: #fff;
  border: none;
  background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
  border-radius: 6px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 600;
  margin: 20px 10%;
}
/deep/.el-input__inner:focus {
  border: 1px solid #e6bbff;
}
/deep/.el-input__inner {
  font-size: 14px;
  border-radius: 10px;
  border: 1px solid #e6e9eb;
}
/deep/.el-radio__input.is-checked + .el-radio__label {
  color: #14181f;
  font-weight: 500;
  font-size: 14px;
}
/deep/.el-radio__label {
  color: #14181f;
  font-weight: 500;
  font-size: 14px;
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
</style>
<style>
.el-tooltip__popper,
.is-light {
  border: none !important;
  background: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow {
  border-bottom-color: #ffffff !important;
}
.el-tooltip__popper[x-placement^="bottom"] .popper__arrow:after {
  border-bottom-color: #ffffff !important;
}
</style>