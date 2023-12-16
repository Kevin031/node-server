const path = require('path')

module.exports = {
  presets: [
    ['@babel/preset-env', { targets: { node: 'current' } }],
    '@babel/preset-typescript'
  ],
  plugins: [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    [
      'module-resolver',
      {
        alias: {
          '@': path.resolve(__dirname, './src')
          // 添加其他别名配置
        }
      }
    ]
  ]
}
