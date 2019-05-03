// all routes here.
import {
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
} from '../views'

export default [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children: [
      {name: 'logout', path: '/logout', component: Logout},
      {name: 'department', path: '/department', component: department},
      {name: 'disease', path: '/disease', component: disease},
      {name: 'hospital', path: '/hospital', component: hospital},
      {name: 'patient', path: '/patient', component: patient},
      {name: 'record', path: '/record', component: record},
      {name: 'staff', path: '/staff', component: staff},
      {name: 'test', path: '/test', component: test},
      {name: 'testRecord', path: '/testRecord', component: testRecord},
      {name: 'treatment', path: '/treatment', component: treatment},
      {name: 'treatmentRecord', path: '/treatmentRecord', component: treatmentRecord},
      {name: 'user', path: '/user', component: user},
    ]
  },
  {
    path: '*', redirect: '/login'
  }
]
