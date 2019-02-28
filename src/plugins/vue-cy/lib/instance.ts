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

type resolvType = (value?: cytoscape.Core) => void;
type cyFunc = (cytoscape: cytoscape.CytoscapeOptions) => cytoscape.Core;
interface CyMod { default: cyFunc; use(module: any): void; }
type ptype = Promise<CyMod>;
type callback = (cy: cytoscape.Core) => void;
export class Instance {
  private pmodule: ptype;
  private pinstance: Promise<cytoscape.Core>;
  private resolv?: resolvType;
  private cy?: cytoscape.Core;
  constructor() {
    this.pinstance = new Promise((resolve, reject) => {
      this.resolv = resolve;
    });
    this.pmodule = import('cytoscape');
  }
  public reset() {
    this.cy = undefined;
  }
  public get instance() {
    return this.pinstance;
  }
  public setConfig(config: cytoscape.CytoscapeOptions, preConfig?: (cm: cyFunc) => void, afterCreated?: callback) {
    this.pmodule.then((mod) => {
      if (preConfig) {
        preConfig(mod.default);
      }

      this.cy = mod.default(config);
      if (afterCreated) {
        afterCreated(this.cy);
      }

      if (this.resolv) {
        this.resolv(this.cy);
      }
    });
  }

}
const CyInstance = new Instance();
export default CyInstance;
