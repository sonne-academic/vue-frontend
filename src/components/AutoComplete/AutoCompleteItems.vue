<template>
  <div class="ac-container" :style="pos">
    <div v-for="k in results" :key='k.id' v-html="k.value"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'AutoCompleteItems',
  props: {
    results: {
      default: new Array<HighlitedResult>(),
    },
    pos: {},
  },
});
</script>

<style scoped>
</style>
