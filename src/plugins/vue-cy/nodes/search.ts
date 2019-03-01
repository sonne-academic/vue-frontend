import {NodeKind, NodeData, Node, uuidgen} from './base';
import {FacetSearchData} from './facet';

export class SearchNodeData extends NodeData {
  public kind: NodeKind = NodeKind.SEARCH;

  public readonly query: string;
  public readonly collection: string;
  constructor(query: string, collection: string) {
    super(`${collection}:${query}`);
    this.query = query;
    this.collection = collection;
  }

  public facet(field: string, value: string): [FacetSearchData, cytoscape.EdgeDataDefinition] {
    const ndata = new FacetSearchData(field, value);
    const ldata = {
        id: uuidgen(this.id + ndata.id),
        source: this.id,
        target: ndata.id,
    };
    return [ndata, ldata];
  }
}
