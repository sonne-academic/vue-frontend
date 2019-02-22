import Worker from 'worker-loader!./solr.worker';
import { RpcRequest, RpcResponse } from './RpcInterface';
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

  private worker: Worker;
  private callbacks: Map<number, RpcCallback> = new Map();
  private counter: number = 1;
  constructor() {
    this.worker = new Worker();
    this.worker.onerror = (event) => {
      this.log(`ERR: ${event.message}`);
    };
    this.worker.onmessage = (event) => this.receiveFromWorker(event);
  }

  private log(message: string) {
    store.dispatch('log/log', `[WorkerWrapper] ${message}`);
  }

  private send_command(command: string, method: string, endpoint: string, payload: any): Promise<RpcResponse> {
    const id = this.counter++;
    // create promise before sending the message, so there is a worker to handle responses.
    const promise = new Promise<RpcResponse>((resolve, reject) => {
      this.callbacks.set(id, {
        onmessage: (d: RpcResponse) => {
          resolve(d);
          this.callbacks.delete(id);
        },
        onerror: (d: RpcResponse) => {
          reject(d);
          this.callbacks.delete(id);
        },
      });
    });
    this.submitToWorker({
      jsonrpc: '2.0',
      method: command,
      id,
      params: { method, endpoint, payload },
    });
    return promise;
  }

  private get(command: string) {
    return (endpoint: string, payload: any) => this.send_command(command, 'GET', endpoint, payload);
  }

  private put(command: string) {
    return (endpoint: string, payload: any) => this.send_command(command, 'PUT', endpoint, payload);
  }

  private post(command: string) {
    return (endpoint: string, payload: any) => this.send_command(command, 'POST', endpoint, payload);
  }
  private delete(command: string) {
    return (endpoint: string, payload: any) => this.send_command(command, 'DELETE', endpoint, payload);
  }
  private command_sender(command: string) {
    return {
      get: this.get(command),
      put: this.put(command),
      post: this.post(command),
      delete: this.delete(command),
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
