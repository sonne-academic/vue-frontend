import {ActionTree, Getter, GetterTree, Module, ModuleTree, MutationTree} from 'vuex';
import uuid from 'uuid/v5';
import { AssertionError } from 'assert';
const UUID_NS = 'a171cd2a-ca10-4cc7-8782-733db8d61ccb';
export enum NodeKind {
  SEARCH,
  AUTHOR,
  JOURNAL,
  PAPER,
  VENUE,
  FILTER,
  ALIAS,
  FACET,
}
export interface FacetNode {
  facetField: string;
  facetValue: string;
}
export interface SearchNode {
  collection: string;
  query: string;
}
export interface Node {
  id: string;
  kind: NodeKind;
  name: string;
  mtime: Date;
  ctime: Date;
  data: SearchNode | FacetNode;
}
export interface Link {
  source: string;
  target: string;
  mtime: Date;
  ctime: Date;
}
interface NavState {
  root: Node|null;
  currentNode: Node|null;
  nodes: Node[];
  links: Link[];
}

type RootState = any;


const state: NavState = {
  root: null,
  currentNode: null,
  nodes: [],
  links: [],
};

const getters: GetterTree<NavState, RootState> = {
  nodes: (stat) => stat.nodes,
  links: (stat) => stat.links,
  current: (stat) => stat.currentNode,
  root: (stat) => stat.root,
};

const actions: ActionTree<NavState, RootState> = {
  mountcy: (ctx, e: HTMLElement) => ctx.commit('mount', e),
  unmountcy: (ctx) => ctx.commit('unmount'),
  changeSearchRoot(ctx, node: SearchNode) {

    const time: Date = new Date();
    const root = {
      ctime: time,
      mtime: time,
      id: uuid(node.query, UUID_NS),
      name: node.query,
      kind: NodeKind.SEARCH,
      data: node,
    };
    ctx.commit('setSearchRoot', root);
  },
  changeCurrentNode: (ctx, node: Node) => ctx.commit('setCurrentNode', node.id),
  navigateToFacet: (ctx, node: FacetNode) => ctx.commit('appendFacet', node),
};

const mutations: MutationTree<NavState> = {
  setSearchRoot(stat, node: Node) {
    stat.root = node;
    stat.currentNode = stat.root;
    stat.nodes = [stat.root];
  },
  setCurrentNode(stat, id: string) {
    for (const node of stat.nodes) {
      if (id === node.id) {
        stat.currentNode = node;
        return;
      }
    }
    throw new AssertionError({
      message: 'provided id does not match any nodes',
      actual: id,
      expected: stat.nodes.map((node) => node.id),
    });
  },
  appendFacet(stat, facet: FacetNode) {
    if (!stat.currentNode) {
      throw new AssertionError({
        message: 'currentNode is invalid',
        actual: stat.currentNode,
        expected: Node,
      });
    }
    const time = new Date();
    const str = `${facet.facetField}:${facet.facetValue}`;
    const node: Node = {
      ctime: time,
      mtime: time,
      id: uuid(str, UUID_NS),
      name: str,
      kind: NodeKind.FACET,
      data: facet,
    };
    stat.nodes.push(node);
    const link: Link = {
      source: stat.currentNode.id,
      target: node.id,
      mtime: time,
      ctime: time,
    };
    stat.links.push(link);
    stat.currentNode = node;
  },
};

const navgraph: Module<NavState, RootState> = {
  state,
  namespaced: false,
  getters,
  actions,
  mutations,
};

export default navgraph;
