import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import * as toTop from '@/utils/toTop'

//Element-ui
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
//iView-ui
import ViewUI from 'view-design';
import 'view-design/dist/styles/iview.css';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.use(ViewUI);
Vue.prototype.$toTop = toTop


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')





