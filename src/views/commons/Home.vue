<template>
  <div>
    <Row>
      <NavHeader></NavHeader>
    </Row>
    <Row>
      <div class="layout">
        <Layout>
          <Sider :collapsed-width="0" :style="{maxHeight: '800px',overflowY:'visible'}" collapsible
                 v-model="isCollapsed">
            <Menu :class="menuitemClasses" :open-names="['1']" :theme="theme2" @on-select="handleRoute"
                  width="auto">
              <Submenu name="1">
                <!--<Submenu name="1">-->
                <template slot="title">
                  <Icon type="md-cog"/>
                  信息查看
                </template>
                <MenuItem name="/user" v-if="isAdminRole">用户管理</MenuItem>
                <MenuItem name="/department" v-if="isAdminRole">科室管理</MenuItem>
                <MenuItem name="/disease" v-if="isAdminRole||isPatientRole">疾病管理</MenuItem>
                <MenuItem name="/hospital" v-if="isAdminRole">医院管理</MenuItem>
                <MenuItem name="/patient" v-if="isAdminRole||isPatientRole">病人管理</MenuItem>
                <MenuItem name="/record" v-if="isAdminRole||isPatientRole">记录管理</MenuItem>
                <MenuItem name="/staff" v-if="isAdminRole||isAdminRole">员工管理</MenuItem>
                <MenuItem name="/test" v-if="isAdminRole||isDoctorRole">检查方案</MenuItem>
                <MenuItem name="/testRecord" v-if="isAdminRole||isDoctorRole">检查方案使用记录</MenuItem>
                <MenuItem name="/treatment" v-if="isAdminRole||isDoctorRole">治疗方案</MenuItem>
                <MenuItem name="/treatmentRecord" v-if="isAdminRole||isDoctorRole">治疗方案使用记录</MenuItem>
              </Submenu>
            </Menu>
          </Sider>
          <Layout style="margin-left: 30px;height: 800px">
            <transition mode="out-in" name="fade">
              <router-view></router-view>
            </transition>
          </Layout>
        </Layout>
      </div>
    </Row>
  </div>
</template>
<script>
  import NavHeader from '../../components/NavHeader'
  import {mapGetters} from 'vuex'
  import storage from "../../util/storage";

  export default {
    name: 'home',
    data() {
      return {
        isCollapsed: false,
        style: {
          'width': '200px', 'height': '660px'
        },
        menus: '',
        theme2: 'dark'
      }
    },
    components: {
      NavHeader,
    },
    mounted(){
      console.log('this.$store.state.user.user.userType:'+this.$store.state.user.user.userType);
      let t = storage.get(this.$store.state.user.user.userId);
      console.log('===>t:\n' + t);
      if (t === null) {
        console.log('用户未登录');
        this.$router.push({name: 'login'});
      } else {
        if (this.$store.state.user.user.userType === '患者') {
          this.$router.push({path: '/patient'})
        } else if (this.$store.state.user.user.userType === '管理员') {
          this.$router.push({path: '/user'})
        } else if (this.$store.state.user.user.userType === '医生') {
          this.$router.push({path: '/test'})
        }
      }
    },
    methods: {
      handleRoute(route) {
        this.$router.push(route)
      }
    },
    computed: {
      ...mapGetters(['user', 'isAdminRole','isDoctorRole','isNurseRole','isPatientRole']),
      menuitemClasses: function () {
        return [
          'menu-item',
          this.isCollapsed ? 'collapsed-menu' : ''
        ]
      }
    },
  }

</script>
<style>
  body {
    margin: 0;
    padding: 0;
    font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
    font-size: 14px;
    -webkit-font-smoothing: antialiased;
    background-color: #ffffff;
  }

  .title {
    font-size: 18px;
    line-height: 30px;
    padding: 10px 5px 10px 15px;
  }

  .menu-item span {
    display: inline-block;
    overflow: hidden;
    width: 69px;
    text-overflow: ellipsis;
    white-space: nowrap;
    vertical-align: bottom;
    transition: width .2s ease .2s;
  }

  .menu-item i {
    transform: translateX(0px);
    transition: font-size .2s ease, transform .2s ease;
    vertical-align: middle;
    font-size: 16px;
  }

  .collapsed-menu span {
    width: 0px;
    transition: width .2s ease;
  }

  .collapsed-menu i {
    transform: translateX(5px);
    transition: font-size .2s ease .2s, transform .2s ease .2s;
    vertical-align: middle;
    font-size: 22px;
  }
</style>
