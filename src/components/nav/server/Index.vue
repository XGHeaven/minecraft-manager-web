<template>
  <div>
    <el-table :data="servers">
      <el-table-column type="expand">
        <template scope="scope">
          Empty
        </template>
      </el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="version" label="Version"></el-table-column>
      <el-table-column label="Status">
        <template scope="scope">
          <el-tag>{{scope.row.status}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template scope="scope">
          <el-button-group>
            <el-button size="small" :disabled="scope.row.status !== 'stopped'" @click="startServer(scope.row)">Start
            </el-button>
            <el-button size="small" :disabled="scope.row.status !== 'started'" @click="stopServer(scope.row)">Stop
            </el-button>
            <el-button size="small" type="danger">Delete</el-button>
          </el-button-group>
          <el-button size="small" type="primary"
                     @click="$router.push({name: 'server', params: {serverName: scope.row.name}})"
                     icon="edit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Add Server" v-model="addServerModal">
      <el-form v-model="newServerModal">
        <el-form-item label="Server Name">
          <el-input v-model="newServerModal.name"></el-input>
        </el-form-item>
        <el-form-item label="Version">
          <version-select v-model="newServerModal.version"></version-select>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" @click="addServer()" :loading="processing">Add</el-button>
        <el-button type="danger" @click="addServerModal = false" :disabled="processing">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import * as event from '@/lib/event'
  import VersionSelect from '@/components/form/VersionSelect'
  import * as resource from '@/resource'

  export default {
    components: {
      VersionSelect
    },
    data() {
      return {
        addServerModal: false,
        newServerModal: {
          name: '',
          version: ''
        },
        processing: false
      }
    },
    computed: {
      ...mapState(['servers'])
    },
    methods: {
      startServer(server) {
        console.log('start')
        this.$http.put(this.$store.state.server + '/api/server/' + server.name, {
          status: 'start'
        }).then(res => {
          server.status = 'starting'
        })
      },
      stopServer(server) {
        console.log('stop')
        this.$http.put(this.$store.state.server + '/api/server/' + server.name, {
          status: 'stop'
        }).then(res => {
          server.status = 'stopping'
        })
      },
      autoRefresh() {
        this.$store.dispatch('fetch', 'server')
      },
      addServer() {
        this.processing = true
        resource.save.create(null, {
          name: this.newServerModal.name
        }).then(res => {
          this.$message({
            type: 'success',
            message: 'save create success'
          })
          return resource.jar.create(null, {
            version: this.newServerModal.version
          })
        }).then(res => {
          this.$message({
            type: 'success',
            message: 'jar create success'
          })
          return resource.server.create(null, {
            ...this.newServerModal,
            save: this.newServerModal.name
          })
        }).then(res => {
          this.$message({
            type: 'success',
            message: 'server create success'
          })
          this.processing = false
          this.addServerModal = false
          this.$store.dispatch('fetch', 'server')
        }).catch(err => {
          console.log(err)
          this.$message.error('create error')
          this.processing = false
        })
      }
    },
    created() {
      this._add = () => {
        this.addServerModal = true
      }
      event.bus.$on(event.ADD_CLICK, this._add)
    },
    beforeDestroy() {
      event.bus.$off(event.ADD_CLICK, this._add)
    }
  }
</script>

<style lang="stylus">

</style>
