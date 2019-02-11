import Vue from 'vue';
import App from './App.vue';
import store from './store';
import solr from './plugins/vue-solr/vue-solr-plugin';

Vue.use(solr);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
