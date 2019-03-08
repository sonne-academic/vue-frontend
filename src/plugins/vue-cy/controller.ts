import { NodeData, uuidgen, NodeKind } from './nodes/base';
import { FacetSearchData } from './nodes/facet';
import {DataNodes as nodes} from './nodes';

interface LocalStore {version: number; elements: cytoscape.ElementDefinition; }

export default class CyController {

  public get scratch() {
    return {
      get: (id: string , ns: string) => this.cy.$id(id).scratch(ns),
      set: (id: string , ns: string, val: any) => this.cy.$id(id).scratch(ns, val),
    };
  }
  public get activeNodes(): cytoscape.CollectionReturnValue {
    return this.cy.$('node:selected');
  }
  private cy: cytoscape.Core;
  constructor(cy: cytoscape.Core) {
    Object.assign(window, {cy});
    this.cy = cy;
    const graphstr = localStorage.getItem('graph');
    if (graphstr) {
      const {version, elements}: LocalStore = JSON.parse(graphstr);
      cy.add(elements);
    }
  }

  public getNodeById(id: string): cytoscape.NodeSingular {
    const node = this.cy.$id(id);
    if (node.length !== 1) {
      throw new Error(`no node with id: ${id}`);
    }
    return node;
  }

  public addSearch(query: string, collection: string) {
    this.addNodeActive(new nodes.search(query, collection));
  }

  public saveGraph() {
    const data: any = this.cy.json();
    localStorage.setItem('graph', JSON.stringify({version: 1, elements: data.elements}));
  }

  public emitDetailFromActiveNode(collection: string, field: string, value: string) {
    const node = this.activeNodes;
    if (node.length !== 1) {
      throw new Error('No active node to emit from');
    }
    const parent = node.id();
    this.addFacet(parent, collection, field, value);
  }

  private addFacet(parent: string, collection: string, field: string, value: string) {
    const child = this.addNode(this.detailFactory(collection, field, value));
    this.addEdge(parent, child);
    this.layout();
  }

  private layout() {
    this.cy.layout({name: 'dagre', rankDir: 'LR', nodeDimensionsIncludeLabels: true}).run();
    this.cy.center(this.activeNodes);
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
    if (source === target) {
      // do not add edges on nodes that link on themselves
      return source;
    }
    const data = {
      id: uuidgen(source + target),
      source,
      target,
    };
    // check that we do not add links that exist.
    if (this.cy.$id(data.id).length === 0) {
      this.cy.add({group: 'edges', data});
    }
    return data.id;
  }

  private addNodeActive(data: NodeData): string {
    if (0 === this.cy.getElementById(data.id).length) {
      this.cy.nodes().unselect();
      const node = this.cy.add({group: 'nodes', data});
      node.select();
      this.layout();
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
