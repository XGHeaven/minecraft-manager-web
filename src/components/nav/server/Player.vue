<template>
  <div class="wrapper">
    <div class="wrapper-left">
      <vertical-tab v-model="playerIndex">
        <vertical-tab-pane :label="player.displayName" :name="index+''" v-for="(player, index) in players" :key="player.uuid">
          <el-tag :type="player.isOnline ? 'success' : 'gray'" slot="right">{{player.isOnline ? 'Online' : 'Offline'}}</el-tag>
        </vertical-tab-pane>
      </vertical-tab>
    </div>
    <div class="wrapper-right">
      <el-form inline>
        <el-form-item label="OP">
          <el-switch v-model="player.isOp" :disabled="server.status !== 'started'" @change="changeOp"></el-switch>
        </el-form-item>
        <el-form-item label="Status">
          <el-tag :type="player.isOnline ? 'success' : 'gray'">{{player.isOnline ? 'Online' : 'Offline'}}</el-tag>
        </el-form-item>
      </el-form>
      <hr/>
      <object-dump :value="player | filterPlayer" :indent="0"></object-dump>
    </div>
  </div>
</template>

<script>
  import {player as playerResource, console as consoleResource} from '@/resource'
  import VerticalTab from '@/components/form/VerticalTab'
  import VerticalTabPane from '@/components/form/VerticalTabPane'
  import ObjectDump from '@/components/form/ObjectDump'

  const filterPlayerKey = ['isOp', 'isOnline', 'displayName']

  export default {
    components: {VerticalTab, VerticalTabPane, ObjectDump},
    props: ['server'],
    data() {
      return {
        players: [],
        playerIndex: '0'
      }
    },
    filters: {
      filterPlayer(value) {
        const player = {}
        Object.assign(player, value)
        filterPlayerKey.forEach(k => delete player[k])
        return player
      }
    },
    computed: {
      player() {
        return this.players[this.playerIndex] || {}
      }
    },
    methods: {
      getPlayers() {
        playerResource.index({
          server: this.server.name
        }).then(res => {
          this.players = res.data
        })
      },
      changeOp(op) {
//        console.log(consoleResource)
        consoleResource.create({
          server: this.server.name
        }, {
          command: (op ? 'op ' : 'deop ') + this.player.displayName
        }).then(() => {
          this.$message({
            type: 'success',
            message: (op ? 'op ' : 'deop ') + 'success on ' + this.player.displayName
          })
        })
      },
      autoRefresh() {
        this.getPlayers()
      }
    },
    activated() {
      this.getPlayers()
    }
  }
</script>

<style lang="stylus" scoped>
  .wrapper
    height 100%
    display flex
    flex-direction row

  .wrapper-left, .wrapper-right
    overflow scroll

  .wrapper-left
    width 240px

  .wrapper-right
    flex-grow 1

    .el-form-item
      width 49%
      margin 0
      padding-left 32px

</style>
