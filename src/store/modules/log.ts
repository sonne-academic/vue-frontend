import {ActionTree, Getter, GetterTree, Module, ModuleTree, MutationTree} from 'vuex';

interface LoggingState {
  items: string[];
}

type RootState = any;

const state: LoggingState = {
  items: new Array<string>(),
};

const getters: GetterTree<LoggingState, RootState> = {
  logContent: (stat) => stat.items.map((d) => d),
};

const actions: ActionTree<LoggingState, RootState> = {
  log: (ctx, lg: string) => ctx.commit('addItem', lg),
  clear: (ctx) => ctx.commit('setItems', {items: []}),
};

const mutations: MutationTree<LoggingState> = {
  setItems: (stat, items) => stat.items = items,
  addItem: (stat, item) => stat.items.push(item),
};

const log: Module<LoggingState, RootState> = {
  state,
  namespaced: true,
  getters,
  actions,
  mutations,
};

export default log;
