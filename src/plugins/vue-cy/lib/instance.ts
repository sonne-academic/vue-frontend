// export const sync = (state: any) => {
//   console.log('sync state: ', state);
//   let elements = [...state.elements];
//   // replace the `elements` field with a custom one
//   Object.defineProperty(state, 'elements', {
//     get() {
//       return elements;
//     },
//     set(newElements) {
//       // update cytoscape view
//       CyInstance.instance.then((c: cytoscape.Core) => {
//         if (null === cy) {
//           return;
//         }
//         // remove all the elements in cytoscape that are not in the newElements
//         const selector = newElements.map((el: cytoscape.ElementDefinition) => `#${el.data.id}`).join(', ');
//         c.remove(cy.$(selector).absoluteComplement());
//         // add new elements if needed
//         newElements.forEach((el: cytoscape.ElementDefinition) => {
//           if (c.$(`#${el.data.id}`).length === 0) { c.add(el); }
//         });
//       });
//       elements = newElements;
//     },
//     enumerable: true,
//     configurable: true,
//   });
//   // trigger the initialization, will add the elements if needed
//   state.elements = elements;
//   return state;
// };

// type resolvType = ;
type cyOption = cytoscape.CytoscapeOptions;
type cyExtensionLoader = (extensionName: string, foo: string, bar: any) => cytoscape.Core;
type cyConstruct = (cytoscape: cyOption) => cytoscape.Core;
interface CyModule { default: cyConstruct|cyExtensionLoader; use(module: any): void; }
type preConfCall = (cm: CyModule) => void;
type callback = (cy: cytoscape.Core) => void;
interface ModuleImport {default: any; }

import cfg from './Cytoscape.cfg';


export class Instance {
  private pimports: Promise<[CyModule, ...ModuleImport[]]>;
  private pinstance: Promise<cytoscape.Core>;
  private resolv?: (value?: cytoscape.Core, ...exts: ModuleImport[]) => void;
  private cy?: cytoscape.Core;
  constructor() {
    this.pinstance = new Promise((resolve, reject) => {
      this.resolv = resolve;
    });
    this.pimports = Promise.all([
      import('cytoscape'),
      import('cytoscape-cxtmenu'),
    ]);
    this.pimports.then(() => {this.setConfig(cfg); });
  }
  public reset() {
    this.cy = undefined;
  }
  public get instance() {
    return this.pinstance;
  }
  public setConfig(config: cyOption) {
    this.pimports.then(([mod, ...exts]) => {

      exts.forEach((ext) => {mod.use(ext.default); });

      this.cy = (mod.default as cyConstruct)(config);

      if (this.resolv) {
        this.resolv(this.cy);
      }
    });
  }

}
export default Instance;
