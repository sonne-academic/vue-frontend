interface WorkerHandler {
  onmessage: ((this: Worker, ev: MessageEvent) => any) | null;
  onerror: ((this: AbstractWorker, ev: ErrorEvent) => any) | null;
}

type Option = boolean | AddEventListenerOptions | undefined;

class SolrSocketWorker {
  public oncompletion: ((ev: any) => void);
  public onerror: ((ev: any) => void);
  private results: any[] = [];
  constructor() {
    this.oncompletion = (d) => {/* do nothing */};
    this.onerror = (d) => {/* do nothing */};
  }
  public postMessage(message: any): void {
    const data = message.data;
    if (data.responseHeader.status === 'accept') {
      console.debug('got accept');
      return;
    }
    if (data.responseHeader.status === 'finished') {
      if (1 === results.length) {
        this.oncompletion(results[0]);
      } else {
        this.oncompletion(this.results);
      }
      return;
    }
    // console.log('result: ' + content);
    this.results.push(message);
  }
  public terminate(): void {
    this.results = [];
  }
}
