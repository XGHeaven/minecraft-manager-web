<template>
  <div class="container">
    <el-tooltip :content="cpuPrompt" placement="right">
      <el-progress :percentage="cpuPercent" class="progress" :textInside="true" :strokeWidth="18"></el-progress>
    </el-tooltip>
    <el-tooltip :content="memPrompt" placement="right">
      <el-progress :percentage="memPercent" class="progress" :textInside="true" :strokeWidth="18"></el-progress>
    </el-tooltip>
  </div>
</template>

<script>
  import {system} from '@/resource'
  import {byte2Size} from '@/lib/utils'

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
        }
      }
    },
    computed: {
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
        return 'CPU ' + this.usage.loadavg.join(', ')
      }
    },
    methods: {
      getUsage() {
        system.index().then(res => {
          this.usage = res.data
        })
      }
    },
    created() {
      this._usageTimer = setInterval(() => {
        this.getUsage()
      }, 3000)
      this.getUsage()
    },
    beforeDestroy() {
      clearInterval(this._usageTimer)
    }
  }
</script>

<style lang="stylus" scoped>
  .container
    height auto
    background #324057

  .progress
    padding 3px
</style>
