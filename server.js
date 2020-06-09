const Vue = require('vue')
const Koa = require('koa')
const Router = require('koa-router')
const { createBundleRenderer } = require('vue-server-renderer')

//  第 1 步：创建koa、koa-router 实例
const app = new Koa()
const router = new Router()
// 获取客户端、服务器端生成的json文件、html模板文件
const serverBundle = require('./dist/vue-ssr-server-bundle.json')
const clientManifest = require('./dist/vue-ssr-client-manifest.json')
const template = require('fs').readFileSync('./src/index.template.html', 'utf-8')

const send = require('koa-send')
// 引入/static/下的文件都通过koa-send转发到dist文件目录下
router.get('/static/*', async (ctx, next) => {
  await send(ctx, ctx.path, { root: __dirname + '/dist' });
})

// 第 2 步：路由中间件
router.get('*', async (ctx, next) => {

  const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template, // 页面模板
    clientManifest // 客户端构建 manifest
  })
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

// 第 3 步：启动服务，通过http://localhost:3000/访问
app.listen(3000, () => {
  console.log(`server started at localhost:3000`)
})
