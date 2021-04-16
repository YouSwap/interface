const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  pluginOptions: { // 第三方插件配置
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, './src/assets/css/base.less')] // less所在文件路径
    }
  },
  chainWebpack: config => {
    config.output.filename('assets/js/[name].[hash].js').chunkFilename('assets/js/[name].[hash].js').end()

    // 如果filenameHashing设置为了false，可以通过这段代码给打包出的css文件增加hash值
    // config.plugin('extract-css').tap(args => [{
    //   filename: 'assets/css/[name].[hash].css',
    //   chunkFilename: 'assets/css/[name].[hash].css'
    // }])
  }
}
