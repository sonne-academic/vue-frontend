import Worker from 'worker-loader!./solr.worker';
import { RpcRequest, RpcResponse, SelectRequestParams } from './RpcInterface';
import store from '@/store';

interface RpcCallback {
  onmessage: (d: RpcResponse) => void;
  onerror: (d: RpcResponse) => void;
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
  private callbacks: Map<number, RpcCallback> = new Map();
  private counter: number = 1;
  private collects: string[];
  constructor(collections: string[]) {
    this.worker = new Worker();
    this.collects = collections;
    this.worker.onerror = (event) => {
      this.log(`ERR: ${event.message}`);
    };
    this.worker.onmessage = (event) => this.receiveFromWorker(event);
  }

  public select(payload: SelectRequestParams) {
    return this.send('select', payload);
  }

  private log(message: string) {
    store.dispatch('log', `[WorkerWrapper] ${message}`);
  }

  private send_command(command: string, method: string, endpoint: string, payload: any): Promise<RpcResponse> {
    return this.send(command, { method, endpoint, payload });
  }

  private send(command: string, params: any) {
    const id = this.counter++;
    const promise = new Promise<RpcResponse>((resolve, reject) => {
      this.callbacks.set(id, {
        onmessage: (d: RpcResponse) => {
          resolve(d);
          this.callbacks.delete(id);
        },
        onerror: (d: RpcResponse) => {
          reject(d);
          if (d.error) {
            const e = d.error;
            this.log(`ERR: ${e.message}: \n ${JSON.stringify(d.error, undefined, 2)}`);
          }
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

  private receiveFromWorker(event: MessageEvent) {
    const data: RpcResponse = event.data;
    const cb = this.callbacks.get(data.id);
    if (!cb) {
      console.error(`had no callback for id: ${data.id}`);
      return;
    }
    if (data.error) {
      cb.onerror(data);
    } else {
      cb.onmessage(data.result);
    }
  }
}
