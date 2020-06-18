import Vue from 'vue'
import Router from 'vue-router'

const Index = () => import('@/components/Index')
const Detail = () => import('@/components/Detail')

Vue.use(Router)

// 这里为什么不导出一个router实例？
// 每次用户请求都需要创建router实例
export function createRouter() {
  return new Router({
    mode: 'history',
    linkActiveClass: 'active',
    linkExactActiveClass: 'exact-active',
    routes: [
      {path: '/home/index', component: Index},
      {path: '/home/detail', component: Detail},
      {path: '/home', redirect: '/home/index'},
      {path: '/', redirect: '/home/index'}
    ]
  })
}