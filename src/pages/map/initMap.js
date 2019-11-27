import AMap from 'AMap'
var infoWindow
var map
var imgSrc = require('../../assets/img/demo/city/nor-city.png')
var bgSrc = require('../../assets/img/home/2-5.png')

function initMarker() {
  var content = `<div class="marker-route marker-marker-bus-from">
    <img src="${imgSrc}" class="item-pro"></div>
    <div class="sound-effect"></div>
  </div>`

  var marker = new AMap.Marker({
    content: content, // 自定义点标记覆盖物内容
    position: [113.065746, 28.149671], // 基点位置
    offset: new AMap.Pixel(0, 0) // 相对于基点的偏移位置
  })
  var marker1 = new AMap.Marker({
    content: content,
    position: [112.934596, 28.261616],
    offset: new AMap.Pixel(0, 0)
  })
  var marker2 = new AMap.Marker({
    content: content,
    position: [112.922237, 28.154514],
    offset: new AMap.Pixel(0, 0)
  })
  var marker3 = new AMap.Marker({
    content: content,
    position: [113.065746, 28.149671],
    offset: new AMap.Pixel(0, 0),
    zooms: [10, 14],
  })

  var markerList = [marker, marker1, marker2, marker3]
  map.add(markerList)
  //鼠标点击marker弹出自定义的信息窗体
  markerList.forEach(it => {
    it.on('click', function() {
      gotoCity('深圳市')
    })

    AMap.event.addListener(it, 'mousemove', function() {
      infoWindow.open(map, it.getPosition())
    })
  })
}

function initInfoWindow() {
  // 信息窗体的内容
  var it = {
    name: '水晶郦城',
    onlineDevice: 112,
    people: 678,
    car: 226,
    order: 3
  }

//   <div class="model-line">
//   <div class="line1"></div>
//   <div class="line2"></div>
//   <div class="line3"></div>
//   <div class="line4"></div>
// </div>
  var content = `
    <div class="model normal city-model">
      <span class="border border-1"></span>
      <span class="border border-2"></span>
      <span class="border border-3"></span>
      <span class="border border-4"></span>
      <div class="bg-blur"></div>
      <div class="model-title">${it.name}</div>
      <div class="model-item">
        <div class="left">在线设备：</div>
        <div>${it.onlineDevice}</div>
      </div>
      <div class="model-item">
        <div class="left">今日人流量：</div>
        <div>${it.people}</div>
      </div>
      <div class="model-item">
        <div class="left">今日车流量：</div>
        <div>${it.car}</div>
      </div>
      <div class="model-item">
        <div class="left">工单数量：</div>
        <div>${it.order}</div>
      </div>
    </div>`
  // 创建 infoWindow 实例
  infoWindow = new AMap.InfoWindow({
    isCustom: true, //使用自定义窗体
    content: content, //传入 dom 对象，或者 html 字符串
    offset: new AMap.Pixel(-150, 50)
  })
  // 打开信息窗体
  infoWindow.open(map)

  map.on('click', function() {
    infoWindow.close(map)
  })
}

//根据cityname、adcode、citycode设置地图位置
function gotoCity(val='北京市') {
  return new Promise((resolve) => {
    map.setCity(val,function(){
      map.setZoom(12)
      resolve()
    })
  })
}

function getWeather() {
  AMap.plugin('AMap.Weather', function() {
    var weather = new AMap.Weather()
    //查询实时天气信息, 查询的城市到行政级别的城市，如朝阳区、杭州市
    weather.getLive('长沙市', function(err, data) {
        if (!err) {
            var str = []
            str.push('<h4 >实时天气' + '</h4><hr>')
            str.push('<p>城市/区：' + data.city + '</p>')
            str.push('<p>天气：' + data.weather + '</p>')
            str.push('<p>温度：' + data.temperature + '℃</p>')
            str.push('<p>风向：' + data.windDirection + '</p>')
            str.push('<p>风力：' + data.windPower + ' 级</p>')
            str.push('<p>空气湿度：' + data.humidity + '</p>')
            str.push('<p>发布时间：' + data.reportTime + '</p>')
            var marker = new AMap.Marker({map: map, position: map.getCenter()})
            var infoWin = new AMap.InfoWindow({
                content: '<div class="model normal city-model">'+str.join('')+'</div>',
                isCustom:true,
                offset: new AMap.Pixel(0, -37)
            })
            infoWin.open(map, marker.getPosition())
            marker.on('mouseover', function() {
                infoWin.open(map, marker.getPosition())
            })
        }
    })
  })
}

const initCityMap = () => {
  map = new AMap.Map('container', {
    center: [113.018367, 28.196279],
    resizeEnable: false,
    zoomEnable: false,
    dragEnable: false,
    mapStyle: 'amap://styles/fc3284054b1c8f3ff9f3e3e0ea0bdcec',
    zoom: 12,
    zooms: [11, 13],
  })
  // var imageLayer = new AMap.ImageLayer({
  //   url: bgSrc,
  //   bounds: map.getBounds(),
  //   zooms: [5, 18]
  // })
  // imageLayer.setMap(map)
  gotoCity('长沙市')
    .then(() => {
      initMarker()
      initInfoWindow()
      getWeather()
    })

}
// 当前级别 country city community
export default initCityMap
