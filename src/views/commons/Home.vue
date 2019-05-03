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
              <Submenu name="1" >
                <!--<Submenu name="1">-->
                <template slot="title">
                  <Icon type="md-cog"/>
                  信息查看
                </template>
                <MenuItem name="/user" >用户管理</MenuItem>
                <MenuItem name="/department" >科室管理</MenuItem>
                <MenuItem name="/disease" >疾病管理</MenuItem>
                <MenuItem name="/hospital" >医院管理</MenuItem>
                <MenuItem name="/patient" >病人管理</MenuItem>
                <MenuItem name="/record" >记录管理</MenuItem>
                <MenuItem name="/staff" >员工管理</MenuItem>
                <MenuItem name="/test" >检查方案</MenuItem>
                <MenuItem name="/testRecord" >检查方案使用记录</MenuItem>
                <MenuItem name="/treatment" >治疗方案</MenuItem>
                <MenuItem name="/treatmentRecord" >治疗方案使用记录</MenuItem>
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
  import api from '@/api/api'
  import {mapGetters} from 'vuex'
  import Vue from 'Vue'

  export default {
    name: 'home',
    data () {
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
    // beforeRouteEnter (to, from, next) {
    //   api.getUserInfo().then(res => {
    //     next(vm => {
    //       vm.$store.commit('SET_USER', res.data.user)
    //     })
    //   }, res => {
    //     console.log('用户未登录');
    //     next({name: 'login'})
    //   })
    // },
    methods: {
      handleRoute (route) {
        this.$router.push(route)
      }
    },
    computed: {
      ...mapGetters(['user', 'isAdminRole']),
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
