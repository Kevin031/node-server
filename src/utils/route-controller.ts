type RouteOptions = {
  prefix: string;
};

type MethodType = "get" | "post" | "put" | "delete";

const method =
  (type: MethodType) =>
  (path: string, options?: RouteOptions) =>
  (target: any, property: string) => {
    let url = options && options.prefix ? options.prefix + path : path;
    target[property].router = {
      url,
      type,
    };
  };

const get = method("get");
const post = method("post");
const put = method("put");
const _delete = method("delete");

export { get, post, put, _delete, MethodType };
