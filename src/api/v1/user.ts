import { get, post } from "@/utils/route-controller";
import Koa from "koa";

const users = [{ name: "tom", age: 20 }];

class User {
  @get("/list")
  public getList(ctx: Koa.Context) {
    ctx.body = {
      ok: 1,
      data: users,
    };
  }

  @post("/list")
  public postList(ctx: Koa.Context) {
    ctx.body = {
      ok: 1,
      data: users,
    };
  }
}

export default User;
