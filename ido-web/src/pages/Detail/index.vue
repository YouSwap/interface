<template>
  <div class="detail-container">
    <div class="top-bg-wrapper">
      <div class="card-wrapper">
        <div class="card-left">
          <div class="card-top">
            <img :src="coinUrl" alt="" />
            <div class="coin-content-wrapper">
              <span class="coin-text">YouSwap Token</span>
              <button class="receive-status">{{showStatus}}</button>
            </div>
          </div>
          <p class="token">{{ $store.state._youAddress }}</p>
          <div class="button-wrapper">
            <button
              v-if="walletAddress"
              :disabled= "!(walletAddress && status === 1)"
              :class="!(walletAddress && status === 1)?'join-btn-disabled': ''"
              @click="centerDialogVisible = true; usdt = ''"
              class="join-btn">
              + {{ $t("Participate") }}
            </button>

            <el-button class="join-btn" :loading="approve_loding" v-if="walletAddress && !(status !== 0)" :class="allowance? 'join-btn-disabled':''">
              <span v-if="allowance">{{$t('Authorized')}}</span>
              <span v-else @click="approve">{{$t('Authorize')}}</span>
            </el-button>
            <button v-if="!walletAddress" @click="handleConnectWallet" class="join-btn">
              {{$t('ConnectWallet_add')}}
            </button>
            <button class="search-btn">
              <a :href="href" target="_blank"
                >{{ $t("View") }} Etherscan
              </a>
            </button>
          </div>
          <div class="tips">{{$t('detail_tips')}}</div>
          <!-- <p class="tips" v-if="isInWhiteList">{{ $t("whitelisted") }} 待修改</p>
          <p class="tips" v-else>
            {{ $t("priClick")
            }}<a
              href="https://forms.gle/Uqq4LsTf49NVkPtF9"
              target="_blank"
              class="clickTo"
              >{{ $t("clickGet") }}</a
            >{{ $t("qualification") }} 待修改
          </p> -->
        </div>
        <div class="card-right">
          <time-card></time-card>
        </div>
      </div>
    </div>
    <div class="content-wrapper-bg">
      <div class="content-wrapper">
        <div class="tab-wrapper">
          <div
            class="tab"
            v-for="(item, index) in tabs"
            :key="item.id"
            :class="{ actived: num == index }"
            @click="num = index"
          >
            {{ item.tabName }}
          </div>
          <el-button
            type="primary"
            @click="getYou"
            class="getYou"
            v-if="showGetYouBtn"
            :class="!isNotShowGetYou ? 'getYouDisabled' : ''"
            :loading="getYouLoading"
            :disabled="!isNotShowGetYou"
            >
            <span v-if="isNotShowGetYou">{{ $t("ClaimYOU") }}</span>
            <span v-else>{{ $t("ClaimSuccess") }}</span>
          </el-button>
        </div>
        <SwapPoolDetail style="margin-top: 30px" v-show="num == 0" />
        <JoinList v-show="num == 1" />
      </div>
    </div>
    <el-dialog
      custom-class="dialog"
      :title="dialogTitle"
      :visible.sync="centerDialogVisible"
    >
      <div class="input_line">
        <el-input
          placeholder=""
          v-model="usdt"
          @input="getTrueNumber(usdt)"
        ></el-input>
        <span>USDT</span>
      </div>
      <div class="desc">
        <span
          >{{ $t("CurrentRate") }}：<span
            >1 YOU =
            {{
              $store.state.youPriceOfPriIEO
                ? $store.state.youPriceOfPriIEO
                : "..."
            }}
            USDT</span
          ></span
        >
        <span>{{ $t("Balance") }}：<span>{{ $store.state.usdtBalanceOf }} USDT</span></span>
      </div>
      <div v-if="error_tip && error_type" class="error_tip">
        *{{ $t("MinAllocationL") }}
        {{ this.$store.state.bottomLimitUsdtOfPubIDO }} USDT
      </div>
      <div v-if="error_tip && !error_type" class="error_tip">
        {{ $t("InsufficientBalance") }}
      </div>
      <!-- <div class="input_line">
        <el-input disabled placeholder="" v-model="you"></el-input>
        <span>YOU</span>
      </div> -->
      <div v-if="!loading && status === 1 && allowance && !error_tip && usdt">
        <div class="priceTitle" v-if="priceList.length">{{$t('GasPrice')}}</div>
        <div class="priceList">
          <div class="price_list" v-for="(list, index) in priceList" :class="list.active?'activepriceList':''" :key="index" @click="selectPriceList(list.id)">
            <span>{{ list.name }}</span>
            <span> {{ list.value }} (gwei)</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          :load="approve_loding"
          :class="!(!approve_loding && status === 1) || allowance ? 'isAllowance' : ''"
          :disabled="!(!approve_loding && status === 1) || allowance" @click="approve">
          <span v-if="!approve_loding">{{ allowance ? $t("Authorized") : $t("Authorize") }}</span>
          <span v-else>{{allowance ? $t("Authorized") : $t("Authorizeing")}}</span>
        </el-button>
        <!--  -->
        <el-button
          :class="!loading && status === 1 && allowance && !error_tip && usdt ? '' : 'disabled'"
          :disabled="!(!loading && status === 1 && allowance && !error_tip && usdt)"
          :loading="loading"
          @click="publicOffering"
          type="primary"
          >{{ $t("Swap") }}</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import TimeCard from "../../components/TimeCard";
import SwapPoolDetail from "../../components/SwapPoolDetail";
import JoinList from "../../components/JoinList";
import { ethers } from "ethers";
import { abi_usdt } from "../../utils/abi_usdt";
import { abi } from "../../utils/abi";
import { floatDivide } from "../../utils";
import { request, gql } from "graphql-request";
// import lodash from 'lodash'


export default {
  components: {
    TimeCard,
    SwapPoolDetail,
    JoinList,
  },
  data() {
    return {
      num: "0",
      coinUrl: require("../../assets/default_coin.png"),
      centerDialogVisible: false,
      usdt: "",
      confirmations: localStorage.getItem("confirmations") || 1,
      error_tip: false,
      error_type: "",
      disabled: true,
      loading: false,
      allowance: false,
      approve_loding: false,
      getYouLoading: false,
      getYouDisabled: false,
      isNotShowGetYou: '',
      showAppove_loding: false,
      href:'',
      gasPrice: {},
      priceList: [],
      NowGasPrice: 180,
      approvedUsdt: '',   //授权usdt的额度
      pricanclaim: '',
      pubcanclaim: '',
    };
  },
  computed: {
    tabs() {
      return [
        {
          id: 0,
          tabName: this.$t("Pools"),
        },
        {
          id: 1,
          tabName: this.$t("MyParticipate"),
        },
      ];
    },
    dialogTitle() {
      return `${this.$t("Swap")} You`;
    },
    status() {
      return this.$store.state.status;
    },
    showStatus() {
      if (this.status === 0) {
        return this.$t('NotStarted')
      }
      if (this.status === 1) {
        return this.$t('InProgress')
      }
      if (this.status === 2) {
        return this.$t('Finish')
      }
      return '--'
    },
    isInWhiteList() {
      return this.$store.state.isInWhiteList;
    },
    noActive() {
      return this.status === 1 && this.isInWhiteList;
    },
    you() {
      return floatDivide(this.usdt, this.$store.state.youPriceOfPriIEO)
    },
    noData() {
      return this.$store.state.nodata;
    },
    walletAddress() {
      return this.$store.state.walletAddress;
    },
    showAppove() {
      return this.status === 0 && this.isInWhiteList
    },
    showGetYouBtn()  {
      if (!this.noData && this.walletAddress && this.pricanclaim) {
        return true
      }
      if (!this.noData && this.walletAddress && this.pubcanclaim && this.status === 2) {
        return true
      }
      return false
    },
    usdtBalanceOf() {
      return this.$store.state.usdtBalanceOf
    },
    bottomLimitUsdtOfPubIDO () {
      return this.$store.state.bottomLimitUsdtOfPubIDO
    }
  },
  mounted() {
    setTimeout(this.allowanceUser, 2000);
    setInterval(() => {
      this.isShowGetYou();
    }, 3000);
    this.href = `https://etherscan.io/address/${process.env.VUE_APP_You_ADDRESS}`
    this.getGasPrice();
  },
  methods: {
    // 一键领取
    getYou() {
      let overrides = {
        // The maximum units of gas for the transaction to use
        gasLimit: 210000,
        // The price (in wei) per unit of gas
        gasPrice: ethers.utils.parseUnits(this.NowGasPrice.toString(), "gwei"),
      };
      const contractAddress = process.env.VUE_APP_IDO_ADDRESS;
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const contract = new ethers.Contract(
        contractAddress,
        abi,
        provider
      ).connect(provider.getSigner());
      contract.claim(overrides).then((claim) => {
        // console.log('claim', claim)
        // provider.once(claim.hash, (receipt) => {
        //   console.log('Transaction Minded: ' + receipt.hash);
        //   console.log(receipt);
        // })
        this.getYouLoading = true;
        this.getYouDisabled = true;
        const timer = setInterval(() => {
          provider.getTransactionReceipt(claim.hash).then((receipt) => {
            if (receipt) {
              clearInterval(timer);
              if (receipt.logs.length > 0) {
                this.getYouLoading = false;
                this.getYouDisabled = true;
                this.$messages.success(this.$t("ClaimSuccess"));
              } else {
                this.getYouLoading = false;
                this.getYouDisabled = false;
                this.$messages.error(this.$t("ClaimFailed"));
              }
            }
          });
        }, 1000);
      });
    },
    // 授权usdt
    approve() {
      // usdt token去授权
      if (this.allowance) {
        return
      } else {
        const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
        const contractUSDT = new ethers.Contract(
          process.env.VUE_APP_USDT_ADDRESS,
          abi_usdt,
          provider
        );
        const contractWithSigner = contractUSDT.connect(provider.getSigner());
        contractWithSigner.approve(process.env.VUE_APP_IDO_ADDRESS, 10000000 * 10 ** 6).then((approve) => {
          this.confirmations = "0";
          this.showAppove_loding = true;
          this.approve_loding = true;
          approve.wait(abi_usdt).then((res) => {
            this.approve_loding = false;
            this.showAppove_loding = false;
            localStorage.setItem("confirmations", res.confirmations);
            this.confirmations = "1";
            this.$messages.success(this.$t("AuthorizedSuccess"));
            this.allowanceUser();
          });
        });
      }
    },
    // 查看当前用户是否授权
    allowanceUser() {
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const contractUSDT = new ethers.Contract(
        process.env.VUE_APP_USDT_ADDRESS,
        abi_usdt,
        provider
      );
      contractUSDT
        .allowance(
          this.$store.state.walletAddress,
          process.env.VUE_APP_IDO_ADDRESS
        )
        .then((allowance) => {
          if (allowance.toNumber() > 0) {
            this.allowance = true;
            this.approvedUsdt = allowance.toNumber()/10**6;
          } else {
            this.allowance = false;
          }
        });
    },
    // 兑换
    publicOffering() {
      const contractAddress = process.env.VUE_APP_IDO_ADDRESS;
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      // const provider = (typeof window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : ethers.getDefaultProvider(process.env.VUE_APP_NETWORK_NAME);
      const contract = new ethers.Contract(contractAddress, abi, provider);
      const contractWithSigner = contract.connect(provider.getSigner());
      let overrides = {
        // The maximum units of gas for the transaction to use
        gasLimit: 210000,
        // The price (in wei) per unit of gas
        gasPrice: ethers.utils.parseUnits(this.NowGasPrice.toString(), "gwei"),
      };
      contractWithSigner
        .publicOffering(this.usdt * 10 ** 6, overrides)
        .then((publicOffering) => {
          if (publicOffering) {
            this.centerDialogVisible = false;
            const timer = setInterval(() => {
              provider.getTransactionReceipt(publicOffering.hash).then((receipt) => {
                if (receipt) {
                  clearInterval(timer);
                  if (receipt.logs.length > 0) {
                    this.$messages.success(this.$t("SwapSuccess"));
                    this.allowanceUser();
                  } else {
                    this.$messages.error(this.$t("SwapFailed"));
                  }
                }
              });
            }, 1000);
          }
        });
    },
    handleConnectWallet() {
      if (typeof window.ethereum !== "undefined") {
        // 连接钱包
        // 获取当前网络
        if (this.$store.state.network) {
          window.ethereum
            .request({ method: "eth_requestAccounts" })
            .then((res) => {
              this.$store.commit("walletAddress", res.result[0]);
            });
        } else {
          this.$messages.error(this.$t('Wrongnetwork'));
        }
      } else {
        window.open("https://metamask.io/", "_blank");
      }
    },
    /* eslint-disable */
    getTrueNumber(value) {
      this.usdt = value.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    },
    /* eslint-disable */
    isShowGetYou() {
      const endpoint = process.env.VUE_APP_NODE_ADDRESS;
      /**
       *  usdtpayed   // 参与数量（USDT)
          usdtused    // 实际成功数量（USDT)
          yougoted    // 数量（YOU)
          timestmp      // 时间
          type         // 公还是私
          state        // 状态
       */
      const query = gql`
        {
        idoUser(id: "${this.walletAddress.toLowerCase()}") {
          id
          pubcanclaim
          pricanclaim
        }
      }
      `;
      request(endpoint, query)
        .then((res) => {
          this.isNotShowGetYou = res.idoUser?.pricanclaim || res.idoUser?.pubcanclaim
          this.pricanclaim = res.idoUser?.pricanclaim
          this.pubcanclaim = res.idoUser?.pubcanclaim
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getGasPrice() {
      const params = {
        module: 'gastracker',
        action: 'gasoracle',
        apikey: process.env.VUE_APP_APIKEY
      }
      this.$axios({
        params,
        method: 'get',
        url: 'https://api-cn.etherscan.com/api'
      }).then((res) => {
        if (res.data.status.toString() === '1') {
          this.gasPrice = res.data.result;
          this.priceList = [
            { 
              id: 1,
              name: this.$t('Medium'),
              value: this.gasPrice.SafeGasPrice,
              active: false,
            },
            { 
              id: 2,
              name: this.$t('FastGwei'),
              value: this.gasPrice.ProposeGasPrice,
              active: true,
            },
            { 
              id: 3,
              name: this.$t('veryFast'),
              value: this.gasPrice.FastGasPrice,
              active: false,
            }
          ];
          this.selectPriceList(2);
        }
        /**
         * FastGasPrice: "171"
          LastBlock: "12056110"
          ProposeGasPrice: "142"
          SafeGasPrice: "131"
         */
      })
    },
    selectPriceList(id) {
      this.priceList.forEach(item => {
        if (id === item.id) {
          item.active = true
          this.NowGasPrice = item.value
        } else {
          item.active = false
        }
      })
    },
  },
  watch: {
    usdt(val) {
      if (val === '') {
        this.error_tip = false;
        return
      }
      if (val > this.usdtBalanceOf) {
        this.error_tip = true;
        this.error_type = 0;
        return
      } else {
        this.error_tip = false;
      }
      if (val > this.approvedUsdt) {
        this.allowance = false;
        return
      } else {
        this.allowance = true;
      }
      if (val < this.bottomLimitUsdtOfPubIDO) {
        this.error_tip = true;
        this.error_type = 1;
        return
      } else {
        this.error_tip = false;
      }
    },
    centerDialogVisible(val) {
      if (val) {
        this.getGasPrice();
      }
    }
  },
};
</script>
<style scoped>
.detail-container {
  width: 100%;
}
.top-bg-wrapper {
  width: 100%;
  /* background: url('../../assets/top-bg.png') no-repeat center; */
  /* position: absolute; */
  left: 0;
  top: 0;
  display: flex;
  justify-content: space-between;
}
.card-left {
  margin-top: 90px;
  display: flex;
  flex-direction: column;
}
.card-top {
  display: flex;
  flex-direction: column;
}
.card-top > img {
  width: 60px;
  height: 60px;
}
.coin-content-wrapper {
  display: flex;
  margin-top: 17px;
  align-items: center;
}
.coin-text {
  font-size: 30px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #fffdfa;
  line-height: 38px;
}
.receive-status {
  height: 30px;
  background: rgba(255, 180, 0, 0.2);
  border-radius: 10px;
  margin-left: 30px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  line-height: 20px;
  border: none;
  color: #fae05b;
  padding: 0 10px;
}
.token {
  font-size: 24px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #fffdfa;
  line-height: 31px;
  margin-top: 16px;
}
.button-wrapper {
  display: flex;
  margin-top: 49px;
  align-items: center;
}
.join-btn {
  padding: 0 15px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
  border-radius: 8px;
  border: none;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fff;
  line-height: 22px;
  cursor: pointer;
  outline: none;
  margin-right: 30px;
}
.join-btn-disabled {
  opacity: 0.5;
  background: #999!important;
}
.activeJoin {
  background: #244761 !important;
  color: #999;
}
.join-btn:hover {
  opacity: 0.8;
}
.search-btn {
  width: 185px;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #fffdfa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fffdfa;
  line-height: 22px;
  background-color: transparent;
  outline: none;
  cursor: pointer;
}
.search-btn a {
  display: block;
  color: #fff;
}
.search-btn:hover {
  opacity: 0.8;
}
.tips {
  margin-top: 50px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #ffffff;
  line-height: 25px;
  width: 80%;
}
.tips a {
  color: #69eecb;
  text-decoration: underline;
}
.tips a:hover {
  color: #999;
}
.card-right {
  margin-top: 82px;
}
.card-wrapper {
  width: 1200px;
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
}
.content-wrapper-bg {
  width: 100%;
  background-color: #fff;
}
.content-wrapper {
  width: 1200px;
  display: flex;
  flex-direction: column;
  padding-top: 100px;
  margin: 40px auto 0 auto;
  padding-bottom: 200px;
}
.tab-wrapper {
  display: flex;
}
.tab {
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #06263c;
  line-height: 16px;
  margin-right: 40px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tab:hover {
  opacity: 0.8;
}
.actived {
  font-size: 20px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #06263c;
  line-height: 28px;
  cursor: pointer;
}
.getYou {
  padding: 0 15px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
  border-radius: 8px;
  border: none;
  font-size: 14px;
  font-family: PingFangSC-Medium, PingFang SC;
  font-weight: 500;
  color: #fff;
  line-height: 22px;
  cursor: pointer;
  outline: none;
  margin-left: auto;
}
.dialog-footer .disabled {
  opacity: 0.4;
}
.isAllowance {
  opacity: 0.4;
}
.priceTitle {
  color: #000;
  font-size: 14px;
  padding-top: 10px;
}
.priceList {
  display: flex;
  justify-content:space-between;
  margin-top: 20px;
}
.priceList>div {
  border: 1px solid #35BDB1;
  font-size: 10px;
  padding: 10px;
  box-sizing: border-box;
  border-radius: 10px;
  color: #000;
}
.activepriceList {
  background-color: #35BDB1;
  color: #fff!important;
  box-sizing: border-box;
}
/deep/.is-disabled:hover {
  background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
  opacity: 0.4;
  color: #fff;
}
@media screen and (max-width: 1000px) {
  .card-wrapper {
    width: 100vw;
    display: flex;
    justify-content: center;
    margin: 0 auto;
    flex-wrap: wrap;
  }
  .card-left {
    width: 90vw;
    margin-top: 10vw;
    display: flex;
    flex-direction: column;
  }
  .card-top {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .card-top > img {
    width: 24px;
    height: 24px;
  }
  .coin-content-wrapper {
    display: flex;
    align-items: flex-start;
    align-items: center;
    margin-left: 12px;
    margin-top: 0;
  }
  .coin-text {
    font-size: 18px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #fffdfa;
    line-height: 38px;
    white-space: nowrap;
  }
  .receive-status {
    height: 30px;
    border-radius: 10px;
    margin-left: 21px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    line-height: 20px;
    border: none;
    color: #fae05b;
    white-space: nowrap;
  }
  .token {
    font-size: 3vw;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #fffdfa;
    line-height: 31px;
    margin-top: 16px;
  }
  .button-wrapper {
    display: flex;
    margin-top: 30px;
    align-items: center;
  }
  .join-btn {
    height: 36px;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
    border-radius: 8px;
    border: none;
    font-size: 3vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #ffffff;
    line-height: 22px;
    cursor: pointer;
    outline: none;
    white-space: nowrap;
    margin-right: 20px;
  }
  .join-btn:hover {
    opacity: 0.8;
  }
  .search-btn {
    width: auto;
    height: 36px;
    border-radius: 10px;
    padding: 0 10px;
    border: 1px solid #fffdfa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 3vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fffdfa;
    line-height: 22px;
    background-color: transparent;
    outline: none;
    cursor: pointer;
  }
  .search-btn:hover {
    opacity: 0.8;
  }
  .tips {
    margin-top: 30px;
    font-size: 2.8vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #ffffff;
    line-height: 4vw;
  }
  .card-right {
    margin-top: 30px;
  }
  .content-wrapper-bg {
    width: 100%;
    background-color: transparent;
  }
  .content-wrapper {
    width: 90vw;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
    margin: 0 auto 0 auto;
    padding-bottom: 200px;
  }
  .tab-wrapper {
    display: flex;
  }
  .tab {
    min-width: 20vw;
    width: auto;
    font-size: 3vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 5vw;
    margin-right: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tab:hover {
    opacity: 0.8;
  }
  .actived {
    font-size: 4vw;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #fff;
    line-height: 5vw;
    cursor: pointer;
  }
}
</style>
<style>
.dialog {
  border-radius: 20px;
  width: 480px;
}
.dialog .el-dialog__footer {
  text-align: center;
}
.dialog .el-dialog__footer button {
  width: 200px;
  background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
  border-radius: 10px;
  color: #fff;
  border: none;
}
.dialog .el-dialog__body {
  padding: 20px 36px;
}
.dialog .el-dialog__footer {
  padding: 0px 20px 30px;
}
.dialog .el-input__inner {
  border-radius: 10px;
  border: 1px solid #e6e9eb;
}
.dialog .el-input__inner:focus {
  border: 1px solid #06999e;
}
.dialog .desc {
  margin: 10px 0 10px 0;
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #06263c;
  line-height: 16px;
  display: flex;
  justify-content: space-between;
}
.dialog .input_line {
  position: relative;
}
.dialog .input_line > span {
  display: block;
  width: 40px;
  position: absolute;
  right: 10px;
  top: 13px;
  color: #06263c;
  font-size: 14px;
}
.dialog .error_tip {
  font-size: 12px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #fe535b;
  line-height: 16px;
  margin-bottom: 10px;
}
.getYouDisabled {
  background: #244761 !important;
  opacity: 0.4;
}
@media screen and (max-width: 1000px) {
  .dialog {
    border-radius: 20px;
    width: 90vw;
    font-size: 5vw;
    padding: 3vw;
  }
  .dialog .el-dialog__title {
    font-size: 4vw;
  }
  .dialog .el-dialog__headerbtn {
    font-size: 5vw;
    top: 5vw;
    right: 5vw;
  }
  .dialog .el-dialog__header {
    padding: 3vw;
  }
  .dialog .input_line {
    height: 10vw;
  }
  .dialog .el-input__inner {
    height: 10vw;
  }
  .dialog .el-dialog__footer {
    text-align: center;
  }
  .dialog .el-dialog__footer button {
    width: 45%;
    height: 11vw;
    background: linear-gradient(80deg, #69eecb 0%, #0c979c 100%);
    border-radius: 10px;
    color: #fff;
    border: none;
    font-size: 3vw;
    margin-top: 20px;
  }
  .dialog .el-dialog__body {
    padding: 20px 6px 0 6px;
  }
  .dialog .el-dialog__footer {
    padding: 0 0 20px 0;
  }
  .dialog .el-input__inner {
    border-radius: 10px;
    border: 1px solid #e6e9eb;
    font-size: 3vw;
    padding-left: 4vw;
  }
  .dialog .el-input__inner:focus {
    border: 1px solid #06999e;
  }
  .dialog .desc {
    margin: 3vw 0 3vw 0;
    font-size: 3vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #06263c;
    line-height: 4vw;
    display: flex;
    justify-content: space-between;
  }
  .dialog .desc > span> span {
    display: block;
  }
  .dialog .input_line {
    position: relative;
  }
  .dialog .input_line > span {
    display: block;
    width: 10vw;
    position: absolute;
    right: 2vw;
    top: 3.4vw;
    color: #06263c;
    font-size: 3vw;
  }
  .dialog .error_tip {
    font-size: 3vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fe535b;
    line-height: 16px;
    margin-bottom: 3vw;
  }
  .priceList {
    display: flex;
    justify-content:space-between;
    margin-top: 20px;
  }
  .priceList>div {
    border: 1px solid #35BDB1;
    font-size: 10px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 10px;
    color: #000;
  }
  .priceList>div>span {
    display: block;
    text-align: center;
    line-height: 15px;
  }
  .activepriceList {
    background-color: #35BDB1;
    color: #fff!important;
  }
}
</style> 