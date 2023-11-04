import Koa from "koa";
import InitManager from "./init";
import { PORT } from "./constants";
import cors from "koa-cors";

const app = new Koa();

// 解除跨域限制
app.use(cors());
// 初始化
InitManager.initCore(app);
app.listen(PORT);

console.log("server is running at: " + `http://localhost:${PORT}`);

export default app;
