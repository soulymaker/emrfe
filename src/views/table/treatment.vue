<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/treatment">治疗方案</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addtreatmentmodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addtreatmentmodal">
      <Row>
        <Form :label-width="100" ref="treatmentForm" v-model="form">
          <FormItem label="治疗名称" prop="treatmentName">
            <Input placeholder="" style="width:200px" v-model="form.treatmentName"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatetreatmentmodal">
      <Row>
        <Form :label-width="100" ref="updatetreatmentForm" v-model="form">
          <FormItem label="治疗名称" prop="treatmentName">
            <Input placeholder="" style="width:200px" v-model="form.treatmentName"/>
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
    name: 'treatment',
    components: {
      Pagination
    },
    data() {
      return {
        addtreatmentmodal: false,
        updatetreatmentmodal: false,
        TableColumns: [
          {
            title: 'id',
            key: 'id',
            sortable: true
          },
          {
            title: '治疗名称',
            key: 'treatmentName',
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
                      this.updatetreatmentmodal = true;
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
          treatmentName: ''
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
          path: 'treatment',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryTreatment(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addTreatment(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateTreatment(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteTreatment(data).then(res => {
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
          treatmentName: ''
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
