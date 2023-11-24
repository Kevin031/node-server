import Koa from "koa";
import InitManager from "./init";
import { PORT } from "./config/constants";
import cors from "koa-cors";

const app = new Koa();
let routerMap: any = [];

// 解除跨域限制
app.use(cors());
// 初始化
InitManager.initCore(app).then((list) => {
  console.log("router Map", list);
  routerMap = list;
});

app.use((ctx, next) => {
  // 请求根目录直接返回可用的接口列表
  if (ctx.request.path === "/") {
    ctx.body = routerMap;
    return;
  }
  next();
});

app.listen(PORT);

console.log("server is running at: " + `http://localhost:${PORT}`);

export default app;
