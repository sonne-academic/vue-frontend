import Worker from 'worker-loader!./solr.worker';
import {RpcRequest} from './RpcRequest';
import Endpoint from './Endpoint';
import { RpcResponse } from './RpcResponse';

const joinParams = (params: string[][]) => [...params].map((kv) => kv.join('=')).join('&');

interface RpcCallback {
  onmessage: (d: RpcResponse) => void;
  onerror: (d: RpcResponse) => void;
}

export default class QueryableWorker {
  private worker: Worker;
  private callbacks: Map<number, RpcCallback> = new Map();
  private counter: number = 1;
  constructor() {
    this.worker = new Worker();
    this.worker.onerror = (event) => {
      console.error(`error in worker: ${event.message}`);
    };
    this.worker.onmessage = (event) => this.receiveFromWorker(event);
  }

  public send_command(command: string, method: string, endpoint: string, payload: any): Promise<RpcResponse> {
    const id = this.counter++;
    // create promise before sending the message, so there is a worker to handle responses.
    const promise = new Promise<RpcResponse>((resolve, reject) => {
      this.callbacks.set(id, {
        onmessage:  (d: RpcResponse) => {
          resolve(d);
          this.callbacks.delete(id);
        },
        onerror: (d: RpcResponse) => {
          reject(d);
          this.callbacks.delete(id);
        },
      });
    });
    const request = new RpcRequest(command, id, {method, endpoint, payload});
    this.submitToWorker(request);
    return promise;
  }

  public get_endpoint(endpoint: string): Promise<Endpoint> {
    return new Promise((resolve, reject) => {
      this.send_command('send_command', 'GET', endpoint + '/_introspect', {})
      .then((d) => {
        resolve(new Endpoint(endpoint, d));
      })
      .catch(reject);
    });
  }

  public get_request(endpoint: string, params?: string[][]) {
    return new Promise((resolve, reject) => {
      let uri = endpoint;

      if (params && 0 < params.length) {
        uri += '?' + joinParams(params);
      }

      this.send_command('send_command', 'GET', uri, {})
        .then((d) => {
          resolve(d);
        })
        .catch((c) => reject(`get_request failed: ${c}`));
    });
  }

  private submitToWorker(request: RpcRequest) {
    this.worker.postMessage(request);
  }

  private receiveFromWorker(event: MessageEvent) {
    const data: RpcResponse = event.data;
    const cb = this.callbacks.get(data.id);
    if (!cb) {
      console.error(`had no worker for id: ${data.id}`);
      return;
    }
    if (data.error) {
      cb.onerror(data);
    } else {
      cb.onmessage(data.result);
    }
  }
}
