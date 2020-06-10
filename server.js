const path = require('path')
const Koa = require('koa')
const Router = require('koa-router')
const send = require('koa-send')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server')

// 创建koa、koa-router 实例
const app = new Koa()
const router = new Router()

// 生成实例公共函数，开发、生产环境只是传入参数不同
const createBundle = (bundle, template, clientManifest) => {
  return createBundleRenderer(bundle, {
    runInNewContext: false,
    template,
    clientManifest
  })
}
// 将实例变量提到全局变量，根据环境变量赋值
let renderer

// 根据环境变量生成不同BundleRenderer实例
if (process.env.NODE_ENV === 'production') {
  // 获取客户端、服务器端生成的json文件
  const serverBundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')
  // 获取html模板文件
  const template = require('fs').readFileSync(path.join(__dirname, 'src/index.template.html'), 'utf-8')
  // 赋值
  renderer = createBundle(serverBundle, template, clientManifest)
  // 静态资源，开发环境不需要指定
  // 引入/static/下的文件都通过koa-send转发到dist文件目录下
  router.get('/static/*', async (ctx, next) => {
    await send(ctx, ctx.path, { root: __dirname + '/dist' });
  })
} else {
  const templatePath = path.join(__dirname, 'src/index.template.html')
  // 传入的回调函数会接受生成的json文件
  setupDevServer(app, templatePath, (bundle, template, clientManifest) => {
    // 赋值
    renderer = createBundle(bundle, template, clientManifest)
  })
}

// 路由中间件
router.get('*', async (ctx, next) => {

  // const renderer = createBundleRenderer(serverBundle, {
  //   runInNewContext: false, // 推荐
  //   template, // 页面模板
  //   clientManifest // 客户端构建 manifest
  // })
  // 创建Vue实例
  const context = {
    url: ctx.url,
    title:'SSR',
    meta: `
	<meta charset="UTF-8">
    <meta name="descript" content="基于webpack、koa搭建的SSR">
  `
  }
  try {
    // 传入context渲染上下文对象
    const html = await renderer.renderToString(context)
    ctx.status = 200
    // 传入了template, html结构会插入到<!--vue-ssr-outlet-->
    ctx.body = html
  } catch (error) {
    ctx.status = 500
    ctx.body = 'Internal Server Error'
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

// 启动服务，通过http://localhost:3000/访问
app.listen(3000, () => {
  console.log(`server started at localhost:3000`)
})
