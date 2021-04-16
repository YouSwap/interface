<template>
  <div :class="[hoverShow ? 'circle-container-show' : 'circle-container']">

  </div>
</template>

<script>
export default {
  props: ['hoverShow'],
  data () {
    return {
    }
  }
}

</script>
<style scoped>
  .circle-container {
    width: 20px;
    height: 20px;
    background-color: #11476E;
    border: 5px solid #0B304A;
    border-radius: 50%;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
  }
  .circle-container-show {
    width: 20px;
    height: 20px;
    background: linear-gradient(80deg, #69EECB 0%, #0C979C 100%);
    border: 5px solid #173D56;
    border-radius: 50%;
    position: absolute;
    top: 0;
    transform: translateY(-50%);
  }
</style>