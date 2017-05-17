<template>
  <div class="wrapper">
    <server-option :option="option"></server-option>
    <div>
      <el-button type="primary" @click="saveServer()">Save</el-button>
    </div>
  </div>
</template>

<script>
  import ServerOption from '@/components/form/ServerOption'
  import * as utils from '@/lib/utils'
  import {server as serverResource} from '@/resource'

  export default {
    components: {
      ServerOption
    },
    props: ['server'],
    data() {
      return {
        option: utils.clone(this.server.options)
      }
    },
    computed: {
      serverName() {
        return this.$route.params.serverName
      }
    },
    methods: {
      saveServer() {
        serverResource.update({
          server: this.serverName
        }, {
          options: this.option
        }).then(res => {
          this.$store.commit('updateAServer', res.body)
          this.$message('Save Success')
        }).catch(res => {
          this.$message.error('Save Error')
        })
      }
    },
    activated() {
//      this.option = utils.clone(this.server.options)
    }
  }
</script>

<style lang="stylus" scoped>
  .wrapper
    overflow-y scroll
    padding 0 20px 20px 20px
</style>
