<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/disease">疾病管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="adddiseasemodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="adddiseasemodal">
      <Row>
        <Form :label-width="100" ref="diseaseForm" v-model="form">
          <FormItem label="icd编码" prop="icdCode">
            <Input placeholder="" style="width:200px" v-model="form.icdCode"/>
          </FormItem>
          <FormItem label="疾病名称" prop="diseaseName">
            <Input placeholder="" style="width:200px" v-model="form.diseaseName"/>
          </FormItem>
          <FormItem label="助记码" prop="code">
            <Input placeholder="" style="width:200px" v-model="form.code"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatediseasemodal">
      <Row>
        <Form :label-width="100" ref="diseaseForm" v-model="form">
          <FormItem label="icd编码" prop="icdCode">
            <Input placeholder="" style="width:200px" v-model="form.icdCode"/>
          </FormItem>
          <FormItem label="疾病名称" prop="diseaseName">
            <Input placeholder="" style="width:200px" v-model="form.diseaseName"/>
          </FormItem>
          <FormItem label="助记码" prop="code">
            <Input placeholder="" style="width:200px" v-model="form.code"/>
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
    name: 'disease',
    components: {
      Pagination
    },
    data() {
      return {
        adddiseasemodal: false,
        updatediseasemodal: false,
        TableColumns: [
          {
            title: 'id',
            key: 'id',
            sortable: true
          },
          {
            title: 'icd编码',
            key: 'icdCode',
            sortable: true
          },
          {
            title: '疾病名称',
            key: 'diseaseName',
            sortable: true,
          },
          {
            title: '助记码',
            key: 'code',
            sortable: true,
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
                      this.updatediseasemodal = true;
                      this.form = params.row
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
          icdCode: '',
          diseaseName: '',
          code: ''
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
          path: 'disease',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryDisease(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addDisease(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateDisease(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteDisease(data).then(res => {
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
          icdCode: '',
          diseaseName: '',
          code: ''
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
