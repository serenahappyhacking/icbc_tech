const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const nodeExternals = require('webpack-node-externals')
const baseWebpackConfig = require('./webpack.base.conf')
const VueServerPlugin = require('vue-server-renderer/server-plugin')
const modules = require("./module-config");

module.exports = modules.map(moduleName => {
  return merge(baseWebpackConfig(moduleName), {
    name: moduleName,
    mode: process.env.NODE_ENV || 'development',
    target: 'node',
    devtool: '#source-map',
    entry: path.join(__dirname, `../src/pages/${moduleName}/entry-server.js`),
    // entry: path.join(__dirname, `../src/pages/${moduleName}/entry-server.js`),
    output: {
      libraryTarget: 'commonjs2',
      filename: 'server-bundle.js',
    },
    // 这里有个坑... 服务端也需要编译样式，但不能使用mini-css-extract-plugin，
    // 因为它会使用document，但服务端并没document，导致打包报错。详情见
    // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/48#issuecomment-375288454
    module: {
      rules: [
        {
          test: /\.styl(us)?$/,
          use: ['css-loader/locals', 'stylus-loader']
        }
      ]
    },
    // 不要外置化 webpack 需要处理的依赖模块
    externals: nodeExternals({
      whitelist: /\.css$/
    }),
    plugins: [
      new webpack.DefinePlugin({
        'process.env.VUE_ENV': '"server"'
      }),
      // 默认文件名为 `vue-ssr-server-bundle.json`
      new VueServerPlugin()
    ]
  })  
})
