import WebSocket from 'ws'
import http from 'http'

export const createWebSocketService = (server: any) => {
  const wss = new WebSocket.Server({ server })
  wss.on('connection', (ws: any) => {
    console.log('websocket建立连接')
    ws.on('message', (msg: any) => {
      let messageStr
      // 如果是 Buffer 类型，将其转换为字符串
      if (msg instanceof Buffer) {
        const textMessage = msg.toString('utf-8')
        messageStr = msg
      } else {
        messageStr = msg
      }
      console.log('接收到消息', msg)
      ws.send('已接收到你的消息:' + msg)
    })
    // 发送消息给客户端
    ws.send('Hello, client!')
  })
  console.log('websocket服务已启动')
}
