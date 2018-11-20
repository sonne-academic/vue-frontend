import Vue from 'vue';
import Vuex from 'vuex';
import log from './modules/log';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    log,
  },
});

if (module.hot) {
  // accept actions and mutations as hot modules
  module.hot.accept(['./modules/log'], () => {
    // require the updated modules
    // have to add .default here due to babel 6 module output
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
