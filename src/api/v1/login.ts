import response from '@/common/response'
import loadJSONFile from '@/utils/load-json-file'
import { post, get } from '@/utils/route-controller'
import Koa from 'koa'
import path from 'path'
import {
  generateSalt,
  getJwt,
  hashPassword,
  verifyPassword,
  isTokenVerify
} from '@/utils/password'

const userMap = loadJSONFile(
  path.resolve(__dirname, '../../public/user-map.json')
)
const config = loadJSONFile(path.resolve(__dirname, '../../public/config.json'))

interface KoaBodyContext {
  request: {
    body: any
  }
}

class Login {
  static isValidUser({ username, password }) {
    const user = userMap.find(user => user.username === username)
    if (!user) return false
    return verifyPassword(password, user.password, user.salt)
  }

  static getJwtToken({ username }) {
    return getJwt(username)
  }

  @get('/is-login')
  public async getToken(ctx: Koa.Context) {
    const token = ctx.request.headers['access-token']
    const isValid = await isTokenVerify(token)
    if (isValid) {
      ctx.body = response.success({})
    } else {
      ctx.status = 400
      ctx.body = response.error('登录过期')
    }
  }

  @post('/auth')
  public login(ctx: Koa.Context & KoaBodyContext) {
    const data = ctx.request.body
    if (Login.isValidUser(data)) {
      ctx.body = response.success({
        token: Login.getJwtToken({ username: data.username })
      })
    } else {
      ctx.body = response.error('用户名或密码错误')
    }
  }
}

export default Login
