<template>
  <div class="container">
    <div class="console-container">
      <div v-for="log in logs" class="console-line" :class="[log.from]">{{log.log}}</div>
    </div>
    <el-input v-model="command" style="width: 100%" @keyup.enter="submitCommand()" @click="alert(1)" :disabled="server.status !== 'started'">
      <el-button slot="append" @click="submitCommand()" :disabled="server.status !== 'started'">Enter</el-button>
    </el-input>
  </div>
</template>

<script>
  import {console as serverConsole} from '@/resource'
  import {createEventSource} from '@/lib/event'

  export default {
    props: ['server'],
    data() {
      return {
        logs: [],
        command: ''
      }
    },
    computed: {
      serverName() {
        return this.$route.params.serverName
      }
    },
    methods: {
      getLog() {
        serverConsole.index({
          server: this.serverName
        }).then(res => {
          this.logs = res.body.reverse()
        })
      },
      submitCommand() {
        serverConsole.create({
          server: this.serverName
        }, {
          command: this.command
        }).then(res => {
          this.command = ''
          this.$message({
            type: 'success',
            message: 'Success'
          })
        })
      },
      scrollToEnd() {
        const container = this.$el.querySelector('.console-container')
        container.scrollTop = container.scrollHeight
      }
    },
    created() {
      this.getLog()
      this._eventSource = createEventSource(`/api/server/${this.serverName}/console?format=event`)
      this._eventSource.addEventListener('message', e => {
        this.logs.push(JSON.parse(e.data))
        this.scrollToEnd()
      })
    },
    beforeDestroy() {
      this._eventSource.close()
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    display flex
    height 100%
    flex-direction column

  .console-line
    border-top 1px solid #cccccc
    font-size 14px

    &.server
      color #333333

    &.client
      color #5e7382

  .console-container
    overflow scroll
    flex-grow 1
</style>
