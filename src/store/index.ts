import Vue from 'vue';
import Vuex from 'vuex';
import log from './modules/log';
import navgraph from './modules/navgraph';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    log,
    navgraph,
  },
  // plugins: [createSolrCommandPlugin()],
  strict: true,
});

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/log', './modules/navgraph'], () => {
    const newLog = require('./modules/log').default;
    const newNG = require('./modules/navgraph').default;
    // swap in the new modules and mutations
    store.hotUpdate({
      modules: {
        log: newLog,
        navgraph: newNG,
      },
    });
  });
}

export default store;
