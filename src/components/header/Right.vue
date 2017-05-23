<template>
  <div class="header-bar">
    <el-row>
      <el-col :span="12" class="global-action">
        <el-button icon="plus" size="mini" type="primary" @click="bus.$emit(event.ADD_CLICK)" v-show="$route.name === 'jars' || $route.name === 'servers'"></el-button>
        <el-button size="mini" type="primary" @click="bus.$emit(event.REFRESH_CLICK)">Refresh</el-button>
        <!--<el-tooltip content="Auto Refresh">-->
          <el-switch v-model="autoRefresh" @change="toggleAutoRefresh"></el-switch>
        <!--</el-tooltip>-->
        &nbsp;
      </el-col>
      <el-col :span="12" class="user-action">
        Server: {{$store.state.address}}
        <el-button icon="edit" size="mini" @click="$router.push('/login')" type="primary"></el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import * as event from '@/lib/event'
  import {mapMutations} from 'vuex'

  export default {
    data() {
      return {
        event,
        bus: event.bus,
        autoRefresh: false
      }
    },
    methods: {
      ...mapMutations(['toggleAutoRefresh'])
    }
  }
</script>

<style lang="stylus" scoped>
  .header-bar
    height 48px
    width 100%
    background #324057
    line-height 48px
    color #F9FAFC
    border-bottom 1px solid #475669
    border-left 1px solid #475669
    padding 0 10px
  .global-action
    text-align left
  .user-action
    text-align right
</style>
