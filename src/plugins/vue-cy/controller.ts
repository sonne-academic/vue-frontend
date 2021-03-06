import { NodeData, uuidgen } from './nodes/base';
import {DataNodes} from './nodes';

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

  private get singleActiveNode(): cytoscape.NodeSingular {
    const node = this.activeNodes;
    if (1 < node.length) {
      return this.makeMid();
      // throw new Error('cannot act on multiple nodes');
    }
    if (0 === node.length) {
      throw new Error('No node selected');
    }
    return node;
  }

  // constructor and fields
  private cy: cytoscape.Core;
  constructor(cy: cytoscape.Core) {
    Object.assign(window, {cy});
    this.cy = cy;
  }

  public restoreFromLocalStorage() {
    const graphstr = localStorage.getItem('graph');
    if (graphstr) {
      const {version, elements}: LocalStore = JSON.parse(graphstr);
      this.cy.add(elements);
    }
  }

  public getNodeById(id: string): cytoscape.NodeSingular {
    const node = this.cy.$id(id);
    if (node.length !== 1) {
      throw new Error(`no node with id: ${id}`);
    }
    return node;
  }

  public saveGraph() {
    const data: any = this.cy.json();
    localStorage.setItem('graph', JSON.stringify({version: 1, elements: data.elements}));
  }

  public addActive(data: NodeData) {
    this.addNodeActive(data);
    this.layout();
    this.cy.center(this.activeNodes);
  }

  public addLinkedToActive(data: NodeData) {
    const parentNode = this.singleActiveNode;
    const child = this.addNode(data);
    this.addEdge(parentNode.id(), child);
    this.layout();
    return child;
  }
  public selectNodeById(id: string) {
    this.cy.elements().unselect();
    const node = this.cy.$id(id).select();
    this.cy.center(node);
  }

  public enhance(ele: cytoscape.NodeSingular) {
    this.cy.fit(ele);
    // TODO
  }

  public remove(eles: cytoscape.CollectionReturnValue) {
    eles.unselect();
    const removed = eles.remove();
    this.cy.nodes('[component="multi"]').forEach((node) => {
      if (node.successors('node').length === 0) {
        removed.union(node.remove());
      }
    });
    return removed;
  }

  public layout() {
    this.cy.zoomingEnabled(false);
    this.cy.layout({
      name: 'dagre',
      rankDir: 'LR',
      nodeDimensionsIncludeLabels: true,
      animate: 'end',
      animationDuration: 250,
      ranker: 'network-simplex',
      // ranker: 'tight-tree',
      // ranker: 'longest-path',
      minLen: ( e ) => {
        if (e.target().data('component') === 'multi') {
          return 0.5;
        }
        if (e.source().data('component') === 'multi') {
          return 0.5;
        }
        return 1;
      },
    }).run();
    this.cy.zoomingEnabled(true);
    // this.cy.one('layoutstop', () => (this.cy.center(this.activeNodes)));
  }
  public fit() {
    this.cy.fit();
  }
  public reset_zoom() {
    this.cy.zoom(1);
  }

  private makeMid() {
    const c = this.activeNodes;
    const compoundId = c.map((node) => node.id()).join(';');
    const data = new DataNodes.multi('IDUNNOLOL', compoundId);
    if (this.cy.$id(data.id).length === 0) {
      this.cy.add({
        group: 'nodes',
        data,
        classes: 'mid',
      });
    }
    const parent = this.cy.$id(data.id);
    c.forEach((node) => {this.addEdge(node.id(), parent.id()); });
    return parent;
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
