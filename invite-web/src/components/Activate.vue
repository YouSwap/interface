<template>
  <div class="activate-box"
       @click="cancelHandle">
    <div class="inner-box"
         :class="platform == 2 ? 'pc-wrap' : 'h5-wrap'"
         @click.stop>
      <h1>{{$t('invite')[6]}}</h1>
      <img class="close"
           @click="cancelHandle"
           src="../assets/image/icon-close.png"
           alt="">
      <div class="tab-box">
        <div :class="tabId == 1 ? 'active' : ''"
             @click="switchHandle(1)">{{$t('activate')[0]}}</div>
        <div :class="tabId == 2 ? 'active' : ''"
             @click="switchHandle(2)">{{$t('activate')[1]}}</div>
      </div>
      <template v-if="tabId == 1">
        <div class="single-box">
          <input type="text"
                 @blur="changeHandle"
                 v-model="userAddress"
                 :placeholder="$t('activate')[2]">
        </div>
      </template>
      <template v-if="tabId == 2">
        <div class="batch-box">
          <p>{{$t('activate')[5]}}<a href="../address-demo.xlsx"
               download="address-demo.xlsx">{{$t('activate')[6]}}</a>{{$t('activate')[7]}}<span>{{$t('activate')[19]}}</span>{{$t('activate')[20]}}
          </p>
          <div class="inner">
            <input type="text"
                   v-model="fileName"
                   readonly>
            <div>
              <input type="file"
                     ref="upload"
                     accept=".xls,.xlsx">
              <a href="javascript:;"
                 :class="lang == 'en' ? 'en-version' : ''">{{$t('activate')[8]}}</a>
            </div>
          </div>
        </div>
      </template>
      <a href="javascript:;"
         class="bottom"
         @click="activateHandle">
        <template v-if="loading">
          <loading></loading>
        </template>
        <template v-else>
          {{$t('invite')[8]}}
        </template>
      </a>
    </div>
  </div>
</template>
<script>
import { ethers } from 'ethers'
import abi from '../abi-invite.json'
import XLSX from 'xlsx'
import bus from '../assets/script/bus'
import loading from './loading'
import { request, gql } from 'graphql-request'
import Cookies from 'js-cookie'

export default {
  name: 'activate',
  components: {
    loading
  },
  data () {
    return {
      lang: '',
      fileName: '',
      outputs: [],
      userAddress: '',
      tabId: 1,
      loading: false,
      isInvited: false,
      gasLimit: 300000,
      baseGasLimit: 250000,
      gasPrice: '1'
    };
  },
  props: {
    platform: {
      type: Number,
      require: true
    },
    account: {
      type: String,
      require: true
    }
  },
  mounted () {
    this.lang = Cookies.get('lang') && typeof Cookies.get('lang') === 'string' ? Cookies.get('lang').toLowerCase() : ''
  },
  methods: {
    /**
     * 钱包地址输入验证
     */
    checkAddress (address) {
      if (!(address.length != 42 || address.slice(0, 2) != "0x") && address != "") {
        return true
      }
      return false
    },
    /**
     * 获取邀请合约实例
     */
    async getContract () {
      const contractAddress = process.env.VUE_APP_INVITE_CONTRACT
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abi, provider)
      let contractWithSigner = contract.connect(provider.getSigner())
      return contractWithSigner
    },
    /**
     * 读取表格
     */
    readExcel (e) {
      const that = this
      const files = e.target.files;
      if (files.length <= 0) {//如果没有文件名
        return false;
      } else if (!/\.(xls|xlsx)$/.test(files[0].name.toLowerCase())) {
        console.log(this.$t('activate')[12]);
        return false;
      }

      const fileReader = new FileReader();
      fileReader.onload = async (ev) => {
        try {
          that.fileName = files[0].name
          const data = ev.target.result
          const workbook = XLSX.read(data, {
            type: 'binary'
          });
          const wsname = workbook.SheetNames[0];//取第一张表
          const ws = XLSX.utils.sheet_to_json(workbook.Sheets[wsname]);//生成json表格内容
          that.outputs = [];//清空接收数据
          for (var i = 0; i < ws.length; i++) {
            that.outputs.push(ws[i].address);
          }
          this.$refs.upload.value = '';
        } catch (e) {
          return false;
        }
      };
      fileReader.readAsBinaryString(files[0]);
    },
    /**
     * 获取gasPrice
     */
    getGasValue (tabId) {
      this.$get(process.env.VUE_APP_HECO_GAS_API).then(res => {
        if (res.code == 0) {
          this.gasPrice = res.prices.median
        }
        this.sendAsync(tabId)
      }).catch((err) => {
        console.log(err)
        this.sendAsync(tabId)
      })
    },
    async sendAsync (tabId) {
      let arr = [];
      if (this.loading) {
        return
      }
      this.loading = true
      bus.$emit('showLoading')
      this.$emit('cancel')


      let overrides = {
        gasLimit: this.gasLimit,
        gasPrice: ethers.utils.parseUnits(this.gasPrice.toString(), 'gwei')
      }
      if (tabId == 1) {
        arr = [this.userAddress]
      } else {
        arr = this.outputs
        overrides.gasLimit = this.baseGasLimit * this.outputs.length
      }
      const contract = await this.getContract()
      contract.inviteBatch(arr, overrides).then((res) => {
        console.log(res)
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        let timer = setInterval(() => {
          provider.getTransactionReceipt(res.hash).then((receipt) => {
            console.log(receipt)
            if (receipt) {
              if (receipt.logs.length) {
                setTimeout(() => {
                  if (tabId == 1) {
                    this.$message.success(this.$t('activate')[14])
                  } else {
                    let num = this.getActivateNum(receipt.logs)
                    this.$message.success(this.$t('activate')[14] + '(' + this.$t('activate')[18] + num + ')')
                  }
                  bus.$emit('updateInvite')
                  this.$emit('updateAccount')
                  this.resetInput()
                  bus.$emit('closeLoading')
                  this.loading = false
                }, 3000)
              } else {
                this.$message.warning(this.$t('activate')[15])
                this.resetInput()
                bus.$emit('closeLoading')
                this.loading = false
              }
              clearInterval(timer)
            }
          }).catch((err) => {
            bus.$emit('closeLoading')
            this.loading = false
            this.resetInput()
            console.log(err)
          });
        }, 1000)
      }).catch((err) => {
        bus.$emit('closeLoading')
        this.loading = false
        this.resetInput()
        console.log(err)
        if (err.code == 4001) {
          this.$message.warning(this.$t('activate')[16])
        } else if (err.code == 'INVALID_ARGUMENT') {
          this.$message.warning(this.$t('activate')[17])
        } else {
          this.$message.warning(err.code || this.$t('activate')[15])
        }
      });
    },
    /**
     * 过滤批量邀请的数量
     */
    getActivateNum (arr) {
      let sign = 0
      let len = arr.length
      let defaultUpper = '0x0000000000000000000000000000000000000000000000000000000000000000'
      arr.forEach((item) => {
        item.topics.forEach((subItem) => {
          if (subItem == defaultUpper) {
            sign = 1
          }
        })
      })
      if (sign == 1) {
        len--
      }
      return len
    },
    /**
     * 检测是否被邀请
     */
    checkIsInvited (str, tabId) {
      const endpoint = process.env.VUE_APP_API_GRAPHQL_URL
      const query = gql`
        {
          relationShip(id: "${str.toLowerCase()}") {
            id
            owner
          }
        }
      `
      request(endpoint, query).then((res) => {
        if (!res.relationShip) {
          this.getGasValue(tabId)
        } else {
          if (res.relationShip.owner) {
            let account = this.account.toLowerCase()
            let owner = res.relationShip.owner.toLowerCase()
            if (account == owner) {
              this.$message.success(this.$t('index')[5])
            } else {
              this.$message.success(this.$t('activate')[4])
            }
          }
        }
      }).catch((err) => {
        console.log(err)
        this.getGasValue(tabId)
      })
    },
    /**
     * 激活
     */
    async activateHandle () {
      // this.sendAsync([this.userAddress]);
      let tabId = this.tabId
      if (!this.account) {
        this.$message.warning(this.$t('activate')[5] + this.$t('connect')[0])
        return
      }
      if (tabId == 1) {
        if (!this.userAddress) {
          this.$message.warning(this.$t('activate')[13])
          return false
        } else if (!this.checkAddress(this.userAddress)) {
          this.$message.warning(this.$t('activate')[3])
          return false
        }
        this.checkIsInvited(this.userAddress, tabId)
        this.fileName = ''
      } else {
        if (this.fileName == '') {
          this.$message.warning(this.$t('activate')[5] + this.$t('activate')[8])
          return false
        }
        if (this.outputs.length > 50) {
          this.$message.warning(this.$t('index')[1])
          return
        } else {
          if (this.outputs.length == 0) {
            this.$message.warning(this.$t('index')[7])
            return
          }
        }
        this.getGasValue(tabId)
      }
    },
    cancelHandle () {
      this.resetInput()
      this.$emit('cancel')
    },
    /**
     * 重置激活弹窗内容
     */
    resetInput () {
      this.tabId = 1
      this.userAddress = ''
      this.fileName = ''
    },
    switchHandle (id) {
      if (this.platform == 1 && id == 2) {
        this.$message.warning(this.$t('index')[8])
      } else {
        this.tabId = id
      }
      this.userAddress = ''
      // this.$refs.upload.value = ''
      this.fileName = ''
      if (this.tabId == 2) {
        this.$nextTick(() => {
          this.$refs.upload.addEventListener('change', e => {//绑定监听表格导入事件
            this.readExcel(e)
          })
        })
      }
    },
    async changeHandle () {
    }
  }
};
</script>
<style lang="less" scoped>
.activate-box {
  width: 100%;
  height: 100%;
  background: rgba(68, 68, 68, 0.5);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1999;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  font-size: 16px;
  .inner-box.pc-wrap {
    position: relative;
    width: 420px;
    padding: 30px;
    margin: 200px 0 0;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 20px;
    h1 {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #06263c;
      line-height: 25px;
    }
    .close {
      position: absolute;
      top: 30px;
      right: 30px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .tab-box {
      margin: 29px auto 30px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 360px;
      height: 50px;
      padding: 6px;
      box-sizing: border-box;
      background: rgba(4, 67, 163, 0.06);
      border-radius: 10px;
      & > div {
        width: 174px;
        height: 38px;
        line-height: 38px;
        text-align: center;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263c;
        font-weight: 500;
        border-radius: 10px;
        cursor: pointer;
      }
      & > div.active {
        font-family: PingFangSC-Medium, PingFang SC;
        color: #ffffff;
        background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      }
    }
    .single-box {
      input {
        width: 360px;
        height: 45px;
        padding: 0 12px;
        border-radius: 10px;
        border: 1px solid #e6e9eb;
      }
    }
    .batch-box {
      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(6, 38, 60, 0.5);
        line-height: 20px;
        a {
          color: #0c979c;
          margin: 0 3px;
          font-size: 18px;
        }
        a:hover {
          opacity: 0.7;
        }
        span {
          color: red;
        }
      }
      .inner {
        margin: 30px 0 0;
        display: flex;
        justify-content: space-between;
        & > input {
          width: 240px;
          height: 45px;
          padding: 0 21px;
          border-radius: 10px;
          border: 1px solid #e6e9eb;
        }
        div {
          position: relative;
          width: 110px;
          height: 45px;
          a {
            width: 110px;
            height: 45px;
            display: block;
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
            border-radius: 10px;
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #ffffff;
            line-height: 45px;
            text-align: center;
          }
          a.en-version {
            line-height: 20px;
          }
          input {
            position: absolute;
            left: 0;
            top: 0;
            width: 110px;
            height: 45px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
    }
    .bottom {
      display: block;
      width: 360px;
      height: 45px;
      background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      border-radius: 10px;
      margin: 20px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #ffffff;
      cursor: pointer;
    }
    .bottom:hover {
      opacity: 0.9;
    }
  }
  .inner-box.h5-wrap {
    position: relative;
    width: 85%;
    padding: 10px;
    margin: 100px 20px 0;
    box-sizing: border-box;
    background: #ffffff;
    border-radius: 10px;
    h1 {
      font-size: 18px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #06263c;
      line-height: 25px;
    }
    .close {
      position: absolute;
      top: 10px;
      right: 15px;
      width: 24px;
      height: 24px;
      cursor: pointer;
    }
    .tab-box {
      margin: 10px auto 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 50px;
      padding: 6px;
      box-sizing: border-box;
      background: rgba(4, 67, 163, 0.06);
      border-radius: 10px;
      & > div {
        width: 174px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263c;
        font-weight: 500;
        border-radius: 10px;
        cursor: pointer;
        font-size: 12px;
      }
      & > div.active {
        font-family: PingFangSC-Medium, PingFang SC;
        color: #ffffff;
        background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      }
    }
    .single-box {
      input::-webkit-input-placeholder {
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(6, 38, 60, 0.5);
      }
      input {
        width: 100%;
        height: 38px;
        overflow: hidden;
        padding: 0 21px;
        border-radius: 10px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        border: 1px solid #e6e9eb;
      }
    }
    .batch-box {
      p {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(6, 38, 60, 0.5);
        line-height: 20px;
        a {
          font-size: 18px;
          color: #0c979c;
          margin: 0 3px;
        }
        span {
          color: red;
        }
      }
      .inner {
        margin: 10px 0 0;
        display: flex;
        justify-content: space-between;
        & > input {
          flex: 1;
          height: 45px;
          padding: 0 10px;
          border-radius: 10px;
          border: 1px solid #e6e9eb;
        }
        div {
          position: relative;
          height: 45px;
          margin-left: 10px;
          a {
            display: flex;
            align-items: center;
            height: 45px;
            background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
            border-radius: 10px;
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            color: #ffffff;
            line-height: 45px;
            text-align: center;
          }
          a.en-version {
            line-height: 20px;
          }
          input {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 45px;
            opacity: 0;
            cursor: pointer;
          }
        }
      }
    }
    .bottom {
      height: 45px;
      background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
      border-radius: 10px;
      margin: 10px auto 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      color: #ffffff;
      cursor: pointer;
    }
  }
}
</style>
