<template>
  <div class="login-container">
    <el-form :model="model" :rules="rule" ref="form">
      <h3 class="title">Minecraft Manager</h3>
      <el-form-item prop="server">
        <el-input type="url" v-model="model.server" auto-complete="off" placeholder="Server"></el-input>
      </el-form-item>
      <el-form-item prop="user">
        <el-input type="text" v-model="model.user" auto-complete="off" placeholder="User" disabled="true"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input type="password" v-model="model.pwd" auto-complete="off" placeholder="Password" disabled="true"></el-input>
      </el-form-item>
      <el-form-item style="width:100%;">
        <el-button type="primary" style="width:100%;" @click.native.prevent="handleSubmit" :loading="logining">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        model: {
          server: localStorage.getItem('server') || '',
          // not support follow
          user: '',
          pwd: ''
        },
        rule: {
          server: {
            required: true,
            type: 'url',
            message: 'server url is invalid'
          },
          user: {
            validator(rule, value, cb) {
              cb()
            }
          },
          pwd: {}
        },
        logining: false
      }
    },
    methods: {
      handleSubmit() {
        this.logining = true
        this.$refs.form.validate(valid => {
          if (!valid) {
            this.logining = false
            return
          }
          localStorage.setItem('server', this.model.server)
          this.$store.commit('updateServer', this.model.server)

          // TODO: check server is valid
          this.logining = true
          this.$router.push('/server')
        })
      }
    }
  }
</script>

<style lang="stylus">
  .login-container
    margin 120px auto
    width 500px
    box-shadow  0 0 5px grey
    border-radius 20px
    padding 20px
    .title
      text-align center
</style>
