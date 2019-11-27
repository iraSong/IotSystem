/**
 * long description for the file
 *
 * @summary axios 请求过滤拦截
 * @author songwh
 *
 * Created at     : 2019-05-05 17:34:46 
 * Last modified  : 2019-11-22 17:52:14
 */

import axios from 'axios'
import { showLoading, hideLoading } from '@assets/js/loading.js'
import commin from './comm.js'

let pending = []
let CancelToken = axios.CancelToken
let cancelPending = (config) => {
  pending.forEach((item, index) => {
    if (config) {
      if(item.UrlPath === config.url + '&' + config.method) {
        item.Cancel() // 取消请求
        pending.splice(index, 1) // 移除当前请求记录
      }
    }
  })
}

// 创建axios实例
const request = axios.create({
  baseURL: process.env.VUE_APP_API_PATH, // api 的 base_url
  timeout: 30000, // 请求超时时间
  headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
})

// request拦截器
request.interceptors.request.use(
  config => {
    showLoading()
    // 实时搜索需要取消上一次请求
    if(config.data.cancelToken) {
      cancelPending(config)
      config.cancelToken = new CancelToken(res => {
        pending.push({'UrlPath': config.url + '&' + config.method, 'Cancel': res})
      })
      delete config.data['cancelToken']
    }
    // 添加token 到 header 
    try {
      let token = window.localStorage.getItem('token')
      if (token) {
        config.headers['token'] = token
      }
    } catch (err) {
      console.log(err)
    }

    // 包装请求参数
    let obj = {
      appDevice: {
        qdDevice: commin.userAgent(),
        qdPlatform: window.navigator.platform,
        qdVersion: '1.0.0',
      },
    }
    let dealData = {}
    try {
      dealData = JSON.parse(config.data)
    } catch (err) {
      dealData = config.data
    }

    var params = new URLSearchParams()
    params.append('body', JSON.stringify(Object.assign(dealData, obj))) 
    config.data = params

    // 增加时间搓 防止缓存
    config.params = {
      _t: Date.parse(new Date())/1000,
      ...config.params
    }
    return config
  },
  error => {
    console.log(error) // for debug
    Promise.reject(error)
  }
)
// respone拦截器
request.interceptors.response.use(
  response => {
    hideLoading()
    cancelPending(response.config)  //在一个axios响应后再执行一下取消操作，把已经完成的请求从pending中移除
    if (response.data.code === 200) {
      return response.data
    } else if (response.data.code == '5002') {
      // token 过期 跳转登录页
      window.location.href = '/index.html'
    } else {
      return Promise.reject(response.data)
    }
  },
  error => {
    console.log('error-------hideLoading')
    hideLoading()
    return Promise.reject(error)
  }
)
export default request
