export const websocket = {
  methods: {
    openSocket(arg) {
      let socketUrl = process.env.VUE_APP_API_WEBSOCET_PATH
      console.log(socketUrl)
      // let socketUrl = 'ws://DESKTOP-POOGVRU:8080/deviceInfoBySnHandler'
      if (!window.myWebSocket || window.myWebSocket.readyState !== 1) {
        window.myWebSocket = new WebSocket(`${socketUrl}?token=${localStorage.getItem("token")}`)
        myWebSocket.onopen = () => {
          console.log('open..', myWebSocket.readyState)
          myWebSocket.readyState === 1 && this.socketSend(arg)
        }
        myWebSocket.onmessage = this.socketReceive
        myWebSocket.onclose = evt => {
          console.log("websocket closed", evt)
        }
      }
    },
    sendSocketMsg(params) {
      if (window.myWebSocket && window.myWebSocket.readyState === 1) {
        myWebSocket.onmessage = this.socketReceive
        myWebSocket.send(JSON.stringify(params))
      } else {
        this.openSocket(params) // 指标列表由每个页面自行定义，指标查询条件则根据需要保留传递
      }
    },
  },
}
