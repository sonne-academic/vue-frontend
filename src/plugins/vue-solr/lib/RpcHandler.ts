import { HandleableWebSocket, WebSocketHandler } from './HandleableWebSocket';
import { RpcResponse, RpcResult } from './RpcInterface';

export default class RpcHandler implements WebSocketHandler {
  private sock: HandleableWebSocket;
  private queue: string[] = [];
  private outputDebug?: string = process.env.VUE_APP_DEBUG;
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
      // TODO: schedule reconnect?
      return;
    }
    if (this.sock.isClosed) {
      // reconnect immediately
      this.sock = new HandleableWebSocket(this, this.url);
      this.debug('socket was closed, reconnecting');
    }
  }

  public onopen(event: Event) {
    this.debug('websocket connected');
    const content = this.queue.slice(0, this.queue.length);
    this.queue = [];
    if (content.length) {
      this.debug('sending queue');
      content.map((d) => this.send(d));
    }
  }

  public onmessage(event: MessageEvent) {
    const message = this.getResult(event.data);
    this.debug(`received result for id: ${message.id}`);
    this.postToHandler(message);
  }

  public onclose(event: CloseEvent) {
    if (!event.wasClean) {
      this.error('socket closed unexpectedly: ' + event.reason);
    }
    if (this.results.size !== 0) {
      this.log('had active requests!');
    }
  }

  public onerror(event: Event) {
    event.preventDefault();
    throw new Error(`Error in Websocket ${JSON.stringify(event)}`);
  }

  private getResult<T>(data: any): RpcResult<T> {
    const message: RpcResponse<T> = JSON.parse(data);
    if (message.error) {
      this.error(`error for id: ${message.id}`);
      if (message.id) {
        this.results.delete(message.id);
      }
      this.postToHandler(message);
      throw new Error(message.error.message);
    } else if (message.result) {
      return message as RpcResult<T>;
    }
    throw new Error('[SolrCmdSock] unexpected message:\n' + JSON.stringify(message, null, 2));
  }

  private log(message: string) {
    // onlt works in vue components!
    // store.dispatch('log', `[RpcHandler] ${message}`).then(console.log).catch(console.error);
    console.log(`[RpcHandler] ${message}`);
  }

  private debug(message: string) {
    if (this.outputDebug) {
      this.log(`[DBG] ${message}`);
    }
  }
  private error(message: string) {
    this.log(`[ERR] ${message}`);
  }

  private postToHandler<T>(message: RpcResponse<T>) {
    this.context.postMessage(message);
  }
}
