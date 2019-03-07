const UUID_NS = 'a171cd2a-ca10-4cc7-8782-733db8d61ccb';

import uuid from 'uuid/v5';
export const uuidgen = (name: string) => uuid(name, UUID_NS);

export enum NodeKind {
  SEARCH = 'search-results',
  FACETSEARCH = 'facet-search-result',
  AUTHOR = 'author-details',
  JOURNAL = 'journal-details',
  PAPER = 'paper-details',
  VENUE = 'venue-details',
  FILTER = 'filter',
  ALIAS = 'alias',
  FACET = 'facet',
}

export interface Node<T extends NodeData> extends cytoscape.NodeDefinition {
  data: T;
}

export abstract class NodeData {
  public readonly component: NodeKind;
  public readonly id: string;
  public readonly name: string;
  public readonly ctime: Date;
  public readonly mtime: Date;
  constructor(component: NodeKind, name: string) {
    const time = new Date();
    this.mtime = time;
    this.ctime = time;
    this.name = name;
    this.component = component;
    this.id = uuidgen(`${component}:${name}`);
  }
}

