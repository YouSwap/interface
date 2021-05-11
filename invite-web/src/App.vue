<template>
  <div id="app">
    <router-view />
  </div>
</template>
<script>
import Cookies from 'js-cookie'
export default {
  name: 'App',
  data () {
    return {
    }
  },
  created () {
    (function (doc, win) {
      var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function () {
          var clientWidth = document.body.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = clientWidth / 3.75 + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
    this.initPlatform();
  },
  mounted () {
    if (Cookies.get('lang') === 'ZH') {
      this.$i18n.locale = 'zh'
      Cookies.set('lang', "ZH", { domain: `${process.env.VUE_APP_DOMAIN}` })
    } else if (Cookies.get('lang') === 'EN') {
      this.$i18n.locale = 'en'
      Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
    } else {
      this.$i18n.locale = "en"
      Cookies.set('lang', "EN", { domain: `${process.env.VUE_APP_DOMAIN}` })
    }
  },
  methods: {
    /**
     * 判断平台
     */
    initPlatform () {
      var userAgentInfo = navigator.userAgent.toLowerCase();
      var Agents = ['android', 'iphone', 'symbianOS', 'windows phone', 'ipad', 'ipod'];
      var flag = true;
      var platform = 2
      for (var v = 0; v < Agents.length; v++) {
        if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
      }
      if (flag) {
        platform = 2
      } else {
        platform = 1
      }
      this.$store.commit('setPlatform', platform)
    },
  }
};
</script>
<style>
@import "./assets/style/global.css";
@import "./assets/style/common.css";
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  width: 100%;
  min-height: 100%;
}
</style>
