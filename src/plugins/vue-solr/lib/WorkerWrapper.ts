import Worker from 'worker-loader!./solr.worker';
import { RpcRequest, RpcResponse, SelectRequestParams, RpcResult, RpcError } from './RpcInterface';
import store from '@/store';
import { GetResponse } from './responses/GetResponse';
import { Searcher } from './Searcher';
import { AuthorPositionResponse } from './responses/AuthorPositionResponse';

interface RpcCallback<T> {
  onmessage: (d: RpcResult<T>) => void;
  onerror: (d: RpcError) => void;
}

/**
 * provides an interface to the worker thread
 */
export default class WorkerWrapper {

  public get pass_through() {
    return this.command_sender('pass_through');
  }

  public get pass_through_solr() {
    return this.command_sender('pass_through_solr');
  }

  public get collections() {
    return this.collects;
  }

  private worker: Worker;
  private callbacks: Map<number, RpcCallback<any>> = new Map();
  private counter: number = 1;
  private collects: string[];
  private readonly coll: Map<string, string[]>;
  constructor(collections: Map<string, string[]>) {
    this.worker = new Worker();
    this.collects = [...collections.keys()];
    this.coll = collections;
    this.worker.onerror = (event) => {
      this.log(`ERR: ${event.message}`);
    };
    this.worker.onmessage = (event) => this.receiveFromWorker(event);
  }

  public select(payload: SelectRequestParams) {
    // TODO remove any
    return this.send<{response: { numFound: number, docs: any[], start: number }}>('solr_select', payload);
  }

  public search(collection: string, query: string) {
    return new Searcher(this, query, collection);
  }

  public get(collection: string, id: string) {
    return this.send<GetResponse>('solr_get', { collection, id });
  }
  public author_position(collection: string, author: string, rows: number) {
    return this.send<AuthorPositionResponse>('solr_author_position', { collection, author, rows });
  }
  public facets(collection: string) {
    const facets = this.coll.get(collection);
    if (!facets) {
      throw new Error(`invalid collection name, allowed values: ${this.collections.join(', ')}`);
    }
    return facets;
  }

  public upload_graph(data: string) {
    return this.send<{uuid: string}>('store_new_graph', { graph: data });
  }

  public download_graph(uuid: string) {
    return this.send<{graph: {version: number, elements: any}}>('get_graph', { graph_id: uuid });
  }

  public upload_update(data: string, uuid: string) {
    return this.send<{uuid: string}>('update_graph', { graph_id: uuid, data });
  }

  private log(message: string) {
    store.dispatch('log', `[WorkerWrapper] ${message}`);
  }

  private send_command<T>(command: string, method: string, endpoint: string, payload: any) {
    return this.send<T>(command, { method, endpoint, payload });
  }

  private send<T>(command: string, params: any): Promise<RpcResult<T>> {
    const id = this.counter++;
    const promise = new Promise<RpcResult<T>>((resolve, reject) => {
      this.callbacks.set(id, {
        onmessage: (d: RpcResult<T>) => {
          resolve(d);
          this.callbacks.delete(id);
        },
        onerror: (d: RpcError) => {
          reject(d);
          const e = d.error;
          this.log(`ERR: ${e.message}: \n ${JSON.stringify(d.error, undefined, 2)}`);
          this.callbacks.delete(id);
        },
      });
    });
    this.submitToWorker({
      jsonrpc: '2.0',
      method: command,
      id,
      params,
    });
    return promise;
  }
  private build_method(method: string, command: string) {
    return (endpoint: string, payload: any) => this.send_command(command, method, endpoint, payload);
  }

  private command_sender(command: string) {
    return {
      get: this.build_method('GET', command),
      put: this.build_method('PUT', command),
      post: this.build_method('POST', command),
      delete: this.build_method('DELETE', command),
    };
  }
  private submitToWorker(request: RpcRequest) {
    this.worker.postMessage(request);
  }

  private receiveFromWorker<T>(event: MessageEvent) {
    const data: RpcResponse<T> = event.data;
    const cb = this.callbacks.get(data.id);
    if (!cb) {
      console.error(`had no callback for id: ${data.id}`);
      return;
    }
    if (data.error) {
      cb.onerror(data as RpcError);
    } else {
      cb.onmessage(data as RpcResult<T>);
    }
  }
}
