<template>
  <div id="app">    
    <router-view/>
  </div>
</template>
<script>
export default {
  name: 'App',
  data() {
    return {
    }
  },
  created() {
    (function(doc, win) {
      var docEl = doc.documentElement,
        resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
        recalc = function() {
          var clientWidth = document.body.clientWidth;
          if (!clientWidth) return;
          docEl.style.fontSize = clientWidth / 3.75 + "px";
        };
      if (!doc.addEventListener) return;
      win.addEventListener(resizeEvt, recalc, false);
      doc.addEventListener("DOMContentLoaded", recalc, false);
    })(document, window);
  }
};
</script>
<style>
@import './assets/style/global.css';
@import './assets/style/common.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-size: 16px;
  width: 100%;
  min-height: 100%;
}
</style>
