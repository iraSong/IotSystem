<template>
  <div class="dialog-content">
    <div class="filter">
      <div class="filter-item">
        <div class="label">时间段</div>
        <div class="qd-el qd-filter-el">
          <el-date-picker
            popper-class="pwdType"
            size="small"
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss"
            >
          </el-date-picker>
        </div>
      </div>
      <div class="filter-item">
        <div class="label">位置</div>
        <div class="qd-el qd-filter-el">
          <el-cascader
            :clearable="true"
            size="small"
            popper-class="qd-cascader"
            :props="props"
            v-model="location">
          </el-cascader>
        </div>

      </div>

      <div class="filter-item lock-password">
        <div class="label">事件类型</div>
        <el-select 
            v-model="deviceStatus"
            clearable 
            placeholder=""
            popper-class="pwdType">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
            >
          </el-option>
        </el-select>
      </div>

      <button class="search" @click="getLogList(1)">搜索</button>
    </div>

    <div class="list">
      <!--列表内容-->
      <div class="list-content">
        <div class="list-table">
          <table class="table">
            <thead>
              <tr>
                <th>时间</th>
                <th>设备编号</th>
                <th>位置</th>
                <th>事件类型</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList" :key="idx">
                <td>{{it.recordTime}}</td>
                <td>{{it.sn}}</td>
                <td>{{it | parseLocation}}</td>
                <td>{{it.status}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="list-info">
          <div class="info-head">
            <div class="export">
              <i/>
             <div @click="exportFile">导出</div>
           </div>
          </div>
        </div>
      </div>

      <!--分页-->
      <div class="wrap-page">
        <Page @on-change="pageNoChange"
          :total="+totalCnt"
          :current="+pageNo"
          :page-size="+pageSize"
          class-name="page" />
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapGetters, mapMutations } from 'vuex'
import { mixLocation } from '../../../mixins/location.js'
import download from '../../../utils/download.js'

export default {
  mixins: [mixLocation],
  data() {
    return {
      pageNo: '1',
      pageSize: '10',
      totalCnt: '',

      recordList: [],
      time: '',
      other: '',

      options: [{
          value: '',
          label: '全部'
        },{
          value: 'offLine',
          label: '离线'
        }, {
          value: 'fault',
          label: '故障'
        }
      ],
      deviceStatus: '',
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getLogList()
    if(this.deviceInfo.deviceType =="locker") {
      this.options.push({value: 'lowBattery', label: '低电量'})
    }
  },
  methods: {
    ...mapMutations(['hide']),
    getLogType() {
      let type = ''
      let deviceType = this.deviceInfo.deviceType
      // 事件记录
      if(deviceType == 'lockergateway') {
        // 门锁网关
        type = 'qdh_gy_locker_locker_gateway_status'
      } else if(deviceType =="locker") {
        // 门锁
        type = 'qdh_gy_locker_locker_status'
      } else if(deviceType == 'elec') { 
        // 电表
        type = 'gy_sys_elec_status'
      } else if (deviceType == 'water' || deviceType == 'hotwater') {
        // 水表
        type = 'gy_sys_water_status'
      } else if(deviceType == 'gateway') {
        // 水电表网关
        type = 'gy_sys_gateway_status'
      } else if(deviceType == 'lift') {
        // 电梯
        type = ''
      } else if(deviceType == 'monitor') {
        // 监控
        type = ''
      }  else {
        // 对讲机
        type = 'cloud_talk_unlock_record,qdmgr_local3_unlock_record'
      }
      return type
    },
    getLogList(pageNo = this.pageNo) {
      this.pageNo = pageNo
      let logType = this.getLogType()
      if(!logType) return
      let params = {
        projectId: this.projectId,
        index: logType, // 门锁
        pageNo: pageNo,
        pageSize: this.pageSize,
        beginTime: moment().subtract(2, 'years').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
      if(this.other) {
        params.mixCon = this.other
      }
      if(this.location.length > 0) {
        params.buildId = this.location[0]
        params.unitId = this.location[1]
        params.roomId = this.location[2]
      }
      if(this.time && this.time.length > 0) {
        params.beginTime = this.time[0]
        params.endTime = this.time[1]
      }
      if(this.deviceStatus) {
        params.status = this.deviceStatus
      }

      this.$http({
        method: 'post',
        url: '/api/json/deviceLogApi/getDeviceLog',
        data: params
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.recordList = res.data.recordList
        })
    },
    pageNoChange(pageNo) {
      this.getLogList(pageNo)
    },
    exportFile() {
      let params = {
        index: this.getLogType(),
        startTime: moment().subtract(2,'years').format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        pageNo: '1',
        pageSize: '10000',
        column:[{
          'code': 'recordTime',
          'name': '时间'
        }, {
          'code': 'sn',
          'name': '设备编号'
        }, {
          'code': 'groupName',
          'name': '组团'
        }, {
          'code': 'buildName',
          'name': '楼栋'
        }, {
          'code': 'unitName',
          'name': '单元'
        }, {
          'code': 'roomName',
          'name': '房间'
        }, {
          'code': 'status',
          'name': '事件类型'
        }]
      }
      download(params, '/api/json/deviceLogApi/exportDeviceLog')
    }
  },
  watch: {
  }
}
</script>

<style lang="less" scoped>
.dialog-content {
  flex: 1;
  width: 1302px;
  margin: auto;
  .filter{
    font-size: 14px;
    display: flex;
    justify-content: flex-start;

    margin-bottom: 40px;
    .filter-item{
      height: auto;
      display: flex;
      margin-right: 40px;
      .label{
        color:rgba(255,255,255,0.6);
        height: 32px;
        line-height: 32px;
        margin-right: 16px;
      }
      input{
        padding-left: 10px;
        color:rgba(255,255,255,1);
        outline: none;
        background: transparent;
        width:296px;
        height:32px;
        border-radius:2px;
        border:1px solid rgba(255,255,255,0.12);
      }
    }

    .search{
      cursor: pointer;
      background: transparent;
      width:64px;
      height:32px;
      border-radius:2px;
      border:1px solid rgba(0,183,255,1);
      color: #00B7FF;
    }
  }

  .list{
    width: 100%;
    .list-head{
      display: flex;
      justify-content: space-between;

      font-size: 14px;
      color:rgba(255,255,255,0.4);

      border-bottom: 1px solid rgba(255,255,255,0.16);
      .tr{
        width: 964px;
        display: flex;
        justify-content: space-between;
      }

      .export{
        color: #00B7FF;
      }
    }

    .list-content{
      font-size: 14px;
      height: 700px;

      display: flex;
      border-bottom: 1px solid rgba(255,255,255,0.16);
      .list-table{
        color:rgba(255,255,255,1);
        width: 948px;
        .table{
          width: 100%;
          thead{
            tr{
              height: 24px;
              color:rgba(255,255,255,0.4);
              border-bottom: 1px solid rgba(255,255,255,0.16);
            }
          }
          tbody{
            tr{
              height: 48px;
            }
          }

          .face-img{
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
        }
      }
      .list-info{
        flex: 1;
        .info-head{
          box-sizing: content-box;
          height: 24px;
          border-bottom: 1px solid rgba(255,255,255,0.16);

          .export{
            cursor: pointer;
            text-align: right;
            color: #00B7FF;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            i{
              display: inline-block;
              width: 15px;
              height: 15px;
              margin-right: 3px;
              background: url('~@assets/img/demo/export.png');
              background-size: 100% 100%;
            }
          }
        }

        .item-info{
          height: 676px;
          flex: 1;
          color:rgba(255,255,255,0.4);
          border-left: 8px solid rgba(255,255,255,0.08);
          padding: 20px 30px 24px 24px;

          .wrap-face-img{
            text-align: center;
            .face-img{
              margin: 0 auto;
              width: 144px;
              height: 190px;
            }
          }

          .sn{
            text-align: center;
            .head-img{
              width: 144px;
              height: 190px;
            }
            margin-bottom: 12px;
          }
          .item{
            height: 28px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255,255,255,0.16);
          }
        }
      }
    }
  }
}

.wrap-page {
  margin-top: 24px;
  text-align: center;
}
/deep/ .page {
  margin-top: 12px;
  text-align: center;
  .ivu-page-next,
  .ivu-page-prev,
  .ivu-page-item {
    background: transparent;
    border:1px solid rgba(255,255,255,0.16);
    &:hover{
      color: #fff;
    }
    a{
      &:hover{
        color: #fff;
      }
    }
  }
  .ivu-page-item-active {
    background:#00B7FF;
    a{
      color: #fff;
    }
  }
}
</style>