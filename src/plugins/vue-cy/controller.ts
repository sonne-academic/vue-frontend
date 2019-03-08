import { NodeData, uuidgen, NodeKind } from './nodes/base';
import { FacetSearchData } from './nodes/facet';
import {DataNodes as nodes} from './nodes';

interface LocalStore {version: number; elements: cytoscape.ElementDefinition; }

export default class CyController {

  public get activeNode(): string {
    if (this.primary) {
      return this.primary;
    }
    return '';
  }
  private cy: cytoscape.Core;
  private primary?: string;
  private secondary?: string;
  constructor(cy: cytoscape.Core) {
    Object.assign(window, {cy});
    this.cy = cy;
    const graphstr = localStorage.getItem('graph');
    if (graphstr) {
      const {version, elements}: LocalStore = JSON.parse(graphstr);
      cy.add(elements);
    }
  }

  public addSearch(query: string, collection: string): string {
    this.addNodeActive(new nodes.search(query, collection));
    const id = this.addNode(new nodes.search(query, collection));
    this.primary = id;
    return id;
  }

  public saveGraph() {
    const data: any = this.cy.json();
    console.log(data.elements);
    localStorage.setItem('graph', JSON.stringify({version: 1, elements: data.elements}));
  }

  public addFacetSearch(query: string, collection: string): string {
    const id = this.addNode(new nodes.search(query, collection));
    this.primary = id;
    return id;
  }
  public emitDetailFromActiveNode(collection: string, field: string, value: string) {
    const node = this.cy.$(':selected');
    if (node.length !== 1) {
      throw new Error('No active node to emit from');
    }
    const parent = node.id();
    this.addFacet(parent, collection, field, value);
  }
  public addFacet(parent: string, collection: string, field: string, value: string) {
    // const parent: string = this.getNodeTyped(this.activeNode, NodeKind.SEARCH).data('id');
    const child = this.addNode(this.detailFactory(collection, field, value));
    this.addEdge(parent, child);
    this.layout();
  }

  public getScratchValue(nodeid: string, scratchname: string) {
    return this.cy.$id(nodeid).scratch(scratchname);
  }

  public setScratchValue(nodeid: string, scratchname: string, value: any) {
    this.cy.$id(nodeid).scratch(scratchname, value);
  }
  private layout() {
    this.cy.layout({name: 'dagre', rankDir: 'LR', nodeDimensionsIncludeLabels: true}).run();
  }

  private detailFactory(collection: string, field: string, value: string): NodeData {
    switch (field) {
      case 'author': return new nodes.author(collection, value);
      case 'journal': return new nodes.journal(collection, value);
      case 'venue': return new nodes.venue(collection, value);
      default: return new FacetSearchData(collection, field, value);
    }
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
  private addNodeActive(data: NodeData): string {
    if (0 === this.cy.getElementById(data.id).length) {
      this.cy.nodes().unselect();
      const node = this.cy.add({group: 'nodes', data});
      node.select();
    } // TODO: what to do when node exists? Blink it? Focus on it?
    return data.id;
  }

  private addNode(data: NodeData): string {
    if (0 === this.cy.getElementById(data.id).length) {
      this.cy.add({group: 'nodes', data});
    } // TODO: what to do when node exists? Blink it? Focus on it?
    return data.id;
  }
  private addNodeParent(data: NodeData, parent: string): string {
    if (0 === this.cy.getElementById(data.id).length) {
      this.cy.add({group: 'nodes', data: {...data, parent}});
    } // TODO: what to do when node exists? Blink it? Focus on it?
    return data.id;
  }
}
