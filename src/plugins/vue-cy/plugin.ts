import {PluginFunction, PluginObject} from 'vue';
import Instance from './lib/instance';
export interface CyOptions {
  placeholder: string;
}
const plugObject: PluginObject<CyOptions> = {
  install(Vue, options) {
    // if (!options) {
    //   throw Error('must specify options');
    // }

    Vue.prototype.$cy = new Instance();
    // Vue.component('some-component', SomeComponent);
  },
};

export default plugObject;
