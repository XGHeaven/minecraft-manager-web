<template>
  <div>
    <div class="header pinned">
      <el-row>
        <el-col :span="4">
          <header-bar-left></header-bar-left>
        </el-col>
        <el-col :span="20">
          <header-bar-right></header-bar-right>
        </el-col>
      </el-row>
    </div>
    <el-row class="main pinned">
      <el-col :span="4" class="full-height">
        <nav-menu></nav-menu>
      </el-col>
      <el-col :span="20" class="full-height">
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import HeaderBarLeft from './header/Left.vue'
  import HeaderBarRight from './header/Right.vue'
  import NavMenu from './nav/Menu.vue'
  import {connect, disconnect} from '@/lib/event'

  export default {
    components: {
      HeaderBarLeft,
      HeaderBarRight,
      NavMenu
    },
    created() {
      connect()
    },
    beforeDestroy() {
      disconnect()
    }
  }
</script>

<style lang="stylus" scoped>
  headerHeight = 48px

  .pinned
    position absolute
    left 0
    right 0

  .header
    top 0
    height headerHeight

  .main
    top headerHeight
    bottom 0

  .full-height
    height 100%
    overflow scroll

</style>
