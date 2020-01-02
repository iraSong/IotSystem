<template>
  <div class="dialog-main detail">
    <div class="dialog-title">
      <div class="name" v-if="deviceInfo">
        {{deviceInfo.deviceProperties.location | parseLocation}}
        {{deviceInfo.deviceName}}
        {{deviceInfo.crtTabDeviceType | typeToName}}

        <div v-if="isAttention" class="attention">

          <img v-if="focus === '1'"
            @click="setAttention('0')" class="attention-img"
            src="~@assets/img/demo/attention.png" />

          <img v-else  
            @click="setAttention('1')" 
            class="attention-img" 
            src="~@assets/img/demo/notAttention.png" />

          <div
            v-if="!noShowFlag"
            class="open-panel">
            <div class="panel-arrow"></div>
            <div class="item">
              被标记的设备将会出现在首页。
            </div>
            <div class="item">
              <div class="footer">
                <div class="footer-txt" @click="handleNoShow">不再提示</div>
                <button class="confirm" @click="confirmNoShow">确定</button>
              </div>
            </div>
          </div>
          <!-- 关注上限 -->
          <div
            v-else-if="isTooMuch"
            class="open-panel">
            <div class="panel-arrow"></div>
            <div class="item">
              <p>每栋楼最多可标记 3 台设备，</p>
              <p>可取消以下设备标记来完成本次操作。</p>
            </div>
            <div class="item list">
              <template v-for="typeItem in focusList">
                <div class="device-item" 
                  v-for="device in typeItem.list"
                  :key="device.id + 'public'" >
                  <i class="point" />
                  <div class="device-name">
                    {{device.deviceProperties.location | parseLocation}}
                    {{device.deviceName}}
                    {{device.deviceProperties.type | typeToName}}
                  </div>

                  <img
                    v-if="jugeId(device.id)"
                    @click.stop="handleFocus(device, '0')" 
                    class="attention-img" 
                    src="~@assets/img/demo/notAttention.png" />

                  <img v-else  @click.stop="handleFocus(device, '1')"
                   class="attention-img" 
                   src="~@assets/img/demo/attention.png" />
                </div>
              </template>
            </div>

            <div class="footer">
              <button class="cancel footer" @click.stop>取消</button>
              <button class="confirm" @click="setAttention('0', 'cancelAttention')">完成</button>
            </div>
          </div>
        
        
        </div>
      </div>
      <div class="back" v-if="!hideBack"  @click.stop="back" ></div>
      <div class="close" @click.stop="close" />
    </div>
    <!--  监控 -->
    <div class="dialog-content">
      <div class="right">
        <div class="info">
          <div class="sn"><i class="icon" />设备编号：{{deviceInfo.deviceSn}}</div>
          <div class="status"><i class="icon" /> 设备状态：{{deviceInfo.deviceStatus | deviceStatus}}</div>
        </div>
        <div class="info" v-if="deviceInfo.deviceName">
          <div class="sn"><i class="icon" />设备标记：{{deviceInfo.deviceName}}</div>
        </div>

        <div class="title-table">
          <div class="wrap-tab">
            事件记录
          </div>
        </div>
        <div class="wrap-table">
          <table class="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>事件类型</th>
                <!-- <th>事件等级</th> -->
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList" :key="idx + '2'">
                <td >{{it.recordTime}}</td>
                <td >{{it.status}}</td>
                <!-- <td >{{it.alarmLvl}}</td> -->
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="left">
        <div class="device-name">
          视频监控
        </div>
        <div class="wrap-video">
          <!-- <div class="play-mask"></div> -->
          <!-- <video id="video1">
            <source src="~@public/video.mp4" />
          </video> -->

          <video-player
                  @click.stop
                  class="video-player"
                  :playsinline="playsinline" 
                  :options="playerOptions"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @loadeddata="onPlayerLoadeddata($event)"
                  @waiting="onPlayerWaiting($event)"
                  @playing="onPlayerPlaying($event)"
                  @timeupdate="onPlayerTimeupdate($event)"
                  @canplay="onPlayerCanplay($event)"
                  @canplaythrough="onPlayerCanplaythrough($event)"
                  @ready="playerReadied"
                  @statechanged="playerStateChanged($event)"
                >
          </video-player>


        </div>
      </div>
    </div>
  </div>
</template>
<script>
//  没有绑定楼栋设备 弹框
import { mapState, mapGetters, mapMutations } from 'vuex'

import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import 'vue-video-player/src/custom-theme.css'
import videojs from 'video.js'
window.videojs = videojs
require('videojs-contrib-hls/dist/videojs-contrib-hls.js')

import { mixAttention } from '../../../../mixins/attention.js'
export default {
  mixins: [mixAttention],
  props: ['deviceInfo', 'refesh', 'hideBack'],
  data() {
    return {
      recordList: [],

      playsinline: true,
      playerOptions: {
        events: [],
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        controls: true, //  控制条
        preload: 'auto', // 视频预加载
        muted: false, //  默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        language: 'zh-CN',
        controlBar: {
          timeDivider: true,
          durationDisplay: true
        },
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          withCredentials: false,
          type:"application/x-mpegURL",
          src: '',
          // src: 'http://ivi.bupt.edu.cn/hls/cctv3hd.m3u8',

          // type: "video/mp4",
          // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
        }],
        hls: true, // 启用hls？
        poster: '', // 你的封面地址
        width: document.documentElement.clientWidth,
        notSupportedMessage: '此视频暂无法播放，请稍后再试' //  允许覆盖Video.js无法播放媒体源时显示的默认信息。
      },
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
    ...mapGetters(['projectId', 'focusList']),
    deviceType() {
      return this.deviceInfo.deviceProperties.type
    },
    focus() {
      if(this.deviceInfo.deviceProperties.other) {
        return this.deviceInfo.deviceProperties.other.focus 
      } else {
        return '0'
      }
    },
    isRomm() {
      let location = this.deviceInfo.deviceProperties.location
      if(Array.isArray(location)){
        location = location[0]
      }
      if(location.roomName){
        return true
      } else {
        return false
      }
    }
  },
  components: {
    videoPlayer
  },
  mounted() {
    this.getCamerasPreviewURL()
    if(!this.deviceInfo.deviceProperties.other) {
      this.deviceInfo.deviceProperties.other = {}
    }
  },
  methods: {
    ...mapMutations(['toggleRefreshBuild']),
    getCamerasPreviewURL() {
      this.$http({
        method:'post',
        url:'/api/json/videoApi/camerasISCPreviewURL',
        data:{
          id: this.deviceInfo.deviceUuid,
        }
      })
        .then((res) => {
          // console.log(this.playerOptions.sources.src)
          this.playerOptions.sources[0].src = res.data.url
        })
    },
    getLogList() {
      this.$http({
        method:'post',
        url:'/api/json/deviceLogApi/getDeviceLog',
        data:{
          projectId: this.projectId,
          sn: this.deviceInfo.deviceSn,
          mac: this.deviceInfo.deviceMac,
          index: '', // 门锁
          pageNo: '1',
          pageSize: '10',
        }
      })
        .then((res) => {
          this.recordList = res.data.recordList
        })
    },
    close() {
      this.$emit('close', false)
    },
    back() {
      this.$emit('doShowList')
    },

    // listen event
    onPlayerPlay(player) {
      console.log('player play!', player)
    },
    onPlayerPause(player) {
      console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      console.log('player ended!', player)
    },
    onPlayerLoadeddata(player) {
      console.log('player Loadeddata!', player)
    },
    onPlayerWaiting(player) {
      console.log('player Waiting!', player)
    },
    onPlayerPlaying(player) {
      console.log('player Playing!', player)
    },
    onPlayerTimeupdate(player) {
      console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      console.log('player Canplay!', player)
    },
    onPlayerCanplaythrough(player) {
      console.log('player Canplaythrough!', player)
    },
    playerStateChanged(playerCurrentState) {
      console.log(playerCurrentState)
    },
    playerReadied(player) {
      player.tech({ IWillNotUseThisInPlugins: true }).hls
      player.tech_.hls.xhr.beforeRequest = function(options) {
        console.log('-----------1111111111111')
        console.log(options)
        // let userInfo = localStorage.getItem('userInfo')
        // let token = JSON.parse(userInfo).accessToken
        // options.headers = {
        //   'Accept': 'application/json, text/plain, */*',
        //   'Content-Type': 'application/json;charset=UTF-8',
        //   'Accept-Language': 'zh-CN,zh;q=0.9,hy;q=0.8,mn;q=0.7',
        //   'Authorization': 'Bearer ' + token
        // }
        // return options


        //var hls = player.tech({ IWillNotUseThisInPlugins: true }).hls
        player.tech_.hls.xhr.beforeRequest = function(options) {
          // console.log(options)
          return options
        }
      }
    },

    setAttention(focusDevice) {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/setFocusDevice',
        data:{
          projectId: this.projectId,
          buildId: this.deviceInfo.crtTabBuildId || '',
          deviceId: this.deviceInfo.id,
          focusDevice,
        }
      })
        .then(() => {
          this.toggleRefreshBuild()
          this.deviceInfo.deviceProperties.other.focus = focusDevice
          this.deviceInfo = Object.assign({}, this.deviceInfo)
        })
    }
  },
  watch: {
    refesh() {
      this.getCamerasPreviewURL()
      // this.getLogList()
    }
  }
}
</script>
<style lang="less" scoped>
.yantramanav{
  font-size:20px;
}
.select-panel{
  position: relative;
  display: inline-block;
  .txt-select{
    color: #00B7FF;
  }
  .ps-arrow{
    position: relative;
    top:10px;
    left: 4px;
    border-top-color:#00B7FF;
  }
  .open-panel{
    background: rgba(255, 255, 255, 0.12);
    border: 1px solid rgba(255, 255, 255, 0.08);
    position: absolute;
    top: 36px;
    left: 0;
    z-index: 9999;
    .panel-arrow{
      width: 0;
      height: 0;
      border-width: 10px;
      border-style: solid;
      border-color: transparent transparent #575c5e transparent;
      position: absolute;
      top: -19px;
      left: 13%;
      transform: translate(-50%, 0);
      z-index: 1;
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;

      background: #343434;
      background-size:100% 100%;
      filter: blur(12px);
    }
    .panel-item{
      position: relative;
      background: rgba(136, 135, 135, 0.6);
      width:212px;
      padding:4px 16px;
      .content{
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        color: rgba(255,255,255,0.8);
      }
      &.active::before{
        font-family: serif;
        position: absolute;
        top: 8px;
        right: 30px;
        content: '√';
        width: 10px;
        height: 10px;
        color: #00B7FF;
        font-size: 18px;
        line-height: 100%;
      }
    }
  }
}
.info{
  justify-content: space-between !important;
  .sn{
    margin-right: 0 !important;
  }

}

.open-panel {
  opacity: 1;
  color: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  position: absolute;
  top: 38px;
  left: 160px;
  z-index: 999;
  transform: translate(-50%, 0);
  background: #3b4a55;
  border-radius: 5px;
  padding: 15px 24px;
  .panel-arrow {
    width: 0;
    height: 0;
    border-width: 12px;
    border-style: solid;
    border-color: transparent transparent #3b4a55 transparent;
    position: absolute;
    top: -23px;
    left: 25px;
    transform: translate(-50%, 0);
  }

  .item {
    position: relative;
    height: auto;
    width: 304px;
    color: rgba(255, 255, 255, 0.8);
    line-height: 40px;
    text-align: left;
    line-height:24px;
    font-size:14px;
    &.list{
      max-height: 350px;
      overflow: auto;
    }
    .device-item{
      margin: 16px 0;
      display: flex;
      align-items: center;
      i{
        display: inline-block;
        width: 6px;
        height:6px;
        border-radius: 50%;
        background:rgba(255,255,255,0.8);
        margin-right: 8px;
      }
      .device-name{
        color: rgba(255, 255, 255, 0.6);
        font-size: 12px;
        width: 240px;
        margin-right: 16px;
      }
    }
  }

  .footer{
    position: relative;
    height: 55px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right:16px;
    font-size: 14px;
    .cancel{
      outline:none;
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.4);
      color:rgba(255,255,255,0.8);
      background: transparent;
      margin-right: 16px;
      &.footer{
        width: 56px;
        height: 28px;
      }
    }
    .confirm{
      outline:none;
      border: none;
      color:rgba(255,255,255,1);
      background:#00B7FF;
      border-radius:2px;
      &[disabled] {
        color:rgba(255,255,255,.6);
        background: #419dc1;
      }
    }
    .footer-txt{
      color:rgba(255,255,255,0.8);
      margin-right: 16px;
    }
  }
}
</style>
