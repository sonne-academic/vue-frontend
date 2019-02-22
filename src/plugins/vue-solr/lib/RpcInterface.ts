
interface RpcRequestParams {
  method: string;
  endpoint: string;
  payload: string;
}

export interface RpcRequest {
  jsonrpc: string;
  method: string;
  id: number;
  params: RpcRequestParams;
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
