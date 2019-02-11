import {ActionTree, Getter, GetterTree, Module, ModuleTree, MutationTree} from 'vuex';
import {SolrCommandSocket} from '@/solr/SolrCommandSocket';

interface SolrState {
  requests: any[];
  responses: any[];
}

type RootState = any;

const sock: SolrCommandSocket = new SolrCommandSocket();
const state: SolrState = {requests: [], responses: []};

const getters: GetterTree<SolrState, RootState> = {
  requests: (stat) => stat.requests,
  responses: (stat) => stat.responses,
};

const actions: ActionTree<SolrState, RootState> = {
  doCommand({commit}, {command, method, endpoint, payload}) {
    commit('addRequest', {command, method, endpoint, payload});
    return new Promise((resolve, reject) => {
      sock.send_command(command, method, endpoint, payload)
      .then((data) => {
        commit('addResponse', data);
        resolve(data);
      }, reject)
      .catch(console.error);
    });
  },
  // clear: (ctx) => ctx.commit('setItems', {items: []}),
};

const mutations: MutationTree<SolrState> = {
  addRequest: (stat, item) => stat.requests.push(item),
  addResponse: (stat, item) => stat.responses.push(item),
};

const idtree: Module<SolrState, RootState> = {
  state,
  namespaced: true,
  getters,
  actions,
  mutations,
};

export default idtree;
