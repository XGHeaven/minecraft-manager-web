<template>
  <div>
    <el-table :data="jars">
      <el-table-column prop="version" label="Version"></el-table-column>
      <el-table-column label="Status">
        <template scope="scope">
          <el-progress
            :percentage="scope.row.status === 'installed' ? 100 : (scope.row.download && parseInt(scope.row.download.percentage*100) || 0)"
            :status="scope.row.status === 'installed' ? 'success' : ''"
          ></el-progress>
        </template>
      </el-table-column>
      <el-table-column label="Action">
        <template scope="scope">
          <el-button-group>
            <el-button
              :disabled="scope.row.status !== 'uninstall'"
              :loading="scope.row.status === 'installing'"
              size="small"
              @click="installJar(scope.row)"
            >Install
            </el-button>
            <el-button size="small" :disabled="scope.row.status === 'installing'" @click="deleteJar(scope.$index)" type="danger">
              Delete
            </el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="Add Jar" v-model="addJarModal">
      <el-form v-loading="$store.state.version.loading">
        <el-form-item label="Minecraft Version">
          <el-select v-model="newJarModal.version" filterable>
            <el-option v-for="version in filterVersions" :label="version.id" :value="version.id" key="version">
              <span>{{version.id}}</span>
              <span class="optionSubTitle">{{version.type}}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Enable Snapshot">
          <el-switch v-model="showSnapshot"></el-switch>
        </el-form-item>
        <el-form-item label="Show Old Version">
          <el-switch v-model="showOldVersion"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="add()" :loading="addingJar">Confirm</el-button>
        <el-button type="primary" @click="addJarModal = false">Cancel</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {jar as jarServer} from '@/resource'
  import Vue from 'vue'
  import * as event from '@/lib/event'
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
        addJarModal: false,
        newJarModal: {
          version: ''
        },
        addingJar: false,
        showSnapshot: false,
        showOldVersion: false,
        version: ''
      }
    },
    computed: {
      ...mapState(['jars']),
      filterVersions() {
        return this.$store.state.version.versions.filter(version => {
          if (version.type === 'release') return true
          if (version.type === 'snapshot') return this.showSnapshot
          return this.showOldVersion
        })
      }
    },
    methods: {
      installJar(jar) {
        jarServer.update({
          jar: jar.version
        }, {
          status: 'install'
        }).then(res => {
          jar.status = res.data.status

          const refresh = () => {
            jarServer.get({
              jar: jar.version
            }).then(res => {
              Vue.set(jar, 'download', res.data.download)
              jar.status = res.data.status
              if (jar.status !== 'installed') setTimeout(refresh, 1000)
            })
          }

          setTimeout(refresh, 1000)
        })
      },
      deleteJar(index) {
        jarServer.delete({
          jar: this.jars[index].version
        }).then(res => {
          this.jars.splice(index, 1)
        })
      },
      add() {
        this.addingJar = true
        jarServer.createBackup(null, this.newJarModal).then(res => {
          this.jars.push(res.data)
          this.newJarModal = {}
          this.addingJar = false
          this.addJarModal = false
          this.$message('Success')
        }, err => {
          this.addingJar = false
          this.$message.error('Add Failed')
          console.error(err)
        })
      },
      autoRefresh() {
        this.$store.dispatch('fetch', 'jar')
      }
    },
    created() {
      this._add = () => {
        this.newJarModal = {version: ''}
        this.addJarModal = true
        this.$store.dispatch('loadingVersion')
      }
      event.bus.$on(event.ADD_CLICK, this._add)
      this.autoRefresh()
    },
    beforeDestroy() {
      event.bus.$off(event.ADD_CLICK, this._add)
    }
  }
</script>

<style lang="stylus" scoped>
  .optionSubTitle
    float right
    color #999999
</style>
