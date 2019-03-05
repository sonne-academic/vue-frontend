import Vue from 'vue';
import Vuex from 'vuex';
import log from './modules/log';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    log,
  },
  // plugins: [createSolrCommandPlugin()],
  strict: true,
});

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/log'], () => {
    const newLog = require('./modules/log').default;
    // swap in the new modules and mutations
    store.hotUpdate({
      modules: {
        log: newLog,
      },
    });
  });
}

export default store;
