<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/testRecord">检查记录管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addtestRecordmodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addtestRecordmodal">
      <Row>
        <Form :label-width="100" ref="testRecordForm" v-model="form">
          <FormItem label="检查名称" prop="testName"><Input placeholder="" style="width:200px" v-model="form.testName"/>
          </FormItem>
          <FormItem label="所在科室" prop="department"><Input placeholder="" style="width:200px" v-model="form.department"/>
          </FormItem>
          <FormItem label="患者uid" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="状态" prop="status"><Input placeholder="" style="width:200px" v-model="form.status"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatetestRecordmodal">
      <Row>
        <Form :label-width="100" ref="updatetestRecordForm" v-model="form">
          <FormItem label="检查名称" prop="testName"><Input placeholder="" style="width:200px" v-model="form.testName"/>
          </FormItem>
          <FormItem label="所在科室" prop="department"><Input placeholder="" style="width:200px" v-model="form.department"/>
          </FormItem>
          <FormItem label="患者uid" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="状态" prop="status"><Input placeholder="" style="width:200px" v-model="form.status"/>
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
    name: 'testRecord',
    components: {
      Pagination
    },
    data() {
      return {
        addtestRecordmodal: false,
        updatetestRecordmodal: false,
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
            title: '所在科室',
            key: 'department',
            sortable: true
          },
          {
            title: '患者uid',
            key: 'uid',
            sortable: true
          },
          {
            title: '状态',
            key: 'status',
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
                      this.updatetestRecordmodal = true;
                      this.form.id = params.row.id;
                      this.form.testRecordname = params.row.testRecordname;
                      this.form.nickname = params.row.nickname;
                      this.form.role_name = params.row.role_name;
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
          department: '',
          uid: '',
          status: '',
          lastchangedTime: ''
        },
        routeName: '',
        limit: 10,
        total: 0,
        cid: 1,
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
          path: 'testRecord',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryTestRecord(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addTestRecord(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateTestRecord(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteTestRecord(data).then(res => {
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
          department: '',
          uid: '',
          status: '',
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
