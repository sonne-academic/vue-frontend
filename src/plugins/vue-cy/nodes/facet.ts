import { NodeData, NodeKind } from './base';

export class FacetSearchData extends NodeData {
  public kind: NodeKind = NodeKind.FACET;
  public readonly field: string;
  public readonly value: string;
  constructor(field: string, value: string) {
    super(`${field}:${value}`);
    this.field = field;
    this.value = value;
  }
}
