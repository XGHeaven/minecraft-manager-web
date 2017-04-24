<template>
  <el-table :data="saves">
    <el-table-column prop="name" label="Name"></el-table-column>
    <el-table-column prop="usedFor" label="Status"></el-table-column>
    <el-table-column label="Action">
      <template scope="scope">
        <el-button-group>
          <el-button size="small" type="primary" @click="$router.push({name: 'save', params: {saveName: scope.row.name}})">Info</el-button>
          <el-button size="small" type="danger" :disabled="!!scope.row.usedFor">Delete</el-button>
        </el-button-group>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import {mapState} from 'vuex'

  export default {
    data() {
      return {
      }
    },
    computed: {
      ...mapState(['saves'])
    },
    methods: {
      autoRefresh() {
        this.$store.dispatch('fetch', 'save')
      }
    }
  }
</script>

<style lang="stylus" scoped>

</style>
