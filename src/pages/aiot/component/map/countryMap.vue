<template>
  <div class="country-map" @click="outCountry">
    <div  class="wrap-position country-bg">
      <div class="map-position">
        <img :class="[isWidth ? 'w-all': 'h-all', '']" src="~@assets/img/demo/bg.png" @load="showCity = true" />
      </div>
    </div>
    <div  class="wrap-position point">
      <div class="map-position">
        <img :class="[isWidth ? 'w-all': 'h-all', 'block-hide']" src="~@assets/img/demo/bg.png"/>
        <!-- 全国 地图 -->
        <div class="point-list" v-show="showCity">
          <div class="current-pro" v-show="showCurrentPro">
            <img class="pro-img"
              src="~@assets/img/demo/pro.png" />
          </div>
          <template v-for="(it, idx) in proList">
            <div :key="idx"
              :class="[{'red' : it.waring }, {'active' : it.active }, 'item-pro']"
              :style="{ position: 'absolute', left: it.x, top: it.y}"
              @mouseover="overCountry(it)"
              @click="toMap('city', it)">
              <!-- 
                @mouseout="outCountry(it)"
                <div :class="[{'red' : it.waring }, 'model-line']" v-show="it.show">
                <div class="line1" />
                <div class="line2" />
                <div class="line3" />
                <div class="line4" />
              </div> -->
              <div class="sound-effect" :style="{ 'animation-delay': idx*0.05 + 's'}"></div>
              <!-- hover 弹框 普通 -->
              <div v-show="it.show && !it.waring"
                class="model normal">
                <div class="model-block"></div>

                <span class="border border-1"></span>
                <span class="border border-2"></span>
                <span class="border border-3"></span>
                <span class="border border-4"></span>
                <div class="bg-blur"></div>
                <div class="model-title">{{it.cityName}}</div>
                <div class="model-item">
                  <div class="left">社区总数：</div>
                  <div>{{it.project}}</div>
                </div>
                <div class="model-item">
                  <div class="left">在线设备：</div>
                  <div>{{it.onlineDevice}}</div>
                </div>
                <div class="model-item">
                  <div class="left">今日人流量：</div>
                  <div>{{it.people}}</div>
                </div>
                <div class="model-item">
                  <div class="left">今日车流量：</div>
                  <div>{{it.car}}</div>
                </div>
                <div class="model-item">
                  <div class="left">工单数量：</div>
                  <div>{{it.order}}</div>
                </div>
              </div>
              <!-- hover 弹框 告警 -->
              <div v-show="it.show && it.waring"
                class="model waring">
                <div class="model-block"></div>
                <span class="border border-1 red"></span>
                <span class="border border-2 red"></span>
                <span class="border border-3 red"></span>
                <span class="border border-4 red"></span>
                <div class="bg-blur red"></div>
                <div class="model-title">{{it.cityName}}</div>
                <div class="model-item">
                  <div class="left">社区总数：</div>
                  <div>{{it.project}}</div>
                </div>
                <div class="model-item">
                  <div class="left">在线设备：</div>
                  <div>{{it.onlineDevice}}</div>
                </div>
                <div class="model-item">
                  <div class="atention">在线设备减少</div>
                </div>
                <div class="model-item">
                  <div class="left">今日人流量：</div>
                  <div>{{it.people}}</div>
                </div>
                <div class="model-item">
                  <div class="left">今日车流量：</div>
                  <div>{{it.car}}</div>
                </div>
                <div class="model-item">
                  <div class="left">工单数量：</div>
                  <div>{{it.order}}</div>
                </div>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { toMap } from '../../mixins/toMap.js'


import { CityPos } from '../../data.js'
export default {
  data() {
    return {
      showCity: false,  // 是否显示城市位置
      showCurrentPro: false,
      proList: [],
    }
  },
  mixins: [toMap],
  computed: {
    ...mapState(['rank', 'rankName']),
    isWidth() {
      return 1920/1080 > window.screen.availWidth/document.documentElement.clientHeight
    }
  },
  components: {
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getMapInfo',
        data:{
          cityCode: '',
        }
      })
        .then((res) => {
          this.proList = []
          // 遍历显示后台放回的城市
          res.data.mapInfo.forEach(mapEl => {
            CityPos.forEach(psEl => {
              if(mapEl.name.indexOf(psEl.cityName) > -1 ) {
                let item = Object.assign({}, psEl, mapEl)
                this.proList.push(item)
              }
            })
          })
        })
    },
    overCountry(it) {
      this.proList = this.proList.map((el) => {
        el.show = false
        return el
      })
      it.show = true
      this.proList = this.proList.concat()
      // if(it.pro =='hn'){
      //   this.showCurrentPro = true
      // }
    },
    outCountry() {
      this.proList = this.proList.map((el) => {
        el.show = false
        // if(el.pro =='hn'){
        //   this.showCurrentPro = false  
        // }
        return el
      })
    },
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
.country-map{
  .wrap-position{
    position: absolute;
    top:0;
    left:0;
    width:100vw;
    height: 100vh;
    z-index: 10;
    &.country-bg{
      z-index: 0;
    }
    &.point{
      pointer-events: none;
      .point-list{
        pointer-events: all;
      }
    }
    .map-position{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      .w-all{
        width: 100wh;
      }
      .h-all{
        height: 100vh;
      }
      .block-hide{
        pointer-events: none;
        visibility: hidden;
      }
    }
  }
  .pro-img {
    position: absolute;
    left: 52.45%;
    top: 55.28%;

    width: 7.81%;
    height: 15.37%;
  }
}

</style>
