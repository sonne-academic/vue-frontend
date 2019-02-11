import Worker from 'worker-loader!./cmd.worker';
import Endpoint from './Endpoint';
import {RpcRequest} from './RpcRequest';
// import store from '@/store';

const joinParams = (params: string[][]) => [...params].map((kv) => kv.join('=')).join('&');

interface SendLog {
  id: number;
  content: any;
}

enum State {
  CONNECTING = 0,
  OPEN = 1,
  CLOSING = 2,
  CLOSED = 3,
}

class SolrCommandSocket {
  private sock: WebSocket;
  private queue: any[];
  private msgCallback?: (message: any) => void;
  private workers: Map<number, Worker>;
  private counter: number;
  constructor(msgCallback?: () => void) {
    this.queue = [];
    this.msgCallback = msgCallback;
    const addr = 'ws://localhost:8000/ws/rpc/solr/';
    // const addr = 'ws://sonne.0ds.de:8001/ws/rpc/solr/';
    this.workers = new Map<number, Worker>();
    this.counter = 0;
    this.sock = new WebSocket(addr);
    this.sock.onmessage = (d) => this.on_message(d);
    this.sock.onclose = (d) => this.on_close(d);
    this.sock.onopen = (d) => this.on_open(d);
    this.sock.onerror = console.error;
  }

  public close() {
    this.sock.close();
  }

  public send(payload: string) {
    if (this.sock.readyState !== State.OPEN) {
      this.queue.push(payload);
    } else {
      this.sock.send(payload);
    }
  }

  public on_open(event: Event) {
    // console.log('websocket connected, sending queue');
    // console.log(event);
    const content = this.queue;
    this.queue = [];
    if (content.length) {
      content.map((d) => this.send(d));
    }
  }

  public on_message(event: MessageEvent) {
    const message = JSON.parse(event.data);
    if (message.result) {
      // console.log(JSON.stringify(message, null, 2));
      const target = this.workers.get(message.id);
      if (target) {
        target.postMessage(message.result);
      }
    } else if (message.error) {
      // console.error(message);
    } else {
      console.error(
        '[SolrCmdSock] unexpected message:\n' + JSON.stringify(message, null, 2),
      );
    }
    if (this.msgCallback) {
      this.msgCallback(message);
    }
  }

  public on_close(event: CloseEvent) {
    if (!event.wasClean) {
      console.error('Chat socket closed unexpectedly: ' + event.reason);
    }
    if (this.workers.size !== 0) {
      console.log('had active workers!');
    }
  }

  public send_command(command: string, method: string, endpoint: string, payload: any) {
    const id = this.counter++;
    const worker = new Worker();
    this.workers.set(id, worker);

    // create promise before sending the message, so there is a worker to handle responses.
    const promise = new Promise((resolve, reject) => {
      worker.onmessage = (d) => {
        resolve(d.data);
        worker.terminate();
        this.workers.delete(id);
      };
      worker.onerror = (d) => {
        reject(d);
        worker.terminate();
        this.workers.delete(id);
      };
    });
    const request = new RpcRequest(command, id, {method, endpoint, payload});
    // console.log(request);

    // this.log({id, content: request});
    this.send(JSON.stringify(request));
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

  // private log(content: SendLog) {
  //   store.dispatch('log/log', content);
  // }
}

export { SolrCommandSocket };
