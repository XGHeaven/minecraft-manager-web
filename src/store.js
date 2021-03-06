import Vuex from 'vuex'
import Vue from 'vue'
import * as resource from '@/resource'
import * as event from '@/lib/event'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    server: localStorage.getItem('server'),
    auth: localStorage.getItem('auth') && JSON.parse(localStorage.getItem('auth')) || {
      user: '',
      pwd: '',
      enabled: false
    },
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
      localStorage.setItem('server', server)
    },
    updateAuth(state, auth) {
      state.auth = auth
      localStorage.setItem('auth', JSON.stringify(auth))
      if (auth.enabled) Vue.http.headers.common['Authorization'] = 'Basic ' + btoa(auth.name + ':' + auth.pwd)
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
    },
    updateServerState(state, server) {
      state.servers.forEach((s, i) => {
        if (s.name === server.name) {
          Object.assign(s, server)
        }
      })
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
    },

    async startServer({dispatch, commit}, serverName) {
      commit('updateServerState', {
        name: serverName,
        status: 'starting'
      })
      return await dispatch('changeServerState', {serverName, action: 'start'})
    },

    async stopServer({dispatch, commit}, serverName) {
      commit('updateServerState', {
        name: serverName,
        status: 'starting'
      })
      return await dispatch('changeServerState', {serverName, action: 'stop'})
    },

    async changeServerState({commit, state, dispatch}, {serverName, action}) {
      const server = state.servers.find(server => server.name === serverName)
      if (!server) return false

      try {
        const res = await resource.server.update({server: server.name}, {
          status: action
        })
        commit('updateServerState', res.data)
        event.bus.$once(event['SERVER_' + action.toUpperCase()], () => dispatch('fetch', 'server'))
      } catch (e) {
        await dispatch('fetch', 'server')
        return false
      }

      return true
    }
  }
})

export default store
