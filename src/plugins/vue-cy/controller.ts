import { SearchNodeData } from './nodes/search';
import { NodeData, uuidgen, NodeKind } from './nodes/base';
import { FacetSearchData } from './nodes/facet';


export default class CyController {
  private cy: cytoscape.Core;
  private primary?: string;
  private secondary?: string;
  constructor(cy: cytoscape.Core) {
    this.cy = cy;
  }

  public get activeNode(): string {
    if (this.primary) {
      return this.primary;
    }
    return '';
  }

  public addSearch(query: string, collection: string): string {
    const id = this.addNode(new SearchNodeData(query, collection));
    this.primary = id;
    return id;
  }

  public addFacet(field: string, value: string) {
    const parent: string = this.getNodeTyped(this.activeNode, NodeKind.SEARCH).data('id');
    const child = this.addNode(new FacetSearchData(field, value));
    this.addEdge(parent, child);
  }

  private addEdge(source: string, target: string) {
    const data = {
      id: uuidgen(source + target),
      source,
      target,
    };
    const link = this.cy.$id(data.id);
    if (link.length === 0) {
      this.cy.add({group: 'edges', data});
    }
    return data.id;
  }

  private getNodeTyped(id: string, component: NodeKind): cytoscape.NodeSingular {
    const node = this.cy.$id(id);
    if ('nodes' !== node.group()) {
      console.error(`element with id ${id} is not a node, but ${node.group()}`);
    }
    if (node.length === 0) {
      console.error(`no node with id ${id}`);
    }
    const type = node.data('component');
    if (component !== type) {
      console.error(`node ${id} has wrong type, expected: ${component}, actual: ${type}`);
    }
    return node;
  }

  private addNode(data: NodeData): string {
    if (0 === this.cy.getElementById(data.id).length) {
      this.cy.add({group: 'nodes', data});
    } // TODO: what to do when node exists? Blink it? Focus on it?
    return data.id;
  }
}
