import supertest from 'supertest'
import { createServer } from '../src/app'
import loadJSONFile from '../src/utils/load-json-file'
import path from 'path'

const config = loadJSONFile(
  path.resolve(__dirname, '../src/public/config.json')
)

const PASSWORD = config.password
const USERNAME = config.username

describe('login', () => {
  const request = supertest(createServer(4022).callback())
  test('wrong password', async () => {
    const res1 = await request.post('/api/v1/login/auth').send({
      username: 'hello',
      password: 'aaaaaa'
    })
    expect(res1._body).toStrictEqual({ code: '400', msg: '用户名或密码错误' })
  })

  test('true password', async () => {
    const res1 = await request.post('/api/v1/login/auth').send({
      username: USERNAME,
      password: PASSWORD
    })
    expect(res1._body.code).toBe('200')
    expect(res1._body.data.token.length > 0).toBe(true)
  })

  test('is login', async () => {
    const res1 = await request.post('/api/v1/login/auth').send({
      username: USERNAME,
      password: PASSWORD
    })
    const token = res1._body.data.token
    const res2 = await request
      .get('/api/v1/login/is-login')
      .set('Access-Token', token)
    expect(res2._body.code).toBe('200')
  })
})
