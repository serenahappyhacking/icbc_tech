import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default function createStore() {
  return new Vuex.Store({
    state: {
      item: {}
    },
    actions: {
      SET_ITEM_FUNC (state, item) {
        state.item = item
      }
      // fetchMovie({ commit }, id) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       resolve({ id })
      //     }, 10)
      //   }).then(res => {
      //     commit('setMovie', { res })
      //   })
      // }

    },
    mutations: {
      SET_ITEM: (state, item) => {
        state.item = item
      }
      // setMovie(state, { res }) {
      //   state.movie = res
      // }
    },
    getters: {
      GET_ITEM: (state) => {
        return state.item
      }
    }
  })
}