import WorkerWrapper from './WorkerWrapper';

export class Searcher {
  private query: string;
  private collection: string;
  private solr: WorkerWrapper;
  private rows: number = 10;
  private responses: Map<number, Promise<any>> = new Map();

  constructor($solr: WorkerWrapper, $query: string, $collection: string) {
    this.query = $query;
    this.collection = $collection;
    this.solr = $solr;
  }

  public getPage(num: number): Promise<any> {
    const p = this.responses.get(num);
    if (p) {
      return p;
    }
    return this.search(num);
  }

  public async pageCount() {
    const resolved = await Promise.race(this.responses.values());
    return resolved.response.numFound;
  }

  private async search(page: number) {
    const start = (page - 1) * this.rows;
    const payload = {params: {
      'q': this.query,
      'rows': this.rows,
      'debug': 'query',
      start,
      'defType': 'edismax',
      // 'fl': 'title',
      'qf': 'suggest_lower^10 suggest_ngram',
      'q.op': 'AND',
      // 'omitHeader': 'true',
      'sort': `year desc`}};
    const p = this.solr.select({collection: this.collection, payload});
    this.responses.set(page, p);
    return p;
  }
}
