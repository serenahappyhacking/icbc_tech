const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')
// css样式提取单独文件
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
// 服务端渲染用到的插件、默认生成JSON文件(vue-ssr-client-manifest.json)
const VueSSRClientPlugin = require('vue-server-renderer/client-plugin')
// 定义是否是生产环境的标志位，用于配置中
const isProd = process.env.NODE_ENV === 'production'

module.exports = merge(baseWebpackConfig, {
  mode: process.env.NODE_ENV || 'development',
  // 入口暂定客户端入口，服务端配置需要更改它
  entry: {
    'app': path.join(__dirname, '../src/entry-client.js')
  },
  output: {
    // chunkhash是根据内容生成的hash, 易于缓存,
    // 开发环境不需要生成hash，目前先不考虑开发环境，后面详细介绍
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[id].[chunkhash].js'
  },
  module: {
    rules: [
      {
        test: /\.styl(us)?$/,
        // 利用mini-css-extract-plugin提取css, 开发环境不需要提取css单独文件
        use: isProd
          ? [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader']
          : ['vue-style-loader', 'css-loader', 'stylus-loader']
      },
    ]
  },
  devtool: '#eval-source-map',
  plugins: isProd
    ? [
      // webpack4.0版本以上采用MiniCssExtractPlugin 而不使用extract-text-webpack-plugin
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[name].[contenthash].css'
      }),
      //  当vendor模块不再改变时, 根据模块的相对路径生成一个四位数的hash作为模块id
      new webpack.HashedModuleIdsPlugin(),
      new VueSSRClientPlugin()
      ]
    : [
      new VueSSRClientPlugin()
    ]
})
