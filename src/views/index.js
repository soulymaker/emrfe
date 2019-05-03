import Home from '@/views/commons/Home.vue'
import Login from '@/views/commons/Login.vue'
import Logout from '@/views/commons/Logout.vue'

/*   组件导出分为两类, 一类常用的直接导出，另一类诸如Login, Logout等用懒加载，懒加载不在此处导出
 *   在对应的route内加载
 *   见https://routerjs.org/en/advanced/lazy-loading.html
 */
// Grouping Components in the Same Chunk
const department = () => import( /* webpackChunkName: "a" */ '@/views/table/department.vue');
const disease = () => import( /* webpackChunkName: "a" */ '@/views/table/disease.vue');
const hospital = () => import( /* webpackChunkName: "a" */ '@/views/table/hospital.vue');
const patient = () => import( /* webpackChunkName: "a" */ '@/views/table/patient.vue');
const record = () => import( /* webpackChunkName: "a" */ '@/views/table/record.vue');
const staff = () => import( /* webpackChunkName: "a" */ '@/views/table/staff.vue');
const test = () => import( /* webpackChunkName: "a" */ '@/views/table/test.vue');
const testRecord = () => import( /* webpackChunkName: "a" */ '@/views/table/testRecord.vue');
const treatment = () => import( /* webpackChunkName: "a" */ '@/views/table/treatment.vue');
const treatmentRecord = () => import( /* webpackChunkName: "a" */ '@/views/table/treatmentRecord.vue');
const user = () => import( /* webpackChunkName: "a" */ '@/views/table/user.vue');


export {
  Home,
  department,
  disease,
  hospital,
  patient,
  record,
  staff,
  test,
  testRecord,
  treatment,
  treatmentRecord,
  user,
  Login,
  Logout
}
