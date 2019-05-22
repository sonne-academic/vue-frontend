<template>
  <a @click.exact="emitActive" @click.ctrl="emit" title="add paper to graph, hold control to remain in this view">
    <img src="/paper.svg"/><span> {{name}}</span></a>
</template>

<script lang="ts">
import Vue from 'vue';
import {DataNodes} from '@/plugins/vue-cy/nodes';
export default Vue.extend({
  name: 'PaperEmitter',
  props: {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
  },
  methods: {
    emit() {
      const paper = new DataNodes.paper(this.collection, this.id, this.name);
      return this.$cy.controller.addLinkedToActive(paper);
    },
    emitActive() {
      const id = this.emit();
      this.$cy.controller.selectNodeById(id);
    },

  },
});
</script>
<style scoped>
img {
  height: 1em;
  opacity: 0.5;
  /* background-color: rgb(255, 251, 0); */
}
a:hover > img {
  opacity: 1;
  cursor: pointer;
  background-color: white;
}
a:hover > span {
  background-color: white;
  color: blue;
  cursor: pointer;
}
</style>
