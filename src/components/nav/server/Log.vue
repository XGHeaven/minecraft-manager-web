<template>
  <div>
    <el-button @click="getLog()">Refresh</el-button>
    <div v-for="log in logs">{{log}}</div>
  </div>
</template>

<script>
  import {serverLog} from '@/resource'

  export default {
    data() {
      return {
        logs: []
      }
    },
    computed: {
      serverName() {
        return this.$route.params.serverName
      }
    },
    methods: {
      getLog() {
        serverLog.index({
          server: this.serverName
        }).then(res => {
          this.logs = res.body.reverse()
        })
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
