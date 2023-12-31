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
    return InitManager.initLoadRouters();
  }

  static initLoadRouters() {
    return new Promise((resolve, reject) => {
      let routerMap: Array<{
        type: string;
        url: string;
      }> = [];
      Promise.all([
        ...glob
          .sync(path.resolve(__dirname, `./api/**/*.{js,ts}`))
          .map((item) =>
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
                    let fullPath = basePath + url;
                    router[type as MethodType](
                      fullPath,
                      method.bind(obj.default)
                    );
                    routerMap.push({
                      url: fullPath,
                      type,
                    });
                    console.log(`注册路由:[${type}]${fullPath}`);
                  }
                });
              }
              return Promise.resolve();
            })
          ),
      ]).then(() => {
        InitManager.app.use(router.routes());
        resolve(routerMap);
      });
    });
  }
}

export default InitManager;
