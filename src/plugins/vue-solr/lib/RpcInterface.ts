
interface RpcRequestParams {
  method: string;
  endpoint: string;
  payload: any;
}

export interface SelectRequestParams {
  collection: string;
  payload: any;
}

export interface RpcRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params: RpcRequestParams | SelectRequestParams;
}

interface Error {
  code: number;
  message: string;
  data: any;
}

export interface RpcResponse {
  jsonrpc: string;
  id: number;
  result?: any;
  error?: Error;
}
