<template>
  <a :title="hint" @click.exact="emitActive" @click.ctrl="emit">
    <img :src="icon" />
    <span>{{name}}</span>
  </a>
</template>

<script lang="ts">
import Vue from 'vue';
import {simpleBuilder} from '@/plugins/vue-cy/nodes';
import { NodeData, NodeKind } from '@/plugins/vue-cy/nodes/base';
export default Vue.extend({
  name: 'SimpleEmitter',
  props: {
    name: {
      type: String,
      required: true,
    },
    field: {
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
      const id = this.$cy.controller.addLinkedToActive(simpleBuilder(this.field, this.collection, this.name));
      return id;
    },
    emitActive() {
      const id = this.emit();
      this.$cy.controller.selectNodeById(id);
    },
  },
  computed: {
    icon(): string {
      return `/${this.field}.svg`;
    },
    hint(): string {
      return `add ${this.field} to graph, hold control to remain in this view`;
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
