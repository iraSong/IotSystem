/* eslint-disable*/
import moment from 'moment'

export function toThousandFilter(num) {
  if(isNaN(num)){
    return '--'
  }
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function rankName(type) {
  if (type == "country") {
    return '城市'
  } else if (type == "city") {
    return '社区'  
  }
}

export function rssi(value) {
  let lever = ''
  if (value < 2) {
    lever = '弱'
  } else if (value < 4) {
    lever = '中'
  } else {
    lever = '强'
  }
  return lever
}
export function dealStatus(status) {
  switch(status) {
    // 通行设备
    case 'undeal':
      return '未处理'
      break
    case 'dealed':
      return '已处理'
      break
    case 'dealing':
      return '处理中'
      break
    default:
      return '处理中'
  } 
}

export function waringRank(status) {
  switch(status) {
    // 通行设备
    case 'low':
      return '低'
      break
    case 'middle':
      return '中'
      break
    case 'high':
      return '高'
      break
    default:
      return '低'
  } 
}

export function formatTime(value) {
  if(value) {
    return moment(value).format('YYYY-MM-DD HH:mm:ss')
  } else {
    return '--'
  }
}

export function formatTime2(value) {
  if(value) {
    return moment(value).format('MM-DD HH:mm')
  } else {
    return '--'
  }
}

export function deviceStatus(status) {
  switch(status) {
    // 通行设备
    case '0':
      return '离线'
      break
    case '1':
      return '在线'
      break
    default:
      return '未知状态'
  } 
}

export function typeToName(type) {
  switch(type) {
    // 通行设备
    case 'doorctl_v2':
      return '门禁二代'
      break
    case 'doorctl':
      return '门禁四代'
      break
    case 'facegate':
      return '人脸门口机'
      break
    case 'facesentry':
      return '人脸门禁机'
      break
    case 'alarmgateway':
      return '报警网关'
      break
    case 'roommastermachhine':
      return '家庭主机'
      break
    case 'roommastermachine':
        return '家庭主机'
        break
    case 'roompad':
      return '家庭平板'
      break
    case 'roomslavermachine':
      return '家庭从机'
      break
    case 'unitdoorwaymacchine':
      return '单元门口机'
      break
    case 'villadoorwaymacchine':
      return '别墅门口机'
      break
    case 'fencingdoorwaymacchine':
      return '围墙机门口机'
      break
    case 'facedoorwaymachine':
      return '围墙人脸门口机'
      break
    case 'propertymaster':
      return '物业主机 '
      break
    case 'gateway':
      return '水电表网关'
      break
    case 'water':
      return '冷水表'
      break
    case 'hotwater':
      return '热水表'
      break
    case 'elec':
      return '电表'
      break
    case 'locker':
      return '门锁'
      break
    case 'lockergateway':
      return '门锁网关'
      break
    case 'qdh-padmgmt':
      return '智享家平板'
      break
    case 'park':
      return '车闸'
      break
    case 'lift':
      return '电梯'
      break
    case 'video':
      return '监控'
      break
    case 'watercollector':
      return '水表采集器'
      break
    case 'eleccollector':
      return '电表采集器'
      break
    case 'eyecloud':
      return '千里眼'
      break
      
    default:
      return type
  } 
}

export function parseLocation(location) {
  if(!location || location.length  == 0) {
    return ''
  }
  if(Array.isArray(location)){
    location = location[0]
  }
  let address = ''
  if(location.groupName){
    address += `${location.groupName}/`
  }
  if(location.buildName){
    address += `${location.buildName}/`
  }
  if(location.unitName){
    address += `${location.unitName}/`
  }
  if(location.gateName){
    address += `${location.gateName}/`
  }
  if(location.roomName){
    address += `${location.roomName}/`
  }
  if(location.direction){
    if(location.direction  == 'I') {
      address += '（入口）'
    } else if(location.direction  == 'O') {
      address += '（出口）'
    }
  }
  return address
}

export function parseWaterWattLocation(location) {
  if(Array.isArray(location)){
    location = location[0]
  }
  let address = ''
  if(location.roomName){
    address = `${location.roomName}`
  } else {
    if(location.buildName){
      address += `${location.buildName}/`
    }
    if(location.unitName){
      address += `${location.unitName}/`
    }
    if(location.gateName){
      address += `${location.gateName}`
    }
  }
  return address
}


export function businessType(status) {
  switch(status) {
    // 通行设备
    case '1':
      return 'iot业务报事'
      break
    case '2':
      return '千里眼报事'
      break
    case '3':
      return '告警报事'
      break
    case '4':
      return '关注报事'
      break
    default:
      return status
  } 
}

export function orderStatus(status) {
  // 1待分派，2已接单，3处理中，4已完成，5已评价，6超时，7待评价
  switch(status) {
    // 通行设备
    case '1':
      return '已处理'
      break
    case '2':
      return '处理中'
      break
    case '3':
      return '处理中'
      break
    case '4':
      return '已完成'
      break
    case '5':
      return '已评价'
      break
    case '6':
      return '超时'
      break
    case '7':
      return '待评价'
      break
    default:
      return status
  } 
}