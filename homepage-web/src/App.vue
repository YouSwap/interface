<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {}
  }
}
</script>

<style lang="less">
@import './assets/style/global.css';
@import './assets/style/common.css';
  #app {
    background-color: #F8FCFF;
    width: 100%;
    height: 100%;
  }
</style>
