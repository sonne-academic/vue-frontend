import Vue from 'vue';
import App from './App.vue';
import store from './store';
import solr from './plugins/vue-solr/plugin';
import cy from './plugins/vue-cy/plugin';
const collections = new Map<string, string[]>();
collections.set('mag', ['author', 'year', 'journal', 'venue']);
collections.set('s2', ['author', 'year', 'keywords', 'journal', 'venue']);
collections.set('dblp', ['author', 'year', 'journal', 'booktitle']);
Vue.use(solr, {
  collections,
});
Vue.use(cy);

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
