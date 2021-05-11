<template>
  <div class="headcard-contaier">
    <div class="card-left">
      <div class="item">
        <div class="item-left">
          <img width="40px"
               height="40px"
               :src="imgUrl1"
               alt="">
        </div>
        <div class="item-right">
          <p>{{$t('inviteDig')[0]}}</p>
          <p>{{inviteNum}}</p>
        </div>
      </div>
      <div class="vertical-line"></div>
      <div class="item">
        <div class="item-left">
          <img width="40px"
               height="40px"
               :src="imgUrl2"
               alt="">
        </div>
        <div class="item-right">
          <div class="item-top">
            <span>{{$t('inviteDig')[1]}}</span>
            <div>
              <a class="toast-box">
                <img :src="questionImgUrl"
                     alt="">
                <div>
                  {{$t('inviteDig')[8]}}
                  <i></i>
                </div>
              </a>
            </div>
          </div>
          <p class="ellipsis"
             :title="inviteBenefit">{{inviteBenefit}}</p>
        </div>
      </div>
    </div>
    <div class="card-right">
      <div class="item">
        <div class="item-top">
          <span>{{$t('inviteDig')[2]}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('inviteDig')[5]}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <button class="item-bottom"
                :class="account ? '' : 'disabled'"
                @click="handleGetLine">{{$t('invite')[7]}}</button>
      </div>
      <div class="vertical-line"></div>
      <div class="item">
        <div class="item-top">
          <span>{{$t('inviteDig')[3]}}</span>
          <div>
            <a class="toast-box">
              <img :src="questionImgUrl"
                   alt="">
              <div>
                {{$t('inviteDig')[4]}}
                <i></i>
              </div>
            </a>
          </div>
        </div>
        <button class="item-bottom"
                :class="account ? '' : 'disabled'"
                @click="handleActive">{{$t('invite')[8]}}</button>
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
  </div>
</template>

<script>
import { mapState } from 'vuex'
import bus from '../../assets/script/bus'
// 邀请链接弹窗
import InviteUrl from '../InviteUrl';
// 激活弹窗
import Activate from '../Activate';

export default {
  components: {
    InviteUrl,
    Activate
  },
  data () {
    return {
      imgUrl1: require('../../assets/image/yaoqing@2x.png'),
      imgUrl2: require('../../assets/image/shouyi@2x.png'),
      questionImgUrl: require('../../assets/image/question-pc.png'),
      isShowInviteUrl: false,
      isShowActivate: false
    }
  },
  computed: {
    ...mapState({
      account: state => state.account,
      platform: state => state.platform,
      inviteNum: state => state.inviteNum,
      inviteBenefit: state => state.inviteBenefit
    })
  },
  mounted () {
  },
  methods: {
    /**
     * 获取邀请连接
     */
    handleGetLine () {
      if (!this.account) {
        bus.$emit('connectWallet')
        return
      }
      this.isShowInviteUrl = true
    },
    closeInviteUrlHandle () {
      this.isShowInviteUrl = false
    },
    /**
     * 激活
     */
    handleActive () {
      if (!this.account) {
        bus.$emit('connectWallet')
        return
      }
      this.isShowActivate = true
    },
    updateAccountHandle () {
      bus.$emit('initBalance')
    },
    closeActivateHandle () {
      this.isShowActivate = false
    }
  }
}

</script>
<style lang='less' scoped>
.vertical-line {
  width: 1px;
  height: 100%;
  opacity: 0.2;
  border: 1px dashed #06263c;
  margin: 0 49px 0 43px;
}
.headcard-contaier {
  width: 100%;
  height: 135px;
  background: #ffffff;
  box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
  border-radius: 20px;
  display: flex;
  justify-content: space-between;
  .card-left {
    padding: 31px 30px;
    display: flex;
    justify-content: space-between;
    .item {
      display: flex;
      .item-left {
        display: flex;
        align-items: center;
      }
      .item-right {
        display: flex;
        flex-direction: column;
        margin-left: 16px;
        & > p:first-child {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263c;
          line-height: 20px;
          opacity: 0.5;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
        & > p:last-child {
          margin-top: 11px;
          font-size: 26px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263c;
          line-height: 26px;
        }
        & > div:first-child {
          display: flex;
          align-items: center;
          width: 161px;
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263c;
          line-height: 20px;
          span {
            font-size: 14px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #06263c;
            line-height: 20px;
            opacity: 0.5;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        & > div:last-child {
          width: 161px;
          margin-top: 11px;
          font-size: 26px;
          font-family: DINPro-Medium, DINPro;
          font-weight: 500;
          color: #06263c;
          line-height: 26px;
        }
      }
    }
  }
  .card-right {
    display: flex;
    justify-content: space-between;
    padding: 31px 32px;
    .item {
      display: flex;
      flex-direction: column;
      .item-top {
        display: flex;
        align-items: center;
        & > span {
          font-size: 14px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #06263c;
          line-height: 20px;
          opacity: 0.5;
        }
        & > img {
          width: 20px;
          height: 20px;
          margin-left: 6px;
          cursor: pointer;
        }
      }
      .item-bottom {
        margin-top: 13px;
        width: 220px;
        height: 45px;
        background: linear-gradient(80deg, #35beb1 0%, #0c979c 100%);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: #ffffff;
        border: none;
        outline: none;
        cursor: pointer;
      }
      .item-bottom:hover {
        opacity: 0.8;
      }
      .disabled {
        background: rgba(6, 38, 60, 0.06);
        color: rgba(6, 38, 60, 0.5);
      }
    }
  }
}
.toast-box {
  position: relative;
  display: block;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  margin-left: 6px;
  img {
    width: 14px;
    height: 14px;
  }
  div {
    position: absolute;
    left: -11px;
    bottom: 26px;
    width: 230px;
    background: #ffffff;
    box-shadow: 0px 0px 9px 0px rgba(197, 199, 203, 0.5);
    border-radius: 10px;
    padding: 10px;
    font-size: 12px;
    color: rgba(6, 38, 60, 0.5);
    line-height: 20px;
    display: none;
    i {
      position: absolute;
      bottom: -12px;
      left: 12px;
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
</style>