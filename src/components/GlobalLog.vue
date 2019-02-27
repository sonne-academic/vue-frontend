<template>
  <div>
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