<template>
  <span class="emitter" @click="emit">{{name}}</span>
</template>

<script lang="ts">
import Vue from 'vue';
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
        this.$cy.controller.emitPaper(
          this.collection, this.id, this.name);
      }
    },
  },
});
</script>
