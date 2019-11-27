<template>
  <div class="overview">
    <div class="title-overview"><i />信息总览</div>
    <div class="body">
      <div class="row" v-if="rank !='community'">
        <div class="col" v-show="rank =='country'">入驻城市：<span class="yantramanav">{{ currentData.city | toThousandFilter }}</span></div>
        <div class="col right-col" v-show="rank !='community'">项目数量：<span class="yantramanav">{{ currentData.project | toThousandFilter }}</span></div>
      </div>
      <div class="row">
        <div class="col">覆盖面积：<span class="yantramanav">{{ currentData.area | toThousandFilter }}</span>&nbsp;{{currentData.areaUnit}}</div>
        <div class="col right-col">住户数量：<span class="yantramanav">{{ currentData.user | toThousandFilter }}</span></div>
      </div>
      <div class="row v-hide">
        <div class="col">楼栋数量：<span class="yantramanav">{{ currentData.build | toThousandFilter }}</span></div>
        <div class="col right-col">车位数量：<span class="yantramanav">{{ currentData.parking | toThousandFilter }}</span></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

// let interval = ''
export default {
  data() {
    return {
      currentData: {}
    }
  },
  computed: {
    ...mapState(['rank', 'refresh']),
    ...mapGetters(['cityCode', 'projectId']),
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getInfoSummary',
        data:{
          cityCode: this.cityCode,
          projectId: this.projectId,
        }
      })
        .then((res) => {
          this.currentData = res.data.info
          if(this.rank == 'country') {
            this.currentData.areaUnit = '亿 m²'
          } else {
            this.currentData.areaUnit = '万 m²'
          }
        })
    },
    getRandomInt(min, max) {
      min = Math.ceil(min)
      max = Math.floor(max)
      return Math.floor(Math.random() * (max - min + 1)) + min
    },
  },
  watch: {
    refresh() {
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.overview{
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  .title-overview{
    color: #fff;
    width: 100%;
    display: flex;
    align-items: center;
    border-bottom: 1px solid rgba(255,255,255,0.16);
    margin-bottom:4px;
    i{
      display: inline-block;
      width: 18px;
      height: 18px;
      margin-right: 3px;
      background: url('~@assets/img/demo/icon-war.png');
      background-size: 100% 100%;
    }
  }
  .row{
    color: rgba(255, 255, 255, 0.8);
    font-size:12px;
    height: 32px;
    display: flex;
    justify-content: space-between;
    .col{
      &.right-col{
        width: 170px;
      }
      span{
        color: rgba(255, 255, 255, 1);
        font-size:20px;
      }
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .overview{
    .row{
      .col{
        &.right-col{
          width: 145px;
        }
      }
    }
  }
}

</style>