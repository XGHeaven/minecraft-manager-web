<template>
  <div>
    <el-button-group>
      <el-button type="primary" icon="plus" @click="createBackup()">Commit</el-button>
      <!--<el-button type="danger">Delete</el-button>-->
      <el-button @click="getBackups()">Refresh</el-button>
    </el-button-group>
    <el-table :data="backups">
      <el-table-column type="selection"></el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="size" label="Size" :formatter="byte2Size" sortable></el-table-column>
      <el-table-column prop="createTime" label="Time" sortable :formatter="parseTime"></el-table-column>
      <el-table-column>
        <template scope="scope">
          <el-button-group>
            <el-button type="warning" size="small" @click="rollback(scope.row)">Rollback</el-button>
            <el-button type="danger" size="small" @click="deleteBackup(scope.row)">Delete</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import {backup as backupResource, save as saveResource} from '@/resource'
  import {byte2Size} from '@/lib/utils'

  export default {
    data() {
      return {
        backups: [{
          id: '111123123',
          size: 1233322,
          createdTime: 12333239898
        }, {
          id: '111123123',
          size: 1233322,
          createdTime: 12333239898
        }, {
          id: '111123123',
          size: 1233322,
          createdTime: 12333239898
        }],
        saveName: this.$route.params.saveName
      }
    },
    computed: {
      nBackups() {
        return this.backups.map(backup => {
          let _backup = {}
          _backup.name = backup.name
          _backup.size = (backup.size / 1024 / 1024).toFixed(2) + ' M'
          _backup.createdTime = new Date(backup.createdTime).toLocaleString()
          return _backup
        })
      }
    },
    methods: {
      getBackups() {
        backupResource.index({
          save: this.saveName
        }).then(res => {
          this.backups = res.data
        })
      },
      createBackup() {
        this.$confirm('Will Create Backup. This will cause game slower on a moment', {
          type: 'warning'
        }).then(() => {
          backupResource.create({
            save: this.saveName
          })
        })
      },
      rollback(backup) {
        this.$confirm(`Are you want to rollback backup ${backup.id}, current snapshot will save in latest backup`, {
          type: 'warning'
        }).then(() => saveResource.update({
          save: this.saveName
        }, {
          backup: backup.id
        })).then(res => {
          this.$message.success('Rollback to ' + backup.id + 'success')
        }, res => {
          this.$message.error('Rollback to ' + backup.id + 'failed')
        })
      },
      deleteBackup(backup) {
        this.$confirm('Do you want to delete backup ' + backup.id, {
          type: 'warning'
        }).then(() => backupResource.delete({
          save: this.saveName,
          backup: backup.id
        })).then(res => {
          this.$message.success('Delete Success')
          this.getBackups()
        }, res => {
          this.$message.error('Delete Failed')
        })
      },
      byte2Size(row, col) {
        return byte2Size(row[col.property])
      },
      parseTime(row, col) {
        return new Date(row[col.property]).toLocaleString()
      }
    },
    created() {
      this.getBackups()
    }
  }
</script>

<style lang="stylus">

</style>
