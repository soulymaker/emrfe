<template>
  <Col>
    <Row>
      <Col align="left" span="6">
        <Breadcrumb class="title">
          <BreadcrumbItem>系统设置</BreadcrumbItem>
          <BreadcrumbItem to="/record">记录管理</BreadcrumbItem>
        </Breadcrumb>
      </Col>
      <Col align="right" span="18" style="margin-top: 10px">
        <Form v-model="form">
          <Input placeholder="医师" style="width:100px" v-model="form.doctorName"/>
          <Input placeholder="患者" style="width:100px" v-model="form.patientName"/>
          <Input placeholder="类型" style="width:100px" v-model="form.visitType"/>
          <Button @click="qt" icon="ios-search" shape="circle" size="large" type="primary">
            查询
          </Button>
          <Button @click="addcancel" icon="ios-search" shape="circle" size="large" type="primary">
            清除查询
          </Button>
          <Button v-if="$store.state.user.user.userType ==='管理员'||$store.state.user.user.userType ==='医生'" @click="addrecordmodal = true" class="icon" shape="circle" size="large" type="primary">
            <Icon type="md-add"/> &nbsp;&nbsp;
            添加
          </Button>
        </Form>
      </Col>
    </Row>
    <Modal @on-cancel="addcancel()" @on-ok="addok()" style="width: 500px" title="添加" v-model="addrecordmodal">
      <Row>
        <Form :label-width="100" ref="recordForm" v-model="form">
          <FormItem label="医师" prop="doctorName"><Input placeholder="" style="width:200px" v-model="form.doctorName"/></FormItem>
          <FormItem label="患者" prop="patientName"><Input placeholder="" style="width:200px" v-model="form.patientName"/></FormItem>
          <FormItem label="身份证号" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="类型" prop="visitType">
            <Select style="width:200px" v-model="form.visitType">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="结论" prop="conclusion"><Input placeholder="" style="width:200px" v-model="form.conclusion"/>
          </FormItem>
          <FormItem label="病情描述" prop="description"><Input placeholder="" style="width:200px" v-model="form.description"/></FormItem>
          <FormItem label="治疗方案" prop="treatment"><Input placeholder="" style="width:200px" v-model="form.treatment"/>
          </FormItem>
          <FormItem label="就诊日期" prop="consultationDate">
            <DatePicker :options="disableOldDay"
                        @on-change="gettime"
                        format="yyyy-MM-dd"
                        placeholder="就诊日期"
                        show-week-numbers
                        style="width: 200px"
                        type="datetime"
                        v-model="form.consultationDate"></DatePicker>
          </FormItem>
          <FormItem label="检查" prop="test"><Input placeholder="" style="width:200px" v-model="form.test"/></FormItem>
          <FormItem label="疾病类型" prop="diseaseType"><Input placeholder="" style="width:200px"
                                                           v-model="form.diseaseType"/>
          </FormItem>
        </Form>
      </Row>
    </Modal>
    <Modal @on-cancel="addcancel()" @on-ok="update()" style="width: 500px" title="修改" v-model="updaterecordmodal">
      <Row>
        <Form :label-width="100" ref="recordForm" v-model="form">
          <FormItem label="医师" prop="doctorName"><Input placeholder="" style="width:200px" v-model="form.doctorName"/>
          </FormItem>
          <FormItem label="患者" prop="patientName"><Input placeholder="" style="width:200px" v-model="form.patientName"/>
          </FormItem>
          <FormItem label="身份证号" prop="uid"><Input placeholder="" style="width:200px" v-model="form.uid"/></FormItem>
          <FormItem label="类型" prop="visitType">
            <Select style="width:200px" v-model="form.visitType">
              <Option :key="item.value" :value="item.value" v-for="item in options">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem label="结论" prop="conclusion"><Input placeholder="" style="width:200px" v-model="form.conclusion"/>
          </FormItem>
          <FormItem label="病情描述" prop="description"><Input placeholder="" style="width:200px" v-model="form.description"/></FormItem>
          <FormItem label="治疗方案" prop="treatment"><Input placeholder="" style="width:200px" v-model="form.treatment"/>
          </FormItem>
          <FormItem label="就诊日期" prop="consultationDate">
            <DatePicker @on-change="gettime"
                        format="yyyy-MM-dd"
                        placeholder="就诊日期"
                        show-week-numbers
                        style="width: 200px" type="date"
                        v-model="form.consultationDate"></DatePicker>
          </FormItem>
          <FormItem label="检查" prop="test"><Input placeholder="" style="width:200px" v-model="form.test"/></FormItem>
          <FormItem label="疾病类型" prop="diseaseType"><Input placeholder="" style="width:200px"
                                                           v-model="form.diseaseType"/>
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
    name: 'record',
    components: {
      Pagination
    },
    data() {
      return {
        addrecordmodal: false,
        updaterecordmodal: false,
        TableColumns: [
          {title: 'id', key: 'id', sortable: true},
          {title: '医师', key: 'doctorName', sortable: true},
          {title: '患者', key: 'patientName', sortable: true},
          {title: '类型', key: 'visitType', sortable: true},
          {title: '结论', key: 'conclusion', sortable: true},
          {title: '病情描述', key: 'description', sortable: true},
          {title: '治疗方案', key: 'treatment', sortable: true},
          {
            title: '操作',
            key: 'option',
            render: (h, params) => {
              if (this.$store.state.user.user.userType === '患者') {
              } else {
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
                        this.updaterecordmodal = true;
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
          doctorName: '',
          consultationDate: '',  //YYYY-MM-DD
          test: '',
          description: '',
          diseaseType: '',
          conclusion: '',
          treatment: '',
          visitType: '',  // 转院 急诊 门诊
          lastchangedTime: ''
        },
        options: [
          {value: '转院', label: '转院'},
          {value: '急诊', label: '急诊'},
          {value: '门诊', label: '门诊'},
        ],
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
          path: 'record',
          query: utils.filterEmptyValue(this.query)
        })
      },
      disableOldDay: {
        disabledDate(date) {
          return date && date.valueOf() < Date.now() - 86400000
        }
      },
      getlist() {
        api.queryRecord(this.query).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      qt() {
        let t = utils.filterEmptyValue(this.form);
        api.queryRecord(t).then(res => {
          this.List = res.data.data;
          this.limit = this.List.length;
        })
      },
      gettime(e) {
        this.form.consultationDate = e
      },
      addok() {
        this.gettime();
        let data = this.form;
        api.addRecord(data).then(res => {
          this.$success('添加成功');
          this.getlist()
        }, res => {
          this.$success('添加失败')
        })
      },
      update() {
        this.gettime();
        let data = this.form;
        api.updateRecord(data).then(res => {
          this.$success('修改成功');
          this.getlist()
        }, res => {
          this.$error('修改失败')
        })
      },
      delete(data) {
        api.deleteRecord(data).then(res => {
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
          doctorName: '',
          consultationDate: '',  //YYYY-MM-DD
          test: '',
          description: '',
          diseaseType: '',
          conclusion: '',
          treatment: '',
          visitType: '',  // 转院 急诊 门诊
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
