import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import loadJSONFile from './load-json-file'
import path from 'path'

const config = loadJSONFile(path.resolve(__dirname, '../public/config.json'))

// 生成随机盐
export function generateSalt() {
  return crypto.randomBytes(16).toString('hex')
}

// 哈希密码并加盐
export function hashPassword(password, salt) {
  const hashedPassword = crypto
    .pbkdf2Sync(password, salt, 10000, 64, 'sha512')
    .toString('hex')
  return { hashedPassword, salt }
}

export function verifyPassword(userPassword, storedHashedPassword, storedSalt) {
  const hashedPassword = crypto
    .pbkdf2Sync(userPassword, storedSalt, 10000, 64, 'sha512')
    .toString('hex')

  return hashedPassword === storedHashedPassword
}

export function getJwt(username) {
  const userData = {
    username,
    role: 'user'
  }
  return jwt.sign(userData, config.jwtSecret, { expiresIn: '1h' })
}

export function isTokenVerify(token) {
  if (!token) {
    return false
  }
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.jwtSecret, (err, decoded) => {
      if (err) {
        reject(err)
      } else {
        resolve(true)
      }
    })
  })
}
