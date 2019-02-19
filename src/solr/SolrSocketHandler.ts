import {HandleableWebSocket, WebSocketHandler} from '../plugins/vue-solr/lib/HandleableWebSocket';

class SolrSocketHandler implements WebSocketHandler  {
  private sock: HandleableWebSocket;
  private queue: any[];
  private workers: Map<number, Worker>;
  constructor() {
    this.sock = new HandleableWebSocket(this, 'SolrSocketHandler_FIX_ME');
    this.queue = [];
    this.workers = new Map<number, Worker>();
  }

  public send(payload: string) {
    if (this.sock.isOpen) {
      this.queue.push(payload);
    } else {
      this.sock.send(payload);
    }
  }

  public onerror(ev: Event) {
    console.error(ev);
  }

  public onmessage(ev: MessageEvent) {
    const message = JSON.parse(ev.data);
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
  }

  public onopen(ev: Event) {
    const content = this.queue;
    this.queue = [];
    if (content.length) {
      content.map((d) => this.send(d));
    }
  }

  public onclose(ev: CloseEvent) {
    if (!ev.wasClean) {
      console.error('Chat socket closed unexpectedly: ' + ev.reason);
    }
    if (this.workers.size !== 0) {
      console.log('had active workers!');
    }
  }
}

export { SolrSocketHandler };
