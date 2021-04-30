<template>
   <div>
      <pdf
        :src="src"
        :page="currentPage"
        @num-pages="pageCount=$event"
        @page-loaded="currentPage=$event"
        @loaded="loadPdfHandler">
      ></pdf>
      <div class="arrow">
        <el-button @click="changePdfPage(0)" class="turn" :class="{grey: currentPage==1}">{{$t('Preview')}}</el-button>
        <span class="pages">{{currentPage}} / {{pageCount}}</span>
        <el-button @click="changePdfPage(1)" class="turn" :class="{grey: currentPage==pageCount}">{{$t('Next')}}</el-button>
      </div>
   </div>
</template>

<script>
import pdf from 'vue-pdf'
export default {
  components: { pdf },
  data() {
    return {
      currentPage: 0, // pdf文件页码
      pageCount: 0, // pdf文件总页数
      fileType: 'pdf', // 文件类型
      src: '', // pdf文件地址
    }
  },
  computed: {},
  methods: {
    // 改变PDF页码,val传过来区分上一页下一页的值,0上一页,1下一页
    changePdfPage (val) {
      // console.log(val)
      if (val === 0 && this.currentPage > 1) {
        this.currentPage--
        // console.log(this.currentPage)
      }
      if (val === 1 && this.currentPage < this.pageCount) {
        this.currentPage++
        // console.log(this.currentPage)
      }
    },
    // pdf加载时
    loadPdfHandler () {
      this.currentPage = 1 // 加载的时候先加载第一页
    }
  },
  created () {
    this.src = pdf.createLoadingTask(this.$route.query.url)
  },
  mounted() {
    // this.src.promise.then(pdf => {
    //   this.numPages = pdf.numPages
    // });
  },
  destroy(){}, 
  watch: {},
};
</script>
<style scoped lang="less">
.arrow {
  width: 100%;
  background-color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  left: 0;
  transform: translate(0, -50%);
  .pages {
    margin: 0 10px;
  }
}
</style>
