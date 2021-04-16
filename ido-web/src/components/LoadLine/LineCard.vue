<!-- 路线图卡片 -->
<template>
  <div>
    <div class="card-container" :style="{width: cardWidth}" v-if="arrowDirect == 'bottom'">
      <div class="card" :class="[borderOutlineShow ? 'card-outline' : 'card']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div class="card-wrapper">
          <span class="card-item" v-for="(list, index) in firstContent" :key="index">
            {{list.value}}
          </span>
        </div>
        <div class="img-wrap">
          <img :src="topImgUrl" alt="">
          <span>{{timeTitle}}</span>
        </div>
      </div>
      <div class="line-container">
        <div class="line-vertical" :style="{alignItems: directAlign}">
          <div class="line-inner">
            <div :class="[borderOutlineShow ? 'vertical-circle-show' : 'vertical-circle']"></div>
            <div class="vertical-line"></div>
            <div class="circle-container" :class="[borderOutlineShow ? 'circle-container-hover' : 'circle-container']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card-container" :style="{width: cardWidth}" v-if="arrowDirect == 'top'">
      <div class="line-container-top">
        <div class="line-vertical" :style="{alignItems: directAlign}">
          <div class="line-inner">
            <div class="circle-container-top" :class="[borderOutlineShow ? 'circle-container-top-hover' : 'circle-container-top']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"></div>
            <div class="vertical-line"></div>
            <div class="vertical-circle" :class="[borderOutlineShow ? 'vertical-circle-show' : 'vertical-circle']"></div>
          </div>
        </div>
      </div>
      <div class="card" :class="[borderOutlineShow ? 'card-outline' : 'card']" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave">
        <div class="card-wrapper">
          <span class="card-item" v-for="(list, index) in firstContent" :key="index">
            {{list.value}}
          </span>
        </div>
        <div class="img-wrap">
          <img :src="topImgUrl" alt="">
          <span>{{timeTitle}}</span>
        </div>
      </div>
      
    </div>
  </div>
  
</template>

<script>
export default {
  props: {
    cardWidth: [String, Number],
    directAlign: [String, Number],
    timeTitle: [String, Number],
    arrowDirect: [String, Number],
    firstContent: [Array],
  },
  data () {
    return {
      topImgUrl: require('../../assets/top_blue.png'),
      borderOutlineShow: false
    }
  },
  methods: {
    // 鼠标滑入
    handleMouseEnter () {
      this.borderOutlineShow = true
      this.topImgUrl = require('../../assets/top_green.png')
    },
    // 鼠标滑出
    handleMouseLeave () {
      this.borderOutlineShow = false
      this.topImgUrl = require('../../assets/top_blue.png')
    }
  }
}

</script>
<style scoped>
  .card {
    position: relative;
    background: #11476E;
    border-radius: 10px;
    min-width: 195px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 1px solid #11476E;
    padding: 40px 10px 20px;
    box-sizing: border-box;
    height: 220px;
  }
  .card-outline {
    border: 1px solid #19B7B3;
  }
  .card-wrapper {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap; 
  }
  .card-item:nth-child(1){
    font-size: 14px;
    padding-bottom: 10px;
  }
  .card-item {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #FFFDFA;
    line-height: 20px;
  }
  .img-wrap {
    width: 174px;
    height: 31px;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translate(-50%, -50%);
    display: flex;
    justify-content: center;
  }
  .img-wrap > img {
    width: 160px;
    height: 31px;
  }
  .img-wrap > span {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%); 
    font-size: 13px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFDFA;
    white-space: nowrap;
  }
  .line-container {
    display: flex;
    flex-direction: column;
    margin-top: 10px;
  }
  .line-container-top {
    display: flex;
    flex-direction: column;
    margin-bottom: 25px;
  }
  .line-vertical {
    display: flex;
    flex-direction: column;
    padding: 0 10px;
  }
  .line-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .vertical-circle {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #11476E;
  }
  .vertical-circle-show {
    width: 10px;
    height: 10px;
    background-color: #69EECB;
    border-radius: 50%;
  }
  .vertical-line {
    width: 1px;
    height: 52px;
    border-left: 2px dashed #11476E;
    margin-left: 1px;
  }
  .circle-container {
    width: 20px;
    height: 20px;
    background-color: #11476E;
    border: 5px solid #0B304A;
    border-radius: 50%;
    position: absolute;
    bottom: -30px;
    z-index: 100;
  }
  .circle-container-hover {
    width: 20px;
    height: 20px; 
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border: 5px solid #173D56;
    border-radius: 50%;
    position: absolute;
    bottom: -30px;
    z-index: 100;
  }
  .circle-container-top {
    width: 20px;
    height: 20px;
    background-color: #11476E;
    border: 5px solid #0B304A;
    border-radius: 50%;
    position: absolute;
    top: -30px;
  }
  .circle-container-top-hover {
    width: 20px;
    height: 20px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border: 5px solid #173D56;
    border-radius: 50%;
    position: absolute;
    top: -30px;
  }
  @media screen and (max-width: 1000px) {
    .card-container {
      display: flex;
      width: 30vw !important;
    }
    .card {
      width: 30vw!important;
      min-height: 26vw;
      position: relative;
      background: #11476E;
      border-radius: 10px;
      min-width: 195px;
      display: flex;
      flex-direction: row-reverse;
      align-items: center;
      justify-content: center;
      border: 1px solid #11476E;
    }
    .card-outline {
      border: 1px solid #19B7B3;
    }
    .card-wrapper {
      display: flex;
      flex-direction: row-reverse;
      flex-wrap: wrap; 
    }
    .card-item {
      font-size: 3vw;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #FFFDFA;
      line-height: 4vw;
      padding: 0 1vw;
      box-sizing: border-box;
    }
    .img-wrap {
      width: 30vw;
      height: 4vw;
      position: absolute;
      left: 50%;
      top: 0;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: center;
    }
    .img-wrap > img {
      width: 25vw;
      height: 4vw;
    }
    .img-wrap > span {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%); 
      font-size: 3vw;
      font-family: DINPro-Medium, DINPro;
      font-weight: 500;
      color: #FFFDFA;
    }
    .line-container {
      display: flex;
      flex-direction: row;
      margin-top: 10px;
      transform: rotate(270deg);
    }
    .line-container-top {
      display: flex;
      flex-direction: row;
      margin-bottom: 25px;
      transform: rotate(270deg);
    }
    .line-vertical {
      display: flex;
      padding: 0 10px;
    }
    .line-inner {
      position: relative;
      display: flex;
      align-items: center;
    }
    .vertical-circle {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: #11476E;
    }
    .vertical-circle-show {
      width: 10px;
      height: 10px;
      background-color: #131414;
      border-radius: 50%;
    }
    .vertical-line {
      width: 38px;
      height: 1px;
      border-bottom: 2px dashed #11476E;
    }
    .circle-container {
      width: 20px;
      height: 20px;
      background-color: #11476E;
      border: 5px solid #0B304A;
      border-radius: 50%;
      position: absolute;
      bottom: -30px;
      z-index: 100;
    }
    .circle-container-hover {
      width: 20px;
      height: 20px; 
      background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
      border: 5px solid #173D56;
      border-radius: 50%;
      position: absolute;
      bottom: -30px;
      z-index: 100;
    }
    .circle-container-top {
      width: 20px;
      height: 20px;
      background-color: #11476E;
      border: 5px solid #0B304A;
      border-radius: 50%;
      position: absolute;
      top: -30px;
    }
    .circle-container-top-hover {
      width: 20px;
      height: 20px;
      background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
      border: 5px solid #173D56;
      border-radius: 50%;
      position: absolute;
      top: -30px;
    }
  }
</style>