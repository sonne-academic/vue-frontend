import {NodeKind, NodeData} from './base';
const kind = NodeKind.SEARCH;
const selector = `node[component="${kind}"]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {
    'background-color': '#eee',
    'label': 'data(name)',
    'background-image': '/search.svg',
    'background-width': '75%',
    'background-height': '75%',
  },
};

class Data extends NodeData {
  public readonly query: string;
  public readonly collection: string;
  constructor(query: string, collection: string) {
    super(kind, `${collection}:${query}`);
    this.query = query;
    this.collection = collection;
  }
}

export {Data, style};
