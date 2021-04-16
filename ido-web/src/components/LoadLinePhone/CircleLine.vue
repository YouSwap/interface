<template>
  <div>
    <div class="circle-wrapper">
      <div class="circle"></div>
      <div class="line" :class="[direction === 'left' ? 'leftLine' : 'rightLine']"></div>
    </div>
  </div>
  
</template>

<script>
export default {
  props: ['direction'],
  data () {
    return {
    }
  }
}

</script>
<style scoped>
  .circle-wrapper {
    width: 12vw;
    height: 20px;
    display: flex;
    position: relative;
  }
  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background-color: #104469;
  }
  .line {
    width: 50%;
    height: 1px;
    border-bottom: 2px dashed #104469;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }
  .leftLine {
    left: 0;
  }
  .rightLine {
    right: 0;
  }
</style>