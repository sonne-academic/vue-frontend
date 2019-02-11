import Worker from 'worker-loader!./cmd.worker';
import Endpoint from './Endpoint';
import {RpcRequest} from './RpcRequest';
const joinParams = (params: string[][]) => [...params].map((kv) => kv.join('=')).join('&');

import store from '@/store';

interface WebSocketHandler {
  onclose: ((ev: CloseEvent) => any);
  onerror: ((ev: Event) => any) ;
  onmessage: ((ev: MessageEvent) => any);
  onopen: ((ev: Event) => any);
}

class BetterWebSocket extends WebSocket {
  private handler: WebSocketHandler;
  constructor(handler: WebSocketHandler, url: string, protocols?: string|string[]) {
    super(url, protocols);
    this.handler = handler;
    this.onclose = (d) => handler.onclose(d);
    this.onerror = (d) => handler.onerror(d);
    this.onmessage = (d) => handler.onmessage(d);
    this.onopen = (d) => handler.onopen(d);
  }
  public get isOpen() {
    return this.OPEN === this.readyState;
  }
  public get isConnecting() {
    return this.CONNECTING === this.readyState;
  }
  public get isClosing() {
    return this.CLOSING === this.readyState;
  }
  public get isClosed() {
    return this.CLOSED === this.readyState;
  }
}

export { BetterWebSocket, WebSocketHandler };
