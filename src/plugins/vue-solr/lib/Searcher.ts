import WorkerWrapper from './WorkerWrapper';
import { RpcResult } from './RpcInterface';

type result = RpcResult<{response: { numFound: number, docs: any[], start: number }}>;

export class Searcher {
  private query: string;
  private collection: string;
  private sort: string;
  private solr: WorkerWrapper;
  private rows: number = 10;
  private responses: Map<number, Promise<result>> = new Map();
  private responseComplete: Map<number, boolean> = new Map();
  private facetResponses: Map<string, Promise<any>> = new Map();

  constructor($solr: WorkerWrapper, $query: string, $collection: string, $sort: string) {
    this.query = $query;
    this.collection = $collection;
    this.sort = $sort;
    this.solr = $solr;
  }

  public getPage(num: number) {
    return this.search(num);
  }

  public pageLoadFinished(page: number): boolean {
    const r = this.responseComplete.get(page);
    return !!r;
  }

  public async pageCount() {
    const resolved = await Promise.race(this.responses.values());
    return resolved.result.response.numFound;
  }

  public get payload() {
    return {
      'q': this.query,
      'rows': this.rows,
      'sort': this.sort,
      'defType': 'edismax',
      'qf': 'suggest_lower^10 suggest_ngram',
      'q.op': 'AND',
      'debug': 'query',
    };
  }

  public async getFacet(field: string) {
    const oldPromise = this.facetResponses.get(field);
    if (undefined !== oldPromise) {
      return oldPromise;
    }
    const rows = 0;
    const facet = 'on';
    const payload = {...this.payload, rows, facet, 'facet.field': field};
    const newPromise = this.solr.select({collection: this.collection, payload: {params: payload}});
    this.facetResponses.set(field, newPromise);
    return newPromise;
  }

  private search(page: number) {
    const oldPromise = this.responses.get(page);
    if (undefined !== oldPromise) {
      return oldPromise;
    }
    const start = (page - 1) * this.rows;
    const payload = {...this.payload, start};
    const p = this.solr.select({collection: this.collection, payload: {params: payload}});
    p.then((x) => this.responseComplete.set(page, true));
    this.responses.set(page, p);
    return p;
  }
}
