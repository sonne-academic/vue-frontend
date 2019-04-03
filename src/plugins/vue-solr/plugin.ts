import {PluginFunction, PluginObject} from 'vue';
import WorkerWrapper from './lib/WorkerWrapper';
import SolrAutoCompleteInput from './components/SolrAutoCompleteInput.vue';
export interface SolrPluginOptions {
  collections: Map<string, string[]>;
}
const plugObject: PluginObject<SolrPluginOptions> = {
  install(Vue, options) {
    // 1. add global method or property
    // Vue.myGlobalMethod = function() {
    // some logic ...
    // };

    //   2. add a global asset
    // Vue.directive('my-directive', {
    // bind(el, binding, vnode, oldVnode) {
    //   // some logic ...
    // },
    // ...,
    // });

    // 3. inject some component options
    // Vue.mixin({
    // created() {
    //   // some logic ...
    // }
    // ...,
    // });

    // 4. add an instance method
    // Vue.prototype.$myMethod = function(methodOptions:any) {
    // some logic ...
    // };
    if (!options) {
      throw Error('must specify options');
    }
    Vue.prototype.$solr = new WorkerWrapper(options.collections);
    Vue.component('solr-autocomplete-input', SolrAutoCompleteInput);
  },
};

export default plugObject;
