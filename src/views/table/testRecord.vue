<template>
  <Col>
    <Row>
      <Col align="left" span="6">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/testRecord">检查记录管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="18" style="margin-top: 10px">
        <Form v-model="form">
          <Input placeholder="检查名称" style="width:100px" v-model="form.testName"/>
          <Input placeholder="所在科室" style="width:100px" v-model="form.department"/>
          <Input placeholder="患者uid" style="width:100px" v-model="form.uid"/>
          <Input placeholder="状态" style="width:100px" v-model="form.status"/>
          <Button @click="qt" icon="ios-search" shape="circle" size="large" type="primary">
            查询
          </Button>
          <Button @click="addcancel" icon="ios-search" shape="circle" size="large" type="primary">
            清除查询
          </Button>
          <Button @click="addtestRecordmodal = true" class="icon" size="large" type="primary">
            <Icon type="md-add"/> &nbsp;&nbsp;
            添加
          </Button>
        </Form>
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
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      qt() {
        let t = utils.filterEmptyValue(this.form);
        api.queryTestRecord(t).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },

      addok() {
        let data = this.form;
        api.addTestRecord(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        })
      },
      update() {
        let data = this.form;
        api.updateTestRecord(data).then(res => {
          if (res.data.err === null) {
            this.$success('修改成功');
            this.getlist()
          }
          if (res.data.err !== null) {
            this.$error(res.data.err)
          }
        })
      },
      delete(data) {
        api.deleteTestRecord(data).then(res => {
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
          testName: '',
          department: '',
          uid: '',
          status: '',
          lastchangedTime: ''
        }
      },
      addclose() {
        this.form = {
          id: null,
          testName: '',
          department: '',
          uid: '',
          status: '',
          lastchangedTime: ''
        }
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
