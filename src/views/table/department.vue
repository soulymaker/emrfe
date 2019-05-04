<template>
  <Col>
    <Row>
      <Col align="left" span="6">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/department">科室管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="18" style="margin-top: 10px">
        <Form v-model="form">
          <Input placeholder="科室名称" style="width:100px" v-model="form.departmentName"/>
          <Input placeholder="科室编码" style="width:100px" v-model="form.code"/>
          <Input placeholder="所属医院" style="width:100px" v-model="form.hospitalName"/>
          <Input placeholder="科室地址" style="width:100px" v-model="form.address"/>
          <Button @click="qt" icon="ios-search" shape="circle" size="large" type="primary">
            查询
          </Button>
          <Button @click="addcancel" icon="ios-search" shape="circle" size="large" type="primary">
            清除查询
          </Button>
          <Button @click="adddepartmentmodal = true" class="icon" size="large" type="primary">
            <Icon type="md-add"/> &nbsp;&nbsp;
            添加
          </Button>
        </Form>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="adddepartmentmodal">
      <Row>
        <Form :label-width="100" ref="departmentForm" v-model="form">
          <FormItem label="科室名称" prop="departmentName">
            <Input placeholder="" style="width:200px" v-model="form.departmentName"/>
          </FormItem>
          <FormItem label="科室编码" prop="code">
            <Input placeholder="" style="width:200px" v-model="form.code"/>
          </FormItem>
          <FormItem label="所属医院" prop="hospitalName">
            <Input placeholder="" style="width:200px" v-model="form.hospitalName"/>
          </FormItem>
          <FormItem label="科室地址" prop="address">
            <Input placeholder="" style="width:200px" v-model="form.address"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatedepartmentmodal">
      <Row>
        <Form :label-width="100" ref="updatedepartmentForm" v-model="form">
          <FormItem label="科室名称" prop="departmentName">
            <Input placeholder="" style="width:200px" v-model="form.departmentName"/>
          </FormItem>
          <FormItem label="科室编码" prop="code">
            <Input placeholder="" style="width:200px" v-model="form.code"/>
          </FormItem>
          <FormItem label="所属医院" prop="hospitalName">
            <Input placeholder="" style="width:200px" v-model="form.hospitalName"/>
          </FormItem>
          <FormItem label="科室地址" prop="address">
            <Input placeholder="" style="width:200px" v-model="form.address"/>
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
  import {formatDate} from '@/util/date.js'

  export default {
    name: 'department',
    components: {
      Pagination
    },
    data() {
      return {
        adddepartmentmodal: false,
        updatedepartmentmodal: false,
        TableColumns: [
          {
            title: 'id',
            key: 'id',
            sortable: true
          },
          {
            title: '科室名称',
            key: 'departmentName',
            sortable: true
          },
          {
            title: '科室编码',
            key: 'code',
            sortable: true
          },
          {
            title: '所属医院',
            key: 'hospitalName',
            sortable: true
          },
          {
            title: '科室地址',
            key: 'address',
            sortable: true
          },
          {
            title: '最后更新时间',
            key: 'lastchangedTime',
            sortable: true,
            render: function (h, params) {
              return h('div', formatDate(new Date(params.row.lastchangedTime), 'yyyy-MM-dd hh:mm:ss'))
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
                      this.updatedepartmentmodal = true;
                      this.form = params.row;
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
          departmentName: '',
          code: '',
          hospitalName: '',
          address: '',
          lastchangedTime: ''
        },
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
          path: 'department',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryDepartment(this.query).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      qt() {
        let t = utils.filterEmptyValue(this.form);
        api.queryDepartment(t).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      addok() {
        let data = this.form;
        api.addDepartment(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateDepartment(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteDepartment(data).then(res => {
          if (res.data.err === null) {
            this.$success('删除成功');
            this.getlist()
          } else {
            this.$error('删除失败')
          }
        })
      },
      addcancel() {
        this.getlist();
        this.form = {
          id: null,
          departmentName: '',
          code: '',
          hospitalName: '',
          address: '',
          lastchangedTime: ''
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
