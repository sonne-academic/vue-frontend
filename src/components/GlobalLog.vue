<template>
  <div>
    <img id="clear" src="/close.svg" @click="clear">
    <textarea rows=10 cols=80 
    id="global-log" 
    readonly 
    title="log" 
    :class="textclass"
    v-model="logText"></textarea>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'GlobalLog',
  methods: {
    clear() {
      this.$store.dispatch('clear');
    },
    store() {
      if (this.$cy.controller) {
        this.$cy.controller.saveGraph();
      }
    },
  },
  computed: {
    textclass(): string {
      if (this.logContent.length > 0) {
        return '';
      }
      return 'empty';
    },
    logContent(): string[] {
      return this.$store.getters.logContent;
    },
    logText(): string {
      return this.logContent.reduce((prev, next) => prev + '\n' + next, '');
    },
  },
});
</script>
<style scoped>
img {
  top: 0.5em;
  height: 1.5em;
  opacity: 0.25;
}
#clear {
  position: absolute;
  right: 0.5em;
}
img:hover {
  opacity: 1;
}
.empty {
  display: none;
}
</style>
