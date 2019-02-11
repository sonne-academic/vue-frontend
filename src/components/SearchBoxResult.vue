<template>
    <div>
      <details>
        <summary>{{data.title}}</summary>
        <details v-if="data.entities">
          <summary>entities</summary>
           {{ data.entities.join(', ') }}
        </details>
        <button @click="startTreeVega">vega</button>
        <button @click="startTreeThree">three</button><img src="../assets/disc.png">
      </details>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import {IdParent} from '@/store/modules/idtree';
import {Node} from '@/store/modules/d3tree';


export default Vue.extend({
  name: 'SearchBoxResult',
  props: {
    data: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data: () => ({
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    addVegaNode(node: IdParent) {
      this.$store.dispatch('idtree/appendSingle', node);
    },
    addVegaNodes(nodes: IdParent[]) {
      return this.$store.dispatch('idtree/appendMultiple', nodes);
    },
    addThreeRoot(node: Node) {
      this.$store.dispatch('d3tree/setRoot', node);
    },
    addThreeNodes(nodes: Node[]) {
      return this.$store.dispatch('d3tree/appendItems', nodes);
    },
    startTreeThree(e: Event) {
      // if (this.data.outCitations === undefined) {
      //   return;
      // }
      this.$emit('starttree', {id: this.data.id});
      // this.addThreeRoot({id: this.data.id, name: this.data.id});
      // const nodes1 = this.data.outCitations.map((cite: string) => ({id: cite, name: cite, parent: this.data.id}));
      // this.addThreeNodes(nodes1).finally(() => {
      //   console.log('inserted depth1 nodes');
      // });
      // const payload = {params: {ids: this.data.outCitations}};
      // this.$solr.send_command('pass_through', 'GET', '/collections/s2/get', payload)
      // .then(
      //   (data: any) => {
      //     const nodes2: any[] = [];
      //     const numFound = data.response.numFound;
      //     const start = data.response.start;
      //     const docs = data.response.docs;
      //     let counter = 0;
      //     for (const doc of docs) {
      //       if (!doc.outCitations) {
      //         console.log(`no outCitations for ${doc.id}`);
      //         continue;
      //       }
      //       this.addThreeNodes(doc.outCitations.map(
      //         (cit: string) => ({id: cit + `[${counter++}]`, name: cit, parent: doc.id})));
      //       // depth2_nodes.push(...doc.outCitations.map((cit: string) => ({id: cit, name: cit, parent: doc.id})));
      //       // depth2_nodes.push(...doc.outCitations.map(
      //       // (cit: string) => ({id: cit+`[${counter++}]`, name: cit, parent: doc.id})));
      //     }
      //     return nodes2;
      //   })
      // .then(
      //   (data) => {
      //     this.addThreeNodes(data).then(
      //       (_) => console.log(`added nodes for depth2, had ${data.length}`),
      //       (reject) => console.error(reject),
      //   ).catch(console.error);
      // });
    },
    startTreeVega(e: Event) {
      if (this.data.outCitations === undefined) {
        return;
      }
      this.addVegaNode({id: this.data.id,  name: this.data.id});
      const nodes1 = this.data.outCitations.map((cite: string) => ({id: cite, name: cite, parent: this.data.id}));
      this.addVegaNodes(nodes1).finally(() => {
        console.log('inserted depth1 nodes');
      });

      const payload = {params: {ids: this.data.outCitations}};
      this.$solr.send_command('pass_through', 'GET', '/collections/s2/get', payload)
      .then(
        (data: any) => {
          const nodes2: any[] = [];
          const numFound = data.response.numFound;
          const start = data.response.start;
          const docs = data.response.docs;
          let counter = 0;
          for (const doc of docs) {
            if (!doc.outCitations) {
              console.log(`no outCitations for ${doc.id}`);
              continue;
            }
            this.addVegaNodes(doc.outCitations.map(
              (cit: string) => ({id: cit + `[${counter++}]`, name: cit, parent: doc.id})));
            // depth2_nodes.push(...doc.outCitations.map((cit: string) => ({id: cit, name: cit, parent: doc.id})));
            // depth2_nodes.push(...doc.outCitations.map(
            // (cit: string) => ({id: cit+`[${counter++}]`, name: cit, parent: doc.id})));
          }
          return nodes2;
        })
      .then(
        (data) => {
          this.addVegaNodes(data).then(
            (_) => console.log(`added nodes for depth2, had ${data.length}`),
            (reject) => console.error(reject),
        ).catch(console.error);

      });
    },
  },
});
</script>

<style scoped>
.subspan, ul {
  margin: 0;
  margin-left: 10px;
  padding: 0;
}

li {
  margin-left: 20px;
}

details details {
  margin-left:10px;
}

.dragger {
  width: inherit;
}

details {
  text-align: left;
}

</style>
