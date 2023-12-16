import fs from 'fs'

export default function loadJSONFile(filePath: string) {
  try {
    const cosSecret = fs.readFileSync(filePath, { encoding: 'utf-8' })
    return JSON.parse(cosSecret)
  } catch (err) {
    console.log('未找到文件:', filePath)
  }
}
