interface RpcBase {
  id: number;
  jsonrpc: string;
}

interface RpcRequestParams {
  method: string;
  endpoint: string;
  payload: any;
}

export interface SelectRequestParams {
  collection: string;
  payload: any;
}

export interface RpcRequest extends RpcBase {
  method: string;
  params: RpcRequestParams | SelectRequestParams;
}

interface Error {
  code: number;
  message: string;
  data: any;
}

export interface RpcResponse<T> extends RpcBase {
  result?: T;
  error?: Error;
}

export interface RpcResult<T> extends RpcBase {
  result: T;
}

export interface RpcError extends RpcBase {
  error: Error;
}
