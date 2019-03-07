import {NodeData, NodeKind} from './base';
const kind = NodeKind.PAPER;
const selector = `node[component="${kind}"]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {
    'background-color': '#eee',
    'label': 'data(name)',
    'background-image': '/paper.svg',
    'background-width': '75%',
    'background-height': '75%',
  },
};
class Data extends NodeData {
  public readonly collection: string;
  public readonly pid: string;
  constructor(collection: string, id: string, name: string) {
    super(kind, name);
    this.pid = id;
    this.collection = collection;
  }
}
export {style, Data};
