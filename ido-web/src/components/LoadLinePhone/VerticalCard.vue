<template>
  <div class="card-wrapper">
    <div class="card">
      <div class="img-wrapper">
        <img width="100%" height="46px" class="img" :src="titleImgUrl" alt="">
        <span>{{dataObj.time}}</span>
      </div>
      <div class="title">{{dataObj.title}}</div>
      <p class="content" v-for="item in dataObj.contentLists" :key="item.id">{{item.content}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ['dataObj'],
  data () {
    return {
      titleImgUrl: require('../../assets/top_blue.png')
    }
  }
}

</script>
<style scoped>
  .card {
    width: 30vw;
    position: relative;
    background: #0B304A;
    border-radius: 20px;
    padding: 54px 38px 38px 38px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .img-wrapper {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
  }
  .img-wrapper > span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-weight: 500;
    font-size: 16px;
    white-space: nowrap;
  }
  .title {
    font-size: 28px;
    color: #FFFDFA;
    font-weight: 500;
    line-height: 4vw;
  }
  .content {
    font-size: 20px;
    color: #FFFDFA;
    font-weight: 400;
    margin-top: 20px;
    line-height: 28px;
  }
@media screen and (max-width: 1000px) {
  .card {
    width: 30vw;
    position: relative;
    background: #0B304A;
    border-radius: 20px;
    padding: 40px 10px 10px 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .img-wrapper {
    width: 80%;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
  }
  .img-wrapper > span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-weight: 500;
    font-size: 10px;
    white-space: nowrap;
  }
  .title {
    font-size: 14px;
    color: #FFFDFA;
    font-weight: 500;
    line-height: 4vw;
  }
  .content {
    font-size: 10px;
    color: #FFFDFA;
    font-weight: 400;
    margin-top: 10px;
    line-height: 20px;
  }
}
</style>