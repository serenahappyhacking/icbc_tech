<template>
<div>
  Detail Page页请求的数据结果：{{  show ? this.$store.state.item : '1111'}}
</div>
</template>

<script>
import { getItemData } from '../api'
export default {
  name: 'Detail',
  data () {
    return {
      show: true
    }
  },
  // 定义asyncData， entry-server.js会编译所有匹配的组件中是否包含，包含则执行
  // 将state值挂在到context上，会被序列化为window.__INITIAL_STATE__
  asyncData ({ store, route }) {
    return getItemData().then(res => {
      store.commit('SET_ITEM', res)
    })
  },
}
</script>
<style lang='scss' scoped>

</style>