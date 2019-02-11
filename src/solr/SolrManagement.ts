// import { SolrCommandSocket } from '@/solr/SolrCommandSocket';

// export default class SolrManagement {
//   private sock: SolrCommandSocket;
//   private collections: any;
//   constructor() {
//     this.sock = new SolrCommandSocket();
//     this.collections = [];
//     // this._get_collections();
//   }

//   public _get_collections() {
//     this.sock
//       .get_request('/collections')
//       .then((d: any) => {
//         if (d.hasOwnProperty('collections')) {
//           this.collections = d.collections;
//         } else {
//           throw new Error('request to collections yielded unexpected result:\n' +
//             JSON.stringify(d));
//         }
//       })
//       .catch(console.error);
//   }

//   public get_endpoint(endp: string) {
//     return this.sock.get_endpoint(endp);
//   }

//   public close() {
//     this.sock.close();
//   }
// }
