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
            <el-button size="small" :disabled="scope.row.status !== 'stopped'" @click="$store.dispatch('startServer', scope.row.name)">Start
            </el-button>
            <el-button size="small" :disabled="scope.row.status !== 'started'" @click="$store.dispatch('stopServer', scope.row.name)">Stop
            </el-button>
            <el-button size="small" type="danger" @click="removeServer(scope.row)">Delete</el-button>
          </el-button-group>
          <el-button size="small" type="primary"
                     @click="$router.push({name: 'server', params: {serverName: scope.row.name}})"
                     icon="edit"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Add Server" v-model="addServerModal">
      <el-form v-model="newServerModal" labelWidth="120px">
        <el-form-item label="Server Name">
          <el-input v-model="newServerModal.name" @change="sameWithServerName ? newServerModal.save = arguments[0] : ''"></el-input>
        </el-form-item>
        <el-form-item label="Save Name">
          <el-select v-model="newServerModal.save" allowCreate filterable placeholder="Please select or create">
            <el-option v-for="save in saves" :value="save.name" :label="save.name" :key="save.name"></el-option>
          </el-select>
          <el-checkbox v-model="sameWithServerName">Same with server name</el-checkbox>
        </el-form-item>
        <el-form-item label="Version">
          <version-select v-model="newServerModal.version"></version-select>
        </el-form-item>
        <el-collapse>
          <el-collapse-item title="Option">
            <server-option :option="newServerModal.options"></server-option>
          </el-collapse-item>
        </el-collapse>
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
  import ServerOption from '@/components/form/ServerOption'
  import * as resource from '@/resource'

  export default {
    components: {
      VersionSelect,
      ServerOption
    },
    data() {
      return {
        addServerModal: false,
        newServerModal: {
          name: '',
          version: '',
          save: '',
          options: {
            javaXms: '256M',
            javaXmx: '1G',
            properties: {
              gamemode: 0,
              difficulty: 1,
              pvp: true,
              'enable-command-block': false,
              'max-players': 20,
              'server-port': 25565,
              'view-distance': 10,
              'white-list': false,
              'online-mode': false,
              'level-seed': 0,
              motd: 'A Minecraft Server'
            }
          }
        },
        sameWithServerName: true,
        processing: false
      }
    },
    computed: {
      ...mapState(['servers', 'saves'])
    },
    watch: {
      sameWithServerName(nv, ov) {
        if (nv) this.newServerModal.save = this.newServerModal.name
      }
    },
    methods: {
      autoRefresh() {
        this.$store.dispatch('fetch', 'server')
      },
      removeServer(server) {
        resource.server.delete({
          server: server.name
        }).then(res => {
          this.$store.dispatch('fetch', 'server')
          this.$message({
            type: 'success',
            message: 'delete success, please delete save or jar manual'
          })
        })
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
