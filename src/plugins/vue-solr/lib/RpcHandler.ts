import { HandleableWebSocket, WebSocketHandler } from './HandleableWebSocket';
import { RpcResponse } from './RpcInterface';

export default class RpcHandler implements WebSocketHandler {
  private sock: HandleableWebSocket;
  private queue: string[] = [];
  private results: Map<number, any[]> = new Map();
  private url: string;
  private context: Worker;
  constructor(url: string, context: Worker) {
    this.url = url;
    this.queue = [];
    this.sock = new HandleableWebSocket(this, url);
    this.context = context;
  }

  public close() {
    this.sock.close();
  }

  public send(payload: string) {
    if (this.sock.isOpen) {
      this.sock.send(payload);
      return;
    }
    // not connected, store the payload for later.
    this.queue.push(payload);

    if (this.sock.isClosing) {
      // TODO: schedule reconnect
      return;
    }
    if (this.sock.isClosed) {
      // reconnect immediately
      this.sock = new HandleableWebSocket(this, this.url);
    }
  }

  public onopen(event: Event) {
    console.log('websocket connected');
    const content = this.queue.slice(0, this.queue.length);
    this.queue = [];
    if (content.length) {
      console.log('sending queue');
      content.map((d) => this.send(d));
    }
  }

  public onmessage(event: MessageEvent) {
    const message: RpcResponse = JSON.parse(event.data);
    if (message.error) {
      if (message.id) {
        this.results.delete(message.id);
      }
      this.postToHandler(message);
      return;
    }
    const data = message.result;
    if (data) {
      if (data.responseHeader && data.responseHeader.status === 'accept') {
        console.debug('confirm with id: ' + message.id);
        this.results.set(message.id, []);
        return;
      }
      if (data.responseHeader && data.responseHeader.status === 'finished') {
        console.debug('finished with id: ' + message.id);
        const finished = this.results.get(message.id);
        this.results.delete(message.id);
        if (!finished) {
          return console.log('did not receive any data');
        }
        const msg: RpcResponse = {
          id: message.id,
          jsonrpc: '2.0',
        };
        if (finished.length === 1) {
          msg.result = finished[0];
        } else {
          msg.result = finished;
        }
        this.postToHandler(msg);

        return;
      }
      const res = this.results.get(message.id);
      if ( !res ) {
        console.error('did not receive [accept] message, but got message');
        console.error(JSON.stringify(message));
        return;
      }
      res.push(message.result);
      // console.log(JSON.stringify(message, null, 2));
    } else {
      throw new Error('[SolrCmdSock] unexpected message:\n' + JSON.stringify(message, null, 2));
    }
  }

  public onclose(event: CloseEvent) {
    if (!event.wasClean) {
      console.error('socket closed unexpectedly: ' + event.reason);
    }
    if (this.results.size !== 0) {
      console.log('had active requests!');
    }
  }

  public onerror(event: Event) {
    event.preventDefault();
    throw new Error(`Error in Websocket ${JSON.stringify(event)}`);
  }

  private postToHandler(message: RpcResponse) {
    this.context.postMessage(message);
  }
}