import {NodeKind, NodeData} from './base';

export class SearchNodeData extends NodeData {
  public component: NodeKind = NodeKind.SEARCH;
  public readonly query: string;
  public readonly collection: string;
  constructor(query: string, collection: string) {
    super(`${collection}:${query}`);
    this.query = query;
    this.collection = collection;
  }
}
