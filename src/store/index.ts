import Vue from 'vue';
import Vuex from 'vuex';
import log from './modules/log';
// import idtree from './modules/idtree';
import navgraph from './modules/navgraph';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    log,
    // idtree,
    navgraph,
  },
  // plugins: [createSolrCommandPlugin()],
  strict: false,
});

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/log', './modules/navgraph'], () => {
//  module.hot.accept(['./modules/log', './modules/idtree', './modules/d3tree'], () => {
      // require the updated modules
    // have to add .default here due to babel 6 module output
    const newLog = require('./modules/log').default;
    // const newId = require('./modules/idtree').default;
    const newD3 = require('./modules/navgraph').default;
    // swap in the new modules and mutations
    store.hotUpdate({
      modules: {
        log: newLog,
        // idtree: newId,
        navgraph: newD3,
      },
    });
  });
}

export default store;
