<template>
  <div class="community-map">
    <div v-show="!showGroupBuilds" class="list">
      <div class="device">
        <div class="item"
          v-for="it in deviceTypeList"
          :key="it.deviceType"
          @click="showDialog(it)">
          <div v-if="it.deviceType =='doorctl_v2' || it.deviceType =='doorctl'" class="device-img mj"></div>
          <div v-else-if="it.deviceType =='type2'" class="device-img spjk"></div>
          <div v-else-if="it.deviceType =='type3'" class="device-img cz"></div>

          <div v-else-if="it.deviceType =='fencingdoorwaymacchine'" class="device-img mk"></div>
          <div v-else-if="it.deviceType =='facedoorwaymachine'" class="device-img rl"></div>
          <div v-else-if="it.deviceType =='propertymaster'" class="device-img wyzj"></div>
          <div v-else class="device-img mk"></div>

          <div class="txt">{{it.deviceName}}</div>
        </div>
      </div>
      <!-- 大于 30栋 显示组团 -->
      <div class="build group" v-if="buildCount > 30">
        <div class="item" v-for="(it, idx) in buildList" :key="it.id" @click="showGroup(it)">
          <div v-if="(idx+1)%3==0" class="group-img group3"></div>
          <div v-else-if="(idx+1)%2==0" class="group-img group2"></div>
          <div v-else class="group-img group1"></div>
          <div class="txt">{{it.groupName}}</div>
        </div>
      </div>
      <!-- 小于 30栋 显示所有楼栋 -->
       <div class="build" v-else>
         <template v-for="it in buildList">
          <div v-for="(i, idx) in it.buildList" :key="i.buildId + '-build'" class="item" @click="showBuildDialog(i)">
            <div v-if="(idx+1)%4==0" class="build-img build4"></div>
            <div v-else-if="(idx+1)%3==0" class="build-img build3"></div>
            <div v-else-if="(idx+1)%2==0" class="build-img build2"></div>
            <div v-else class="build-img build1"></div>
            <div class="txt">{{i.buildName}}</div>
          </div>
         </template>
      </div>
    </div>

    <!-- 单个组团下的楼栋列表 -->
    <div v-show="showGroupBuilds">
      <div class="list group-nav">
        <div @click="showGroupBuilds = false" class="back"><i />返回</div>
        <div>{{currentGroupList.groupName}}</div>
      </div>
      <div class="list group-build">
        <!-- 大于 30栋 显示组团 -->
        <div class="build">
          <div class="item" v-for="(it, idx) in currentGroupList.buildList" :key="idx + '-4'" @click="showBuildDialog(it)">
            <div v-if="(idx+1)%4==0" class="build-img build4"></div>
            <div v-else-if="(idx+1)%3==0" class="build-img build3"></div>
            <div v-else-if="(idx+1)%2==0" class="build-img build2"></div>
            <div v-else class="build-img build1"></div>
            <div class="txt">{{it.buildName}}</div>
          </div>
        </div>
      </div>
    </div>

    <!--社区设备 弹框 -->
    <qd-dialog ref="dialog" :select-device="selectDevice"/>
    <!--楼栋设备 弹框 -->
    <qd-build-dialog ref="buildDialog" :select-device="selectDevice"/>
    <!-- 告警弹框 -->
    <qd-warning-dialog ref="warningDialog"/>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'
import { DevicePos } from '../../data.js'
import qdDialog from './component/dialog.vue'
import qdBuildDialog from './component/buildDialog.vue'

import qdWarningDialog from './component/warningDialog.vue'

export default {
  data() {
    return {
      showMask: true,
      DeviceList: DevicePos,

      buildList: [],
      deviceTypeList: [],
      selectDevice: {},

      buildCount: 0, // 楼栋数量
      showGroupBuilds: false,
      currentGroupList: [],
    }
  },
  computed: {
    ...mapState(['rank', 'rankName', 'refresh']),
    ...mapGetters(['projectId']),
  },
  components: {
    qdDialog,
    qdBuildDialog,
    qdWarningDialog
  },
  mounted() {
    this.getBuildList()
    this.getDeviceTypeList() // 获取未绑定楼栋设备列表
  },
  methods: {
    getBuildList() {
      this.$http({
        method:'post',
        url:'/api/json/buildApi/getBuildListByProjectId',
        data:{
          projectId: this.projectId
        }
      })
        .then((res) => {
          this.buildCount = res.data.totalCnt
          this.buildList = res.data.groupList
        })
    },
    getDeviceTypeList() {
      this.$http({
        method:'post',
        url:'/api/json/platformDeviceApi/getDeviceTypeList',
        data:{
          projectId: this.projectId,
          buildId: '',
        }
      })
        .then((res) => {
          this.deviceTypeList = res.data.mapInfo
        })
    },
    showDeviceDetail(it,idx) {
      it[idx].show = true
      this.DeviceList = Object.assign({}, this.DeviceList )
    },
    playVideo(idx) {
      let myVideo=document.getElementById(`video${idx}`)
      myVideo.play()
      this.showMask = false
    },
    over(it){
      it.show = true
    },
    out(it, idx) {
      it.show = false
      if(it.type !==2) return
      let myVideo=document.getElementById(`video${idx}`)
      setTimeout(()=> {
        if(it.show === false){
          myVideo.pause()
          this.showMask = true
        } 
      }, 10)
    },
    showDialog(it) {
      this.selectDevice = it
      this.$refs.dialog.showDialog = true
    },
    showBuildDialog(it) {
      this.selectDevice = it
      this.$refs.buildDialog.showDialog = true
    },
    showGroup(it) {
      this.currentGroupList = it
      this.showGroupBuilds = true
    }
  },
  watch: {
    refresh() {
      console.log('---------refresh')
      this.getBuildList()
      this.getDeviceTypeList() // 获取未绑定楼栋设备列表
    }
  }
}
</script>
<style lang="less" scoped>
.community-map{
  .list{
    position: absolute;
    top:115px;
    left:490px;
    right:400px;
    overflow: auto;
    height: 690px;

    .device{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .build{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
    }
    .item{
      cursor: pointer;
      margin-right:72px;
      margin-bottom:40px;
      .device-img{
        width: 72px;
        height:72px;
        background: url("~@assets/img/demo/community/device-door.png");
        background-size: 100% 100%;
        &:hover{
          background: url("~@assets/img/demo/community/device-door-active.png");
          background-size: 100% 100%;
        }
        &.mj{
          background: url("~@assets/img/demo/community/device-door.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-door-active.png");
            background-size: 100% 100%;
          }
        }
        &.spjk{
          background: url("~@assets/img/demo/community/device-monitor.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-monitor-active.png");
            background-size: 100% 100%;
          }
        }
        &.cz{
          background: url("~@assets/img/demo/community/device-car.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-car-active.png");
            background-size: 100% 100%;
          }
        }
        &.mk{
          background: url("~@assets/img/demo/community/device-mk.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-mk-active.png");
            background-size: 100% 100%;
          }
        }
        &.rl{
          background: url("~@assets/img/demo/community/device-rl.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-rl-active.png");
            background-size: 100% 100%;
          }
        }
        &.wyzj{
          background: url("~@assets/img/demo/community/device-wyzj.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/device-wyzj-active.png");
            background-size: 100% 100%;
          }
        }
      }

      .group-img{
        width: 158px;
        height: 218px;

        &.group1{
          background: url("~@assets/img/demo/community/group1.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/group1-active.png");
            background-size: 100% 100%;
          }
        }
        &.group2{
          background: url("~@assets/img/demo/community/group2.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/group2-active.png");
            background-size: 100% 100%;
          }
        }
        &.group3{
          background: url("~@assets/img/demo/community/group3.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/group3-active.png");
            background-size: 100% 100%;
          }
        }
      }

      .build-img{
        width: 96px;
        height: 148.6px;

        &.build1{
          background: url("~@assets/img/demo/community/build1.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/build1-active.png");
            background-size: 100% 100%;
          }
        }
        &.build2{
          background: url("~@assets/img/demo/community/build2.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/build2-active.png");
            background-size: 100% 100%;
          }
        }
        &.build3{
          background: url("~@assets/img/demo/community/build3.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/build3-active.png");
            background-size: 100% 100%;
          }
        }
        &.build4{
          background: url("~@assets/img/demo/community/build4.png");
          background-size: 100% 100%;
          &:hover{
            background: url("~@assets/img/demo/community/build4-active.png");
            background-size: 100% 100%;
          }
        }
      }

      .txt{
        text-align: center;
        font-size:12px;
        color:rgba(255,255,255,0.8);
      }
    }
    .group{
      .item{
        margin-right:91px;
      }
    }
    &.group-nav{
      top: 95px;
      font-size:14px;
      height: auto;
      overflow: visible;
      border-bottom:1px solid rgba(255,255,255,0.16);
      display: flex;
      justify-content: center;
      .back{
        cursor: pointer;
        position: absolute;
        left:0;
        padding-left: 20px;
        i{
          display: block;
          position: absolute;
          top: 5px;
          left: 5px;
          content: '';

          width: 12px;
          height:12px;
          border: 2px solid #fff;
          border-color: #fff #fff transparent  transparent;
          transform: rotate(-135deg);
        }
      }
    }
    &.group-build{
      top: 135px;
    }
  }

  .dialog{
    color:rgba(255,255,255,0.8);
    &::after{
      content: "";
      position: fixed;
      z-index: 99;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,16,31,0.8);
    }
    .dialog-main{
      position: absolute;
      top:50%;
      left:50%;
      z-index: 999;
      transform: translate(-50%, -50%);

      width:1196px;
      height: 554px;
      background:#21313c;
      border-radius:2px;
      border:1px solid rgba(255,255,255,0.08);
      .dialog-title{
        background:#283742;
        .name{
          font-weight:600;
          text-align: center;
          padding: 17px 0;
        }
        .tab{
          .tab-item{
            padding: 0 14px 8px;
            &.active{
              color:#00B7FF;
            }
          }
        }
        .close{
          position: absolute;
          top: 24px;
          right: 24px;
          width: 14px;
          height: 15px;
          background: url("~@assets/img/demo/city/close.png");
          background-size: 100% 100%;
        }
      }

      .dialog-content{
        padding: 24px 12px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        .item{
          width: 171px;
          height: 80px;
          line-height: 80px;
          text-align: center;
          border-radius:1px;
          border:1px solid rgba(255,255,255,0.08);
          margin: 0 12px 24px;
        }
      }
    }
  }
}

// 小屏幕适配
@media screen and (max-height: 800px) {
  .community-map{
    
    .list{
      position: absolute;
      top:90px;
      left:360px;
      right:360px;


      height: 435px;
      overflow: auto;
      .device{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }
      .build{
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
      }

      .item{
        cursor: pointer;
        margin-right: 10px;
        margin-bottom: 30px;
        .device-img{
          width: 72px;
          height:72px;
          &.mj{
            background: url("~@assets/img/demo/community/device-door.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-door-active.png");
              background-size: 100% 100%;
            }
          }
          &.spjk{
            background: url("~@assets/img/demo/community/device-monitor.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-monitor-active.png");
              background-size: 100% 100%;
            }
          }
          &.cz{
            background: url("~@assets/img/demo/community/device-car.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-car-active.png");
              background-size: 100% 100%;
            }
          }
          &.mk{
            background: url("~@assets/img/demo/community/device-mk.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-mk-active.png");
              background-size: 100% 100%;
            }
          }
          &.rl{
            background: url("~@assets/img/demo/community/device-rl.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-rl-active.png");
              background-size: 100% 100%;
            }
          }
          &.wyzj{
            background: url("~@assets/img/demo/community/device-wyzj.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/device-wyzj-active.png");
              background-size: 100% 100%;
            }
          }
        }
        .build-img{
          width: 96px;
          height: 148.6px;

          &.build1{
            background: url("~@assets/img/demo/community/build1.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/build1-active.png");
              background-size: 100% 100%;
            }
          }
          &.build2{
            background: url("~@assets/img/demo/community/build2.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/build2-active.png");
              background-size: 100% 100%;
            }
          }
          &.build3{
            background: url("~@assets/img/demo/community/build3.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/build3-active.png");
              background-size: 100% 100%;
            }
          }
          &.build4{
            background: url("~@assets/img/demo/community/build4.png");
            background-size: 100% 100%;
            &:hover{
              background: url("~@assets/img/demo/community/build4-active.png");
              background-size: 100% 100%;
            }
          }
        }
        .group-img{
          width: 148px;
          height: 200px;
        }
        .txt{
          text-align: center;
          font-size:12px;
          color:rgba(255,255,255,0.8);
        }
      }
      .group{
        .item{
          margin-right: 60px;
        }
      }
    }
  }
}
</style>
