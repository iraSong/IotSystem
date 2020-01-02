<template>
  <div class="community-map">
    <div class="list">
      <!-- 公共区域设备列表 -->
      <div class="device">
        <template v-for="typeItem in deviceTypeList">
          <div
            v-for="device in typeItem.list"
            :key="device.id + 'public'"
            :class="[{'offline': device.deviceStatus ==='0'}, 'item']"
            @click="showPublicDialog(device, typeItem.deviceType)">
             <div
                @mouseover="overPublicDevice(device, typeItem.deviceType)"
                @mouseout="outPublicDevice(device)"
                :class="[typeItem.deviceType, getDreciton(device), 'device-img']">
                  <!-- 设备hover -->
                  <components
                    ref="hover"
                    :is="crtPublicHover"
                    :show="device.showHover"
                    :device="device"
                    :device-type="typeItem.deviceType" />
              </div>
              <div class="txt">
                {{device.deviceProperties.location | parseLocation}}
                {{device.deviceName}}
                <br/>
                {{typeItem.deviceType | typeToName}}
              </div>
          </div>
        </template>



        <div class="item all-device">
          <div class="line"></div>
          <div class="device-img all" @click="showAllPublicDialog()"></div>
          <div class="txt">全部公区设备</div>
        </div>
      </div>

      <!-- 组团名称 -->
      <div class="group-nav">
        <!-- 全部 -->
        <div :class="[{'current': crtGroupIdx === ''}, 'group-item']"
          @click="changeGroup('')"><span></span>&nbsp;全
        </div>
        <!-- 组团名称列表 -->
        <div v-if="groupList.length > 1"  v-for="(it,idx) in groupList"
          :key="idx + 'tab'"
          :class="[{'current': crtGroupIdx === idx}, 'group-item']"
          @click="changeGroup(idx)">
            <span></span>&nbsp;{{it.groupName}}
        </div>

      </div>

      <!-- 楼栋列表 全部 -->
      <div class="build"
        v-if="crtGroupIdx === ''">
        <template v-for="it in groupList">
          <div v-for="(i, idx) in it.buildList"
            :key="i.buildId + '-build'"
            class="item"
            @click="showBuildDialog(i)">
            <div v-if="(idx+1)%4==0"
              class="build-img build4"></div>
            <div v-else-if="(idx+1)%3==0"
              class="build-img build3"></div>
            <div v-else-if="(idx+1)%2==0"
              class="build-img build2"></div>
            <div v-else
              class="build-img build1"></div>
            <div class="txt">{{i.buildName}}</div>
            <!-- 楼栋上的设备图标 -->
            <div class="wrap-icon">
              <template v-for="attentionIt in i.deviceTypeList">
                <div
                  :class="[attentionIt.deviceType, 'icon-device icon-device1']"
                  v-for="(device, j) in attentionIt.list"
                  :key="device.id + j"
                  @click.stop="showBuildDialogHover(i.buildId, device, attentionIt.deviceType)"
                  @mouseover="overAllBuildDeivce('showHover',device, attentionIt.deviceType)"
                  @mouseout="outAllBuildDevice('showHover',device)">
                    <!-- 设备hover -->
                    <components 
                    :is="crtBuildHover"
                    :show="device.showHover" 
                    :device="device"
                    :device-type="attentionIt.deviceType" />
                </div>
              </template>


            </div>
          </div>
        </template>
      </div>

      <!-- 当前组团列表 -->
      <div class="build group"
        v-else>
        <div
          v-for="(it, idx) in crtBuildList"
          :key="it.id"
          class="item"
          @click="showBuildDialog(it)">
          <div v-if="(idx+1)%4==0"
            class="build-img build4"></div>
          <div v-else-if="(idx+1)%3==0"
            class="build-img build3"></div>
          <div v-else-if="(idx+1)%2==0"
            class="build-img build2"></div>
          <div v-else
            class="build-img build1"></div>
          <div class="txt">{{it.buildName}}</div>

          <!-- 楼栋上的设备图标 -->
          <div class="wrap-icon 111">
            <template v-for="typeIt in it.deviceTypeList">
              <div
                :class="[typeIt.deviceType, 'icon-device icon-device1']"
                v-for="(device, j) in typeIt.list"
                :key="device.id + j + '-2'"
                @mouseover="overGroupBuildDeivce('showHover',device, typeIt.deviceType)"
                @mouseout="outGroupBuildDevice('showHover',device)">
                  <!-- 设备hover -->
                  <components 
                  :is="crtBuildHover"
                  :show="device.showHover" 
                  :device="device"
                  :device-type="typeIt.deviceType" />
              </div>
            </template>

            <!-- <div class="icon-device icon-device3"
              @mouseover="overGroupBuildDeivce('device3',it)"
              @mouseout="outGroupBuildDevice('device3',it)">
                <div v-show="it.device3"
                  class="device-model build-model">
                  <div class="model-block"></div>
                  <span class="border border-1"></span>
                  <span class="border border-2"></span>
                  <span class="border border-3"></span>
                  <span class="border border-4"></span>
                  <div class="bg-blur"></div>

                  <div class="model-title">1 组团 C1 电梯 A</div>
                  <div class="model-item">
                    <div class="left">今日人流量：<span class="yantramanav">344</span></div>
                    <div></div>
                  </div>
                  <div class="table-title">最近用梯</div>
                  <table >
                    <thead>
                      <tr>
                        <th>时间</th><th>姓名</th><th>用梯方式</th><th>目的楼层</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(it, idx) in 5" :key="idx + '-2'">
                        <td>09.01  07:00:01</td>
                        <td>靖成羽</td>
                        <td>人脸</td>
                        <td>10 楼</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
            </div> -->
          </div>
        </div>
      </div>
    </div>

    <!--公区设备 弹框 -->
    <qd-public-dialog ref="publicDialog"
      :select-device="selectDevice" />
    <!--全部公区设备 弹框 -->
    <qd-all-public-dialog ref="allPublicDialog"
      :select-device="selectDevice" />
    <!--楼栋 弹框 -->
    <qd-build-dialog ref="buildDialog"
      :select-device="selectDevice" />
    <!--楼栋设备 hover 弹框 -->
    <qd-build-dialog-hover ref="buildDialogHover"
      :select-device="selectDevice" />
      
    <!-- 告警弹框 -->
    <qd-warning-dialog ref="warningDialog" />

  </div>
</template>
<script>
import { mapState, mapGetters, mapMutations } from 'vuex'
import { DevicePos } from '../../data.js'
import qdPublicDialog from './component/publicDialog.vue'
import qdAllPublicDialog from './component/allPublicDialog.vue'
import qdBuildDialog from './component/buildDialog.vue'
import qdBuildDialogHover from './component/buildDialogHover.vue'


import qdWarningDialog from './component/warningDialog.vue'


import qdHoverLift from './component/hover/lift.vue'
import qdHoverMonitor from './component/hover/monitor.vue'
import qdHoverDoor from './component/hover/door.vue'
import qdHoverFaceDoor from './component/hover/faceDoor.vue'
import qdOffLine from './component/hover/offLine.vue'

import qdPublicOffLine from './component/hover/public/offLine.vue'
import qdHoverPublicDoor from './component/hover/public/door.vue'
import qdPublicHoverMonitor from './component/hover/public/monitor.vue'
import qdPublicHoverPark from './component/hover/public/park.vue'
import qdPublicHoverFaceDoor from './component/hover/public/faceDoor.vue'

export default {
  data() {
    return {
      showCz: false,
      showCzOut: false,
      showMask: true,
      DeviceList: DevicePos,

      groupList: [],
      deviceTypeList: [],
      buildDeviceTypeList: [],
      selectDevice: {},

      crtGroupIdx: '', // 当前组团 索引 '' 为全部
      crtBuildList: [], // 当前组团下面的楼栋列表

      hoverDevice: {},
      hoverDeviceType: '',
    }
  },
  computed: {
    ...mapState(['rank', 'rankName', 'refresh', 'refreshBuild']),
    ...mapGetters(['projectId']),
    crtBuildHover() {
      // 当前hover
      /* eslint-disable no-unreachable */
      if(this.hoverDevice.deviceStatus === '0') {
        return 'qdOffLine'
      }else {
        switch(this.hoverDeviceType) {
          // 电梯
          case 'lift':
            return 'qdHoverLift'
            break
          // 监控
          case 'video':
            return 'qdHoverMonitor'
            break
          // 通行设备
          case 'doorctl_v2':
            return 'qdHoverDoor'
            break
          case 'doorctl':
            return 'qdHoverDoor'
            break
          case 'unitdoorwaymacchine':
            return 'qdHoverDoor'
            break
          case 'villadoorwaymacchine':
            return 'qdHoverDoor'
            break
          case 'fencingdoorwaymacchine':
            return 'qdHoverDoor'
            break
          // 人脸通行设备
          case 'facegate':
            return 'qdHoverFaceDoor'
            break
          case 'facesentry':
            return 'qdHoverFaceDoor'
            break
          case 'facedoorwaymachine':
            return 'qdHoverFaceDoor'
            break
          default:
            return ''
        } 
      }
    },
    crtPublicHover() {
      // 当前hover
      /* eslint-disable no-unreachable */
      if(this.hoverDevice.deviceStatus === '0') {
        return 'qdPublicOffLine'
      }else {
        switch(this.hoverDeviceType) {
          // 门禁
          case 'doorctl_v2':
            return 'qdHoverPublicDoor'
            break
          case 'doorctl':
            return 'qdHoverPublicDoor'
            break
          case 'unitdoorwaymacchine':
            return 'qdHoverPublicDoor'
            break
          case 'villadoorwaymacchine':
            return 'qdHoverPublicDoor'
            break
          case 'fencingdoorwaymacchine':
            return 'qdHoverPublicDoor'
            break
          case 'faceSentry':
            return 'qdPublicHoverFaceDoor'
            break
          case 'facegate':
            return 'qdPublicHoverFaceDoor'
            break
          case 'facedoorwaymachine':
            return 'qdPublicHoverFaceDoor'
            break

          // 监控
          case 'video':
            return 'qdPublicHoverMonitor'
            break
          // 停车
          case 'park':
            return 'qdPublicHoverPark'
            break
          default:
            return ''
        } 
      }
    }
  },
  components: {
    qdPublicDialog,
    qdAllPublicDialog,
    qdBuildDialog,
    qdBuildDialogHover,
    qdWarningDialog,
    // qdConfirmDialog,

    qdHoverLift,
    qdHoverMonitor,
    qdHoverDoor,
    qdHoverFaceDoor,
    qdOffLine,

    qdPublicOffLine,
    qdHoverPublicDoor,
    qdPublicHoverMonitor,
    qdPublicHoverPark,
    qdPublicHoverFaceDoor,
  },
  mounted() {
    this.getBuildList({
      focusDevice: '1'
    }) 
    this.getPublicDeviceList({
      focusDevice: '1'
    }) // 获取未绑定楼栋设备列表
  },
  methods: {
    ...mapMutations(['setBuildFocusList', 'setPublicFocusList', 'setFocusBuildId', 'setFocusType' ]),
    getDreciton(device) {
      let location = device.deviceProperties.location
      if(Array.isArray(location)){
        location = location[0]
      }
      if(location && location.direction  == 'O') {
        return 'out'
      } else {
        return 'in'
      }
    },
    getBuildList(focusDevice) {
      this.$http({
        method: 'post',
        url: '/api/json/platformDeviceApi/getBuildFocusDeviceList',
        data: {
          projectId: this.projectId,
          ...focusDevice,
        }
      })
        .then((res) => {
          // 保存关注列表
          this.setBuildFocusList(this.groupList)
          this.groupList = res.data.groupList
          if (res.data.groupList && res.data.groupList.length > 0) {
            this.crtBuildList = res.data.groupList[0].buildList
          }
        })
    },
    getPublicDeviceList(focusDevice) {
      this.$http({
        method: 'post',
        url: '/api/json/platformDeviceApi/getProjectFocusDeviceList',
        data: {
          projectId: this.projectId,
          ...focusDevice,
        }
      })
        .then((res) => {
          this.deviceTypeList = res.data.deviceTypeList
          // 保存关注列表
          this.setPublicFocusList(this.deviceTypeList)
          if(this.deviceTypeList.length > 0) {
            this.deviceTypeList = this.deviceTypeList.map(el => {
              el.list = el.list.map(e =>{
                e.showHover = false
                return e
              })
              return el
            })
          }
        })
    },
    getDeviceTypeList() {
      this.$http({
        method: 'post',
        url: '/api/json/platformDeviceApi/getDeviceTypeList',
        data: {
          projectId: this.projectId,
          buildId: '',
        }
      })
        .then((res) => {
          this.deviceTypeList = res.data.mapInfo
        })
    },
    // 公区设备点击
    showPublicDialog(it, deviceType) {
      this.setFocusType('public')
      this.selectDevice  = Object.assign({}, it, {crtTabDeviceType: deviceType})
      this.$refs.publicDialog.showDialog = true
    },
    // 全部公区设备点击
    showAllPublicDialog() {
      this.setFocusType('public')
      this.$refs.allPublicDialog.showDialog = true
    },
    // 全部楼栋点击
    showBuildDialog(it) {
      this.setFocusBuildId(it.buildId)
      this.setFocusType('build')

      this.selectDevice = it
      this.$refs.buildDialog.showDialog = true
    },
    // 全部楼栋设备点击
    showBuildDialogHover(buildId, device, deviceType) {
      console.log(buildId)
      this.setFocusBuildId(buildId)
      this.setFocusType('build')

      this.selectDevice  = Object.assign({}, device, {crtTabDeviceType: deviceType})
      this.$refs.buildDialogHover.showDialog = true
    },

    changeGroup(idx) {
      this.crtGroupIdx = idx
      if(idx !== '') {
        this.crtBuildList = this.groupList[idx].buildList
      }
    },
    overPublicDevice(it, type) {
      clearTimeout(it.outTimeout)
      it.overTimeout = setTimeout(() => {
        it.showHover = true
        this.hoverDevice = it
        this.hoverDeviceType = type
        this.deviceTypeList = this.deviceTypeList.concat()
      }, 400)
    },
    outPublicDevice(it) {
      clearTimeout(it.overTimeout)
      it.outTimeout = setTimeout(() => {
        it.showHover = false 
        this.hoverDevice = it
        this.deviceTypeList = this.deviceTypeList.concat()
      }, 400)
    },
    overAllBuildDeivce(showName, i, type) {
      clearTimeout(i.outTimeout)
      i.overTimeout = setTimeout(() => {
        i[showName] = true
        this.hoverDevice = i
        this.hoverDeviceType = type
        this.groupList = this.groupList.concat()
      }, 400)
    },
    outAllBuildDevice(showName, i) {
      clearTimeout(i.overTimeout)
      i.outTimeout = setTimeout(() => {
        i[showName] = false
        this.groupList = this.groupList.concat()
      }, 400)
    },
    overGroupBuildDeivce(showName, i, type) {
      clearTimeout(i.outTimeout)
      i.overTimeout = setTimeout(() => {
        i[showName] = true
        this.hoverDevice = i
        this.hoverDeviceType = type
        this.crtBuildList = this.crtBuildList.concat()
      }, 400)
    },
    outGroupBuildDevice(showName, i) {
      clearTimeout(i.overTimeout)
      i.outTimeout = setTimeout(() => {
        i[showName] = false
        this.crtBuildList = this.crtBuildList.concat()
      }, 400)
    }
  },
  watch: {
    refresh() {
      this.crtGroupIdx = ''
      this.crtBuildList = []
      this.getBuildList({
        focusDevice: '1'
      })
      this.getPublicDeviceList({
        focusDevice: '1'
      }) // 获取未绑定楼栋设备列表
    },
    refreshBuild() {
      this.getBuildList({
        focusDevice: '1'
      })
      this.getPublicDeviceList({
        focusDevice: '1'
      }) 
    },
  }
}
</script>
<style lang="less" scoped>
.community-map {
  .list {
    position: absolute;
    top: 115px;
    left: 0px;
    right: 0px;
    overflow: auto;
    padding: 0 480px 300px;
    height: 720px;

    scrollbar-width: none;
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
    .item {
      position: relative;
      cursor: pointer;
      margin-right: 100px;
      margin-bottom: 40px;
      .device-img {
        width: 72px;
        height: 72px;
        background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine.png");
        background-size: 100% 100%;
        &:hover {
          background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine-active.png");
          background-size: 100% 100%;
        }
        &.park {
          background: url("~@assets/img/demo/community/device-icon/park.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/park-active.png");
            background-size: 100% 100%;
          }
        }
        &.park  {
          &.out{
            background: url("~@assets/img/demo/community/device-icon/park-out.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/park-out-active.png");
              background-size: 100% 100%;
            }
          }
        }
        &.doorctl_v2 {
          background: url("~@assets/img/demo/community/device-icon/doorctl_v2.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/doorctl_v2-active.png");
            background-size: 100% 100%;
          }
        }
        &.doorctl {
          background: url("~@assets/img/demo/community/device-icon/doorctl.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/doorctl-active.png");
            background-size: 100% 100%;
          }
        }
        &.all {
          background: url("~@assets/img/demo/community/device-icon/all.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/all-active.png");
            background-size: 100% 100%;
          }
        }
        &.video {
          background: url("~@assets/img/demo/community/device-icon/video.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/video-active.png");
            background-size: 100% 100%;
          }
        }
        &.fencingdoorwaymacchine {
          background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine-active.png");
            background-size: 100% 100%;
          }
        }
        &.facedoorwaymachine {
          background: url("~@assets/img/demo/community/device-icon/facedoorwaymachine.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/facedoorwaymachine-active.png");
            background-size: 100% 100%;
          }
        }
        &.propertymaster, &.roommastermachhine {
          background: url("~@assets/img/demo/community/device-icon/propertymaster.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/propertymaster-active.png");
            background-size: 100% 100%;
          }
        }
        &.unitdoorwaymacchine, &.facegate, &.villadoorwaymacchine {
          background: url("~@assets/img/demo/community/device-icon/mkj.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-icon/mkj-active.png");
            background-size: 100% 100%;
          }
        }


        &.mj {
          background: url("~@assets/img/demo/community/device-door.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-door-active.png");
            background-size: 100% 100%;
          }
        }
        &.spjk {
          background: url("~@assets/img/demo/community/device-monitor.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-monitor-active.png");
            background-size: 100% 100%;
          }
        }
        &.cz {
          background: url("~@assets/img/demo/community/device-car.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-car-active.png");
            background-size: 100% 100%;
          }
        }
        &.mk {
          background: url("~@assets/img/demo/community/device-mk.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-mk-active.png");
            background-size: 100% 100%;
          }
        }
        &.rl {
          background: url("~@assets/img/demo/community/device-rl.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-rl-active.png");
            background-size: 100% 100%;
          }
        }
        &.wyzj {
          background: url("~@assets/img/demo/community/device-wyzj.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/device-wyzj-active.png");
            background-size: 100% 100%;
          }
        }

      }
      .build-img {
        width: 96px;
        height: 132.6px;

        &.build1 {
          background: url("~@assets/img/demo/community/build1.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/build1-active.png");
            background-size: 100% 100%;
          }
        }
        &.build2 {
          background: url("~@assets/img/demo/community/build2.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/build2-active.png");
            background-size: 100% 100%;
          }
        }
        &.build3 {
          background: url("~@assets/img/demo/community/build3.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/build3-active.png");
            background-size: 100% 100%;
          }
        }
        &.build4 {
          background: url("~@assets/img/demo/community/build4.png");
          background-size: 100% 100%;
          &:hover {
            background: url("~@assets/img/demo/community/build4-active.png");
            background-size: 100% 100%;
          }
        }
      }
      .txt {
        text-align: center;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.8);
        width: 100px;
        word-break: break-all;
      }

      .wrap-icon{
        position: absolute;
        right: -22px;
        top: 0;
        display: flex;
        flex-direction: column;
        .icon-device{
          width: 26px;
          height: 26px;
          border-radius: 50%;
          margin-bottom: 8px;

          position: relative;
          &.icon-device1{
            background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine-active.png");
              background-size: 100% 100%;
            }
          }
          &.park {
            background: url("~@assets/img/demo/community/device-icon/park.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/park-active.png");
              background-size: 100% 100%;
            }
          }
          &.doorctl_v2 {
            background: url("~@assets/img/demo/community/device-icon/doorctl_v2.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/doorctl_v2-active.png");
              background-size: 100% 100%;
            }
          }
          &.doorctl {
            background: url("~@assets/img/demo/community/device-icon/doorctl.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/doorctl-active.png");
              background-size: 100% 100%;
            }
          }
          &.all {
            background: url("~@assets/img/demo/community/device-icon/all.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/all-active.png");
              background-size: 100% 100%;
            }
          }
          &.video {
            background: url("~@assets/img/demo/community/device-icon/video.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/video-active.png");
              background-size: 100% 100%;
            }
          }
          &.fencingdoorwaymacchine {
            background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine-active.png");
              background-size: 100% 100%;
            }
          }
          &.facedoorwaymachine {
            background: url("~@assets/img/demo/community/device-icon/facedoorwaymachine.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/facedoorwaymachine-active.png");
              background-size: 100% 100%;
            }
          }
          &.propertymaster, &.roommastermachhine {
            background: url("~@assets/img/demo/community/device-icon/propertymaster.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/propertymaster-active.png");
              background-size: 100% 100%;
            }
          }
          &.unitdoorwaymacchine, &.facegate, &.villadoorwaymacchine {
            background: url("~@assets/img/demo/community/device-icon/mkj.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/mkj-active.png");
              background-size: 100% 100%;
            }
          }
          &.lift{
            background: url("~@assets/img/demo/community/device-icon/lift.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-icon/lift-active.png");
              background-size: 100% 100%;
            }
          }
        }
      }

      &.offline{
        .device-img {
          &.park{
            background: url("~@assets/img/demo/community/device-icon/park-offline.png");
            background-size: 100% 100%;
          }
          &.park{
            &.out{
              background: url("~@assets/img/demo/community/device-icon/park-out-offline.png");
              background-size: 100% 100%;
            }
          }
          &.doorctl_v2{
            background: url("~@assets/img/demo/community/device-icon/doorctl_v2-offline.png");
            background-size: 100% 100%;
          }
          &.doorctl{
            background: url("~@assets/img/demo/community/device-icon/doorctl-offline.png");
            background-size: 100% 100%;
          }
          &.video{
            background: url("~@assets/img/demo/community/device-icon/video-offline.png");
            background-size: 100% 100%;
          }
          &.fencingdoorwaymacchine{
            background: url("~@assets/img/demo/community/device-icon/fencingdoorwaymacchine-offline.png");
            background-size: 100% 100%;
          }
          &.facedoorwaymachine{
            background: url("~@assets/img/demo/community/device-icon/facedoorwaymachine-offline.png");
            background-size: 100% 100%;
          }
          &.propertymaster{
            background: url("~@assets/img/demo/community/device-icon/propertymaster-offline.png");
            background-size: 100% 100%;
          }
          &.roommastermachhine{
            background: url("~@assets/img/demo/community/device-icon/propertymaster-offline.png");
            background-size: 100% 100%;
          }
          &.unitdoorwaymacchine, &.facegate, &.villadoorwaymacchine{
            background: url("~@assets/img/demo/community/device-icon/mkj-offline.png");
            background-size: 100% 100%;
          }
          &.lift{
            background: url("~@assets/img/demo/community/device-icon/lift-offline.png");
            background-size: 100% 100%;
          }
          

          &.mj {
            background: url("~@assets/img/demo/community/hz.png");
            background-size: 100% 100%;
          }
        }
        .txt {
          color: #F37D2C;
        }
      }
    }
    /** 公区 */
    .device {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .item {
        position: relative;
        margin-right: 48px;
        &.all-device {
          margin-left: 32px;
        }
        .line {
          position: absolute;
          top: 10px;
          left: -40px;
          height: 60px;
          width: 1px;
          background: rgba(255, 255, 255, 0.16);
        }

        .txt {
          text-align: center;
          font-size: 12px;
          width: 72px;
          word-break: break-all;
          margin-top: 4px;
        }
      }
    }
    /** 楼栋 */
    .group-nav {
      font-size: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      display: flex;
      padding: 3px 0;
      margin-bottom: 22px;

      .group-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        margin-right: 20px;
        color: rgba(255, 255, 255, 0.8);
        span {
          display: inline-block;
          width: 14px;
          height: 14px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 50%;
        }
        &.current {
          span {
            position: relative;
            border: 1px solid rgba(0, 183, 255, 1);
            &::after {
              content: "";
              border-radius: 50%;
              display: inline-block;
              width: 8px;
              height: 8px;
              background: #00b7ff;
              margin: auto;

              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
            }
          }
        }
      }
    }
    .build {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      .item:nth-child(5n+5) {
        margin-right: 0;
      }
    }
  }

  /**  对话框 */
  .dialog {
    color: rgba(255, 255, 255, 0.8);
    &::after {
      content: "";
      position: fixed;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 16, 31, 0.8);
    }
    .dialog-main {
      position: absolute;
      top: 50%;
      left: 50%;
      z-index: 999;
      transform: translate(-50%, -50%);

      width: 1196px;
      height: 554px;
      background: #21313c;
      border-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.08);
      .dialog-title {
        background: #283742;
        .name {
          font-weight: 600;
          text-align: center;
          padding: 17px 0;
        }
        .tab {
          .tab-item {
            padding: 0 14px 8px;
            &.active {
              color: #00b7ff;
            }
          }
        }
        .close {
          position: absolute;
          top: 24px;
          right: 24px;
          width: 14px;
          height: 15px;
          background: url("~@assets/img/demo/city/close.png");
          background-size: 100% 100%;
        }
      }

      .dialog-content {
        padding: 24px 12px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          width: 171px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border-radius: 1px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          margin: 0 12px 24px;
        }
      }
    }
  }

  /**  设备hover 弹框 */
  /deep/ .device-model {
    padding: 16px 24px;
    .model-title{
      text-align: center;
      font-size: 18px;
      margin-bottom: 11px;
      font-weight: bold;
    }
    .model-item {
      display: flex;
      justify-content: space-between;
      height: 28px;
      line-height: 28px;
      margin-bottom: 16px;
      .yantramanav{
        font-size: 20px;
      }
    }
    .table-title{
      margin: 16px 0 7px;
      .title-bottom{
        margin-top: 32px;
      }
    }
    table{
      text-align: center;
      width: 100%;
      table-layout: auto;

      tr{
        td, th{
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 200px;
        }
      }
      thead tr{
        color:rgba(255,255,255,0.4);
        height: 24px;
        border-bottom: 1px solid rgba(255,255,255,0.16);
        th{
          text-align: left;
        }
      }
      tbody{
        border-bottom: 1px solid rgba(255,255,255,0.16);
        tr{
          color:rgba(255,255,255,0.8);
          height: 28px;
          &.active{
            background:rgba(255,255,255,0.04);
            color: #00B7F;
          }
          td{
            text-align: left;
          }
        }
        .red{
          color: #FF4646;
        }
      }
    }
    .wrap-table{
      height: 172px;
      display: flex;
      align-items: flex-end;
      .pass-table{
        width: 273px;
      }
      .wrap-face{
        height: 141px;
        flex: 1;
        text-align: right;

        border-top: 1px solid rgba(255,255,255,0.16);
        border-bottom: 1px solid rgba(255,255,255,0.16);
        border-left: 16px solid rgba(255,255,255,0.16);
        .face-img{
          margin: 8px 0 8px 8px;
          width: 212px;
          height: 126px;
        }
      }
    }
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;

      background: url("~@assets/img/demo/offline-model-bg.png");
      background-size:100% 100%;
      filter: blur(12px);
    }
    // 公区弹框
    &.public-device-model {
      width: 428px;
      position: absolute;
      left: 50%;
      top: 80px;
      transform: translate(-50%, 0);
      z-index: 99;
      background:rgba(7,78,77,0.3);
      box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
      border:1px solid rgba(0,255,251,1);
      font-size: 12px;
      .model-block{
        width: 15px;
        height: 15px;
        position: absolute;
        left:50%;
        top: -8px;
        transform: translate(-50%, 0) rotate(225deg);

        background: #022a2f;
        border-right:1px solid rgba(0,255,251,1);
        border-bottom:1px solid rgba(0,255,251,1);
        padding:0;
      }
      &::after {
        content: '';
        position: absolute;
        left:50%;
        top: -20px;
        z-index: -1;
        transform: translate(-50%, 0);
        width: 60px;
        height: 60px;
      }

      &.face{
        width: 556px;
      }
      &.offline{
        width: 400px;
        background:rgba(74,34,6,0.3);
        box-shadow:0px 0px 12px 0px rgba(243,125,44,0.24);
        border:1px solid rgba(243,125,44,1);
        &::before {
          content: '';
          background: url("~@assets/img/demo/offline-model-bg.png");
          background-size:100% 100%;
        }
        .bg-blur{
          background: rgba(74,34,6,0.3);
        }
        .model-block{
          background: #0b1b1e;
          border-right:1px solid rgba(243,125,44,1);
          border-bottom:1px solid rgba(243,125,44,1);
        }
        .model-title{
          color: #F37D2C;
        }
        .offline-content{
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .offline-img{
            width: 78px;
            height: 60px;
            margin-top: 16px;
          }
          .offline-txt{
            font-size: 14px;
            margin-top: 36px;
            .orderNo{
              color: #00B7FF;
            }
          }
          .offline-btn{
            cursor: pointer;
            margin-top: 32px;

            outline: none;
            border: none;
            width:64px;
            height:32px;
            background:rgba(255,70,70,1);
            border-radius:2px;

            font-size:14px;
            color:rgba(255,255,255,1);
          }
        }
      }
      &.cz{
        width: 696px;
        .model-title{
          margin-bottom: 15px;
          font-weight: bold;
        }
        .wrap-table{
          height: 263px;
          align-items: flex-start;
          .pass-table{
            width: 276px;
          }
          .wrap-face{
            height: 225px;
            margin-top: 24px;
            padding-top: 10px;
            .face-img{
              width: 340px;
              height: 192px;
            }
          }
        }
        &.out{
          width: 850px;
          .wrap-table{
            height: 263px;
            .pass-table{
              width: 420px;
            }
          }
        }
      }
      &.monitor{
        .wrap-monitor-img{
          position: relative;
          margin-bottom: 26px;
          .time{
            background:rgba(0,0,0,0.72);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            line-height: 20px;
            padding-left: 8px;
          }
          .monitor-img{
            width: 100%;
            height: 192px;
          }
        }
      }
    }
    // 楼栋堂客
    &.build-model{
      width: 390px;
      position: absolute;
      left: 40px;
      top: -140px;
      transform: none;


      z-index: 99;
      background:rgba(7,78,77,0.3);
      box-shadow:0px 0px 12px 0px rgba(0,255,251,0.24);
      border:1px solid rgba(0,255,251,1);
      font-size: 12px;
      .model-block{
        width: 15px;
        height: 15px;
        position: absolute;
        left: -8px;
        top: 150px;
        transform: translate(0, -50%,) rotate(135deg);

        background: #022a2f;
        border-right:1px solid rgba(0,255,251,1);
        border-bottom:1px solid rgba(0,255,251,1);
        padding:0;
      }
      &::after {
        content: '';
        position: absolute;
        left: -20px;
        top: 150px;
        transform: translate(0, -50%,) rotate(135deg);
        z-index: -1;
        width: 60px;
        height: 60px;
      }
      &.monitor{
        .wrap-monitor-img{
          position: relative;
          margin-bottom: 26px;
          .time{
            background:rgba(0,0,0,0.72);
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 20px;
            line-height: 20px;
            padding-left: 8px;
          }
          .monitor-img{
            width: 100%;
            height: 192px;
          }
        }
      }
      &.offline{
        background:rgba(74,34,6,0.3);
        box-shadow:0px 0px 12px 0px rgba(243,125,44,0.24);
        border:1px solid rgba(243,125,44,1);
        top: -100px;
        .model-block {
          background: #0b1b1e;
          border-right:1px solid rgba(243,125,44,1);
          border-bottom:1px solid rgba(243,125,44,1);
          top: 111px;
        }
        .bg-blur{
          background: rgba(74,34,6,0.3);
        }
        .offline-content{
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          .offline-img{
            width: 78px;
            height: 60px;
            margin-top: 36px;
          }
          .offline-txt{
            font-size: 14px;
            margin-top: 36px;
            .orderNo{
              color: #00B7FF;
            }
          }
          .offline-btn{
            margin-top: 32px;

            outline: none;
            border: none;
            width:64px;
            height:32px;
            background:rgba(255,70,70,1);
            border-radius:2px;

            font-size:14px;
            color:rgba(255,255,255,1);
          }
        }
      }
    }

  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .community-map {
    .list {
      position: absolute;
      top: 90px;
      left: 0;
      right: 0;

      height: 435px;
      overflow: auto;
      padding: 0 360px 240px;
      .device {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item {
          position: relative;
          margin-right: 28px;
          &.all-device {
            margin-left: 28px;
          }
          .line {
            left: -28px;
          }
        }
      }
      .build {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .item {
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 30px;
        .device-img {
          width: 72px;
          height: 72px;
          &.spjk {
            background: url("~@assets/img/demo/community/device-monitor.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-monitor-active.png");
              background-size: 100% 100%;
            }
          }
          &.cz {
            background: url("~@assets/img/demo/community/device-car.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-car-active.png");
              background-size: 100% 100%;
            }
          }
          &.mk {
            background: url("~@assets/img/demo/community/device-mk.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-mk-active.png");
              background-size: 100% 100%;
            }
          }
          &.rl {
            background: url("~@assets/img/demo/community/device-rl.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-rl-active.png");
              background-size: 100% 100%;
            }
          }
          &.wyzj {
            background: url("~@assets/img/demo/community/device-wyzj.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/device-wyzj-active.png");
              background-size: 100% 100%;
            }
          }
        }
        .build-img {
          width: 96px;
          height: 148.6px;

          &.build1 {
            background: url("~@assets/img/demo/community/build1.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/build1-active.png");
              background-size: 100% 100%;
            }
          }
          &.build2 {
            background: url("~@assets/img/demo/community/build2.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/build2-active.png");
              background-size: 100% 100%;
            }
          }
          &.build3 {
            background: url("~@assets/img/demo/community/build3.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/build3-active.png");
              background-size: 100% 100%;
            }
          }
          &.build4 {
            background: url("~@assets/img/demo/community/build4.png");
            background-size: 100% 100%;
            &:hover {
              background: url("~@assets/img/demo/community/build4-active.png");
              background-size: 100% 100%;
            }
          }
        }
        .group-img {
          width: 148px;
          height: 200px;
        }
        .txt {
          text-align: center;
          font-size: 12px;
        }
      }
      .group {
        .item {
          margin-right: 60px;
        }
      }
    }
  }
}
</style>
