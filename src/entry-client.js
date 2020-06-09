// 挂载激活App

import createApp from './app'

const { app, router } = createApp()

router.onReady(() => {
  app.$mount('#app')
})