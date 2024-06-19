import { Notification } from 'element-ui'
import store from '@/store/index'
import { mapState } from 'vuex'
import util from '@/libs/util'

var socket = null
var lockReconnect = false
var timeout = 20 * 1000
var timeoutObj = null
var serverTimeoutObj = null
var timeoutnum = null

const initWebSocket = async (role) => {
  // var clientId = Math.random().toString(36).substr(2)
  if ('WebSocket' in window) {
    var clientId = util.cookies.get('uuid')
    var role = util.cookies.get('role')
    const wsUrl = 'ws://localhost:8080/ws/' + clientId + '/' + role
    socket = new WebSocket(wsUrl)
    socket.onerror = webSocketOnError
    socket.onmessage = webSocketOnMessage
    socket.onclose = closeWebsocket
    socket.onopen = openWebsocket
  } else {
    Notification.error({
      title: '错误',
      message: '您的浏览器不支持websocket，请更换Chrome或者Firefox'
    })
  }
}

// 建立连接
const openWebsocket = (e) => {
  start()
}

const start = () => {
  // 开启心跳
  timeoutObj && clearTimeout(timeoutObj)
  serverTimeoutObj && clearTimeout(serverTimeoutObj)
  timeoutObj = setTimeout(function () {
    // 这里发送一个心跳，后端收到后，返回一个心跳消息
    if (socket.readyState === 1) {
      // 如果连接正常
      // socket.send("heartbeat");
    } else {
      // 否则重连
      reconnect()
    }
    serverTimeoutObj = setTimeout(function () {
      // 超时关闭
      socket.close()
    }, timeout)
  }, timeout)
}

// 重新连接
const reconnect = () => {
  if (lockReconnect) {
    return
  }
  lockReconnect = true
  // 没连接上会一直重连，设置延迟避免请求过多
  timeoutnum && clearTimeout(timeoutnum)
  timeoutnum = setTimeout(function () {
    // 新连接
    initWebSocket()
    lockReconnect = false
  }, 1000)
}

// 重置心跳
const reset = () => {
  // 清除时间
  clearTimeout(timeoutObj)
  clearTimeout(serverTimeoutObj)
  // 重启心跳
  start()
}

const sendWebsocket = (e) => {
  // socket.send(`我发消息了`);
}

const webSocketOnError = (e) => {
  initWebSocket()
  reconnect()
}

// 服务器返回的数据
const webSocketOnMessage = (e) => {
  // 判断是否登录
  // if (getToken()) {
  // window自定义事件[下面有说明]
  window.dispatchEvent(
    new CustomEvent('onmessageWS', {
      detail: {
        data: JSON.parse(e?.data)
      }
    })
  )
  // }
  reset()
}

const closeWebsocket = (e) => {
  reconnect()
}

// 断开连接
const close = () => {
// WebSocket对象也有发送和关闭的两个方法，只需要在自定义方法中分别调用send()和close()即可实现。
  socket.close()
}
// 具体问题具体分析,把需要用到的方法暴露出去
export default {
  initWebSocket,
  sendWebsocket,
  webSocketOnMessage,
  close,
  computed: {
    ...mapState('d2admin/user', [
      'info'
    ])
  }
}
