import Koa from 'koa'
import response from '@/common/response'
import { isTokenVerify } from './password'

type RouteOptions = {
  prefix: string
}

type MethodType = 'get' | 'post' | 'put' | 'delete'

const method =
  (type: MethodType) =>
  (path: string, options?: RouteOptions) =>
  (target: any, property: string) => {
    let url = options && options.prefix ? options.prefix + path : path
    target[property].router = {
      url,
      type
    }
  }

const useAuth = (target: any, property: string) => {
  let fn = target[property]
  target[property] = async (ctx: Koa.Context) => {
    const token = ctx.headers['access-token']
    const valid = await isTokenVerify(token)
    if (!valid) {
      ctx.status = 401
      ctx.body = response.error('your token is invalid', '401')
    } else {
      fn(ctx)
    }
  }
  return target[property]
}

const get = method('get')
const post = method('post')
const put = method('put')
const _delete = method('delete')

export { get, post, put, _delete, MethodType, useAuth }
