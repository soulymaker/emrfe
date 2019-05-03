import Vue from 'vue'
import axios from 'axios'
import router from '../router/index'

Vue.prototype.$http = axios;
axios.defaults.baseURL = "http://localhost:8082/yjyemr_war_exploded/api/";
axios.defaults.withCredentials = true;
export default {
  //AdminController
  login (data) {return ajax('login', 'post', data)},
  logout (data) {return ajax('logout', 'post', data)},
  //UserController  √
  queryUser (data) {return ajax('queryUser', 'post', data)},
  addUser (data) {return ajax('addUser', 'post', data)},
  deleteUser (data) {return ajax('deleteUser', 'post', data)},
  updateUser(data) {return ajax('updateUser', 'post', data)},
  getUserInfo (data) {return ajax('profile', 'get', data)},

  //DepartmentController  √
  queryDepartment (data) {return ajax('queryDepartment', 'post', data)},
  addDepartment (data) {return ajax('addDepartment', 'post', data)},
  updateDepartment (data) {return ajax('updateDepartment', 'post', data)},
  deleteDepartment(data) {return ajax('deleteDepartment', 'post', data)},

  //Disease
  queryDisease (data) {return ajax('queryDisease', 'post', data)},
  addDisease (data) {return ajax('addDisease', 'post', data)},
  deleteDisease(data) {return ajax('deleteDisease', 'post', data)},
  updateDisease(data) {return ajax('updateDisease', 'post', data)},

  queryHospital (data) {return ajax('queryHospital', 'post', data)},
  addHospital (data) {return ajax('addHospital', 'post', data)},
  deleteHospital(data) {return ajax('deleteHospital', 'post', data)},
  updateHospital (data) {return ajax('updateHospital', 'post', data)},

  deletePatient (data) {return ajax('deletePatient', 'post', data)},
  updatePatient(data) {return ajax('updatePatient', 'post', data)},
  queryPatient (data) {return ajax('queryPatient', 'post', data)},
  addPatient (data) {return ajax('addPatient', 'post', data)},

  queryRecord (data) {return ajax('queryRecord', 'post', data)},
  addRecord (data) {return ajax('addRecord', 'post', data)},
  deleteRecord (data) {return ajax('deleteRecord', 'post', data)},
  updateRecord (data) {return ajax('updateRecord', 'post', data)},

  queryStaff (data) {return ajax('queryStaff', 'post', data)},
  addStaff (data) {return ajax('addStaff', 'post', data)},
  updateStaff (data) {return ajax('updateStaff', 'post', data)},
  deleteStaff (data) {return ajax('deleteStaff', 'post', data)},

  queryTest (data) {return ajax('queryTest', 'post', data)},
  addTest (data) {return ajax('addTest', 'post', data)},
  deleteTest(data) {return ajax('deleteTest', 'post', data)},
  updateTest(data) {return ajax('updateTest', 'post', data)},

  queryTestRecord (data) {return ajax('queryTestRecord', 'post', data)},
  deleteTestRecord(data) {return ajax('deleteTestRecord', 'post', data)},
  addTestRecord (data) {return ajax('addTestRecord', 'post', data)},
  updateTestRecord(data) {return ajax('updateTestRecord', 'post', data)},

  queryTreatment (data) {return ajax('queryTreatment', 'post', data)},
  addTreatment (data) {return ajax('addTreatment', 'post', data)},
  deleteTreatment(data) {return ajax('deleteTreatment', 'post', data)},
  updateTreatment(data) {return ajax('updateTreatment', 'post', data)},

  queryTreatmentRecord (data) {return ajax('queryTreatmentRecord', 'post', data)},
  addTreatmentRecord (data) {return ajax('addTreatmentRecord', 'post', data)},
  deleteTreatmentRecord(data) {return ajax('deleteTreatmentRecord', 'post', data)},
  updateTreatmentRecord(data) {return ajax('updateTreatmentRecord', 'post', data)},

}

/**
 * @param url
 * @param method get|post|put|delete...
 * @param params like queryString. if a url is index?a=1&b=2, params = {a: '1', b: '2'}
 * @param data post data, use for method put|post
 * @returns {Promise}
 */

function ajax (url, method, data) {
  return new Promise((resolve, reject) => {
    axios({
      url, method, data
    }).then(res => {
      // API正常返回(status=20x), 是否错误通过有无error判断
      if (res.data.err !== null) {
        // 若后端返回为登录，则为session失效，应退出当前登录用户
        Vue.prototype.$error(res.data.err);
        reject(res);
        if (res.data.err.startsWith('Access Denied')) {
          router.push({name: 'login'})
        }
      } else {
        resolve(res)
      }
    }, res => {
      // API请求异常，一般为Server error 或 network error
      Vue.prototype.$error(res.data.msg);
      reject(res)
    })
  })
}

