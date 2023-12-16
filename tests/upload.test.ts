import supertest from 'supertest'
import { createServer } from '../src/app'
import Login from '../src/api/v1/login'
import loadJSONFile from '../src/utils/load-json-file'
import path from 'path'

const config = loadJSONFile(
  path.resolve(__dirname, '../src/public/config.json')
)

const USERNAME = config.username

describe('upload', () => {
  const request = supertest(createServer(4023).callback())
  test.only('policy', async () => {
    const res1 = await request.get('/api/v1/upload/policy')
    expect(res1._body.code).toBe('401')
    const token = Login.getJwtToken({ username: USERNAME })
    const res2 = await request
      .get('/api/v1/upload/policy')
      .set('Access-Token', token)
    expect(res2._body.code).toBe('200')
  })
})
