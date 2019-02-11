import {PluginFunction, PluginObject} from 'vue';
import WorkerWrapper from './lib/WorkerWrapper';
export interface SolrPluginOptions {
  host: string;
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
    Vue.prototype.$solr = new WorkerWrapper();
  },
};

export default plugObject;
