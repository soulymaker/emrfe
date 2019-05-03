<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/user">用户管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addusermodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/>
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addusermodal">
      <Row>
        <Form :label-width="100" ref="userForm" v-model="form">
          <FormItem label="用户名" prop="userId">
            <Input placeholder="用户名" style="width:200px" v-model="form.userId"/>
          </FormItem>
          <FormItem label="密码" prop="password">
            <Input placeholder="密码" style="width:200px" v-model="form.password"/>
          </FormItem>
          <FormItem label="角色" prop="userType">
            <Select style="width:200px" v-model="form.userType">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updateusermodal">
      <Row>
        <Form :label-width="100" ref="updateuserForm" v-model="form">
          <FormItem label="用户名" prop="userId">
            <Input placeholder="用户名" style="width:200px" v-model="form.userId"/>
          </FormItem>
          <FormItem label="角色" prop="userType">
            <Select style="width:200px" v-model="form.userType">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Table :columns="TableColumns" :data="List" :loading="false"></Table>
    <Pagination :current.sync="query.page" :page-size="limit" :total="total" @on-change="pushRouter"/>
  </col>
</template>
<script>
  import api from '@/api/api'
  import utils from '@/util/utils'
  import Pagination from '@/components/Pagination'

  export default {
    name: 'user',
    components: {
      Pagination
    },
    data() {
      return {
        addusermodal: false,
        updateusermodal: false,
        TableColumns: [
          {
            title: '序号',
            key: 'id',
            sortable: true
          },
          {
            title: '用户名',
            key: 'userId',
            sortable: true
          },
          {
            title: '角色',
            key: 'userType',
            sortable: true,
            render: (h, params) => {
              let t = params.row.userType;
              let color = '';
              if (t === '管理员') {
                color = 'green'
              } else if (t === '医生') {
                color = 'blue'
              } else if (t === '护士') {
                color = 'volcano'
              } else {
                color = 'pink'
              }
              return h('Tag', {
                props: {
                  color: color,
                }
              }, t)
            }
          },
          {
            title: '操作',
            key: 'option',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.form = params.row;
                      this.updateusermodal = true;
                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.delete(params.row);
                    }
                  }
                }, '删除')
              ])
            }
          }
        ],
        List: [],
        loadings: {
          table: true
        },
        form: {
          id: null,
          userId: '',
          password: '',
          userType: ''
        },
        options: [
          {value: '管理员', label: '管理员'},
          {value: '医生', label: '医生'},
          {value: '护士', label: '护士'},
          {value: '患者', label: '患者'}
        ],
        routeName: '',
        limit: 10,
        total: 0,
        query: {
          page: 1
        },
      }
    },
    mounted() {
      this.init()
    },
    methods: {
      init() {
        this.routeName = this.$route.name;
        let query = this.$route.query;
        this.query.page = query.page || '';
        this.getlist()
      },
      pushRouter() {
        this.$router.push({
          path: 'user',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryUser(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.total = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addUser(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateUser(data).then(res => {
          if (res.data.err == null) {
            this.$success('修改成功');
            this.getlist()
          } else {
            this.$error('修改失败')
          }
        })
      },
      delete(data) {
        api.deleteUser(data).then(res => {
          if (res.data.err === null) {
            this.$success('删除成功');
            this.getlist()
          } else {
            this.$error('删除失败')
          }
        })
      },
      addcancel() {
        this.form = {
          id: null,
          userId: '',
          password: '',
          userType: ''
        }
      },
      addclose() {
      },
    },
    watch: {
      '$route'(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.init(true)
        }
      }
    }
  }
</script>
