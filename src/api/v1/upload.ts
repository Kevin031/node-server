import { get, post, useAuth } from '@/utils/route-controller'
import Koa from 'koa'
import crypto from 'crypto'
import response from '@/common/response'
import path from 'path'
import loadJSONFile from '@/utils/load-json-file'

let configPath = path.resolve(__dirname, '../../public/cos-secret.json')
const config = loadJSONFile(configPath)

class Upload {
  @get('/policy')
  @useAuth
  public getPolicy(ctx: Koa.Context) {
    if (!config) {
      ctx.body = response.error('未找到签名文件')
      return
    }
    const now = Math.round(Date.now() / 1000)
    const exp = now + 900
    const qKeyTime = now + ';' + exp
    const qSignAlgorithm = 'sha1'
    const policy = JSON.stringify({
      expiration: new Date(exp * 1000).toISOString(),
      conditions: [
        { 'q-sign-algorithm': qSignAlgorithm },
        { 'q-ak': config.secretId },
        { 'q-sign-time': qKeyTime }
      ]
    })

    // 步骤1：生成SignKey
    const signKey = crypto
      .createHmac('sha1', config.secretKey)
      .update(qKeyTime)
      .digest('hex')

    // 步骤2：生成 StringToSign
    const stringToSign = crypto.createHash('sha1').update(policy).digest('hex')

    // 步骤3：生成 Signature
    const qSignature = crypto
      .createHmac('sha1', signKey)
      .update(stringToSign)
      .digest('hex')

    ctx.body = response.success({
      policyObj: JSON.parse(policy),
      url: config.url,
      policy: Buffer.from(policy).toString('base64'),
      qSignAlgorithm: qSignAlgorithm,
      qAk: config.secretId,
      qKeyTime: qKeyTime,
      qSignature: qSignature
    })
  }
}

export default Upload
