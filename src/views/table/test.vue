<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/test">检查管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addtestmodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addtestmodal">
      <Row>
        <Form :label-width="100" ref="testForm" v-model="form">
          <FormItem label="检查名称" prop="testName">
            <Input placeholder="" style="width:200px" v-model="form.testName"/>
          </FormItem>
          <FormItem label="所属科室" prop="department">
            <Input placeholder="" style="width:200px" v-model="form.department"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatetestmodal">
      <Row>
        <Form :label-width="100" ref="updatetestForm" v-model="form">
          <FormItem label="检查名称" prop="testName">
            <Input placeholder="" style="width:200px" v-model="form.testName"/>
          </FormItem>
          <FormItem label="所属科室" prop="department">
            <Input placeholder="" style="width:200px" v-model="form.department"/>
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
    name: 'test',
    components: {
      Pagination
    },
    data() {
      return {
        addtestmodal: false,
        updatetestmodal: false,
        TableColumns: [
          {
            title: 'id',
            key: 'id',
            sortable: true
          },
          {
            title: '检查名称',
            key: 'testName',
            sortable: true
          },
          {
            title: '所属科室',
            key: 'department',
            sortable: true
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
                      this.updatetestmodal = true;
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
          testName: '',
          department: ''
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
          path: 'test',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryTest(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addTest(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateTest(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteTest(data).then(res => {
          if (res.data.err != null) {
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
          testName: '',
          department: ''
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
