<template>
  <span>
    <img :src="icon" :title="hint" @click="emit"/>
    <span>{{name}}</span>
  </span>
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
      this.$cy.controller.addLinkedToActive(simpleBuilder(this.field, this.collection, this.name));
    },
  },
  computed: {
    icon(): string {
      return `/${this.field}.svg`;
    },
    hint(): string {
      return `add ${this.field} to graph`;
    },
  },
});
</script>
<style scoped>
img {
  height: 1em;
  opacity: 0.5;
  background-color: rgb(255, 251, 0);
}
img:hover {
  opacity: 1;
  cursor: pointer;
  background-color: white;
}
</style>
