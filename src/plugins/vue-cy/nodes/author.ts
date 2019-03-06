import {NodeData, NodeKind} from './base';

export class AuthorData extends NodeData {
  public component: NodeKind = NodeKind.AUTHOR;
  public readonly name: string;
  constructor(name: string) {
    super(name);
    this.name = name;
  }
}
