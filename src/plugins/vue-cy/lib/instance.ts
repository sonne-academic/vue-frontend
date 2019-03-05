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
      ]).then(([mod, ...exts]) => {
        exts.forEach((ext: ModuleImport) => {mod.use(ext.default); });
        this.cy = mod.default(cfg);
        if (this.cy) {

          resolve(this.cy);
          this.ctrl = new CyController(this.cy);
          this.ctrl.addSearch('maisch ropinski', 's2');
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
