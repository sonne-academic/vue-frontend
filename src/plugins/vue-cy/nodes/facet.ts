import { NodeData, NodeKind } from './base';
const selector = `node[component=${NodeKind.FACET}]`;
const style: cytoscape.Stylesheet = {
  selector,
  style: {},
};
export class FacetSearchData extends NodeData {
  public readonly field: string;
  public readonly value: string;
  constructor(field: string, value: string) {
    super(NodeKind.FACET, `${field}:${value}`);
    this.field = field;
    this.value = value;
  }
}
