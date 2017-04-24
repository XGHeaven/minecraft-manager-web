<template>
  <el-menu class="el-menu-vertical-demo" style="height: 100%;" defaultActive="server" :uniqueOpened="true" :router="true" theme="dark">
    <el-menu-item index="/server">服务器管理</el-menu-item>
    <el-menu-item index="/save">存档管理</el-menu-item>
    <el-menu-item index="/jar">版本管理</el-menu-item>
    <el-menu-item index="/setting">设置</el-menu-item>
  </el-menu>
</template>

<script>
  export default {

  }
</script>

<style lang="stylus" scoped>
  .el-menu
    border-radius 0
</style>
