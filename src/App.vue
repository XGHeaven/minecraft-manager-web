<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import * as event from '@/lib/event'
  export default {
    name: 'app',
    created() {
      event.bus.$on(event.SAVE_BACKUP, data => {
        if (data.result) {
          if (data.backup.id === 'latest') return
          this.$notify({
            title: 'Save Backup',
            message: `save ${data.save} backup ${data.backup.id} success!`,
            type: 'success'
          })
        } else {
          this.$notify.error({
            title: 'Save Backup',
            message: `save ${data.save} Backup Error, try again later`
          })
        }
      })

      event.bus.$on(event.SAVE_ROLLBACK, data => {
        if (data.result) {
          this.$notify({
            type: 'success',
            title: 'Save Rollback',
            message: `rollback to backup ${data.backup.id} success for save ${data.save}`
          })
        } else {
          this.$notify.error({
            title: 'Save Rollback',
            message: `rollback to backup ${data.backup.id} failed for save ${data.save}`
          })
        }
      })

      event.bus.$on(event.SERVER_START, data => {
        if (data.result) {
          this.$notify({
            type: 'success',
            title: 'Server Start',
            message: `start server ${data.server} success`
          })
          this.$store.dispatch('fetch', 'server')
        } else {
          this.$notify.error({
            title: 'Server Start',
            message: `start server ${data.result} error`
          })
        }
      })

      event.bus.$on(event.SERVER_STOP, data => {
        if (data.result) {
          this.$notify({
            type: 'success',
            title: 'Server Stop',
            message: `stop server ${data.server} success`
          })
          this.$store.dispatch('fetch', 'server')
        } else {
          this.$notify.error({
            title: 'Server Stop',
            message: `stop server ${data.result} error`
          })
        }
      })
    }
  }
</script>

<style lang="stylus">
  body
    margin 0
    padding 0

  #app
    position absolute
    top 0
    bottom 0
    width 100%

  *
    box-sizing border-box
</style>
