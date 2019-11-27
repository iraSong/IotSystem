<template>
  <div class="body"
    id="container">
  </div>
</template>
<script>

import initMap from './initMap.js'

export default {
  data() {
    return {
    }
  },
  components: {
  },
  mounted() {
    initMap()
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
#container {
  width: 100%;
  height: 100%;
}
@keyframes soundEffect {
  0% {
    width: 30px;
    height: 30px;
    opacity: 1;
  }
  100% {
    width: 58px;
    height: 58px;
    opacity: 0.8;
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
  opacity: 0.5;
  border: 1px solid rgba(0, 183, 255, 0.12);
  border-radius: 50%;

  animation: soundEffect 1.5s ease infinite alternate;
}

/deep/ .model-line{
  .line1{
    position: absolute;
    top: -2px;
    left: -11px;
    width: 20px;
    height: 1px;

    background: rgba(0,255,251,1);
    transform: rotate(45deg)
  }
  .line2{
    position: absolute;
    top: -88px;
    left: -9px;
    width: 1px;
    height: 80px;

    background: rgba(0,255,251,1);
  }
  .line3{
    position: absolute;
    top: -96px;
    left: -26px;
    width: 20px;
    height: 1px;

    background: rgba(0,255,251,1);
    transform: rotate(45deg)
  }
  .line4{
    position: absolute;
    top: -103px;
    left: -43px;
    width: 20px;
    height: 1px;

    background: rgba(0,255,251,1);
  }
  &.red{
    .line1{
      top: -2px;
      left: auto;
      right: -13px;
      background: rgba(255,70,70,1);
      transform: rotate(-45deg)
    }
    .line2{
      left: auto;
      right: -10px;
      background: rgba(255,70,70,1);
    }
    .line3{
      left: auto;
      right: -26px;
      background: rgba(255,70,70,1);
      transform: rotate(-45deg)
    }
    .line4{
      left: auto;
      right: -43px;
      background: rgba(255,70,70,1);
    }
  }
  &.device{
    .line1{
      top: -2px;
      left: auto;
      right: -13px;
      background: rgba(0,255,251,1);
      transform: rotate(-45deg)
    }
    .line2{
      left: auto;
      right: -10px;
      background: rgba(0,255,251,1);
    }
    .line3{
      left: auto;
      right: -26px;
      background: rgba(0,255,251,1);
      transform: rotate(-45deg)
    }
    .line4{
      left: auto;
      right: -43px;
      background: rgba(0,255,251,1);
    }
  }
}

/deep/  .model {
  padding: 12px 16px;
  width: 214px;
  color:#fff;
  &.normal {
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
  }
  &.waring {
    position: absolute;
    right: -257px;
    top: -215px;
    z-index: 99;
    background:rgba(87,5,5,0.7);
    box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
    border:1px solid rgba(255,70,70,1);
    .model-block{
      width: 100px;
      height: 100%;
      position: absolute;
      top:0;
      left: -50px;
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
  &.city-model{
    top: -140px;
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
</style>
