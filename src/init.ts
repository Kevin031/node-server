import Router from "koa-router";
import Koa from "koa";
import path from "path";
import * as glob from "glob";
import { MethodType } from "@/utils/route-controller";

const router = new Router();

class InitManager {
  static app: Koa;

  static initCore(app: Koa) {
    InitManager.app = app;
    InitManager.initLoadRouters();
  }

  static initLoadRouters() {
    Promise.all([
      ...glob.sync(path.resolve(__dirname, `./api/**/*.{js,ts}`)).map((item) =>
        import(item).then((obj) => {
          if (obj.default instanceof Router) {
            InitManager.app.use(obj.default.routes());
          } else {
            let Prototype = obj.default.prototype;
            Object.getOwnPropertyNames(Prototype).forEach((key) => {
              if (key === "constructor") return;
              let method = Prototype[key];
              let pathMatch = item.match(/(\/api\/.+?)\.(js|ts)/);
              let basePath = pathMatch ? pathMatch[1] : "";
              if (method.router) {
                const { url, type } = method.router;
                router[type as MethodType](basePath + url, method);
                console.log(`注册路由:[${type}]${basePath}${url}`);
              }
            });
          }
          return Promise.resolve();
        })
      ),
    ]).then(() => {
      InitManager.app.use(router.routes());
    });
  }
}

export default InitManager;
