<template>
  <span class="emitter" @click="emit">{{name}}</span>
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
});
</script>
