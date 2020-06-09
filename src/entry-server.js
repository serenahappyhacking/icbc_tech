// 渲染首屏
import createApp from './app'

// context
export default context => {
  // 因为有可能会是异步路由钩子函数或数组，所以我们将返回一个Promise，以便服务器能够等待所有的内容在渲染前就已经准备就绪
  return new Promise((resolve, reject) => {
    const { app, router } = createApp()
    // 进入首屏， 设置服务器端 router 的位置
    router.push(context.url)
    router.onReady(() => {
      const matchedComponents = router.getMatchedComponents()
      // 匹配不到的路由，执行reject函数，并返回404
      if (!matchedComponents.length) {
        return reject({ code: 404})
      }
      // Promise 应该resolve 应用程序实例，以便它可以渲染
      resolve(app)
    }, reject)
  })
}