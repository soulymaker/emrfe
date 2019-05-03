<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/treatmentRecord">治疗方案使用记录</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addtreatmentRecordmodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addtreatmentRecordmodal">
      <Row>
        <Form :label-width="100" ref="treatmentRecordForm" v-model="form">
          <FormItem label="患者uid" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="治疗名称" prop="treatmentName"><Input placeholder="" style="width:200px"
                                                             v-model="form.treatmentName"/></FormItem>
          <FormItem label="治疗医生" prop="doctor"><Input placeholder="" style="width:200px" v-model="form.doctor"/>
          </FormItem>
          <FormItem label="状态" prop="status"><Input placeholder="" style="width:200px" v-model="form.status"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改"
           v-model="updatetreatmentRecordmodal">
      <Row>
        <Form :label-width="100" ref="updatetreatmentRecordForm" v-model="form">
          <FormItem label="患者uid" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="治疗名称" prop="treatmentName"><Input placeholder="" style="width:200px"
                                                             v-model="form.treatmentName"/></FormItem>
          <FormItem label="治疗医生" prop="doctor"><Input placeholder="" style="width:200px" v-model="form.doctor"/>
          </FormItem>
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
    name: 'treatmentRecord',
    components: {
      Pagination
    },
    data() {
      return {
        addtreatmentRecordmodal: false,
        updatetreatmentRecordmodal: false,
        TableColumns: [
          {
            title: 'id',
            key: 'id',
            sortable: true
          },
          {
            title: '患者uid',
            key: 'uid',
            sortable: true
          },
          {
            title: '治疗名称',
            key: 'treatmentName',
            sortable: true
          },
          {
            title: '治疗医生',
            key: 'doctor',
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
                      this.updatetreatmentRecordmodal = true;
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
          uid: '',
          treatmentName: '',
          doctor: '',
          status: ''
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
          path: 'treatmentRecord',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryTreatmentRecord(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addTreatmentRecord(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateTreatmentRecord(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteTreatmentRecord(data).then(res => {
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
          uid: '',
          treatmentName: '',
          doctor: '',
          status: ''
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
