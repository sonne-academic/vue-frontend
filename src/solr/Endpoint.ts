import {cartesian} from './utils';
import Command from './Command';


export default class Endpoint {
  public commands: Command[];

  private spec: any;
  private path: string;
  private warning: any;
  private newPaths: any[];
  private responseHeader: any;
  private subpaths: any;

  constructor(path: string, data: any) {
    this.responseHeader = data.responseHeader;
    this.subpaths = data.availableSubPaths || {};
    this.warning = data.WARNING;
    this.spec = data.spec || {};
    this.path = path;
    this.newPaths = [];
    this.commands = [...this._assembleCommands()];
  }

  public *_assembleCommands() {
    for (const spec of this.spec) {
      let fixedParams = [
        spec.url.params,
        spec.description,
        spec.documentation,
      ];
      if (spec.commands === undefined) {
        fixedParams = [null, ...fixedParams];
        for (const [method, url] of cartesian(spec.methods, spec.url.paths)) {
          yield new Command(method, url, null, spec.url.params, spec.description, spec.documentation);
        }
      } else {
        for (const [method, url, cmd] of cartesian(spec.methods, spec.url.paths, Object.keys(spec.commands))) {
          yield new Command(
            method,
            url,
            { command: cmd, params: spec.commands[cmd] },
            spec.url.params, spec.description, spec.documentation,
          );
        }
      }
    }
  }

  public _findPlaceHolders() {
    const placeholders = [];
    for (const path of this.getSubpaths()) {
      const matches = path.match(/{\w+}/g);
      if (matches === null) { continue; }
      placeholders.push(...matches);
    }
    return new Set(placeholders);
  }

  public *getSubpaths() {
    for (const prop of Object.keys(this.subpaths)) {
      yield prop.replace(this.path, '');
    }
  }
}
