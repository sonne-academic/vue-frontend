import {ActionTree, Getter, GetterTree, Module, ModuleTree, MutationTree} from 'vuex';
import * as d3 from 'd3-hierarchy';

export interface Node {
  parent?: string;
  children?: string[];
  id: string;
  name: string;
}
interface DThreeState {
  root: d3.HierarchyNode<Node>|null;
  items: any[];
}

type RootState = any;

const state: DThreeState = {
  root: null,
  items: [],
};

const getters: GetterTree<DThreeState, RootState> = {
  getItems: (stat) => stat.items,
  getTree: (stat) => {
    if (stat.root) {
      return d3.tree<Node>()(stat.root);
    } else {
      return null;
    }
  },
  getRoot: (stat) => stat.root,
};

const actions: ActionTree<DThreeState, RootState> = {
  setRoot: (ctx, item) => ctx.commit('changeRoot', item),
  appendItems: (ctx, items) => ctx.commit('addItems', items),
  // clear: (ctx) => ctx.commit('setItems', {items: []}),
};

const mutations: MutationTree<DThreeState> = {
  // setItems: (stat, items) => stat.view.change = items,
  changeRoot: (stat, item) => {
    stat.items = [];
    stat.items.push(item);
  },
  addItems: (stat, items) => {
    stat.items.push(...items);
    stat.root = d3.stratify<Node>()
      .id((d) => d.id)
      .parentId((d) => d.parent)
      (stat.items);
  },
};

const d3tree: Module<DThreeState, RootState> = {
  state,
  namespaced: true,
  getters,
  actions,
  mutations,
};

export default d3tree;
