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

      <div class="filter-item">
        <div class="label">开门方式</div>
        <input v-model="other"
          type="text"
          placeholder="" />
      </div>

      <button class="search"
        @click="getLogList('1')">搜索</button>
    </div>

    <div class="list">
      <!--表头-->
      <!-- <div class="list-head">
        <div class="tr">
          <div class="td name">姓名</div>
          <div class="td id">身份</div>
          <div class="td phone">手机</div>
          <div class="td passTime">通行时间</div>
          <div class="td passType">通行方式</div>
          <div class="td location">位置</div>
          <div class="td img">照片</div>
        </div>

        <div class="export"><i/>导出</div>
      </div> -->
      <!--列表内容-->
      <div class="list-content">
        <div class="list-table">
          <table class="table">
            <thead>
              <tr>
                <th>用户 </th>
                <th>位置</th>
                <th>开门方式</th>
                <th>开门时间</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(it, idx) in recordList"
                :key="idx"
                @click="changeCurrentDetail(it,idx)"
                :class="[{'active': idx == currentIdx}]">
                  <td class="name">{{it.userName}}</td>
                  <td class="id">{{it.locaition}}</td>
                  <td class="phone">{{it.opType}}</td>
                  <td class="passTime">{{it.recordTime}}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="list-info">
          <div class="info-head">
            <!-- <div class="export"><i />
              <div>导出</div>
            </div> -->
          </div>

          <div class="item-info">
            <div class="item">
              <div class="label">用户</div>
              <div class="value">{{currentDetail.userName}}</div>
            </div>
            <div class="item">
              <div class="label">位置</div>
              <div class="value">{{currentDetail.location}}</div>
            </div>
            <div class="item">
              <div class="label">开门方式</div>
              <div class="value">{{currentDetail.opType}}</div>
            </div>
            <div class="item">
              <div class="label">开门时间</div>
              <div class="value">{{currentDetail.recordTime}}</div>
            </div>
            <div class="item">
              <div class="label">设备sn</div>
              <div class="value">{{currentDetail.deviceSn}}</div>
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
export default {
  mixins: [mixLocation],
  data() {
    return {
      time: '',
      other: '',

      pageNo: '1',
      pageSize: '10',
      totalCnt: '',
      recordList: [],

      currentDetail: {},
      currentIdx: 0,
    }
  },
  computed: {
    ...mapState(['deviceInfo', 'rank']),
    ...mapGetters(['projectId']),
  },
  mounted() {
    this.getBuild()
    this.getLogList()
  },
  methods: {
    ...mapMutations(['hide']),
    getLogList(pageNo = this.pageNo) {
      let params = {
        projectId: this.projectId,
        index: 'qdh_gy_locker_locker_operation', // 门锁 操作记录（开门记录）
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

      this.$http({
        method: 'post',
        url: '/api/json/deviceLogApi/getDeviceLog',
        data: params
      })
        .then((res) => {
          this.totalCnt = res.data.totalCnt
          this.recordList = res.data.recordList
          this.currentDetail = this.recordList[this.currentIdx]
        })
    },
    pageNoChange(pageNo) {
      this.getLogList(pageNo)
    },
    changeCurrentDetail(it, idx) {
      this.currentIdx = idx
      this.currentDetail = it
    },
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
  .filter {
    font-size: 14px;
    display: flex;
    justify-content: flex-start;

    margin-bottom: 40px;
    .filter-item {
      height: auto;
      display: flex;
      margin-right: 40px;
      .label {
        white-space: nowrap;
        color: rgba(255, 255, 255, 0.6);
        height: 32px;
        line-height: 32px;
        margin-right: 16px;
      }
      input {
        padding-left: 10px;
        color: rgba(255, 255, 255, 1);
        outline: none;
        background: transparent;
        width: 240px;
        height: 32px;
        border-radius: 2px;
        border: 1px solid rgba(255, 255, 255, 0.12);
      }
    }

    .search {
      cursor: pointer;
      background: transparent;
      width: 64px;
      height: 32px;
      border-radius: 2px;
      border: 1px solid rgba(0, 183, 255, 1);
      color: #00b7ff;
    }
  }

  .list {
    width: 100%;
    .list-head {
      display: flex;
      justify-content: space-between;

      font-size: 14px;
      color: rgba(255, 255, 255, 0.4);

      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      .tr {
        width: 964px;
        display: flex;
        justify-content: space-between;
      }

      .export {
        color: #00b7ff;
      }
    }

    .list-content {
      font-size: 14px;
      height: 700px;

      display: flex;
      border-bottom: 1px solid rgba(255, 255, 255, 0.16);
      .list-table {
        color: rgba(255, 255, 255, 1);
        width: 948px;
        .table {
          width: 100%;
          thead {
            tr {
              height: 24px;
              color: rgba(255, 255, 255, 0.4);
              border-bottom: 1px solid rgba(255, 255, 255, 0.16);
            }
          }
          tbody {
            tr {
              height: 64px;
              &.active {
                background: rgba(255, 255, 255, 0.04);
              }
            }
          }

          .face-img {
            width: 48px;
            height: 48px;
            border-radius: 50%;
          }
        }
      }
      .list-info {
        flex: 1;
        .info-head {
          box-sizing: content-box;
          height: 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.16);

          .export {
            cursor: pointer;
            text-align: right;
            color: #00b7ff;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            i {
              display: inline-block;
              width: 15px;
              height: 15px;
              margin-right: 3px;
              background: url("~@assets/img/demo/export.png");
              background-size: 100% 100%;
            }
          }
        }

        .item-info {
          height: 676px;
          flex: 1;
          color: rgba(255, 255, 255, 0.4);
          border-left: 8px solid rgba(255, 255, 255, 0.08);
          padding: 20px 30px 24px 24px;

          .wrap-face-img {
            text-align: center;
            .face-img {
              margin: 0 auto;
              width: 144px;
              height: 190px;
            }
          }

          .sn {
            text-align: center;
            .head-img {
              width: 144px;
              height: 190px;
            }
            margin-bottom: 12px;
          }
          .item {
            padding: 3px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid rgba(255, 255, 255, 0.16);
            .label{
              min-width: 100px;
            }
            .value{
              text-align: right;
              color: rgba(255,255,255,0.8);
            }
          }
        }
      }
    }
    // .name{
    //   width: 69px;
    // }
    // .id{
    //   width: 171px;
    // }
    // .phone{
    //   width: 137px;
    // }
    // .passTime{
    //   width: 161px;
    // }
    // .passType{
    //   width: 263px;
    // }
    // .location{
    //   width: 93px;
    // }
    // .img{
    //   width: 70px;
    // }
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
    border: 1px solid rgba(255, 255, 255, 0.16);
    &:hover {
      color: #fff;
    }
    a {
      &:hover {
        color: #fff;
      }
    }
  }
  .ivu-page-item-active {
    background: #00b7ff;
    a {
      color: #fff;
    }
  }
}
</style>