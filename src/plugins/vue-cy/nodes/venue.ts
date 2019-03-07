import {NodeData, NodeKind} from './base';
const kind = NodeKind.VENUE;
const selector = `node[component="${kind}"]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {
    'background-color': '#eee',
    'label': 'data(name)',
    'background-image': '/venue.svg',
    'background-fit': 'contain',
  },
};
class Data extends NodeData {
  constructor(name: string) {
    super(kind, name);
  }
}

export {style, Data};