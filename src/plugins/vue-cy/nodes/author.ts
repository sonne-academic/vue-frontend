import {NodeData, NodeKind} from './base';
const kind = NodeKind.AUTHOR;
const selector = `node[component="${kind}"]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {
    'background-color': '#eee',
    'label': 'data(name)',
    'background-image': '/author.svg',
    'background-width': '75%',
    'background-height': '75%',
  },
};
class Data extends NodeData {
  constructor(name: string) {
    super(kind, name);
  }
}
export {style, Data};