<template>
  <div class="mining-container">
    <MiningHeader 
      :balance="balance" 
      :isConnected="isConnected"
      :account="account"
      :title="$t('across_chain.across_title')"
      :titleDesc="$t('across_chain.across_titleDesc')"
      @connectWallet="connectWallet"/>
    <div class="content-wrapper">
      <div class="content-center" :style="!account && !IsPC()? 'margin-bottom:100px':''">
        <div class="content-header"> 
          <span>{{$t('across_chain.Asset')}} :</span>
          <img class="logo" :src="logoUrl" alt="">
          <span class="you">YOU</span>  
        </div>
        <div class="content-card"> 
          <div>
            {{$t('across_chain.From')}}
            <div class="chainBox">
              <div v-if="account" class="connect">{{$t('across_chain.Connected')}}</div>
              <img :src="ethUrl" alt="">
              <div>{{$t('across_chain.EthereumMainnet')}}</div>
            </div>
          </div>
          <div><img :src="arrowRight" alt=""></div>
          <div>
            {{$t('across_chain.To')}}
            <div class="chainBox">
              <img :src="huobiUrl" alt="">
              <div>{{$t('across_chain.Heco')}}</div>
            </div>
          </div>
        </div>
        <div class="input-card">
          <div class="info">
            <span>{{$t('across_chain.TargetAddress')}}</span>
          </div>
          <div class="inputDiv">
            <el-input v-model="recipient" :disabled="transferLoding || approve_loding" :placeholder="$t('across_chain.EnterTheAddressOfHeco')"></el-input>
          </div>
          <div v-if="errorTipAddress" class="errorTipAddress">{{errorTipAddressDesc}}</div>
        </div>
        <div class="input-card">
          <div class="info">
            <span>{{$t('across_chain.Volume')}}</span>
            <span>{{$t('across_chain.Balance')}}：{{ youBalance}}</span>
          </div>
          <div class="inputDiv inputLimit">
            <el-input 
              v-model="amount" 
              oninput="value=value.toString().match(/^\d+(?:\.\d{0,6})?/)"
              :disabled="transferLoding || approve_loding" :placeholder="$t('across_chain.MinVolume')">
            </el-input>
            <el-button :disabled="transferLoding || approve_loding" @click="maxBalance" class="max">Max</el-button>
            <span class="symbolName">YOU</span>
          </div>
          <div v-if="errorTip" class="errorTip">{{errorDesc}}</div>
          <div v-if="amount" class="desc">
            <span>{{$t('across_chain.YouWillReceive')}} {{ getDecimalsCoinFn(amount * (1 - 0.003), 5) }} YOU</span>
            <span class="desc_symbol">HECO</span>
            <el-popover
              popper-class="popoverList"
              placement="top-end"
              width="200"
              trigger="hover">
              <div style="font-size: 12px;">{{ $t('across_chain.fee') }}</div>
              <img class="help" slot="reference" :src="help" alt="">
            </el-popover>
          </div>
        </div>
        <el-button class="transfer" v-if="!account" @click="connectWallet">{{$t('across_chain.ConnectWallet')}}</el-button>
        <el-button class="transfer" v-if="!approve && account" :loading="approve_loding" @click="approveDom">{{$t('Authorize')}}</el-button>
        <el-button
          v-if="approve && account"
          :loading="transferLoding" 
          class="transfer" 
          @click="transfer" 
          :class="(errorTipAddress || errorTip || amount === '' || recipient === '') ? 'disabled':''"
          :disabled="errorTipAddress || errorTip || amount === '' || recipient === ''">
          {{$t('across_chain.Swap')}}
          </el-button>
        <div class="limit">
          <span>{{$t('across_chain.Dailylimit')}} ：{{haveMount}} / {{ limitOfOneDay }} YOU </span>
          <el-popover
              popper-class="popoverList"
              placement="top-end"
              width="200"
              trigger="hover">
              <div style="font-size: 12px;">{{ $t('across_chain.toDayLimitDesc') }}</div>
              <img class="help" slot="reference" :src="help" alt="">
            </el-popover>
        </div>
      </div>
      <div v-if="account" class="tableCard">
        <div class="tableTitle">
          <span>{{$t('across_chain.SwapRecords')}}</span>
          <span class="account">{{getShowAddressFn(account, 6)}}</span>
        </div>
        <ul v-if="IsPC()" class="tableHeader">
          <li v-for="(column, index) in tableColumn" :key="index">
            {{column.label}}
          </li>
        </ul>
        <div v-if="IsPC()" class="tableDatas">
          <div v-if="tableData.length > 0">
            <div v-for="(table, index) in tableData" :key="index">
              <div class="state" :class="(table.state === 10 || table.state === 9) ? 'Failed' : (table.state === 5 || table.state === 6 || table.state === 7 || table.state === 8) ? 'Completed' : 'InProcessing'">{{(table.state === 5 || table.state === 6 || table.state === 7 || table.state === 8) ? $t('across_chain.Completed') : table.state === 10 ? $t('across_chain.Failed') : table.state === 9 ? $t('across_chain.Failed') :$t('across_chain.InProcessing')}}</div>
              <div class="fee">
                <div>{{getDecimalsCoinFn(table.amount/10**6 / (997 / 1000), 5)}} YOU <span>({{table.fromConfirm}}/{{table.fromFigConfirm}})</span></div>
                <div><span class="signAccount">{{getShowAddressFn(table.sender, 6)}}</span> <span class="sign">ETH</span></div>
            </div>
              <div class="fee">
                <div>{{getDecimalsCoinFn(table.amount/10**6, 5)}} YOU <span v-if="!(table.state === 10 || table.state === 9)">({{table.toConfirm}}/{{table.toFigConfirm}})</span></div>
                <div><span class="signAccount">{{getShowAddressFn(table.recipient, 6)}}</span> <span class="sign">HECO</span></div>
              </div>
              <div class="fee">
                <div>{{getDecimalsCoinFn(table.amount/10**6 * 0.003 / (997 / 1000), 4)}} YOU</div>
                <div class="createTime">{{formatTimeFn(table.datestamp/1)}}</div>
              </div>
            </div>
          </div>
          <div class="noRecord" v-else>{{$t('across_chain.noRecord')}}</div>
        </div>
        <div v-else class="tableDatas">
          <div v-if="tableData.length > 0">
            <div v-for="(table, index) in tableData" :key="index">
              <div class="tableList">
                <div>
                  <div class="title">{{$t('across_chain.Status')}}</div>
                  <div class="state" :class="(table.state === 10 || table.state === 9) ? 'Failed' : (table.state === 5 || table.state === 6 || table.state === 7 || table.state === 8) ? 'Completed' : 'InProcessing'">{{(table.state === 5 || table.state === 6 || table.state === 7 || table.state === 8) ? $t('across_chain.Completed') : table.state === 10 ? $t('across_chain.Failed') : table.state === 9 ? $t('across_chain.Failed') :$t('across_chain.InProcessing')}}</div>
                </div>
                <div>
                  <div class="title"><span>{{$t('across_chain.SentVolume')}}</span><span> {{$t('across_chain.SentVolumeDesc')}}</span></div>
                  <div class="fee">
                    <div>{{getDecimalsCoinFn(table.amount/10**6 / (997 / 1000), 5)}} YOU <span>({{table.fromConfirm}}/{{table.fromFigConfirm}})</span></div>
                    <div><span class="signAccount">{{getShowAddressFn(table.sender)}}</span> <span class="sign">ETH</span></div>
                  </div>
                </div>
                <div>
                  <div class="title"> <span>{{$t('across_chain.ReceivedVolume')}}</span><span>{{$t('across_chain.ReceivedVolumeDesc')}}</span></div>
                  <div class="fee">
                    <div>{{getDecimalsCoinFn(table.amount/10**6, 5)}} YOU <span v-if="!(table.state === 10 || table.state === 9)">({{table.toConfirm}}/{{table.toFigConfirm}})</span></div>
                    <div><span class="signAccount">{{getShowAddressFn(table.recipient)}}</span> <span class="sign">HECO</span></div>
                  </div>
                </div>
                <div>
                  <div class="title">{{$t('across_chain.Fee')}}</div>
                  <div class="fee">
                    <div>{{ getDecimalsCoinFn(table.amount/10**6 * 0.003 / (997 / 1000), 5)}} YOU</div>
                  </div>
                </div>
                <div>
                  <div class="title">{{$t('across_chain.Time')}}</div>
                  <div class="createTime">{{formatTimeFn(table.datestamp/1)}}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="noRecord" v-else>{{$t('across_chain.noRecord')}}</div>
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
import MobileFooter from '../../components/MobileFooter'
import PcFooter from '../../components/PcFooter'
import MobileChain from '../../components/MobileChain'
import { ethers } from 'ethers'
import { getDecimalsCoin, getShowAddress, formatDate } from '../../utils'
import abi_across from '../../abi-across.json'
import youabi from '../../youabi.json'

export default {
  components: {
    MiningHeader,
    MobileFooter,
    MobileChain,
    PcFooter,
  },
  mounted() {
    this.checkNetwork(); // 检测网络
    this.accountChanged(); // 监听账户改变
    this.getGasValue();
    setInterval(() => {
      this.getTransferList()
    }, 3000)
    this.maxLimit()      //判断用户最大限制
    this.remaingLimit()
  },
  data () {
    return {
      network: true,
      account: '',
      isConnected: false,
      balance: '',
      digImgUrl1: require('../../assets/mining-img/dig_img1.png'),
      digImgUrl2: require('../../assets/mining-img/dig_img2.png'),
      getYouList: [],
      youTotal: 0,
      cardLists: [],
      totolList: [],     //流动性总额 YOU价格列表
      currentBlockNumber: '', // 当前块高
      logoUrl: require('../../assets/logo_black.png'),
      huobiUrl: require('../../assets/huobi.png'),
      ethUrl: require('../../assets/ETH.png'),
      arrowRight: require('../../assets/arrowRight.png'),
      help: require('../../assets/mining-img/help.png'),
      amount: '',
      recipient: '',
      youBalance: '--',
      limitNumber: 1000,
      maxNumber: 10000,
      errorTip: false,
      errorDesc: '',
      errorTipAddress: false,
      errorTipAddressDesc: '',
      gasPrice: '150',
      approve: 0,
      approve_loding: false,
      transferLoding: false,
      tableData: [],
      limitOfOneDay: '--',
      remainingOfDay: '--',
      isShowNet: false,
      approveBalance: 0
    }
  },
  computed: {
    realTimeDeflationRate () {
      if (this.youTotal === 0) {
        return '-'
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
      return this.currentBlockNumber - 240*24
    },
    todayLimit () {
      return this.remainingOfDay >=0
    },
    haveMount() {
      if (this.limitOfOneDay !== '--') {
        return getDecimalsCoin(this.limitOfOneDay - this.remainingOfDay, 5)
      }
      return '--'
    },
    tableColumn() {
      return [
        {
          prop: 'state',
          label: this.$t('across_chain.Status'),
          width: '200px'
        },
        {
          prop: 'amount',
          label: `${this.$t('across_chain.SentVolume')}${this.$t('across_chain.SentVolumeDesc')}`,
          width: '350px'
        },
        {
          prop: 'amount',
          label: `${this.$t('across_chain.ReceivedVolume')}${this.$t('across_chain.ReceivedVolumeDesc')}`,
          width: '350px'
        },
        {
          prop: 'created',
          label: this.$t('across_chain.FeeTime'),
          width: '200px'
        },
      ]
    }
  },
  methods: {
    showNetHandle() {
      this.isShowNet = true
    },
    closeNetHandle() {
      this.isShowNet = false
    },
    /***
     *  数据截取
     */
    getDecimalsCoinFn (number, decails) {
      return getDecimalsCoin(number, decails)
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
    /**
     * 地址截取
     */
    getShowAddressFn (address, sign) {
      return getShowAddress(address, sign)
    },
    /**
     * 时间转化
     */
    formatTimeFn(data) {
      return formatDate(data)
    },
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
        if (Network.chainId != process.env.VUE_APP_CHAIN_ID) {
          this.$message.error(this.$t('across_chain.NetworkError'))
          this.network = false
        } else {
          this.network = true
          this.initAccount()
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
          that.approveUser();  //判断用户是否授权
          that.getTransferList() //获取转换列表
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
          that.account = accounts[0]
          that.$store.commit('setAccount', accounts[0])
          that.shortAccount = getShowAddress(accounts[0])
          that.sendAsync()
          window.location.reload()
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
      if (!this.network) {
        this.$message.error(this.$t('across_chain.NetworkError'))
        return
      }
      if (window.ethereum) {
        window.ethereum.request({ method: 'eth_requestAccounts' })
        .then((accounts) => {
          if (accounts.length === 0) {
            console.log('Please connect to MetaMask.');
          } else {
            this.account = accounts[0]
            this.$store.commit('setAccount', accounts[0])
            this.shortAccount = getShowAddress(accounts[0])
            this.isConnected = true
            this.sendAsync()
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            provider.getBalance(this.account).then((balance) => {
                // 余额是 BigNumber (in wei); 格式化为 ether 字符串
                let etherString = ethers.utils.formatEther(balance)
                this.balance = parseFloat(etherString, 10).toFixed(3)
            })
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
      const provider = ethers.getDefaultProvider('homestead');
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
          this.youBalance = ethers.utils.formatUnits(res, 6) || '--'
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
     * 获取gasPrice
     */
    getGasValue() {
      this.$get(process.env.VUE_APP_HECO_GAS_API).then(res => {
        if (res.result && res.result.ProposeGasPrice) {
          this.gasPrice = res.result.ProposeGasPrice
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    /**
     * maxNumber
     */
    maxBalance() {
      this.amount = this.youBalance
    },
    /**
     * 获取YOU最大限制
     */
    maxLimit() {
      const contractAddress = process.env.VUE_APP_ACROSS_ADDRESS
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi_across, provider)
      console.log('contract', contract)
      contract.limitOfOneDay().then(limitOfOneDay => {
        this.limitOfOneDay = limitOfOneDay.toNumber()/10**6;
      })
    },
    /**
     * 获取当前用户单日YOU限制
     */
    remaingLimit() {
      const contractAddress = process.env.VUE_APP_ACROSS_ADDRESS
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi_across, provider)
      contract.remainingOfDay().then(remainingOfDay => {
        this.remainingOfDay = remainingOfDay.toNumber()/10**6;
      })
    },
    /**
     * 获取当前用户是否授权
     */
    approveUser () {
      const contractAddress = process.env.VUE_APP_YOU_CONTRACT_ADDRESS
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, youabi, provider);
      const contractAddressAcross = process.env.VUE_APP_ACROSS_ADDRESS
      const account = this.account.toLowerCase()
      contract.allowance(account, contractAddressAcross).then(res => {
        if (ethers.utils.formatUnits(res, 6) > 0) {
          this.approve = 1
          this.approveBalance = ethers.utils.formatUnits(res, 6)
        } else {
          this.approve = 0
        }
        
      })
    },
    /**
     * 授权
     */
    approveDom() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contractYou = new ethers.Contract(
        process.env.VUE_APP_YOU_CONTRACT_ADDRESS,
        youabi,
        provider
      );
      const contractAddressAcross = process.env.VUE_APP_ACROSS_ADDRESS
      const contractWithSigner = contractYou.connect(provider.getSigner());
      contractWithSigner.approve(contractAddressAcross, 100000000 * 10 ** 6).then((approve) => {
        this.approve_loding = true;
        approve.wait(youabi).then((res) => {
          console.log('res', res)
          this.approve_loding = false;
          this.approve =  1;
          this.approveUser();
          this.$message.success(this.$t('across_chain.ApproveSuccess'));
        }).catch(() => {
          this.approveUser();
          this.$message.error(this.$t('across_chain.ApproveFaild'))
          this.approve_loding = false
        });
      });
    },
    /**
     * 转换
     */
    transfer() {
      if (!this.todayLimit) {
        this.$message.error(this.$t('across_chain.topLimit'))
        return
      }
      const overrides = {
        gasLimit: 300000,
        gasPrice: ethers.utils.parseUnits(this.gasPrice, 'gwei')
      }
      // const chainId = process.env.VUE_APP_HECO_ID
      const contractAddress = process.env.VUE_APP_ACROSS_ADDRESS
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(contractAddress, abi_across, provider)
      const contractWithSigner = contract.connect(provider.getSigner())
      // 1:ETH 2:HECO 3:BSC 4:TRX
      
      contractWithSigner.exchange('2', this.recipient, this.amount * 10**6, overrides).then(res => {
        this.transferLoding = true
        res.wait(youabi).then((result) => {
          console.log('result', result)
          if(result) {
            this.transferLoding = false
            this.checkNetwork();
            this.amount = '';
            this.recipient = '';
          }
        }).catch(() => {
          this.$message.error(this.$t('across_chain.Failed'))
          this.transferLoding = false
        })
      })
    },
    /**
     * 获取转换记录
     */
    getTransferList() {
      const params =  {
        sender: this.account
      }
      this.$get(process.env.VUE_APP_ACROSS_MIDDLE_ADDRESS, params).then(response => {
        if (response.code === '88') {
          this.tableData = response.obj
        }
      })
    },
  },
  watch: {
    amount(val) {
      if(val === '') {
        this.errorTip = false
        return
      }
      if (Number(val) > Number(this.approveBalance)) {
        this.approve = 0
      } else {
        this.approve = 1
      }
      if (Number(val) > Number(this.youBalance)) {
        this.errorTip = true
        this.errorDesc = this.$t('across_chain.InsufficientBalance')
        return
      } else {
        this.errorTip = false
      }
      if (val < this.limitNumber) {
        this.errorTip = true
        this.errorDesc = this.$t('across_chain.MinVolume')
        return
      } else {
        this.errorTip = false
      }
      if (val > this.remainingOfDay) {
        this.errorTip = true
        this.errorDesc = `${this.$t('across_chain.Maxvolume')} ${this.remainingOfDay} YOU`
        return
      } else {
        this.errorTip = false
      }
    },
    recipient(val) {
      if (val === '') {
        this.errorTipAddress = false
        return
      }
      if (ethers.utils.isAddress(val)) {
        this.errorTipAddress = false
      } else {
        this.errorTipAddress = true
        this.errorTipAddressDesc = this.$t('across_chain.walletAddressError')
      }
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
      margin: 100px auto 60px auto;
      width: 480px;
      background: #FFFFFF;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      padding: 27px 30px 30px 30px;
      box-sizing: border-box;
      color: #82929D;
      font-size: 12px;
      .logo {
        margin: 0 10px;
      }
      .you {
        font-size: 14px;
        font-family: DINPro-Medium, DINPro, PingFang SC;
        font-weight: 500;
        color: #06263C;
      }
      .content-header {
        display: flex;
        align-items: center;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #82929D;
        .logo {
          width: 20px;
          height: 20px;
        }
      }
      .content-card {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 20px 0;
        .chainBox {
          width: 161px;
          height: 118px;
          background: #FFFFFF;
          box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
          border-radius: 10px;
          margin-top: 10px;
          text-align: center;
          position: relative;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #06263C;
          >img {
            width: 40px;
            height: 60px;
          }
          .connect {
            position: absolute;
            top: 0;
            right:0;
            height: 24px;
            padding: 0 6px;
            background: #35BDB1;
            box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
            border-radius: 0px 10px 0px 10px;
            color: #fff;
            font-size: 10px;
            line-height: 24px;
          }
          >img {
            margin: 10px 0;
          }
        }
      }
      .input-card {
        width: 100%;
        margin-top: 20px;
        .info,.inputDiv {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 15px;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #82929D;
          /deep/.el-input__inner {
            border-radius: 10px;
          }
          /deep/.el-input__inner:focus {
            border: 1px solid #35BDB1
          }
        }
        .errorTip,.errorTipAddress {
          line-height: 24px;
          color: #FE535B;
        }
        .inputLimit {
          border: 1px solid #E6E9EB;
          border-radius: 10px;
          .el-input {
            /deep/.el-input__inner {
              border: none;
            }
          }
          .max {
            color: #fff;
            background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
            border-radius: 4px;
            height: 20px;
            line-height: 0px;
            padding: 0 4px;
          }
          .symbolName {
            color: #06263C;
            padding: 0 20px 0 10px;
            font-family: DINPro-Medium, DINPro, PingFang SC;
            font-weight: 500;
            font-size: 14px;
          }
        }
        .desc {
          margin-top: 10px;
          display: flex;
          align-items: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #82929D;
          line-height: 16px;
          .desc_symbol {
            margin-left: 10px;
            background: rgba(53, 189, 177, 0.5);
            border-radius: 4px;
            color: #fff;
            padding: 0 3px;
          }
        }
      }
      .help {
        width: 13px;
        height: 13px;
        margin-left: 5px;
        margin-top: 4px;
      }
      .transfer {
        width: 100%;
        height: 45px;
        margin-top: 30px;
        border-radius: 10px;
        background: #FFFFFF;
        background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
        border-radius: 10px;
        color: #fff;
        font-size: 16px;
      }
      .disabled {
        opacity: 0.4;
      }
    }
    .tableCard {
      width: 1200px;
      margin: 0 auto;
      background: #fff;
      padding: 30px;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 20px;
    }
  }
  .isdisabled {
    opacity: 0.8;
  }
  .tableTitle {
    margin-bottom: 30px;
    padding-bottom: 30px;
    border-bottom: 1px solid #F8F8F8;
    .account {
      background: #F7F7FA;
      border-radius: 4px;
      font-size: 12px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #82929D;
      padding: 2px 5px;
      margin-left: 10px;
    }
  }
  .limit {
    line-height: 37px;
    height: 37px;
    background: #F7F7FA;
    border-radius: 10px;
    padding: 0 15px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #82929D;
    display: flex;
    align-items: center;
    .help {
      margin-top: 13px!important;
    }
  }
  .tableHeader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .tableHeader li:first-child {
    width: 20%;
  }
  .tableHeader li:last-child {
    width: 15%;
  }
  .tableHeader li {
    width: 35%;
    margin-right: 30px;
    color: #06263C;
    font-size: 14px;
  }
  .tableDatas .Failed{
    color: #FE535B
  }
  .tableDatas .Completed{
    color: #35BDB1;
  }
  .tableDatas .InProcessing {
    color: #FB9410;
  }
  .tableDatas >div >div {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    color: #06263C;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro, PingFang SC;
    font-weight: 500;
    >div {
      font-weight: 500;
      &:first-child {
        width: 20%;
        line-height: 40px;
      }
      &:last-child {
        width: 15%;
      }
      & {
        width: 35%;
        margin-right: 30px;
        color: #06263C;
        font-size: 12px;
      }
    }
    .fee {
      font-weight: 500;
      .signAccount {
        color: #82929D;
        font-size: 12px;
      }
      .sign {
        padding: 0 5px;
        background: rgba(53, 189, 177, 0.5);
        border-radius: 4px;
        color: #fff;
        font-size: 12px;
      }
      >div {
        font-weight: 500;
        padding: 5px 0;
        >span {
          font-weight: 500;
        }
      }
      .createTime {
        color: #82929D;
      }
    }
  }
  .tableDatas .noRecord {
    line-height: 200px;
    display: inherit;
    text-align: center;
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
        margin: 100px auto 20px auto;
        width: 92%;
        background: #FFFFFF;
        box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
        border-radius: 10px;
        padding: 27px 20px 30px 20px;
        box-sizing: border-box;
        color: #82929D;
        font-size: 12px;
        .logo {
          margin: 0 10px;
        }
        .you {
          font-size: 14px;
          font-family: DINPro-Medium, DINPro, PingFang SC;
          font-weight: 500;
          color: #06263C;
        }
        .content-header {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #82929D;
          .logo {
            width: 20px;
            height: 20px;
          }
        }
        .content-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 20px 0;
          .chainBox {
            width: 30vw;
            height: 118px;
            background: #FFFFFF;
            box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
            border-radius: 10px;
            margin-top: 10px;
            text-align: center;
            position: relative;
            .connect {
              position: absolute;
              top: 0;
              right:0;
              height: 24px;
              background: #35BDB1;
              box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
              border-radius: 0px 10px 0px 10px;
              color: #fff;
              font-size: 8px;
              line-height: 24px;
            }
          }
        }
        .input-card {
          width: 100%;
          margin-top: 20px;
          .info,.inputDiv {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 15px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #82929D;
            /deep/.el-input__inner {
              border-radius: 10px;
            }
            /deep/.el-input__inner:focus {
              border: 1px solid #35BDB1
            }
          }
          .inputLimit {
            border: 1px solid #E6E9EB;
            border-radius: 10px;
            .el-input {
              /deep/.el-input__inner {
                border: none;
              }
            }
            .max {
              padding: 4px;
              color: #fff;
              background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
              border-radius: 4px;
              height: 20px;
              line-height: 10px;
            }
            .symbolName {
              color: #06263C;
              padding: 0 10px;
              font-family: DINPro-Medium, DINPro, PingFang SC;
              font-weight: 500;
            }
          }
          .desc {
            margin-top: 10px;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #82929D;
            line-height: 16px;
            .desc_symbol {
              margin-left: 10px;
              background: rgba(53, 189, 177, 0.5);
              border-radius: 4px;
              color: #fff;
              padding: 0 3px;
            }
            .help {
              width: 13px;
              height: 13px;
              margin-left: 5px;
              margin-top: 3px;
            }
          }
        }
        .transfer {
          width: 100%;
          height: 45px;
          margin-top: 30px;
          border-radius: 10px;
          background: #FFFFFF;
          background: linear-gradient(72deg, #34BDB0 0%, #0C979C 100%);
          border-radius: 10px;
          color: #fff;
          font-size: 16px;
        }
      }
      .tableCard {
        width: 90%;
        margin: 0 auto 100px auto;
        background: #fff;
        padding: 20px;
        box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
        border-radius: 20px;
      }
    }
    .isdisabled {
      opacity: 0.8;
    }
    .pc-footer {
      display: none;
    }
  }
  .tableTitle {
    margin-bottom: 20px!important;
    border-bottom: none!important;
    padding-bottom: 0!important;
    .account {
      background: #F7F7FA;
      border-radius: 4px;
      font-size: 12px;
      font-family: DINPro-Regular, DINPro;
      font-weight: 400;
      color: #82929D;
      margin-top: 15px;
      padding: 2px 5px;
      margin-left: 10px;
    }
  }
  .tableList {
    width: 100%!important;
    border-top: 1px solid #F8F8F8;
    margin-right: 0!important;
    padding-top: 20px;
    >div {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      line-height: 20px;
    }
    .title {
      width: 40vw;
      line-height: 20px;
      color: #82929D;
      >span {
        display: block;
        text-align: left;
      }
    }
    .fee {
      line-height: 20px;
      text-align: right;
      >div {
        padding: 0!important;
      }
    }
  }
  .limit {
    line-height: 37px;
    height: 37px;
    background: #F7F7FA;
    border-radius: 10px;
    padding: 0 10px;
    margin-top: 20px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #82929D;
  }
  .tableHeader {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  .tableHeader li:first-child {
    width: 20%;
  }
  .tableHeader li:last-child {
    width: 15%;
  }
  .tableHeader li {
    width: 35%;
    margin-right: 30px;
    color: #06263C;
    font-size: 14px;
  }
  .tableDatas .Failed{
    color: #FE535B
  }
  .tableDatas .Completed{
    color: #35BDB1;
  }
  .tableDatas .InProcessing {
    color: #FB9410;
  }
  .tableDatas .noRecord {
    line-height: 200px;
    display: inherit;
    text-align: center;
  }
}
/deep/.popoverList {
  font-size: 12px!important;
}
</style>
<style>
.el-popover{
  word-break: normal!important;
};
</style>