import {NodeData, NodeKind} from './base';
const kind = NodeKind.KEYWORDS;
const selector = `node[component="${kind}"]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {
    'background-color': '#eee',
    'label': 'data(name)',
    'background-image': '/keywords.svg',
    'background-fit': 'contain',
  },
};
class Data extends NodeData {
  public readonly collection: string;
  constructor(collection: string, name: string) {
    super(kind, name);
    this.collection = collection;
  }
}

export {style, Data};
