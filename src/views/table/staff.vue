<template>
  <Col>
    <Row>
      <Col align="left" span="6">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/staff">员工管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="18" style="margin-top: 10px">
        <Form v-model="form">
          <Input placeholder="工号" style="width:100px" v-model="form.jobNumber"/>
          <Input placeholder="姓名" style="width:100px" v-model="form.staffName"/>
          <Button @click="qt" icon="ios-search" shape="circle" size="large" type="primary">
            查询
          </Button>
          <Button @click="addcancel" icon="ios-search" shape="circle" size="large" type="primary">
            清除查询
          </Button>
          <Button @click="addstaffmodal = true" class="icon" size="large" type="primary">
            <Icon type="md-add"/> &nbsp;&nbsp;
            添加
          </Button>
        </Form>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addstaffmodal">
      <Row>
        <Form :label-width="100" ref="staffForm" v-model="form">
          <FormItem label="工号" prop="jobNumber"><Input placeholder="" style="width:200px" v-model="form.jobNumber"/>
          </FormItem>
          <FormItem label="姓名" prop="staffName"><Input placeholder="" style="width:200px" v-model="form.staffName"/>
          </FormItem>
          <FormItem label="类别" prop="type"><Input placeholder="" style="width:200px" v-model="form.type"/></FormItem>
          <FormItem label="工作职级" prop="grade"><Input placeholder="" style="width:200px" v-model="form.grade"/>
          </FormItem>
          <FormItem label="所属医院" prop="hospital"><Input placeholder="" style="width:200px" v-model="form.hospital"/>
          </FormItem>
          <FormItem label="所属科室" prop="departmentName"><Input placeholder="" style="width:200px"
                                                              v-model="form.departmentName"/></FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatestaffmodal">
      <Row>
        <Form :label-width="100" ref="staffForm" v-model="form">
          <FormItem label="工号" prop="jobNumber"><Input placeholder="" style="width:200px" v-model="form.jobNumber"/>
          </FormItem>
          <FormItem label="姓名" prop="staffName"><Input placeholder="" style="width:200px" v-model="form.staffName"/>
          </FormItem>
          <FormItem label="类别" prop="type"><Input placeholder="" style="width:200px" v-model="form.type"/></FormItem>
          <FormItem label="工作职级" prop="grade"><Input placeholder="" style="width:200px" v-model="form.grade"/>
          </FormItem>
          <FormItem label="所属医院" prop="hospital"><Input placeholder="" style="width:200px" v-model="form.hospital"/>
          </FormItem>
          <FormItem label="所属科室" prop="departmentName"><Input placeholder="" style="width:200px"
                                                              v-model="form.departmentName"/></FormItem>
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
    name: 'staff',
    components: {
      Pagination
    },
    data() {
      return {
        addstaffmodal: false,
        updatestaffmodal: false,
        TableColumns: [
          {title: 'id', key: 'id', sortable: true},
          {title: '工号', key: 'jobNumber', sortable: true},
          {title: '姓名', key: 'staffName', sortable: true},
          {title: '类别', key: 'type', sortable: true},
          {title: '工作职级', key: 'grade', sortable: true},
          {title: '所属医院', key: 'hospital', sortable: true},
          {title: '所属科室', key: 'departmentName', sortable: true},
          {
            title: '最后更新时间', key: 'lastchangedTime', sortable: true,
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
                      this.updatestaffmodal = true;
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
          jobNumber: '',
          staffName: '',
          type: '',  // 医生 护士 护工 未登记
          grade: '',
          hospital: '',
          departmentName: '',
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
          path: 'staff',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryStaff(this.query).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      qt() {
        let t = utils.filterEmptyValue(this.form);
        api.queryStaff(t).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      addok() {
        let data = this.form;
        api.addStaff(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateStaff(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteStaff(data).then(res => {
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
          jobNumber: '',
          staffName: '',
          type: '',  // 医生 护士 护工 未登记
          grade: '',
          hospital: '',
          departmentName: '',
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
