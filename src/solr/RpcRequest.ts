
interface RpcRequestParams {
  method: string;
  endpoint: string;
  payload: string;
}

export class RpcRequest {
  public jsonrpc: string = '2.0';
  public method: string;
  public id: number;
  public params: RpcRequestParams;

  constructor(method: string, id: number, params: RpcRequestParams) {
    this.method = method;
    this.id = id;
    this.params = params;
  }
}
