<template>
  <div class="login-container">
    <el-form :model="model" :rules="rule" ref="form">
      <h3 class="title">Minecraft Manager</h3>
      <el-form-item prop="server">
        <el-input type="url" v-model="model.server" auto-complete="off" placeholder="Server"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" v-model="model.name" auto-complete="off" placeholder="Name" :disabled="!model.useAuth"></el-input>
      </el-form-item>
      <el-form-item prop="pwd">
        <el-input type="password" v-model="model.pwd" auto-complete="off" placeholder="Password" :disabled="!model.useAuth"></el-input>
      </el-form-item>
      <el-form-item label="Use Authorization">
        <el-checkbox v-model="model.useAuth"></el-checkbox>
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
          server: this.$store.state.server,
          name: this.$store.state.auth.name,
          pwd: this.$store.state.auth.pwd,
          useAuth: this.$store.state.auth.enabled
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
          return this.$http.get(this.model.server + '/api/', {
            headers: this.model.useAuth && {
              'Authorization': 'Basic ' + btoa(this.model.name + ':' + this.model.pwd)
            } || {}
          }).then(() => {
            this.$store.commit('updateServer', this.model.server)
            this.$store.commit('updateAuth', {
              name: this.model.name,
              pwd: this.model.pwd,
              enabled: this.model.useAuth
            })

            this.logining = true
            this.$router.push('/server')
          }).catch(res => {
            switch (res.status) {
              case 401:
                if (this.model.useAuth) {
                  this.$message.error('name or password wrong')
                } else {
                  this.$message.error('please enable authorization')
                }
                break
              default:
                this.$message.error('server cannot acceptable')
            }
            this.logining = false
          })
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
