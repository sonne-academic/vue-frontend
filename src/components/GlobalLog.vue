<template>
  <div>
    <img src="/close.min.svg" @click="clear">
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
      this.$store.dispatch('log/clear');
    },
  },
  computed: {
    logContent(): string[] {
      return this.$store.getters['log/logContent'];
    },
    logText(): string {
      return this.logContent.reduce((prev, next) => prev + '\n' + next, '');
    },
  },
});
</script>
<style scoped>
img {
  position: absolute;
  right: 0.5em;
  top: 0.5em;
  height: 1.5em;
  opacity: 0.5;
}
img:hover {
  opacity: 1;
}
</style>
