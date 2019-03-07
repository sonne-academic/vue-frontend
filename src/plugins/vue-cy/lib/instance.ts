interface ModuleImport {default: any; }

import cfg from './cfg';
import CyController from '../controller';

export class Instance {
  private pinstance: Promise<cytoscape.Core>;
  private cy?: cytoscape.Core;
  private ctrl?: CyController;
  constructor() {
    this.pinstance = new Promise((resolve, reject) => {
      Promise.all([
        import('cytoscape'),
        import('cytoscape-cxtmenu'),
        import('cytoscape-dagre'),
        // import('cytoscape-cola'),
        // import('cytoscape-cose-bilkent'),
      ]).then(([mod, ...exts]) => {
        exts.forEach((ext: ModuleImport) => {mod.use(ext.default); });
        this.cy = mod.default(cfg);
        const datas = localStorage.getItem('graph');
        if (datas) {
          const data = JSON.parse(datas);

        }
        if (this.cy) {

          resolve(this.cy);
          this.ctrl = new CyController(this.cy);
          const deeplink = window.location.search;
          if (deeplink) {
            const split = deeplink.replace('?', '').split('=');
            if (split.length === 2) {
              const collection = decodeURI(split[0]);
              const query = decodeURI(split[1]);
              this.ctrl.addSearch(query, collection);
            }
          }
        } else {
          reject('could not load cytoscape');
        }
      }).catch(reject);
    });
  }
  public get instance() {
    return this.pinstance;
  }
  public get controller() {
    return this.ctrl;
  }
}
export default Instance;
