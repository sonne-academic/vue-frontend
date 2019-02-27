<template>
<div :id="name" :title="name"/>
</template>

<script lang="ts">
import Vue from 'vue';
import {RenderThing, Node} from './ThreeTreeViewImpl';
import * as d3 from 'd3-hierarchy';

export default Vue.extend({
  name: 'ThreeTreeView',
  props: {
    name: {
      type: String,
      required: true,
    },
    rootid: {
      type: String,
      required: false,
    },
  },
  data: () => ({
    renderthing: new RenderThing(),
    nodesById: new Map<string, Node>(),
    collection: 's2',
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    container() {
      return document.getElementById(this.name);
    },
    updateData() {
      this.renderthing.updateNodes(this.nodesById);
    },
    addNode(node: Node) {
      if (node.parent && !this.nodesById.has(node.parent)) {
        console.error('node has parent, but no matching parent in map');
        return;
      }
      if (node.id && this.nodesById.has(node.id)) {
        // console.error('node with that id already present');
        return;
      }
      this.nodesById.set(node.id, node);
    },
    collectData() {
      this.nodesById.clear();
      // set root
      const node: Node = {id: this.rootid, name: this.rootid};
      this.nodesById.set(this.rootid, node);
      this.fetchSingle(this.rootid)
      .then((data) => {
        console.log(data);
        const doc: any = data;  // TODO: Worker needs to respond with RPCRequest
        const outCitations: string[] = doc.doc.outCitations;
        if (outCitations ===  undefined) {
          throw new Error('outCitations for root empty');
        }
        const newCits = outCitations
          .filter((id) => !this.nodesById.has(id));
        newCits
          .forEach((id) => {
            this.addNode({parent: this.rootid, name: id, id});
          });
        return this.fetchMultiple(newCits);
      })
      .then((data) => {
        const tmp: any = data;
        const docs: any[] = tmp.response.docs;
        const newDocs = docs.filter((doc: any) => !this.nodesById.has(doc));
        const newMaps = newDocs.map(({id, outCitations}) => ({
          parent: id as string,
          children: outCitations as string[],
          }),
        );
        newMaps.forEach(({parent, children}) => {
          if (!children) {
            return;
          }
          const out: string[] = children;
          children.forEach((id) => this.addNode({id, name: id, parent}));
        });
        const childs = newMaps.map((value) => value.children);
        const toFetch: string[] = childs.flat().filter((val: any) => val !== undefined);
        // console.log(toFetch);
        this.updateData();
        return this.fetchMultiple(toFetch);
      })
      .then((data) => {
        const tmp: any = data;
        if (tmp.response === undefined) {
          console.log(tmp);
        }
        const docs: any[] = tmp.response.docs;
        const newDocs = docs.filter((doc: any) => !this.nodesById.has(doc));
        const newMaps = newDocs.map(({id, outCitations}) => ({parent: id, children: outCitations}));
        newMaps.forEach(({parent, children}) => {
          if (!children) {
            return;
          }
          const out: string[] = children;
          out.forEach((id) => this.addNode({id, name: id, parent}));
        });
        this.updateData();
      })
      .catch(console.error);
    },
    fetchSingle(id: string) {
      const payload = {params: {id}};
      return this.$solr.pass_through.get('/collections/s2/get', payload);
    },
    fetchMultiple(ids: string[]) {
      const payload = {params: {ids}};
      return this.$solr.pass_through.get('/collections/s2/get', payload);
    },
    stratify(): d3.HierarchyNode<Node> {
      return d3.stratify<Node>()
      .id((d) => d.id)
      .parentId((d) => d.parent)
      ([...this.nodesById.values()]);
    },
  },
  computed: {
    items(): Node[] {
      return this.$store.getters['d3tree/getItems'];
    },
  },
  watch: {
    items() { // TODO: this triggers multiple times on a single update?
      this.updateData();
    },
    rootid() {
      console.log('rootid changed');
      this.collectData();
    },
  },
  mounted() {
    this.renderthing.init(this.$el);
    window.addEventListener('beforeunload', (ev) => {
      console.log('closing WebGL context through beforeunload');
      this.renderthing.close();
    });
  },
  beforeDestroy() {
    console.log('closing WebGL context');
    this.renderthing.close();
  },
});
</script>

<style scoped>

</style>
