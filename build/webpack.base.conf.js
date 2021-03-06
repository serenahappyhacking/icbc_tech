const path = require('path')
// vue-loader v15版本需要引入此插件
const VueLoaderPlugin = require('vue-loader/lib/plugin')

// 用于返回文件相对于根目录的绝对路径
const resolve = dir => path.posix.join(__dirname, '..', dir)

// 定义是否是生产环境的标志位，用于配置中
const isProd = process.env.NODE_ENV === 'production'

module.exports = function(moduleName){
  return {
    // 生成文件路径、名字、引入公共路径
    output: {
      path: path.join(__dirname, '../dist', moduleName),
      filename: '[name].[chunkhash].js',
      publicPath: `/dist/${moduleName}/`
    },
    resolve: {
      // 对于.js、.vue引入不需要写后缀
      extensions: ['.js', '.vue'],
      // 引入components、assets可以简写，可根据需要自行更改
      alias: {
        '@': path.resolve(__dirname, "../src")
      }
    },
    devtool: isProd
      ? false
      : '#cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: {
            // 配置哪些引入路径按照模块方式查找
            transformAssetUrls: {
              video: ['src', 'poster'],
              source: 'src',
              img: 'src',
              image: 'xlink:href'
            }
          }
        },
        {
          test: /\.js$/, // 利用babel-loader编译js，使用更高的特性，排除npm下载的.vue组件
          loader: 'babel-loader',
          exclude: file => (
            /node_modules/.test(file) &&
            !/\.vue\.js/.test(file)
          )
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/, // 处理图片
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 10000,
                name: 'static/img/[name].[hash:7].[ext]'
              }
            }
          ]
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 处理字体
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/fonts/[name].[hash:7].[ext]'
          }
        },
        {
          test: /\.css$/,
          use: [
            'vue-style-loader',
            'css-loader'
          ]
        }
      ]
    },
    plugins: [
      new VueLoaderPlugin()
    ]
  }
}
