<template>
  <div>
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
            <el-button size="small" :disabled="this.server.status !== 'stopped'" :loading="this.server.status === 'starting'" @click="startServer()">Start</el-button>
            <el-button size="small" :disabled="this.server.status !== 'started'" :loading="this.server.status === 'stopping'" @click="stopServer()">Stop</el-button>
          </el-button-group>
        </el-form-item>
      </el-form>
    </div>
    <el-menu mode="horizontal" defaultActive="log">
      <el-menu-item index="log" @click="$router.push({name: 'log', params: {serverName: $route.params.serverName}})">Log</el-menu-item>
      <el-menu-item index="setting">Setting</el-menu-item>
    </el-menu>
    <router-view></router-view>
  </div>
</template>

<script>
  import {server} from '@/resource/'

  let timer = null
  let interval = 1000

  export default {
    data() {
      return {
        server: {
          name: 'name1',
          version: '1.11.2',
          status: 'starting'
        }
      }
    },
    computed: {
      serverName() {
        return this.$route.params.serverName
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
      startServer() {
        server.update({server: this.serverName}, {
          status: 'start'
        }).then(res => {
          this.status = 'starting'
          this.waiting()
        })
      },
      stopServer() {
        server.update({server: this.serverName}, {
          status: 'stop'
        }).then(res => {
          this.status = 'stopping'
          this.waiting()
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
  .header
    padding 30px
    background #F9FAFC

  .header-info
    .el-form-item
      margin-right 0
      margin-bottom 0
      width 33%
</style>
