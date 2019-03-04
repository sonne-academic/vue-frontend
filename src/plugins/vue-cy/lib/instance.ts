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

type cyOption = cytoscape.CytoscapeOptions;
type cyConstruct = (cytoscape: cyOption) => cytoscape.Core;
interface ModuleImport {default: any; }

import cfg from './Cytoscape.cfg';

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
        this.cy = (mod.default as cyConstruct)(cfg);
        resolve(this.cy);
      }).catch(reject);
    });
  }
  public get instance() {
    return this.pinstance;
  }
}
export default Instance;
