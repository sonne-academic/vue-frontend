import Vue from 'vue';
import App from './App.vue';
import store from './store';
import solr from './plugins/vue-solr/plugin';
import cy from './plugins/vue-cy/plugin';

Vue.use(solr, {
  collections: ['s2', 'dblp'],
});
Vue.use(cy);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
