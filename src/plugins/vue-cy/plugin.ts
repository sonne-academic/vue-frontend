import {PluginFunction, PluginObject} from 'vue';
import CyInstance from './lib/instance';
export interface CyOptions {
  placeholder: string;
}
const plugObject: PluginObject<CyOptions> = {
  install(Vue, options) {
    // if (!options) {
    //   throw Error('must specify options');
    // }

    Vue.prototype.$cy = CyInstance;
    // Vue.component('some-component', SomeComponent);
  },
};

export default plugObject;
