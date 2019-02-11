
export interface Error {
  code: number;
  message: string;
  data: any;
}

export class RpcResponse {
  public jsonrpc: string;
  public id: number;
  public result?: any;
  public error?: Error;

  constructor(jsonrpc: string, id: number, result?: any, error?: Error) {
    this.jsonrpc = jsonrpc;
    this.result = result;
    this.id = id;
    this.error = error;
  }
}
