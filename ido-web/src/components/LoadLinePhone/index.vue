<template>
  <div class="load-container">
    <div class="load-wrapper">
      <div class="first-line">
        <VerticalCard :dataObj="dataObj1" />
        <VerticalCard style="margin-top: 94px;" :dataObj="dataObj2" />
        <VerticalCard style="margin-top: 202px;" :dataObj="dataObj3" />
      </div>
      <div :class="languageEn == 'zh' ? 'second-line-zh' : 'second-line-en'">
        <CircleLine :style="languageEn == 'en' ? 'margin-top: 100px;' : 'margin-top: 40px;'" :direction="directLeft"/>
        <CircleLine :style="languageEn == 'en' ? 'margin-top: 120px;' : 'margin-top: 100px;'" :direction="directRight"/>
        <CircleLine :style="languageEn == 'en' ? 'margin-top: 330px;' : 'margin-top: 210px;'" :direction="directLeft"/>
        <CircleLine style="margin-top: 170px;" :direction="directRight"/>
        <CircleLine :style="languageEn == 'en' ? 'margin-top: 250px;' : 'margin-top: 204px;'" :direction="directLeft"/>
        <CircleLine style="margin-top: 100px;" :direction="directRight"/>
        <div class="line"></div>
        <div class="arrow-down"></div>
      </div>
      <div class="third-line">
        <VerticalCard style="margin-top: 123px;" :dataObj="dataObj4"/>
        <VerticalCard style="margin-top: 138px;" :dataObj="dataObj5"/>
        <VerticalCard style="margin-top: 138px;" :dataObj="dataObj6"/>
      </div>
    </div>
  </div>
</template>

<script>
import VerticalCard from './VerticalCard'
import CircleLine from './CircleLine'
import Cookie from "js-cookie"
export default {
  components: {
    VerticalCard,
    CircleLine
  },
  data () {
    return {
      directLeft: 'left',
      directRight: 'right',
      dataObj1: {
        title: this.$t('store1.one'),
        time: this.$t('Time1'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store1.two')
          },
          {
            id: 1,
            content: this.$t('store1.three')
          },
          {
            id: 2,
            content: this.$t('store1.four')
          },
          {
            id: 3,
            content: this.$t('store1.five')
          }
        ]
      },
      dataObj2: {
        title: this.$t('store3.one'),
        time: this.$t('Time3'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store3.two')
          },
          {
            id: 1,
            content: this.$t('store3.three')
          }
        ]
      },
      dataObj3: {
        title: this.$t('store5.one'),
        time: this.$t('Time5'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store5.two')
          },
          {
            id: 1,
            content: this.$t('store5.three')
          },
          {
            id: 2,
            content: this.$t('store5.four')
          }
        ]
      },
      dataObj4: {
        title: this.$t('store2.one'),
        time: this.$t('Time2'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store2.two')
          },
          {
            id: 1,
            content: this.$t('store2.three')
          },
          {
            id: 2,
            content: this.$t('store2.four')
          },
          {
            id: 3,
            content: this.$t('store2.five')
          }
        ]
      },
      dataObj5: {
        title: this.$t('store4.one'),
        time: this.$t('Time4'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store4.two')
          },
          {
            id: 1,
            content: this.$t('store4.three')
          }
        ]
      },
      dataObj6: {
        title: this.$t('store6.one'),
        time: this.$t('Time6'),
        contentLists: [
          {
            id: 0,
            content: this.$t('store6.two')
          },
          {
            id: 1,
            content: this.$t('store6.three')
          },
          {
            id: 2,
            content: this.$t('store6.four')
          }
        ]
      }
    }
  },
  computed: {
    languageEn() {
      return Cookie.get('lan')
    }
  }
}

</script>
<style scoped>
  .load-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 69px;
  }
  .load-wrapper {
    width: 90vw;
    display: flex;
    justify-content: space-between;
  }
  .second-line {
    width: 12vw;
    height: 1300px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .line {
    height: inherit;
    border: 2px dashed #104469;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  .arrow-down {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translate(-50%);  
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #11476E;
  }

@media screen and (max-width: 1000px) {
  .load-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: 0;
  }
  .load-wrapper {
    width: 90vw;
    display: flex;
    justify-content: space-between;
  }
  .second-line-zh {
    width: 12vw;
    height: 1100px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .second-line-en {
    width: 12vw;
    height: 1450px;
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .line {
    height: 100%;
    border: 2px dashed #104469;
    position: absolute;
    left: 50%;
    top: 0;
    transform: translateX(-50%);
  }
  .arrow-down {
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translate(-50%);  
    border-left: 20px solid transparent;
    border-right: 20px solid transparent;
    border-top: 20px solid #11476E;
  }
}
</style>