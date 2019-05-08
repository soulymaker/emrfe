<template>
  <div id="NavHeader" style="margin: 0">
    <Menu theme="dark" mode="horizontal" class="oj-menu">
      <div class="logo">病历系统</div>
      <template>
        <Dropdown class="drop-menu" @on-click="handleRoute" placement="bottom" trigger="click" id="userinfobtn">
          <Button type="text" class="drop-menu-title" id="usernamebtn"
                  style="background-color:#515a6e;color: #ffffff; border-color:#515a6e;">
            <span id="username">{{user.userId}}</span>
            <Icon type="ivu-icon ivu-icon-ios-arrow-down"></Icon>
          </Button>
          <Dropdown-menu slot="list">
            <Dropdown-item name="/logout">登出</Dropdown-item>
          </Dropdown-menu>
        </Dropdown>
      </template>
    </Menu>
  </div>
</template>
<script>
  import {mapActions, mapGetters} from 'vuex'

  export default {
    name: 'NavHeader',
    data () {
      const oldPasswordCheck = [{required: true, trigger: 'blur', min: 5, max: 20}]
      const CheckAgainPassword = (rule, value, callback) => {
        if (value !== this.formPassword.new_password) {
          callback(new Error('password does not match'))
        }
        callback()
      }
      const CheckNewPassword = (rule, value, callback) => {
        if (this.formPassword.old_password !== '') {
          if (this.formPassword.old_password === this.formPassword.new_password) {
            callback(new Error('The new password doesn\'t change'))
          } else {
            // 对第二个密码框再次验证
            this.$refs.formPassword.validateField('again_password')
          }
        }
        callback()
      }
      return {
        chModal: false,
        formPassword: {
          old_password: '',
          new_password: '',
          again_password: ''
        },
        rulePassword: {
          old_password: oldPasswordCheck,
          new_password: [
            {required: true, trigger: 'blur', min: 5, max: 20},
            {validator: CheckNewPassword, trigger: 'blur'}
          ],
          again_password: [
            {required: true, validator: CheckAgainPassword, trigger: 'change'}
          ],
        },
      }
    },
    mounted () {
    },
    methods: {
      handleRoute (route) {
        this.$router.push(route)
      },
      changePassword () {
        let data = Object.assign({}, this.formPassword)
        api.resetPassword(data).then(res => {
          this.$success(res.data.msg)
          this.$router.push({name: 'login'})
        }, res => {
        })
      },
    },
    computed: {
      ...mapGetters(['user', 'isAdminRole', 'isDoctorRole', 'isNurseRole', 'isPatientRole']),
    }
  }
</script>
<style lang="less" scoped>
  #header {
    min-width: 1100px;
    position: fixed !important;
    top: 0;
    left: 0;
    height: 60px;
    width: 100%;
    z-index: 1000;
    /*background-color: #fff;*/
    background: #515a6e;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }

  .logo {
    margin-left: 2%;
    margin-right: 2%;
    font-size: 20px;
    float: left;
    color: #ffffff;
    line-height: 60px;
  }

  .btn-menu {
    font-size: 16px;
    float: right;
    margin-right: 10px;
  }

  .drop-menu {
    float: right;
    margin-right: 40px;
    position: absolute;
    right: 25px;
  }

  .chp {
    float: right;
    margin-top: 15px;
    margin-right: 80px;
    position: absolute;
    right: 80px;
    background-color: #515a6e;
    border-color: #515a6e;
    color: #ffffff
  }

  .identify {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
    position: absolute;
    right: 30px;
  }

  .oj-menu {
    /*background-color: #ffffff;*/
    background: #515a6e;
  }

  #username {
    /*color: #515a6e;*/
    color: #ffffff;
    font-size: 16px;
  }

  #usernamebtn {
    margin-right: 10px;
    padding: 5px 0px 6px 15px;
  }
</style>
