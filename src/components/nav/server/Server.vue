<template>
  <div class="wrapper">
    <div class="header">
      <el-form inline class="header-info">
        <el-form-item label="Name">
          {{server.name}}
        </el-form-item>
        <el-form-item label="Version">
          {{server.version}}
        </el-form-item>
        <el-form-item label="Status">
          <el-tag>{{server.status}}</el-tag>
          <el-button-group>
            <el-button size="small" :disabled="this.server.status !== 'stopped'" :loading="this.server.status === 'starting'" @click="$store.dispatch('startServer', server.name)">Start</el-button>
            <el-button size="small" :disabled="this.server.status !== 'started'" :loading="this.server.status === 'stopping'" @click="$store.dispatch('stopServer', server.name)">Stop</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <el-tabs :value="current" v-model="current">
      <el-tab-pane label="Console" name="console"></el-tab-pane>
      <el-tab-pane label="Setting" name="setting"></el-tab-pane>
    </el-tabs>
    <div class="component">
      <keep-alive>
        <component :is="'server-' + current" :server="server"></component>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import {server} from '@/resource/'
  import ServerConsole from './Console.vue'
  import ServerSetting from './Setting.vue'

  let timer = null
  let interval = 1000

  export default {
    components: {
      ServerConsole, ServerSetting
    },
    data() {
      return {
        current: 'console'
      }
    },
    computed: {
      serverName() {
        return this.$route.params.serverName
      },
      server() {
        return this.$store.state.servers.find(s => s.name === this.serverName) || {}
      }
    },
    created() {
      this.getServer()
    },
    methods: {
      getServer() {
        server.get({server: this.serverName}).then(res => {
          this.server = res.body
        })
      },
      waiting() {
        if (timer) return
        let wait = () => {
          server.get({server: this.serverName}).then(res => {
            this.server = res.body
            if (this.server.status !== 'started' || this.server.status !== 'stopped') {
              timer = setTimeout(wait, interval)
            } else {
              timer = null
            }
          })
        }
        setTimeout(wait, interval)
      }
    }
  }
</script>

<style lang="stylus" scoped>
  .wrapper
    display flex
    flex-direction column
    height 100%

  .component
    overflow hidden
    flex auto
    position relative
    height 100%

  .header
    padding 30px
    background #F9FAFC

  .header-info
    .el-form-item
      margin-right 0
      margin-bottom 0
      width 33%
</style>
