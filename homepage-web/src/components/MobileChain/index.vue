<template>
  <div class="net-wrapper">
    <div class="blank"
         @click="hideHandle"></div>
    <div class="inner">
      <div class="title">{{$t('network.switch')}}</div>
      <div class="net-list">
        <p class="active"><i></i><a :href="youswapHECO">{{$t('network.heco')}}</a></p>
        <p><i></i><a :href="youswapETH">{{$t('network.eth')}}</a></p>
        <p><i></i><a :href="youswapBSC">{{$t('network.bsc')}}</a></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {
  },
  data () {
    return {
      youswapETH: process.env.VUE_APP_YOUSWAP_ETH,
      youswapHECO: process.env.VUE_APP_YOUSWAP_HECO,
      youswapBSC: process.env.VUE_APP_YOUSWAP_BSC
    }
  },
  mounted () {

  },
  methods: {
    hideHandle () {
      this.$emit('close')
    }
  }
}

</script>
<style lang='less' scoped>
.net-wrapper {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  z-index: 100;
  .blank {
    flex: 1;
  }
  .inner {
    width: 100%;
    background: #fff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px 10px 0px 0px;
    padding: 20px 15px;
    .title {
      padding-bottom: 10px;
      font-size: 16px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: #06263c;
    }
    .net-list {
      p {
        display: flex;
        align-items: center;
        height: 50px;
        line-height: 50px;
      }
      p:first-child {
        border-bottom: 1px solid #f8f8f8;
      }
      i {
        width: 4px;
        height: 4px;
        display: inline-block;
        margin-right: 10px;
        border-radius: 50%;
        background: #bfc6cb;
      }
      a {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: #06263c;
        line-height: 20px;
      }
      .active {
        i {
          background: #35bdb1;
        }
      }
    }
  }
}
.disabled a {
  color: #bfc6cb !important;
}
</style>