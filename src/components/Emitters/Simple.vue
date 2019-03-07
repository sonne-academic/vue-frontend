<template>
  <span class="emitter" @click="emit">{{name}}</span>
</template>

<script lang="ts">
import Vue from 'vue';
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
  },
  methods: {
    emit() {
      if (this.$cy.controller) {
        this.$cy.controller.emitDetailFromActiveNode(this.field, this.name);
      }
    },
  },
});
</script>
