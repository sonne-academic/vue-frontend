<template>
  <div class="ac-container">
    <div class="ac-result"
      @click="clicked(k.id)"
      v-for="k in results" 
      :key='k.id' 
      v-html="k.value"/>
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
  },
  methods: {
    clicked(key: string) {
      console.log(key);
    },
  },
});
</script>

<style scoped>
.ac-result:nth-of-type(2n) {
  background-color: bisque;
}
.ac-result:hover {
  border-width: 1px;
  border-color: red;
  border-style: dashed;
}
</style>
