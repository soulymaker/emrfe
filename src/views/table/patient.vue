<template>
  <Col>
    <Row>
      <Col align="left" span="6">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/patient">患者管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="18" style="margin-top: 10px">
        <Form v-model="form">
          <Input placeholder="身份证号" style="width:100px" v-model="form.uid"/>
          <Input placeholder="姓名" style="width:100px" v-model="form.patientName"/>
          <Select style="width:100px" v-model="form.sex">
            <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
          </Select>
          <Input placeholder="联系电话" style="width:100px" v-model="form.phone"/>
          <Button @click="qt" icon="ios-search" shape="circle" size="large" type="primary">
            查询
          </Button>
          <Button @click="addcancel" icon="ios-search" shape="circle" size="large" type="primary">
            清除查询
          </Button>
          <Button v-if="$store.state.user.user.userType ==='管理员'" @click="addpatientmodal = true" class="icon" size="large" type="primary">
            <Icon type="md-add"/> &nbsp;&nbsp;
            添加
          </Button>
        </Form>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addpatientmodal">
      <Row>
        <Form :label-width="100" ref="updatepatientForm" v-model="form">
          <FormItem label="身份证号" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="姓名" prop="patientName"><Input placeholder="" style="width:200px" v-model="form.patientName"/>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select style="width:200px" v-model="form.sex">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出生年份" prop="birthYear">
            <DatePicker @on-change="gettime"
                        format="yyyy"
                        placeholder="出生年份"
                        show-week-numbers
                        style="width: 200px" type="year"
                        v-model="form.birthYear"></DatePicker>
          </FormItem>
          <FormItem label="籍贯地" prop="nativePlace"><Input placeholder="" style="width:200px"
                                                          v-model="form.nativePlace"/></FormItem>
          <FormItem label="家庭住址" prop="address"><Input placeholder="" style="width:200px" v-model="form.address"/>
          </FormItem>
          <FormItem label="联系电话" prop="phone"><Input placeholder="" style="width:200px" v-model="form.phone"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updatepatientmodal">
      <Row>
        <Form :label-width="100" ref="updatepatientForm" v-model="form">
          <FormItem label="身份证号" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="姓名" prop="patientName"><Input placeholder="" style="width:200px" v-model="form.patientName"/>
          </FormItem>
          <FormItem label="性别" prop="sex">
            <Select style="width:200px" v-model="form.sex">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="出生年份" prop="birthYear">
            <DatePicker @on-change="gettime"
                        format="yyyy"
                        placeholder="出生年份"
                        show-week-numbers
                        style="width: 200px" type="year"
                        v-model="form.birthYear"></DatePicker>
          </FormItem>
          <FormItem label="籍贯地" prop="nativePlace"><Input placeholder="" style="width:200px"
                                                          v-model="form.nativePlace"/></FormItem>
          <FormItem label="家庭住址" prop="address"><Input placeholder="" style="width:200px" v-model="form.address"/>
          </FormItem>
          <FormItem label="联系电话" prop="phone"><Input placeholder="" style="width:200px" v-model="form.phone"/>
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
    name: 'patient',
    components: {
      Pagination
    },
    data() {
      return {
        addpatientmodal: false,
        updatepatientmodal: false,
        TableColumns: [
          {title: 'id', key: 'id', sortable: true},
          {title: '身份证号', key: 'uid', sortable: true},
          {title: '姓名', key: 'patientName', sortable: true},
          {title: '性别', key: 'sex', sortable: true},
          {
            title: '出生年份', key: 'birthYear', sortable: true,
            render: function (h, params) {
              return h('div', formatDate(new Date(params.row.birthYear), 'yyyy'))
            }
          },
          {title: '籍贯地', key: 'nativePlace', sortable: true},
          {title: '家庭住址', key: 'address', sortable: true},
          {title: '联系电话', key: 'phone', sortable: true},
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
              if(this.$store.state.user.user.userType==='患者'){}else {
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
                        this.updatepatientmodal = true;
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
          }
        ],
        List: [],
        loadings: {
          table: true
        },
        form: {
          id: null,
          uid: '',
          patientName: '',
          sex: '',
          birthYear: '',
          nativePlace: '',
          address: '',
          phone: '',
          lastchangedTime: ''
        },
        routeName: '',
        options: [
          {value: '男', label: '男'},
          {value: '女', label: '女'},
        ],
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
          path: 'patient',
          query: utils.filterEmptyValue(this.query)
        })
      },
      getlist() {
        api.queryPatient(this.query).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      qt() {
        let t = utils.filterEmptyValue(this.form);
        console.log(t)
        api.queryPatient(t).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      addok() {
        let data = this.form;
        api.addPatient(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        let data = this.form;
        api.updatePatient(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      gettime(e) {
        this.form.birthYear = e
      },
      delete(data) {
        api.deletePatient(data).then(res => {
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
          uid: '',
          patientName: '',
          sex: '',
          birthYear: '',
          nativePlace: '',
          address: '',
          phone: '',
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
