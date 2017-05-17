<template>
  <el-form :rules="rules" labelWidth="120px">
    <el-form-item label="javaXms">
      <el-input v-model="option.javaXms" size="small">
      </el-input>
    </el-form-item>
    <el-form-item label="javaXmx">
      <el-input v-model="option.javaXmx" size="small">
      </el-input>
    </el-form-item>
    <el-form-item label="Gamemode">
      <el-radio-group v-model="option.properties.gamemode" size="small">
        <el-radio-button v-for="(item, index) in present.gamemode" :label="index" key="gamemode">{{item}}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="Difficulty">
      <el-radio-group v-model="option.properties.difficulty" size="small">
        <el-radio-button v-for="(item, index) in present.difficulty" :label="index" key="gamemode">{{item}}</el-radio-button>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="PVP">
      <el-switch v-model="option.properties.pvp" size="small"></el-switch>
    </el-form-item>
    <el-form-item label="Max Players">
      <el-slider v-model="option.properties['max-players']" :min="1" :max="20" showInput=""></el-slider>
    </el-form-item>
    <el-form-item label="Seed">
      <el-input type="number" v-model="option.properties['level-seed']" size="small"></el-input>
    </el-form-item>
    <el-form-item label="Server Port">
      <el-input type="number" v-model="option.properties['server-port']" size="small"></el-input>
    </el-form-item>
    <el-form-item label="Enable Command Block">
      <el-switch v-model="option.properties['enable-command-block']"></el-switch>
    </el-form-item>
    <el-form-item label="View Distance">
      <el-slider v-model="option.properties['view-distance']" :min="3" :max="16" showInput></el-slider>
    </el-form-item>
    <el-form-item label="Online Mode">
      <el-switch v-model="option.properties['online-mode']"></el-switch>
    </el-form-item>
  </el-form>
</template>

<script>
  export default {
    data() {
      return {
        rules: {
          gamemode: {
            type: 'enum',
            'enum': [0, 1, 2, 3]
          },
          difficulty: {
            type: 'enum',
            enum: [0, 1, 2, 3]
          }
//          pvp: {
//            type: 'boolean'
//          },
        },
        present: {
          gamemode: ['生存模式', '创造模式', '冒险模式', '旁观者模式'],
          difficulty: ['和平', '简单', '中等', '困难'],
          'view-distance': 10,
          'white-list': false,
          'online-mode': false,
          'level-seed': '',
          motd: 'A Minecraft Server'
        }
      }
    },
    props: ['option']
  }
</script>

<style lang="stylus">

</style>
