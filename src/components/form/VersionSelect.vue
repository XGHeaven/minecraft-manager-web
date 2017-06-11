<template>
  <div>
    <el-select filterable @change="change" v-model="version" placeholder="Please select minecraft version">
      <el-option v-for="version in filterVersions" :label="version.id" :value="version.id" :key="'version'">
        <span>{{version.id}}</span>
        <span class="optionSubTitle">{{version.type}}</span>
      </el-option>
    </el-select>
    <el-checkbox v-model="showSnapshot">Snapshot</el-checkbox>
    <el-checkbox v-model="showOldVersion">Old Version</el-checkbox>
    <el-button type="primary" size="mini" @click="$store.dispatch('loadingVersion', true)">Refresh</el-button>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        showSnapshot: false,
        showOldVersion: false,
        version: ''
      }
    },
    props: ['value'],
    computed: {
      versions() {
        return this.$store.state.version.versions
      },
      filterVersions() {
        return this.$store.state.version.versions.filter(version => {
          if (version.type === 'release') return true
          if (version.type === 'snapshot') return this.showSnapshot
          return this.showOldVersion
        })
      }
    },
    methods: {
      change(value) {
        this.$emit('input', value)
      }
    },
    created() {
      this.$store.dispatch('loadingVersion')
      this.version = this.value
    }
  }
</script>

<style lang="stylus">

</style>
