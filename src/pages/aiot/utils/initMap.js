import { Message } from 'element-ui'
import { showLoading, hideLoading } from '@assets/js/loading.js'
import AMap from 'AMap'
import store from '../store/index.js'

var infoWindow = ''
var map = ''
var imgSrc = require('../../../assets/img/demo/city/nor-city.png')

function getContent(project) {
    // 信息窗体的内容
    let content = `
    <div class="model normal city-model">
      <div class="model-block"></div>
      <span class="border border-1"></span>
      <span class="border border-2"></span>
      <span class="border border-3"></span>
      <span class="border border-4"></span>
      <div class="bg-blur"></div>
      <div class="model-title">${project.name}</div>
      <div class="model-item">
        <div class="left">在线设备：</div>
        <div>${project.onlineDevice}</div>
      </div>
      <div class="model-item">
        <div class="left">今日人流量：</div>
        <div>${project.people}</div>
      </div>
      <div class="model-item">
        <div class="left">今日车流量：</div>
        <div>${project.car}</div>
      </div>
      <div class="model-item">
        <div class="left">工单数量：</div>
        <div>${project.order}</div>
      </div>
    </div>`
    return content
}

function initMarker(projectList) {
  var content = `<div class="marker-route marker-marker-bus-from">
    <img src="${imgSrc}" class="item-project"></div>
    <div class="sound-effect"></div>
  </div>`

  let markerList = []
  console.log(projectList)
  projectList.forEach((el) => {
    let marker = new AMap.Marker({
      content: content,
      position: [+el.longitude, +el.latitude],
      offset: new AMap.Pixel(0, 0),
      zooms: [9, 15],
    })
    markerList.push(marker)
  })
 
  map.add(markerList)
  //鼠标点击marker弹出自定义的信息窗体
  markerList.forEach((it, idx) => {
    it.on('click', function() {
      store.commit('setRank', 'community')
      store.commit('setRankObj', projectList[idx])
    })

    AMap.event.addListener(it, 'mousemove', function() {
      let content = getContent(projectList[idx])
      infoWindow.setContent(content)
      infoWindow.open(map, it.getPosition())
    })
  })
}

function initInfoWindow() {
  // 信息窗体的内容
  let project = {
    name: '水晶郦城',
    onlineDevice: 112,
    people: 678,
    car: 226,
    order: 3
  }
  let content = getContent(project)
  // 创建 infoWindow 实例
  infoWindow = new AMap.InfoWindow({
    isCustom: true, //使用自定义窗体
    content: content, //传入 dom 对象，或者 html 字符串
    offset: new AMap.Pixel(13, -5)
  })
  // 打开信息窗体
  infoWindow.open(map)
  window.map = map
  window.infoWindow = infoWindow

  map.on('click', function() {
    infoWindow.close(map)
  })
}

//根据cityname、adcode、citycode设置地图位置
function gotoCity(val='北京市') {
  console.log(val)
  return new Promise((resolve, reject) => {
    try {
      map.setCity(val,function(){
        map.setZoom(11)
        window.localStorage.setItem('aiot-map-center', map.getCenter())
         resolve()
      })
    } catch (e) {
       reject(e)
    }
  })
}

const initCityMap = (currentCity, projectList) => {
  showLoading()
  let mapIsInit = false // 地图初始化完成
  console.log(map)
  if(!map){
    map = new AMap.Map('container', {
      center: [113.018367, 28.196279],
      // resizeEnable: false,
      // zoomEnable: false,
      // dragEnable: false,
      mapStyle: 'amap://styles/fc3284054b1c8f3ff9f3e3e0ea0bdcec',
      zoom: 11,
      zooms: [9, 15],
    })
  }

  gotoCity(currentCity)
    .then(() => {
      mapIsInit = true
      store.commit('setMask', true)
      hideLoading()
      initMarker(projectList)
      initInfoWindow()
    })
    .catch((err) => {
      console.log(err)
    })

    // 10s后 检查地图是否初始化完成。
    setTimeout(() => {
      if(!mapIsInit) {
        store.commit('setMask', true)
        hideLoading()
        Message({
          type: 'warning',
          message: '地图初始化超时'
        })
      }
    }, 10000)

  return map
}

export default initCityMap
