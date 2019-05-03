<template>
  <Col>
    <Row>
      <Col align="left" span="12">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/hospital">医院管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="12" style="margin-top: 10px">
        <Button @click="addhospitalmodal = true" class="icon" size="large" type="primary">
          <Icon type="md-add"/> &nbsp;&nbsp;
          添加
        </Button>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addhospitalmodal">
      <Row>
        <Form :label-width="100" ref="updateHospitalForm" v-model="form">
          <FormItem label="医院名称" prop="hospitalName">
            <Input placeholder="" style="width:200px" v-model="form.hospitalName"/>
          </FormItem>
          <FormItem label="医院编码" prop="code">
            <Input placeholder="" style="width:200px" v-model="form.code"/>
          </FormItem>
          <FormItem label="医院等级" prop="level">
            <Input placeholder="" style="width:200px" v-model="form.level"/>
          </FormItem>
          <FormItem label="医院电话" prop="telephone">
            <Input placeholder="" style="width:200px" v-model="form.telephone"/>
          </FormItem>
          <FormItem label="医院地址" prop="address">
            <Input placeholder="" style="width:200px" v-model="form.address"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatehospitalmodal">
      <Row>
        <FormItem label="医院名称" prop="hospitalName">
          <Input placeholder="" style="width:200px" v-model="form.hospitalName"/>
        </FormItem>
        <FormItem label="医院编码" prop="code">
          <Input placeholder="" style="width:200px" v-model="form.code"/>
        </FormItem>
        <FormItem label="医院等级" prop="level">
          <Input placeholder="" style="width:200px" v-model="form.level"/>
        </FormItem>
        <FormItem label="医院电话" prop="telephone">
          <Input placeholder="" style="width:200px" v-model="form.telephone"/>
        </FormItem>
        <FormItem label="医院地址" prop="address">
          <Input placeholder="" style="width:200px" v-model="form.address"/>
        </FormItem>
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
    name: 'hospital',
    components: {
      Pagination
    },
    data() {
      return {
        addhospitalmodal: false,
        updatehospitalmodal: false,
        TableColumns: [
          {title: '序号', key: 'id', sortable: true,},
          {title: '医院编码', key: 'code', sortable: true,},
          {title: '医院名称', key: 'hospitalName', sortable: true,},
          {title: '医院级别', key: 'level', sortable: true,},
          {title: '医院联系电话', key: 'telephone', sortable: true,},
          {title: '医院地址', key: 'address', sortable: true,},
          {
            title: '最后更新时间', key: 'lastchangedTime', sortable: true, render: function (h, params) {
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
                      this.updatehospitalmodal = true;
                      this.form.id = params.row.id;
                      this.form.hospitalname = params.row.hospitalname;
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
          code: '',
          hospitalName: '',
          level: '',
          telephone: '',
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
          path: 'hospital',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryHospital(this.query).then(res => {
          this.loadings.table = false;
          this.List = res.data.data;
          this.limit = this.List.length;
        }, res => {
          this.loadings.table = false
        })
      },
      addok() {
        let data = this.form;
        api.addHospital(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updateHospital(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteHospital(data).then(res => {
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
          hospitalname: '',
          nickname: '',
          role_name: ''
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
