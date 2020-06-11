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
    },
    mutations: {
      SET_ITEM: (state, item) => {
        state.item = item
      }
    },
    getters: {
      GET_ITEM: (state) => {
        return state.item
      }
    }
  })
}