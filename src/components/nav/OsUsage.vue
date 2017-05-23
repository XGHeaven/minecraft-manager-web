<template>
  <div class="container">
    <div class="system-info">
      <section>
        <header>web:</header>
        <span>{{version}}</span>
      </section>
      <section>
        <header>server:</header>
        <span>{{system.version}}</span>
      </section>
      <section>
        <header>node:</header>
        <span>{{system.node}}</span>
      </section>
    </div>
    <el-tooltip :content="cpuPrompt" placement="right">
      <el-progress :percentage="cpuPercent" class="progress" :textInside="true" :strokeWidth="18"></el-progress>
    </el-tooltip>
    <el-tooltip :content="memPrompt" placement="right">
      <el-progress :percentage="memPercent" class="progress" :textInside="true" :strokeWidth="18"></el-progress>
    </el-tooltip>
  </div>
</template>

<script>
  import {byte2Size} from '@/lib/utils'
  import {createEventSource} from '@/lib/event'
  import {mapState} from 'vuex'
  import pkg from '../../../package.json'

  export default {
    data() {
      return {
        usage: {
          cpu: {
            user: 0, sys: 0, nice: 0, idle: 0, irq: 0
          },
          mem: {
            free: 0,
            total: 0,
            process: {
              rss: 0,
              heapTotal: 0,
              heapUsed: 0,
              external: 0
            }
          },
          loadavg: [0, 0, 0]
        },
        es: null,
        version: pkg.version
      }
    },
    computed: {
      ...mapState(['system']),
      cpuPercent() {
        const cpu = this.usage.cpu
        const used = cpu.user + cpu.sys + cpu.nice + cpu.irq
        const total = used + cpu.idle
        return ~~((used / total) * 100)
      },
      memPercent() {
        const mem = this.usage.mem
        return ~~((mem.total - mem.free) / mem.total * 100)
      },
      memPrompt() {
        return 'Mem ' + byte2Size(this.usage.mem.total - this.usage.mem.free) + '/' + byte2Size(this.usage.mem.total)
      },
      cpuPrompt() {
        return 'CPU LoadAvg ' + this.usage.loadavg.map(v => v.toFixed(2)).join(', ')
      }
    },
    methods: {
      connect() {
        this.es = createEventSource('/api/system/stream')
        this.es.addEventListener('message', e => {
          this.usage = JSON.parse(e.data)
        })
      },
      disconnect() {
        this.es && this.es.close()
        this.es = null
      }
    },
    created() {
      this.connect()
    },
    beforeDestroy() {
      this.disconnect()
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    height auto
    background #324057

  .progress
    padding 3px

  .system-info
    padding 0 5px
    /*text-align right*/
    color white
    font-size 0.75rem
    section
      display flex
    header
      display inline
    span
      flex-grow 1
      text-align right
</style>
