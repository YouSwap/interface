<template>
  <div class="invite-box" @click="cancelHandle">
    <div class="inner-box" :class="platform == 2 ? 'pc-wrap' : 'h5-wrap'" @click.stop>
      <div class="notice" id="generate-box">
        <template v-if="lang == 'zh'">
          <img src="../assets/image/poster-zh-heco.png" alt="">
        </template>
        <template v-else>
          <img src="../assets/image/poster-en-heco.png" alt="">
        </template>
        <!-- <h1>邀请好友，共享收益</h1>
        <p>和好友一起加入YouSwap，做最富矿主</p> -->
        <div class="code-box">
          <template v-if="platform == 2">
            <qrcode :value="url" :options="{ width: 90 }"></qrcode>
          </template>
          <template v-else>
            <qrcode :value="url" :options="{ width: 90 }"></qrcode>
          </template>
				</div>
      </div>
      <div class="bottom">
        <template v-if="platform == 2">
          <a class="confirm" href="javascript:;" @click="shareHandle">{{$t('invite')[18]}}</a>
        </template>
        <template v-else>
          <a class="confirm" href="javascript:;" :class="lang == 'en' ? 'en-version' : ''">{{$t('share')[4]}}</a>
        </template>
        <a class="cancel"
          href="javascript:;"
          v-clipboard:copy="url"
          v-clipboard:success="onCopy">{{$t('invite')[19]}}</a>
      </div>
    </div>
  </div>
</template>
<script>
// 二维码生成器
import qrcode from '@chenfengyuan/vue-qrcode';
import html2canvas from 'html2canvas'

export default {
  name: 'inviteUrl',
  components: {
    qrcode
  },
  data() {
    return {
      lang: '',
      url: ' '
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
  mounted() {
    this.lang = localStorage.getItem('lang')
    this.createShareUrl()
  },
  methods: {
    createShareUrl() {
      let url = location.href
      let arr = url.split('?')
      if (url.indexOf('?') == -1) {
        if (url.indexOf('invite') == -1) {
          this.url = url + 'invite?address=' + this.account
        } else {
          this.url = url + '?address=' + this.account
        }
      } else {
        if (url.indexOf('invite') == -1) {
          if (url.indexOf('address=') == -1) {
            this.url = arr[0] + 'invite?' + arr[1] + '&address=' + this.account
          } else {
            this.url = url.split('?')[0] + 'invite?address=' + this.account
          }
        } else {
          if (url.indexOf('address=') == -1) {
            this.url = url + '&address=' + this.account
          } else {
            this.url = url.split('?')[0] + '?address=' + this.account
          }
        }
      }
      console.log(this.url)
    },
    shareHandle() {
      let that = this
      window.pageYOffset = 0
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
      // var scrollTop = document.documentElement.scrollTop||document.body.scrollTop
      setTimeout(() => {
        let dom = document.getElementById('generate-box')
        html2canvas(dom, {
          x: dom.getBoundingClientRect().left + 15, // 绘制的dom元素相对于视口的位置，由于获取的位置比原本往前偏离的所以要加上，你需要根据自己的视图去计算
          y:dom.getBoundingClientRect().top + 15,
          backgroundColor: null,  // 解决生成的图片有白边，只单单加和这个并没有效果
          width:dom.offsetWidth - 15, // 因为多出的需要剪裁掉，
          height:dom.offsetHeight - 15,
          dpi: window.devicePixelRatio * 2, // 解决图片不清晰问题
          scale: 2
        }).then(function(canvas) {
          //console.log(canvas.toDataURL())
          // window.open(canvas.toDataURL())
          let a = document.createElement('a')
          let event = new MouseEvent('click')
          a.download = that.lang == 'zh' ? '海报' : 'poster'
          a.href = canvas.toDataURL()
          a.dispatchEvent(event)
        });
      }, 500)
    },
    cancelHandle() {
      this.$emit('cancel')
    },
    onCopy() {
      this.$message.success(this.$t('connect')[1])
    }
  }
};
</script>
<style lang="less" scoped>
  .invite-box {
    width: 100%;
    height: 100%;
    background: rgba(68, 68, 68, 0.5);
    position: fixed;
    top: 0;
    left: 0;
    z-index: 999;
    display: flex;
    justify-content: center;
    font-size: 16px;
    .inner-box.pc-wrap {
      margin-top: 100px;
      position: relative;
      width: 350px;
      height: 616px;
      background: linear-gradient(180deg, #1A567F 0%, #FFFFFF 100%);
      .notice {
        position: relative;
        width: 350px;
        height: 541px;
        box-sizing: border-box;
        h1 {
          margin: 73px 0 20px 60px;
          font-size: 26px;
          font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
          color: #FFFFFF;
          line-height: 35px;
        }
        p {
          margin-left: 60px;
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #FFFFFF;
          line-height: 28px;
        }
        img {
          position: absolute;
          left: 0;
          top: 0;
          max-width: 100%;
        }
        .code-box {
          position: absolute;
          bottom: 10px;
          right: 13px;
        }
      }
      .bottom {
        margin-top: 16px;
        width: 100%;
        height: 42px;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        &> a {
          width: 149px;
          height: 42px;
          background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
          border-radius: 21px;
          line-height: 42px;
          text-align: center;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #FFFFFF;
        }
        &> a:hover {
          opacity: .9;
        }
      }
    }
    .inner-box.h5-wrap {
      position: relative;
      width: 300px;
      margin: 20px 40px 0;
      height: 521px;
      background: linear-gradient(180deg, #1A567F 0%, #FFFFFF 100%);
      .notice {
        position: relative;
        width: 300px;
        height: 464px;
        box-sizing: border-box;
        h1 {
          margin: 40px 0 20px 20px;
          font-size: 26px;
          font-family: AlibabaPuHuiTi-Bold, AlibabaPuHuiTi;
          color: #FFFFFF;
          line-height: 35px;
        }
        p {
          margin-left: 20px;
          font-size: 20px;
          font-family: PingFangSC-Regular, PingFang SC;
          color: #FFFFFF;
          line-height: 28px;
        }
        img {
          max-width: 100%;
        }
        .code-box {
          position: absolute;
          bottom: 5px;
          right: 10px;
        }
      }
      .bottom {
        margin-top: 10px;
        width: 100%;
        height: 45px;
        padding: 0 10px;
        display: flex;
        justify-content: space-between;
        &> a {
          width: 106px;
          height: 38px;
          background: linear-gradient(80deg, #35BEB1 0%, #0C979C 100%);
          border-radius: 21px;
          line-height: 38px;
          text-align: center;
          font-size: 12px;
          font-family: PingFangSC-Medium, PingFang SC;
          color: #FFFFFF;
        }
        a.en-version {
          line-height: 16px;
          padding: 5px 5px 0;
        }
      }
    }
  }
</style>
