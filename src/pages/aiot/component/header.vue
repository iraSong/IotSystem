<template>
  <div class="header">
    <div class="logo">
      <img class="logo-img"
        src="~@assets/img/demo/logo.png" />
      <span>千丁物联云</span>
    </div>
    <div class="map-nav">
      <div class="middle-nav">
        <div class="tips">
          <div class="time yantramanav">{{time.date}}</div>
          <!-- 天气 -->
          <div v-show="rank != 'country'" class="weather">
            <!-- <i :class="[iconWeatherClass, 'icon-wea']" /> -->
            <img class="icon-wea" :src="publicPath + iconWeather + '.png'" />{{dayWeather}}
            <span class="yantramanav">{{tmpMin}}~{{tmpMax}}°C</span>
          </div>
          <!-- 空气 -->
          <div v-show="rank != 'country'" class="pm yantramanav">
            风力：
            <span class="yantramanav">{{daypower}}</span>(级)
          </div>
        </div>
        <div class="yantramanav" 
          @click.stop="showSearch">
          {{rankName}}
          <i class="i-arrow ps-arrow"/>

          <div v-if="showSearchPanel" class="open-panel">
            <div class="panel-arrow"></div>
            <div class="search">
              <input v-model="keyword" @input="searchCommunityList" type="text" placeholder="输入项目名称进行搜索" />
            </div>

            <div class="wrap-list" v-show="!keyword">
              <div class="list list1">
                <div :class="[{'active' : countryList[0].active }, 'item select parent']" 
                     @click.stop="itemSelect('country', countryList[0])">
                      {{countryList[0].name}}
                </div>
              </div>

              <div class="list list2">
                <div v-for ="(it,idx) in cityList" 
                    :key="idx + 'list2'"
                    :class="[{'active' : it.active },{'select' :it.selected }, 'item parent']"
                    @click.stop="itemSelect('city', it)">
                      {{it.cityName}}
                </div>
              </div>

              <div class="list list3">
                <div 
                    v-if="communityList.length > 0" 
                    v-for ="(it,idx) in communityList" 
                    :key="idx + 'list3'"
                    :class="[{'active' : it.active },{'select' :it.selected }, 'item']"
                    @click.stop="itemSelect('community', it)">
                      {{it.name}}
                </div>
              </div>
            </div>

            <div v-show="keyword" class="search-result">
              <div 
                class="item" 
                v-for ="(it,idx) in searchList"
                :key="idx + 'search'" 
                @click.stop="handelSearch('community', it)">
                  {{it.name}}
              </div>
            </div>

            <div class="btns">
              <button class="cancel" @click.stop="showSearchPanel = false">取消</button>
              <button class="confirm" @click.stop="submit">确认</button>
            </div>
          </div>
        </div>
      </div>
      <div class="right-nav">
        <div class="user">
          <div class="userName" @click.stop="showUser">{{userName}}<i class="i-arrow ps-arrow"/></div>
          <div v-show="showUserPanel" class="open-panel-user">
            <div class="panel-arrow"></div>
            <div class="item" @click="showPasswordDialog">修改密码</div>
            <div class="item" @click="logOut">退出</div>
          </div>

        </div>
        <div class="msg" @click.stop="showMsg">
          <span class="msg-icon" />
          <span class="msg-txt">消息</span>
          <span class="msg-unread" >6</span>

          <div v-show="showMsgPanel" class="open-panel-msg">
            <div class="panel-arrow"></div>
            <div class="item">
              <div class="content">当前有 3 个工单未处理</div>
              <div class="time">2019.09.24  12:23:23</div>
            </div>
            <div class="item">
              <div class="content">当前有 3 个工单未处理</div>
              <div class="time">2019.09.24  12:23:23</div>
            </div>
            <div class="item">
              <div class="content">当前有 3 个工单未处理</div>
              <div class="time">2019.09.24  12:23:23</div>
            </div>
            <div class="item">
              <div class="content">当前有 3 个工单未处理</div>
              <div class="time">2019.09.24  12:23:23</div>
            </div>
            <div class="item">
              <div class="content">当前有 3 个工单未处理</div>
              <div class="time">2019.09.24  12:23:23</div>
            </div>
            <div class="item">
              <div class="all">查看全部消息</div>
            </div>
          </div>
        </div>
        <div class="to-manage" @click="toManage">
          <span class="manage-icon" />
          <span class="manage-txt">管理</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapState, mapMutations  } from 'vuex'
import { toMap } from '../mixins/toMap.js'
export default {
  data() {
    return {
      time: {},
      showSearchPanel: false,
      showMsgPanel: false,
      showUserPanel: false,
      keyword:'',
      tmpMin: '--',
      tmpMax: '--',
      dayWeather: '晴',
      daypower: '5',

      navRank: '',
      navObj: '',

      countryList:[
        {
          name: '全国',
          selected: true,
          active: true,
        }
      ],
      cityList:[],
      communityList:[],
      searchList: [],

      publicPath: process.env.BASE_URL + 'img/weather/',
      userName: '',
    }
  },
  mixins: [toMap],
  computed: {
    ...mapState(['rank', 'rankObj', 'refresh']),
    rankName() {
      if(this.rank == 'country') {
        return '全国'
      } else if(this.rank == 'city') {
        return this.rankObj.cityName
      } else {
        return this.rankObj.name
      }
    },
    iconWeather() {
      /* eslint-disable no-unreachable */
      switch(this.dayWeather) {
        case '晴':
          return 'q'
          break
        case '多云':
          return 'dy'
          break
        case '阴':
          return 'y'
          break
        case '阵雨':
          return 'zy'
          break
        case '雷阵雨':
          return 'dayu'
          break
        case '雷阵雨并伴有冰雹':
          return 'lyzbbybb'
          break

        case '雨夹雪':
          return 'yjx'
          break
        case '小雨':
          return 'xy'
          break
        case '中雨':
          return 'zhongy'
          break
        case '大雨':
          return 'dayu'
          break
        case '暴雨':
          return 'dayu'
          break
        case '大暴雨':
          return 'dayu'
          break

        case '特大暴雨':
          return 'dayu'
          break
        case '阵雪':
          return 'zhx'
          break
        case '小雪':
          return 'xiaoxue'
          break
        case '中雪':
          return 'zhongx'
          break
        case '大雪':
          return 'dax'
          break
        case '暴雪':
          return 'dax'
          break

        case '雾':
          return 'w'
          break
        case '冻雨':
          return 'dayu'
          break
        case '沙尘暴':
          return 'shacb'
          break
        case '小雨-中雨':
          return 'xy'
          break
        case '中雨-大雨':
          return 'zhongy'
          break
        case '大雨-暴雨':
          return 'dayu'
          break

        case '暴雨-大暴雨':
          return 'dayu'
          break
        case '大暴雨-特大暴雨':
          return 'dayu'
          break
        case '小雪-中雪':
          return 'xiaoxue'
          break
        case '中雪-大雪':
          return 'zhongx'
          break
        case '大雪-暴雪':
          return 'dax'
          break
        case '浮尘':
          return 'shacb'
          break

        case '扬沙':
          return 'shacb'
          break
        case '强沙尘暴':
          return 'shacb'
          break
        case '飑':
          return 'b'
          break
        case '龙卷风':
          return 'rzf'
          break
        case '弱高吹雪':
          return 'rgcx'
          break
        case '轻雾':
          return 'qw'
          break
        case '霾':
          return 'l'
          break
        default:
          return 'q'
      }
    }
  },
  mounted() {

    this.navRank = this.rank
    this.navObj = this.rankObj

    this.getUserName()
    this.getCityList()
    setInterval(() => {
      this.getCurrentTime()
    },1000)
  },
  methods: {
    ...mapMutations(['toggleModifyPassword']),
    getUserName() {
      try{
        this.userName = JSON.parse(localStorage.getItem('Navigation')).jsonObject.realName
      } catch(e) {
        this.userName = 'userName'
        console.log(e)
      }
    },
    getCityList() {
      let Navigation = localStorage.getItem('Navigation')
      let tenantId = null
      if(Navigation) {
        tenantId = JSON.parse(Navigation).jsonObject.tenantId
      }

      this.$http({
        method:'post',
        url:'/api/json/provinceCityApi/getAllCityByLoginUser',
        data: {
          tenantId
        }
      })
        .then((res) => {
          this.cityList = res.data.list
        })
    },
    getCommunityList(params={ projectName: this.keyword}) {
      if(!params.projectName && !params.cityCode) {
        this.communityList = []
        return Promise.reject()
      }

      let Navigation = localStorage.getItem('Navigation')
      let tenantId = null
      if(Navigation) {
        tenantId = JSON.parse(Navigation).jsonObject.tenantId
      }
      params.pageNo = 1
      params.pageSize = 1000
      params.tenantId = tenantId

      params.cancelToken = true // 实时搜索需要取消上一次请求
      return this.$http({
        method:'post',
        url:'/api/json/projectApi/findProjectListByLoginUser',
        data: params
      })
    },
    searchCommunityList() {
      this.getCommunityList({projectName: this.keyword})
        .then((res) => {
          this.searchList = res.data.list
        })
        
    },
    showPasswordDialog() {
      this.toggleModifyPassword()
    },
    getWeather() {
      let self = this
      AMap.plugin('AMap.Weather', function() {
        var weather = new AMap.Weather()
        //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
        weather.getForecast(self.rankObj.cityName, function(err, data) {
          if (!err) {
            let dayTemp = data.forecasts[0].dayTemp
            let nightTemp = data.forecasts[0].nightTemp
            self.tmpMax = Math.max(dayTemp, nightTemp)
            self.tmpMin =  Math.min(dayTemp, nightTemp)
            self.dayWeather = data.forecasts[0].dayWeather
            self.daypower = data.forecasts[0].dayWindPower
          }
        })
      })
    },
    getCurrentTime(){
      let t = {
        date: moment().format('YYYY-MM-DD HH:mm:ss'),
        y: moment().get('year'),
        mon: moment().get('month'), // 需要 + 1
        d: moment().get('date'),
        h: moment().get('hour'),
        m: moment().get('minute'),
      }
      window.localStorage.setItem('aiot-time', JSON.stringify(t))
      this.time = t
    },
    showSearch() {
      this.showMsgPanel = false
      this.showUserPanel = false
      this.showSearchPanel = true
    },
    showUser() {
      this.showSearchPanel = false
      this.showMsgPanel = false
      this.showUserPanel = true
    },
    showMsg() {
      this.showUserPanel = false
      this.showSearchPanel = false
      this.showMsgPanel = true
    },
    itemSelect(rank, it) {
      this.navRank = rank
      this.navObj = it
      this.dealData(rank,it)
      if( rank == 'city'){
        this.getCommunityList(it)
          .then((res) => {
            this.communityList = res.data.list
          })
      }
    },
    handelSearch(rank, it) {
      this.showSearchPanel = false
      this.toMap(rank, it)
    },
    dealData(rank,it) {
      if(rank == 'city') {
        this.cityList = this.cityList.map((el) =>{
          el.active = false
          return el
        })
      } else if(rank == 'community') {
        this.communityList = this.communityList.map((el) =>{
          el.active = false
          return el
        })
      } else {
        this.cityList = this.cityList.map((el) =>{
          el.active = false
          return el
        })
        this.communityList = []
      }
      it.active = true
    },
    submit() {
      this.showSearchPanel = false
      this.toMap(this.navRank, this.navObj)
    },
    logOut() {
      this.$http({
        method:'post',
        url:'/api/json/auth/signout',
        data: {
        }
      })
        .then(() => {
          window.location.href = '/index.html'
        })
    },
    toManage() {
      window.open('/index.html#/intelligent_apartment/index')
    }
  },
  watch: {
    refresh() {
      if(this.rank !== 'country'){
        console.log('获取天气')
        this.getWeather()
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .header {
    position: relative;
    z-index: 99;
    height: 40px;
    line-height: 40px;
    .logo {
      display: flex;
      align-items: center;
      font-size: 24px;
      .logo-img {
        width: 40px;
        height: 40px;
        margin-right: 12px;
      }
    }
    .right-nav {
      width: 360px;
      position: absolute;
      top: 12px;
      right: 0px;
      text-align: left;
      font-size: 14px;
      line-height: 28px;

      display: flex;
      justify-content: flex-end;
      color:rgba(255,255,255,0.8);
      .ps-arrow{
        position: relative;
        top:10px;
        left: 4px;
        border-top-color:rgba(255,255,255,0.8);
      }
      .to-manage{
        margin-left: 40px;
        .manage-icon{
          display: inline-block;
          width: 14px;
          height: 10px;
          margin-right: 4px;
          background: url("~@assets/img/demo/icon-manage.png");
          background-size: 100% 100%;
        }
      }
      .msg{
        margin-left: 40px;
        .msg-icon{
          display: inline-block;
          width: 14px;
          height: 10px;
          margin-right: 4px;
          background: url("~@assets/img/demo/icon-msg.png");
          background-size: 100% 100%;
        }
        .msg-unread{
          margin-left: 3px;
          display: inline-block;
          width:14px;
          height:14px;
          background:rgba(255,70,70,1);
          font-size: 12px;
          color: #fff;
          border-radius: 50%;

          line-height: 14px;
          text-align: center;
        }
      }

      .open-panel-user{
        opacity: 1;
        color:rgba(255,255,255,0.8);
        border: 1px solid rgba(255, 255, 255, 0.08);
        position: absolute;
        top: 38px;
        left: 40%;
        z-index: 999;
        transform: translate(-50%, 0);
        background: #676767;
        border-radius: 5px;
        padding: 12px 0 8px;
        &::before {
          background: #37484e;
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          filter: blur(20px);
        }
        .panel-arrow{
          width: 0;
          height: 0;
          border-width: 12px;
          border-style: solid;
          border-color: transparent transparent #4f585b transparent;
          position: absolute;
          top: -23px;
          left: 50%;
          transform: translate(-50%, 0);
        }

        .item{
          position: relative;
          height: 40px;
          width:128px;
          padding-left:12px;

          color:rgba(255,255,255,0.8);
          line-height: 40px;
        }
      }

      .open-panel-msg{
        background: rgba(255, 255, 255, 0.12);
        border: 1px solid rgba(255, 255, 255, 0.08);
        position: absolute;
        top: 36px;
        right: 0;
        .panel-arrow{
          width: 0;
          height: 0;
          border-width: 12px;
          border-style: solid;
          border-color: transparent transparent #575c5e transparent;
          position: absolute;
          top: -23px;
          left: 50%;
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

          background: url("~@assets/img/demo/open-bg.png");
          background-size:100% 100%;
          filter: blur(12px);
        }
        .item{
          position: relative;
          background: rgba(136, 135, 135, 0.6);

          width:264px;
          padding-left:16px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
          .content{
            padding-top:4px;
            color: rgba(255,255,255,0.8);
          }
          .time{
            padding-bottom: 3px;
            color:rgba(255,255,255,0.4);
          }
          .all{
            color:rgba(255,255,255,0.8);
            height: 40px;
            line-height: 40px;
            position: relative;
            &::after{
              position: absolute;
              top:16px;
              left: 95px;
              content:'';
              width: 0; 
              height: 0;
              border-width: 4px;
              border-style: solid;
              border-color: transparent transparent transparent #fff;
            }
          }
        }
      }
    }
    .map-nav {
      color:rgba(255,255,255,0.8);
      position: absolute;
      top: -12px;
      left: 0;
      right: 0;
      text-align: center;
      font-size: 24px;

      .middle-nav{
        line-height: 110%;
        .tips{
          font-size:18px;
          display: flex;
          justify-content: center;
          font-weight:bold;
          .time{
            display: block;
            margin-bottom: 5px;
          }
          .weather{
            margin: 0 32px;
            .icon-wea{
              vertical-align: sub;
              display: inline-block;
              width: 22px;
              height:22px;
              // background: url("~@assets/img/demo/city/sun.png");
              // background-size: 100% 100%;
            }
          }

        }
        .ps-arrow{
          position: relative;
          top:18px;
          left: 4px;
        }
        .open-panel{
          background: rgba(255, 255, 255, 0.12);
          border: 1px solid rgba(255, 255, 255, 0.08);
          position: absolute;
          top: 70px;
          left: 50%;
          transform: translate(-50%, 0);
          .panel-arrow{
            width: 0;
            height: 0;
            border-width: 12px;
            border-style: solid;
            border-color: transparent transparent #395059 transparent;
            position: absolute;
            top: -22px;
            left: 50%;
            transform: translate(-50%, 0);
            z-index: 1;
          }
          &::before {
            background: url("~@assets/img/demo/bg.png") 0 / cover fixed;
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            filter: blur(20px);
            background-position: 332px -35px;
          }
          .search {
            background:rgba(255,255,255,0.18);
            position: relative;
            height: 50px;

            display: flex;
            align-items: center;
            justify-content: flex-start;
            padding-left:16px;
            input{
              flex: none;
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
          }
          .wrap-list{
            position: relative;
            background:rgba(255,255,255,0.16);
            width: 642px;
            display: flex;
            .list1, .list2{
              width: 184px;
            }
            .list3 {
              flex: 1;
            }

            .list{
              height: 359px;
              overflow-y: scroll;
              .item{
                cursor: pointer;
                position: relative;
                padding-left:16px;
                text-align: left;
                height: 40px;
                line-height: 40px;
                font-size: 14px;
                color:rgba(255,255,255,0.8);
                &.select, &.active{
                  background:rgba(255,255,255,0.04);
                }
                &.parent::after{
                  position: absolute;
                  top:18px;
                  right: 8px;
                  content:'';
                  width: 0; 
                  height: 0;
                  border-width: 3px;
                  border-style: solid;
                  border-color: transparent transparent transparent #fff;
                }
                &.active::before{
    

                  position: absolute;
                  top: 15px;
                  right: 30px;
                  content: '';
                  width: 18px;
                  height: 12px;
                  background: url("~@assets/img/demo/right.png");
                  background-size: 100% 100%;
                  color: #00B7FF;
                }
              }
            }
          }
          .search-result{
            width: 642px;
            height: 359px;

            position: relative;
            text-align: left;
            background:rgba(255,255,255,0.16);
            overflow: auto;
            .item{
              padding-left:16px;
              font-size: 14px;
              height: 40px;
              line-height: 40px;
              color:rgba(255,255,255,0.8);
            }
          }
          .btns{
            position: relative;
            background:rgba(255,255,255,0.18);
            height: 50px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            padding-right:16px;
            font-size: 14px;
            .cancel{
              outline:none;
              width: 64px;
              height: 32px;
              border-radius:2px;
              border:1px solid rgba(255,255,255,0.4);
              color:rgba(255,255,255,0.8);
              background: transparent;
              margin-right: 16px;
            }
            .confirm{
              outline:none;
              border: none;
              width: 64px;
              height: 32px;
              border-radius:2px;
              background:rgba(0,183,255,1);
              color: #fff;
            }
          }
        }
      }
    }
  }
</style>