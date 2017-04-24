import Vuex from 'vuex'
import Vue from 'vue'
import * as resource from '@/resource'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    server: localStorage.getItem('server'),
    version: {
      loading: false,
      loaded: false,
      versions: []
    },
    servers: [],
    jars: [],
    saves: [],
    autoRefresh: false,
    autoRefreshInterval: 3000
  },
  mutations: {
    updateServer(state, server) {
      state.server = server
    },
    startUpdateVersion(state) {
      state.version.loading = true
    },
    updateVersion(state, versions) {
      state.version.versions = versions
      state.version.loading = false
      state.version.loaded = false
    },
    update(state, [key, value]) {
      state[key] = value
    },
    toggleAutoRefresh(state, bool) {
      if (bool === false || bool === true) {
        state.autoRefresh = bool
      } else {
        state.autoRefresh = !state.autoRefresh
      }
    }
  },
  actions: {
    loadingVersion: async ({commit, state}) => {
      if (state.version.loaded) return
      if (state.version.loading) return
      commit('startUpdateVersion')
      let res = await resource.version.index()
      commit('updateVersion', res.data)
    },

    async fetch({commit}, resourceName) {
      commit('update', [resourceName + 's', (await resource[resourceName].index()).data])
    }
  }
})

export default store
