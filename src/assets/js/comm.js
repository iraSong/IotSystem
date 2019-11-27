var _backend = {
  requesturl(paras) {
    var url = location.href
    var paraString = url.substring(url.indexOf('?') + 1, url.length).split('&')
    var paraObj = {}
    var j
    for (var i = 0; (j = paraString[i]); i++) {
      paraObj[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(
        j.indexOf('=') + 1,
        j.length
      )
    }
    var returnValue = paraObj[paras.toLowerCase()]
    if (typeof returnValue == 'undefined') {
      return ''
    } else {
      return returnValue
    }
  },
  getBrowserInfo() {
    var agent = navigator.userAgent.toLowerCase()
    var regStr_ie = /msie [\d.]+;/gi
    var regStr_ff = /firefox\/[\d.]+/gi
    var regStr_chrome = /chrome\/[\d.]+/gi
    var regStr_saf = /safari\/[\d.]+/gi
    //IE
    if (agent.indexOf('msie') > 0) {
      return agent.match(regStr_ie)
    }

    //firefox
    if (agent.indexOf('firefox') > 0) {
      return agent.match(regStr_ff)
    }

    //Chrome
    if (agent.indexOf('chrome') > 0) {
      return agent.match(regStr_chrome)
    }

    //Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
      return agent.match(regStr_saf)
    }
  },
  userAgent() {
    var userAgent = navigator.userAgent
    if (userAgent.indexOf('Opera') > -1) {
      return 'Opera'
    }
    if (!!window.ActiveXObject || 'ActiveXObject' in window) {
      return 'IE'
    }
    if (userAgent.indexOf('Firefox') > -1) {
      return 'Firefox'
    }
    if (userAgent.indexOf('Safari') > -1 && userAgent.indexOf('Chrome') == -1) {
      return 'Safari'
    }
    if (userAgent.indexOf('Chrome') > -1 && userAgent.indexOf('Safari') > -1) {
      return 'Chrome'
    }
  },
}
export default _backend
