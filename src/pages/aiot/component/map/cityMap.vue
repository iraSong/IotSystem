<template>
  <div class="city-map" id="container">
    <img class="mask" v-show="showMask" src="~@assets/img/demo/mask.png" />
    <div class="bar">
      <div  class="center">
        <div @click="setCenter(1)" class="zoom-btn zoom-center"></div>
      </div>
      <div  class="zoom">
        <div @click="setZoom(1)" :class="[zoomInClass, 'zoom-btn zoom-in']"></div>
        <div @click="setZoom(-1)" :class="[zoomOutClass, 'zoom-btn zoom-out']"></div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import initMap from '../../utils/initMap.js'
import { CommunityPos} from '../../data.js'

export default {
  data() {
    return {
      map: '',
      currentZoom: 12,
      projectList: CommunityPos,
    }
  },
  computed: {
    ...mapState(['rank','rankObj', 'refresh', 'showMask']),
    ...mapGetters(['cityCode']),
    zoomInClass() {
      if(this.currentZoom >= 13) {
        return 'disPoint'
      }
    },
    zoomOutClass() {
      if(this.currentZoom <=11) {
        return 'disPoint'
      }
    },
  },
  components: {
  },
  mounted() {
    if(this.rank == 'city'){
      this.getData()
    }
  },
  methods: {
    getData() {
      this.$http({
        method:'post',
        url:'/api/json/ufoXcApi/getMapInfo',
        data:{
          cityCode: this.cityCode,
        }
      })
        .then((res) => {
          if(res.data.mapInfo &&  res.data.mapInfo.length > 0) {
            this.projectList = res.data.mapInfo
          }
          this.map = initMap(this.rankObj.cityName, this.projectList)
        })
    },
    setZoom(val) {
      let map = this.map
      this.currentZoom = map.getZoom()
      let zoom = this.currentZoom + val
      if(zoom > 13 || zoom <11) return
      map.setZoom(zoom) // 设置地图层级
      // map.zoomIn() // 地图放大一级显示
      // map.zoomOut() // 地图缩小一级显示
    },
    setCenter() {
      let center = window.localStorage.getItem('aiot-map-center').split(',')
      this.map.setZoomAndCenter(12,center)
    }
  },
  watch: {
    refresh() {
      if(this.rank == 'city'){
        this.getData()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.city-map {
  position: absolute;
  top:0;
  left:0;
  width: 100%;
  height: 100%;
  .mask{
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
  }
}
@keyframes soundEffect {
  0% {
    width: 28px;
    height: 28px;
    opacity: 1;
  }
  100% {
    width: 36px;
    height: 36px;
    opacity: .5;
  }
}
/deep/ .bg-blur{
  filter: blur(0px);
  background:rgba(7,78,77,0.3);
  &.red{
    background:rgba(87,5,5,0.3);
  }
}
/deep/ .amap-marker{
  .marker-route{
    font-size: 0;
  }
  img{
    width: 26px;
    height: 26px;
  }
}
/deep/ .sound-effect {
  cursor: pointer;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 38px;
  height: 38px;
  background: rgba(0, 183, 255, 0.2);
  box-shadow: 0px 0px 4px 0px rgba(0, 183, 255, 0.4);
  opacity: 1;
  border: 1px solid rgba(0, 183, 255, 0.12);
  border-radius: 50%;

  // animation: soundEffect 1.5s ease infinite alternate;
}
/deep/  .model {
  position: relative;
  padding: 12px 16px;
  width: 214px;
  color:#fff;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    width: 100%;
    height: 100%;

    background: url("~@assets/img/demo/model-bg.png");
    background-size:100% 100%;
    filter: blur(12px);
  }
  &.normal {
    background:rgba(7,78,77,0.3);
    box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
    border:1px solid rgba(0,255,251,1);

    .model-block{
      width: 15px;
      height: 15px;
      position: absolute;
      left:50%;
      bottom: -8px;
      transform: translate(-50%, 0) rotate(225deg);

      background: #034056;
      border-left:1px solid rgba(0,255,251,1);
      border-top:1px solid rgba(0,255,251,1);
      padding:0;
    }
  }
  &.waring {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translate(-50%, 0);

    z-index: 99;
    background:rgba(87,5,5,0.3);
    box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
    border:1px solid rgba(255,70,70,1);
    .model-block{
      width: 15px;
      height: 15px;
      position: absolute;
      left:50%;
      bottom: -8px;
      transform: translate(-50%, 0) rotate(225deg);

      background: #20253c;
      border-left:1px solid rgba(255,70,70,1);
      border-top:1px solid rgba(255,70,70,1);
      padding:0;
    }
  }
  &.video{
    width:320px;
    position: absolute;
    left: -362px;
    top: -203px;
    z-index: 99;
    background:rgba(7,78,77,0.7);
    box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
    border:1px solid rgba(0,255,251,1);
    .model-block{
      width: 100px;
      height: 100%;
      position: absolute;
      top:0;
      right: -50px;
    }
    video, .car-img{
      width: 288px;
      height: 162px;
    }
    .wrap-video{
      position: relative;
      .play-mask{
        position: absolute;
        top:0;
        left:0;
        z-index: 999;
        width: 288px;
        height: 162px;
        background: #888;
        &::after{
          content: "";
          position: absolute;
          width:66px;
          height:66px;
          top:50%;
          left:50%;
          transform: translate(-50%, -50%);
          background: url("~@assets/img/demo/play.png");
          background-size: 100% 100%;
        }
      }
    }

    .model-title{
      text-align: left;
    }
    .model-item {
      .left{
        width:auto;
      }
    }
    table{
      width: 100%;
      table-layout: auto;
      font-size:12px;
      thead{
        tr{
          border-bottom: 1px solid rgba(255,255,255,0.4);
          td{
            height: 24px;
            color: rgba(255,255,255,0.4);
          }
        }
      }
      tbody{
        tr{
          height:28px;
          td{
            color:rgba(255,255,255,0.8);
          }
        }
      }
    }
  }

  .model-title {
    text-align: center;
  }
  .model-item {
    display: flex;
    height: 35px;
    line-height: 35px;
    font-size: 20px;

    .atention {
      flex: 1;
      font-size: 12px;
      text-align: right;
    }
    .left {
      font-size: 12px;
      width: 74px;
      text-align: right;
      margin-right: 12px;
    }
  }
}
.bar{
  position: absolute;
  bottom:248px;
  right:416px;
  z-index: 1;
  .zoom-btn{
    background:rgba(255,255,255,0.2);
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    font-size: 20px;

    cursor:pointer;
    background-repeat: no-repeat;
  }
  .zoom-in{
    background-image: url("~@assets/img/demo/city/zoomin.png");
    background-size: 18px 18px;
    background-position: center;

    border-radius:2px 2px 0px 0px;
    border-bottom: 1px solid rgba(255,255,255,0.16);
  }
  .zoom-out{
    background-image: url("~@assets/img/demo/city/zoomout.png");
    background-size: 18px 18px;
    background-position: center;

    border-radius:0px 0px 2px 2px;
  }
  .zoom-center{
    margin-bottom: 8px;
    background-image: url("~@assets/img/demo/city/center.png");
    background-size: 18px 18px;
    background-position: center;
  }
  .disPoint{
    cursor:not-allowed;
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .bar{
    bottom: 180px;
    right: 362px;
  }
}
</style>
