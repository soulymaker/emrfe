<template>
  <div class="page-main-content">
    <div id="NavHeader">
      <Menu class="oj-menu" mode="horizontal" theme="light">
        <div class="logo">病历系统</div>
      </Menu>
    </div>
    <div class="main-container">
      <div class="content-wrap account" style="margin-top: 200px;">
        <div class="set_cover">
          <div class="bg_cover" style="width: 100%; height: 100%;background-size: cover"></div>
        </div>
        <div class="login_bg">
          <div class="ele_cover"></div>
          <form :model="loginform" :rules="rule" ref="form">
            <div class="login_box">
              <div class="content">
                <div class="error_msg">
                </div>
                <div class="line">
                  <input class="input_text" name="" placeholder="请输入账号" type="text" v-model="loginform.userId"
                         value="">
                </div>
                <div class="line" style="margin-top: 20px">
                  <input class="input_text" name="" placeholder="请输入密码" type="password" v-model="loginform.password"
                         value="" @submit="handleLogin">
                </div>
                <div class="btn_wrap" id="loginSubmit" style="margin-top: 20px">
                  <a @click="handleLogin" class="btn_green37">登录</a>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import api from '@/api/api'
  import {mapActions} from 'vuex'
  import '@/assets/css/login_7a7fb90.css'
  import '@/assets/css/theme_c63f218.css'

  export default {
    name: 'Login',
    data () {
      return {
        logining: false,
        loginform: {
          userId: '',
          password: '',
        },
        rule: {
          userId: [
            {required: true, trigger: 'blur'}
          ],
          password: [
            {required: true, trigger: 'blur'}
          ]
        },
      }
    },
    methods: {
      ...mapActions(['getProfile']),
      handleLogin () {
        this.logining = true;
        let data={
          userId:this.loginform.userId,
          password:this.loginform.password
        };
        api.login(data).then(res => {
          if(res.data.msg==="success"){
            this.getProfile();
            this.$success('登录成功');
            this.$router.push({name: 'user'})
          }
        }, res => {
        })
      },
      handleRoute (route) {
        this.$router.push(route)
      }
    }
  }
</script>
<style lang="less" scoped>
  body {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    background-color: #324157;
  }

  #header {
    min-width: 1100px;
    position: fixed !important;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 1000;
    background-color: #fff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }

  .logo {
    margin-left: 2%;
    margin-right: 2%;
    font-size: 20px;
    float: left;
    line-height: 60px;
  }

  .btn-menu {
    font-size: 16px;
    float: right;
    margin-right: 10px;
  }

  .drop-menu {
    float: right;
    margin-right: 10px;
    position: absolute;
    right: 10px;
  }

  .identify {
    float: right;
    margin-right: 40px;
    position: absolute;
    right: 10px;
  }

  .oj-menu {
    background: #ffffff;
  }

  #username {
    font-size: 16px;
  }

  #usernamebtn {
    margin-right: 10px;
    padding: 5px 0px 6px 10px;
  }
</style>
