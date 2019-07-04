import SuiVue from 'semantic-ui-vue';
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import App from './App';
import router from './router';
import xmlToJs from 'xml-js';
import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false;
Vue.use(SuiVue);
Vue.use(VeeValidate);
Vue.use(xmlToJs);
Vue.use(BootstrapVue)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
