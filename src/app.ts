import Koa from 'koa'
import InitManager from './init'
import { PORT } from './config/constants'
import cors from 'koa-cors'
import { createWebSocketService } from './websocket'
import http from 'http'
import bodyParser from 'koa-bodyparser'

const app = new Koa()
const server = http.createServer(app.callback())
let routerMap: any = []

// 解除跨域限制
app.use(cors())
app.use(bodyParser())
// 初始化
InitManager.initCore(app).then(list => {
  // console.log("router Map", list);
  routerMap = list
})

app.use((ctx, next) => {
  // 请求根目录直接返回可用的接口列表
  if (ctx.request.path === '/') {
    ctx.body = routerMap
    return
  }
  next()
})

createWebSocketService(server)

export const createServer = port => {
  server.listen(port, () => {
    console.log('server is running at: ' + `http://localhost:${PORT}`)
  })
  return app
}

if (!process.env.JEST) {
  createServer(PORT)
}

export default app
