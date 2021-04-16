<!-- 我参与的列表 -->
<template>
  <div class="join-container">
    <div v-if="IsPC()">
      <div class="title-wrapper">
        <span class="title-content" v-for="(item, index) in titleLists" :key="index">{{
          item.name
        }}</span>
      </div>
      <div class="noData" v-if="nodata">
        {{$t('noData')}}
      </div>
      <div v-else>
        <div class="list-wrapper" v-for="(item, index) in contentLists" :key="index">
          <span class="list-item">{{ formatTimeFn(item.timestmp, '-') }}</span>
          <span class="list-item">{{ item.usdtpayed /10**6 }}</span>
          <span class="list-item">{{ getDecimalsCoinFn(item.usdtused /10**6, 2) }}</span>
          <span class="list-item">{{ getDecimalsCoinFn(item.yougoted /10**6, 2) }}</span>
          <span class="list-item">{{ item.state? $t('Success') : $t('Failed') }}</span>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="noData" v-if="nodata">
        {{$t('noData')}}
      </div>
      <div v-else class="list-wrapper-phone" v-for="(item, index) in contentLists" :key="index">
        <div class="list-item"><span>{{ $t("Time") }}</span> <span>{{ formatTimeFn(item.timestmp, '-') }}</span></div>
        <div class="list-item"><span>{{ $t("ParticipatingAmount") }}</span> <span> {{ item.usdtpayed /10**6 }}</span></div>
        <div class="list-item"><span>{{ $t("ActualAmount") }}</span> <span>{{ getDecimalsCoinFn(item.usdtused /10**6, 2)}}</span></div>
        <div class="list-item"><span>{{ $t("Amount") }}</span> <span> {{ getDecimalsCoinFn(item.yougoted /10**6, 2)}}</span></div>
        <div class="list-item"><span>{{ $t("Status") }}</span> <span> {{ item.state? $t('Success') : $t('Failed') }}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
import { request, gql } from "graphql-request";
import { formatTime, getDecimalsCoin } from '../../utils'
export default {
  data() {
    return {
      contentLists: [],
      num: 999, // 每页的数量
      curPage: 1,
      totalPage: 0,
      dataList: [],
      nodata: true,
    };
  },
  computed: {
    titleLists() {
      return [
        {
          id: 0,
          name: this.$t("Time"),
        },
        {
          id: 1,
          name: this.$t("ParticipatingAmount"),
        },
        {
          id: 2,
          name: this.$t("ActualAmount"),
        },
        {
          id: 3,
          name: this.$t("Amount"),
        },
        {
          id: 4,
          name: this.$t("Status"),
        },
      ];
    },
    account() {
      return this.$store.state.walletAddress
    },
  },
  mounted() {
    this.getInviteData(0);
    setInterval(() => {
      this.getInviteData(0);
    }, 2000)
  },
  methods: {
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
    getInviteData(index) {
      let skip = 0;
      if (index) {
        skip = index;
      }
      if (!this.account) {
        return false;
      }
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
          idos(first: ${
            this.num
          } skip: ${skip}, where: {address: "${this.account.toLowerCase()}"}) {
            id
            address
            usdtpayed
            usdtused
            yougoted
            timestmp
            type
            state
          }
        }
      `;
      request(endpoint, query)
        .then((res) => {
          if (res) {
            if (res.idos.length > 0) {
              const priList = [];
              res.idos.forEach(item => {
                priList.push(item)
              })
              this.contentLists = priList;
              this.$store.commit('nodata', false)
              this.nodata = false
            } else {
              this.nodata = true;
              this.$store.commit('nodata', true)
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    /**
     * 上一页
     */
    prePageHandle() {
      if (this.curPage > 1) {
        this.curPage--;
        let skip = this.num * (this.curPage - 1);
        this.getInviteData(skip);
      }
    },
    /**
     * 下一页
     */
    nextPageHandle() {
      if (this.curPage < this.totalPage) {
        this.curPage++;
        let skip = this.num * (this.curPage - 1);
        this.getInviteData(skip);
      }
    },
    formatTimeFn(time, sign) {
      return formatTime(time, sign)
    },
    getDecimalsCoinFn(num, del) {
      return getDecimalsCoin(num, del)
    },
  },
  watch: {
    account() {
      this.getInviteData(0);
    }
  },
};
</script>
<style scoped>
.join-container {
  width: 1200px;
  display: flex;
  flex-direction: column;
  padding: 0 30px;
  background: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
  border-radius: 16px;
  margin-top: 30px;
  box-sizing: border-box;
}
.title-wrapper {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-wrapper {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.list-item {
  width: 20%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #06263c;
  line-height: 20px;
  text-align: center;
}
.title-content {
  width: 20%;
  display: flex;
  justify-content: center;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: #06263c;
  line-height: 20px;
  opacity: 0.5;
}
.list {
  display: flex;
  flex-direction: column;
}
.noData{
  text-align: center;
  padding: 30px 0;
  font-size: 14px;
}
@media screen and (max-width: 1000px) {
  .join-container {
    width: 90vw;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    padding: 0;
    background: transparent;
    box-shadow: none;
    border-radius: 16px;
    color: #fff;
    margin-top: 30px;
    text-align: center;
    box-sizing: border-box;
  }
  .title-wrapper {
    height: 10vw;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .list-wrapper-phone {
    margin-top: 20px;
    background-color: #0b304a;
    border-radius: 16px;
  }
  .list-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    line-height: 4vw;
    padding: 16px 19px;
    box-sizing: border-box;
  }
  .list-item span:nth-child(1) {
    color: #C9CED1;
  }
  .title-content {
    width: 20vw;
    display: inline-block;
    justify-content: flex-start;
    font-size: 3vw;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #fff;
    line-height: 4vw;
    opacity: 0.5;
    text-align: center;
  }
  .list {
    display: flex;
    flex-direction: column;
  }
}
</style>