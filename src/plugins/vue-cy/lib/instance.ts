interface ModuleImport {default: any; }

import cfg from './cfg';

export class Instance {
  private pinstance: Promise<cytoscape.Core>;
  private cy?: cytoscape.Core;
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
        } else {
          reject('could not load cytoscape');
        }
      }).catch(reject);
    });
  }
  public get instance() {
    return this.pinstance;
  }
}
export default Instance;
