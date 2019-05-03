// all routes here.
import Vue from 'vue'
import Router from 'vue-router'
import routes from './routes'
import iView from 'iview'
import 'font-awesome/css/font-awesome.min.css'
Vue.use(Router);
Vue.use(iView);

export default new Router({
  mode:'history',
  scrollBehavior: () => ({y: 0}),
  routes
})

