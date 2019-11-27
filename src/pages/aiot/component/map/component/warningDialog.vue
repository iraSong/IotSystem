<template>
  <!-- 弹框 -->
  <div class="qdDialog" @click="showWarning = false" v-if="showWarning">
    <div @click.stop class="dialog-main detail">
      <div class="dialog-title">
        <div class="name">告警：敏感通行</div>
      </div>
      <div class="dialog-wrap">
        <div class="dialog-content">
          <div class="right">
            <div class="info">
              <div class="sn"><i class="icon" />通行人员</div>
            </div>
            <div class="info">
              <div class="sn"><img  class="head-img" src="~@assets/img/face1.jpg" /></div>
              <div class="status">
                <div>姓名：施梦卿</div>
                <div>手机：19093161605</div>
              </div>
            </div>

            <div class="title-table">
              <div><i class="icon" />通行记录</div>
            </div>

            <div class="info it">
              <div class="sn"><i class="icon" />通行时间：09.24  23:40:59</div>
            </div>
            <div class="info it">
              <div class="sn"><i class="icon" />通行设备：社区游泳池门禁</div>
            </div>
          </div>

          <div class="left">
            <div class="device-name">
              <i class="icon" />周边监控：
              <div class="select-panel">
                <span @click="showPanel = true" class="txt-select">社区游泳池监控</span>
                <i class="i-arrow ps-arrow"/>
                <div v-show="showPanel" class="open-panel">
                  <div class="panel-arrow"></div>
                  <div class="panel-item">
                    <div class="content">监控 4</div>
                  </div>
                  <div class="panel-item">
                    <div class="content">监控 4</div>
                  </div>
                  <div class="panel-item active">
                    <div class="content">监控 4</div>
                  </div>
                  <div class="panel-item">
                    <div class="content">监控 4</div>
                  </div>
                  <div class="panel-item">
                    <div class="content">监控 4</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="wrap-video">
              <div class="play-mask"></div>
              <video id="video1">
                <source src="~@public/video.mp4" />
              </video>
            </div>
          </div>


        </div>
        <div class="footer">
          <button class="cancel" @click.stop="showSearchPanel = false">忽略告警</button>
          <button class="confirm" @click.stop="submit">确认</button>
          <div  class="confirmDialog">
            <div class="panel-arrow"></div>
            <div class="title">要忽略告警吗？</div>
            <input v-model="reMarks" type="text" placeholder="备注忽略原因" />
            <div class="footer">
              <button class="cancel footer">取消</button>
              <button class="confirm">忽略</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      showPanel: false,
      showWarning: false,
      reMarks: '',
    }
  },
  computed: {
    ...mapState(['rank', 'rankName']),
  },
  components: {
  },
  mounted() {
  },
  methods: {
    hideDialog() {
      this.showDialog = false
    },
    changeDetail(val) {
      this.showList = false
      this.cutTab = val
    },
    doShowList() {
      this.showList = true
    }
  },
  watch: {
  }
}
</script>
<style lang="less" scoped>
.qdDialog{
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

    background:rgba(0,16,31,0.8);
    border-radius:2px;
    border:1px solid rgba(255,255,255,0.08);

    display: flex;
    flex-direction: column;
    .dialog-title{
      background: repeating-linear-gradient(120deg, #EF3A3A, #EF3A3A 16px, #FF4646 16px, #FF4646 32px);
      .name{
        font-size:20px;
        font-weight:600;
        text-align: center;
        padding: 17px 0;
      }
    }
    .dialog-wrap{
      flex: 1;
      background:rgba(87,5,5,0.3);
      box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
      border-radius:2px;
      border:1px solid rgba(255,70,70,1);

      display: flex;
      flex-direction: column;
    }
    .dialog-content{
      flex: 1;
      padding: 24px 12px;
      display: flex;
      justify-content: flex-start;
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
    .footer{
      border-top:1px solid #291c26;
      position: relative;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-right:16px;
      font-size: 14px;
      .cancel{
        outline:none;
        width: 94px;
        height: 32px;
        border-radius:2px;
        border:1px solid rgba(255,255,255,0.4);
        color:rgba(255,255,255,0.8);
        background: transparent;
        margin-right: 16px;
        &.footer{
          width: 64px;
        }
      }
      .confirm{
        outline:none;
        border: none;
        width: 64px;
        height: 32px;

        background:#FF4646;
        color: #fff;
        box-shadow:0px 0px 12px 0px rgba(255,70,70,0.4);
        border-radius:2px;
        border:1px solid rgba(255,70,70,1);
      }

      .confirmDialog{
        position: absolute;
        right:104px;
        bottom: 64px;
        background: #2e2b2b;
        z-index: 9999;

        width: 344px;
        height:135px;

        padding: 10px 24px;
        .title{
          margin-bottom: 12px;
        }
        input{
          padding-left: 8px;
          font-size:14px;
          border:none;
          outline: none;
          width:296px;
          height:32px;
          background:rgba(255,255,255,0.04);
          border-radius:2px;
          border:1px solid rgba(255,255,255,0.08);
          color:rgba(255,255,255,0.8);
        }
        input::-webkit-input-placeholder, textarea::-webkit-input-placeholder {
          color:rgba(255,255,255,0.2);
        }
        .panel-arrow{
          width: 0;
          height: 0;
          border-width: 10px;
          border-style: solid;
          border-color: #2e2b2b transparent transparent transparent;
          position: absolute;
          bottom: -20px;
          right: 6%;
          transform: translate(-50%, 0);
          z-index: 1;
        }
        .cancel, .confirm{
          width: 56px;
          height: 28px;
        }

      }
    }

    &.detail{
      .dialog-title{
        .back{
          width: 12px;
          height:12px;
          border: 2px solid #fff;
          border-color: #fff #fff transparent  transparent;
          transform: rotate(-135deg);

          position: absolute;
          top: 20px;
          left: 24px;
        }
        .close{
          top: 20px;
        }
      }
      .dialog-content{
        justify-content: space-between;
        .left{
          .device-name{
            margin-bottom: 8px;
          }
          video, .car-img{
            width: 700px;
            height: 402px;
          }
          .wrap-video{
            position: relative;
            .play-mask{
              position: absolute;
              top:0;
              left:0;
              z-index: 999;
              width: 700px;
              height: 402px;
              background:rgba(0,0,0,0.8);
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
        }
        .right{
          // width: 472px;

          width:350px;
          font-size: 14px;
          .info{
            display: flex;
            justify-content: flex-start;
            margin-bottom: 32px;
            &.it{
              margin-bottom: 12px;
            }
            .sn{
              margin-right: 12px;
              .head-img{
                width: 124px;
                height: 160px;
              }
            }
            .status{
              display: flex;
              flex-direction: column;
              justify-content: center;
            }
          }
          .title-table{
            margin-bottom:13px;
          }
          table{
            table-layout: fixed;
            width:100%;
            thead{
              tr{
                color:rgba(255,255,255,0.4);
                height: 24px;
                border-bottom:1px solid rgba(255,255,255,0.16);
              }
            }
            tbody{
              tr{
                color:rgba(255,255,255,0.8);
                height: 40px;
              }
            }
          }
        }
      }
    }


  }
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
</style>
