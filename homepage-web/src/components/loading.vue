<template>
  <div class="loading">
    <img src="../assets/loading.png" alt="">
  </div>
</template>

<script>
export default {
  name: "loading",
  data() {
    return {};
  }
};
</script>
<style lang="less" scoped>
.loading {
  width: 20px;
  height: 20px;
  img {
    width: 20px;
    height: 20px;
    animation: loading 2s infinite linear;
    -webkit-animation: loading 2s infinite linear;
    -moz-animation: loading 2s infinite linear;
    -o-animation: loading 2s infinite linear;
  }
}
@keyframes loading
{
  0%{
    transform: rotate(0deg);
  }
  50%{
    transform: rotate(180deg);
  }
  100%{
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loading
{
  0%{
    -webkit-transform: rotate(0deg);
  }
  50%{
    -webkit-transform: rotate(180deg);
  }
  100%{
    -webkit-transform: rotate(360deg);
  }
}
@-moz-keyframes loading
{
  0%{
    -moz-transform: rotate(0deg);
  }
  50%{
    -moz-transform: rotate(180deg);
  }
  100%{
    -moz-transform: rotate(360deg);
  }
}
@-o-keyframes loading
{
  0%{
    -o-transform: rotate(0deg);
  }
  50%{
    -o-transform: rotate(180deg);
  }
  100%{
    -o-transform: rotate(360deg);
  }
}
</style>