<template>
  <div class="box">
    <div class="boxFlex">
      <div :class="IsPC()?'listBoxPc':'listBox'">
        <div class="tableTitle">
          <span class="creatCoin">{{$t('myToken')}}</span>
          <button :class="IsPC()?'clickCoinPc':'clickCoin'"
                  @click="goMain">{{$t('oneClickIco')}}</button>
        </div>
        <el-main class="el-main"
                 v-if="IsPC()">
          <el-table :data="tableData"
                    height="100%"
                    style="width: 100%;">
            <template slot="empty">{{$t('noData')}}</template>
            <el-table-column prop="address"
                             :label="$t('tokenContractAddress')"
                             width="265px">
              <template slot-scope='scope'>
                <span>{{ getShowAddressFn(scope.row.address, 6)}}</span>
                <img class="copy"
                     v-if="scope.row.address!= '--'"
                     v-clipboard:copy="scope.row.address"
                     v-clipboard:success="onCopy"
                     referrerpolicy="no-referrer"
                     :src="copyImg" />
                <img class="copy jump"
                     v-if="scope.row.address!= '--'"
                     @click="jump(scope.row)"
                     referrerpolicy="no-referrer"
                     :src="jumpImg" />
              </template>
            </el-table-column>
            <el-table-column prop="name"
                             :label="$t('tokenName')"
                             align="center">
            </el-table-column>
            <el-table-column prop="totalSupply"
                             :label="$t('totalSupply')"
                             align="center">
            </el-table-column>
            <el-table-column prop="type"
                             :label="$t('type')"
                             align="center">
            </el-table-column>
            <!-- <el-table-column prop="holder"
                             label="持有人">
            </el-table-column> -->
            <el-table-column prop="balance"
                             :label="$t('balance')"
                             align="center">
            </el-table-column>
            <el-table-column prop="action"
                             slot=""
                             width="130px"
                             :label="$t('operation')"
                             align="center">
              <template slot-scope="scope">
                <button class="listButton"
                        @click="createPool(scope.row)">{{$t('createPool')}}</button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <div v-if="!IsPC()">
          <div class="card"
               v-if="!tableData.length">
            <div class="noData">{{$t('noData')}}</div>
          </div>
          <div v-else
               class="card">
            <div class="cardList"
                 v-for="(item, index) in tableData"
                 :key="index">
              <div class="line">
                <span>{{$t('tokenContractAddress')}}</span>
                <div class="line-right">
                  <span>{{ getShowAddressFn(item.address, 6)}}</span>
                  <img v-clipboard:copy="item.address"
                       v-clipboard:success="onCopy"
                       class="copy"
                       v-if="item.address != '--'"
                       referrerpolicy="no-referrer"
                       :src="copyImg" />
                  <img class="copy jump"
                       v-if="item.address!= '--'"
                       @click="jump(item)"
                       referrerpolicy="no-referrer"
                       :src="jumpImg" />
                </div>
              </div>
              <div class="line">
                <span>{{$t('tokenName')}}</span>
                <div class="line-right">
                  <span>{{item.name}}</span>
                </div>
              </div>
              <div class="line">
                <span>{{$t('totalSupply')}}</span>
                <div class="line-right">
                  <span>{{item.totalSupply}}</span>
                </div>
              </div>
              <div class="line">
                <span>{{$t('type')}}</span>
                <div class="line-right">
                  <span>{{item.type}}</span>
                </div>
              </div>
              <!-- <div class="line">
              <span>持有人</span>
              <div>
                <span>{{item.name}}</span>
              </div>
            </div> -->
              <div class="line">
                <span>{{$t('balance')}}</span>
                <div class="line-right">
                  <span>{{item.balance}}</span>
                </div>
              </div>
              <div class="line">
                <span>{{$t('operation')}}</span>
                <div class="line-right">
                  <button class="listButton"
                          @click="createPool(item)">{{$t('createPool')}}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ethers } from 'ethers'
import { getShowAddress } from '../../utils/index'
import abiCoin from '../../utils/abiCoin.json'
import abiList from '../../utils/abiList.json'

export default {
  data () {
    return {
      network: true,
      // account: '',
      isConnected: false,
      balance: '--',
      disWalletAddress: '',
      copyImg: require('../../assets/image/copy.png'),
      jumpImg: require('../../assets/image/jump.png'),
      dataHeader: [
        { value: 'address', name: '代币合约地址', slot: true },
        { value: 'name', name: '代币名称' },
        { value: 'totalSupply', name: '总发行量' },
        { value: 'type', name: '类型' },
        { value: 'holder', name: '持有人' },
        { value: 'balance', name: '余额' },
        { value: 'action', name: '操作', slot: true }
      ],
      tableData: [{
        address: '--',
        name: '--',
        totalSupply: '--',
        type: '--',
        holder: '--',
        balance: '--',
      }]
    };
  },
  computed: {
    account () {
      return this.$store.state.account
    },
    currentChainId () {
      return localStorage.getItem('currentChainIdSelect')
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
  },
  mounted () {
    setTimeout(() => {
      this.queryList()
    }, 1000)
  },
  watch: {
    account: {
      handler () {
        this.queryList()
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    queryList () {
      console.log('321321')
      this.loading = true
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(this.NOW_CONTRACT, abiCoin, provider)
      contract.getTokenByUser(this.account).then(res => {
        console.log('获取到到列表信息：====', res)
        if (res.length > 0) {
          let arr = []
          console.log('res.tokens', res)
          res.tokens.forEach((itemToken, indexToken) => {
            res.tokenTypes.forEach((itemType, indexType) => {
              if (indexToken === indexType) {
                this.queryListInfo(itemToken, itemType, indexToken).then(res => {
                  arr.push(res)
                })
              }
            })
          });
          setTimeout(() => {
            this.tableData = arr.sort((a, b) => { return b.sortIndex - a.sortIndex })
            this.loading = false
          }, 1000)
        } else {
          this.tableData = []
        }
      })
    },
    async queryListInfo (contractAddress, type, idx) {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, abiList, provider)
      let list = {
        address: contractAddress,
        sortIndex: idx
      }
      list.type = this.getCoinType(type)
      await contract.name().then(res => {
        list.name = res
      })
      await contract.symbol().then(res => {
        list.symbol = res
      })
      // await contract.holder().then(res => {
      //   list.holders = res
      // })
      await contract.decimals().then(decimals => {
        list.decimals = decimals
      })
      await contract.totalSupply().then(res => {
        list.totalSupply = ethers.utils.formatUnits(res.toString(), list.decimals)
      })
      await contract.balanceOf(this.account).then(res => {
        list.balance = ethers.utils.formatUnits(res.toString(), list.decimals)
      })
      // console.log(list)
      return list
    },
    /**
     * 根据类型判断
     */
    getCoinType (type) {
      switch (type) {
        case 1:
          return this.$t('fixedSupply')
        case 2:
          return this.$t('issuanceOrBurn')
        case 3:
          return this.$t('moonMode')
      }
    },
    // 跳转合约
    jump (item) {
      let currentChainId = localStorage.getItem('currentChainIdSelect');
      if (currentChainId == 56) {
        window.open('https://bscscan.com/address/' + item.address, '_self');
      } else {
        window.open('https://hecoinfo.com/address/' + item.address, '_self');
      }
    },
    onCopy () {
      this.$message.success('复制成功')
    },
    getShowAddressFn (address, sign) {
      if (address != '--') {
        return getShowAddress(address, sign);
      } else {
        return '--';
      }
    },
    createPool (item) {
      if (this.currentChainId == 56) {
        window.open(`${process.env.VUE_APP_CREATE_BSC_COIN_URL}${item.address}`, '_self')
      } else {
        window.open(`${process.env.VUE_APP_CREATE_COIN_URL}${item.address}`, '_self')
      }
    },
    goMain () {
      this.$store.commit('setActiveTab', 1)
      this.$router.push('/main')
    },

    copyText (info) {
      console.log(info)
    },
    cellClass () {
      return 'font-size: 16px;font-family: PingFangSC-Regular, PingFang SC;font-weight: 500;color: #14181F;line-height: 17px;'
    },
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
    }
  }
};
</script>
<style lang='less' scoped>
.box {
  width: 100%;
  .boxFlex {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    .listBox {
      width: 100%;
      margin: 20px 15px 0 15px;
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      margin-bottom: 100px;
      .tableTitle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 20px 20px 20px 20px;
        border-bottom: 1px solid #f8f8f8;
        .creatCoin {
          font-size: 16px;
          font-weight: 500;
          color: #06263c;
          line-height: 22px;
          padding-top: 5px;
        }

        .clickCoin {
          // width: 76px;
          padding: 6px 10px;
          height: 30px;
          background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
          border-radius: 8px;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 17px;
        }
        .clickCoin:hover {
          opacity: 0.8;
        }
      }
      .card {
        width: 100%;
        margin-bottom: 30px;
        .cardList {
          width: 100%;
          margin-top: 20px;
          background: #ffffff;
          border-bottom: 1px solid #f8f8f8;
          .line {
            margin: 0 20px 10px 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            span {
              line-height: 14px;
              font-size: 12px;
              font-family: PingFangSC-Regular, PingFang SC;
              font-weight: 400;
              color: #565b64;
              // line-height: 31px;
            }
            .line-right span {
              color: #14181f;
            }
            button {
              color: #ffffff;
              border: none;
              width: 80px;
              height: 30px;
              background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
              border-radius: 8px;
            }
          }
        }
        .cardList:last-child {
          border: none;
        }
      }
    }
    .listBoxPc {
      width: calc(100% - 80px);
      margin: 40px 0;
      background: #ffffff;
      box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
      border-radius: 10px;
      .el-main {
        padding-bottom: 10px;
        height: auto;
      }
      .tableTitle {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 30px 30px 0 30px;
        margin-bottom: 15px;
        .creatCoin {
          font-size: 18px;
          font-weight: 500;
          color: #06263c;
          line-height: 25px;
          padding-top: 8px;
        }
        .clickCoinPc {
          border: none;
          width: 200px;
          height: 40px;
          background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
          border-radius: 10px;
          font-size: 14px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #ffffff;
          line-height: 20px;
        }
        .clickCoinPc:hover {
          opacity: 0.8;
        }
      }
      .spanStyle {
        color: #35bdb1;
      }
    }
  }
}
.blackColor {
  color: #06263c !important;
}
.pinkColor {
  color: #c154ff !important;
}
.el-table::before {
  height: 0;
}
.listButton {
  margin-left: 10px;
  border: none;
  width: 100px;
  height: 40px;
  border: 1px solid #c154ff;
  border-radius: 10px;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #c154ff;
  line-height: 17px;
  background: none;
}
.listButton:hover {
  border: none;
  background: linear-gradient(72deg, #f7a1aa 0%, #c154ff 100%);
  color: #ffffff;
}
.copy {
  margin-left: 3px;
  width: 12px;
  height: 12px;
}
.jump {
  margin-left: 16px;
}
/deep/.el-table__body-wrapper {
  height: auto !important;
}
.noData {
  line-height: 40px;
  padding-top: 40px;
}
.el-table__body tr:last-child td {
  border-bottom: none !important;
}

/deep/.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #f8f8f8 !important;
}
/deep/.el-table th > .cell {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #14181f;
  line-height: 20px;
}
/deep/.el-table__body tbody td {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #14181f;
  line-height: 22px;
}
/deep/.el-table__body tbody tr td:first-child {
  font-weight: 400 !important;
}
</style>
<style>
.el-table__body tbody tr:last-child td {
  border-bottom: none !important;
}

.el-table td,
.el-table th.is-leaf {
  border-bottom: 1px solid #f8f8f8 !important;
}
</style>
