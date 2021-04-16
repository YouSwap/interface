<template>
  <div id="app">
    <Header />
    <router-view></router-view>
  </div>
</template>

<script>
import Header from './components/Header'
export default {
  name: 'App',
  data() {
    return {
      account: 0,
    }
  },
  components: {
    Header,
  },
}
</script>

<style lang="less">
#app {
  background-image: url('../src/statics/bg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
@media (max-width: 1000px) {
  #app {
    background-image: url('../src/statics/bg-phone.png');
    background-repeat: no-repeat;
    background-size: 100% 1378px;
    background-color: #06263c;
  }
}
</style>
