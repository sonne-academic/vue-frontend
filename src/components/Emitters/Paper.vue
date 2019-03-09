<template>
  <span class="emitter" @click="emit">{{name}}</span>
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
      if (this.$cy.controller) {
        const paper = new DataNodes.paper(this.collection, this.id, this.name);
        this.$cy.controller.addLinkedToActive(paper);
      }
    },
  },
});
</script>
