<template>
  <div>
    <img id="clear" src="/close.svg" @click="clear">
    <!-- <svg id="save"><use href="/symbols.svg#save"/></svg> -->
    <img id="save" src="/save.svg" @click="store">
    <textarea rows=10 cols=80 
    id="global-log" 
    readonly 
    title="log" 
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
#save {
  position: absolute;
  stroke-width: 1;
  stroke: gray;
  right: 2.5em;
  top: 0.5em;
  height: 1.5em;
  width: 1.5em;
}
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
</style>
