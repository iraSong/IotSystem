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
  return moment(value).format('YYYY-MM-DD HH:mm:ss')
}

export function formatTime2(value) {
  return moment(value).format('MM-DD HH:mm')
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