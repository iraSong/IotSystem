
const token = window.localStorage.getItem('token')
console.log(token)
if(!token) { // 未登入 跳转到sass 千丁物联的登入页
  window.location.href = '/index.html'
}
