import Koa from "koa";
import { get, post } from "@/utils/route-controller";

class Hello {
  @get("")
  public async getData(ctx: Koa.Context) {
    ctx.body = {
      key: "hello koa-router v1 自动",
    };
  }
}

export default Hello;
