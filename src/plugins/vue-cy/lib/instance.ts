interface ModuleImport { default: any; }

import cfg from './cfg';
import CyController from '../controller';
import { DataNodes } from '../nodes';

export class Instance {
  private pinstance: Promise<cytoscape.Core>;
  private cy?: cytoscape.Core;
  private ctrl!: CyController;
  constructor() {
    this.pinstance = new Promise((resolve, reject) => {
      Promise.all([
        import('cytoscape'),
        import('cytoscape-cxtmenu'),
        import('cytoscape-dagre'),
        import('cytoscape-compound-drag-and-drop'),
        // import('cytoscape-cola'),
        // import('cytoscape-cose-bilkent'),
      ]).then(([mod, ...exts]) => {
        exts.forEach((ext: ModuleImport) => { mod.use(ext.default); });
        this.cy = mod.default(cfg);
        if (this.cy) {

          resolve(this.cy);
          this.ctrl = new CyController(this.cy);
          const deeplink = window.location.search;
          if (deeplink) {
            const split = deeplink.replace('?', '').split('=');
            if (split.length === 2) {
              const collection = decodeURI(split[0]);
              const query = decodeURI(split[1]);
              this.ctrl.addActive(new DataNodes.search(query, collection));
            }
          } else {
            this.ctrl.restoreFromLocalStorage();
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
