// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueResource from 'vue-resource'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import store from './store'

Vue.config.productionTip = false

Vue.mixin({
  methods: {
    changeAutoRefresh(bool) {
      // this.autoRefresh.call check Function type
      if (this.autoRefresh && this.autoRefresh.call) {
        bool = bool || this.$store.state.autoRefresh
        if (bool && !this._autoRefreshTimer) {
          this._autoRefreshTimer = setInterval(() => this.autoRefresh(), this.$store.state.autoRefreshInterval)
        } else if (!bool && this._autoRefreshTimer) {
          clearInterval(this._autoRefreshTimer)
          this._autoRefreshTimer = null
        }
      }
    }
  },
  watch: {
    '$store.state.autoRefresh': function(bool) {
      this.changeAutoRefresh(bool)
    }
  },
  created() {
    this.changeAutoRefresh()
    this.autoRefresh && this.autoRefresh.call && this.autoRefresh()
  },
  beforeDestroy() {
    if (this._autoRefreshTimer) {
      clearInterval(this._autoRefreshTimer)
      this._autoRefreshTimer = null
    }
  }
})

Vue.use(ElementUI)
Vue.use(VueResource)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
