import {ActionTree, Getter, GetterTree, Module, ModuleTree, MutationTree} from 'vuex';
import {View, parse, changeset} from 'vega';
import spec from './idtree.view';


interface IdViewState {
  view: View;
  items: any[];
}

export interface IdParent {
  id: string;
  name: string;
  parent?: string;
}

type RootState = any;

const state: IdViewState = {
  view: new View(spec),
  items: [],
};

const getters: GetterTree<IdViewState, RootState> = {
  idContent: (stat) => stat.view.data('tree'),
  getView: (stat) => stat.view,
};

const actions: ActionTree<IdViewState, RootState> = {
  appendSingle: (ctx, item) => ctx.commit('addItem', item),
  appendMultiple(ctx, items) {
    return new Promise((resolve, reject) => {
      ctx.commit('addItems', items);
      resolve({});
    });
  },
  // clear: (ctx) => ctx.commit('setItems', {items: []}),
};

const mutations: MutationTree<IdViewState> = {
  // setItems: (stat, items) => stat.view.change = items,
  addItem: (stat, item) => stat.view.change('tree', changeset().insert(item)).run(),
  addItems: (stat, items) => {
    stat.items.push(...items);
    stat.view.insert('tree', items).run();
    // for (const item of items) {
    //   stat.view.change('tree', changeset().insert(item)).run();
    // }
  },
};

const idtree: Module<IdViewState, RootState> = {
  state,
  namespaced: true,
  getters,
  actions,
  mutations,
};

export default idtree;
