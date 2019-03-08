<template>
  <div name="search">
      <solr-autocomplete-input id="input"
      :endpoint="endpoint"
      :collection="collection"
      @autocomplete="completion"
      @enter="submitSearch"/>
      <collection-select id="select" @change="collection = $event"/>
      <span id="count" v-if="count">hits: {{count}}</span>
      <auto-complete-items class="auto-items" :results="highlights"/>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import {CollectionSelect, AutoCompleteItems} from './util';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'SearchBox',
  components: { AutoCompleteItems, CollectionSelect },
  data() {
    return {
      query: '',
      collection: '',
      highlights: new Array<HighlitedResult>(),
     count: 0,

    };
  },
  computed: {
    endpoint(): string {
      return `/${this.collection}/suggest`;
    },
  },
  methods: {
    log(content: any) {
      this.$store.dispatch('log', content);
    },
    completion(cmp: {count: number, result: HighlitedResult[]}) {
      this.highlights = cmp.result;
      this.count = cmp.count;
    },

    submitSearch(query: string) {
      if (this.$cy.controller) {
        const id = this.$cy.controller.addSearch(query, this.collection);
        this.$emit('setactive', {component: 'search-results', id});
      }
      this.query = '';
      this.count = 0;
    },
  },

});
</script>
<style scoped>
#input {
  width: 75%;
}
#select {
  width: 25%;
}
#count {
  position: absolute;
  /* transform: translateX(-100%); */
  /* top: 25%; */
  
}
.auto-items {
  position: absolute;
  max-width: 200%;
  width: 100%;
  /* transform: translateX(25%); */
  background-color: #fff;
}
.auto-items:hover {
  position: absolute;
  border-color: #ccc;
  border-width: 1px;
}
</style>
