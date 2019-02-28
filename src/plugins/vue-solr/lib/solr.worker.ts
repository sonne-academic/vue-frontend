import RpcHandler from './RpcHandler';
const context: Worker = self as any;
// const addr = process.env.VUE_APP_SONNE_HOST + '/ws/rpc/solr/';
const addr = 'ws://localhost:8000/ws/rpc/solr/';
const socket = new RpcHandler(addr, context);
context.addEventListener('message', (event) => {
  socket.send(JSON.stringify(event.data));
});
