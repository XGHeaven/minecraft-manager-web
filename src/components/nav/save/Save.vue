<template>
  <div>
    <el-tabs :value="current" v-model="current">
      <el-tab-pane label="Backup" name="backup"></el-tab-pane>
      <el-tab-pane label="Setting" name="setting"></el-tab-pane>
    </el-tabs>
    <keep-alive>
      <component :is="'save-' + current"></component>
    </keep-alive>
  </div>
</template>

<script>
  import {save as saveResource} from '@/resource'
  import SaveBackup from './Backup.vue'

  export default {
    components: {SaveBackup},
    data() {
      return {
        saveName: this.$route.params.saveName,
        save: {
          name: '',
          backups: []
        },
        current: 'backup'
      }
    },
    methods: {
      getSave() {
        saveResource.get({
          save: this.saveName
        }).then(res => {
          this.save = res.data
        })
      }
    },
    created() {

    }
  }
</script>

<style lang="stylus" scoped>

</style>
