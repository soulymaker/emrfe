import Vue from 'vue'
import 'babel-polyfill'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
Vue.use(iView);
Vue.prototype.HOST = '/api';
Vue.config.productionTip = false;


// 注册全局消息提示
Vue.prototype.$Message.config({
  duration: 3
});
Vue.prototype.$error = (s) => Vue.prototype.$Message.error(s);
Vue.prototype.$info = (s) => Vue.prototype.$Message.info(s);
Vue.prototype.$success = (s) => Vue.prototype.$Message.success(s);


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
});

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  next();
});

router.afterEach(()=> {
  iView.LoadingBar.finish();
});
