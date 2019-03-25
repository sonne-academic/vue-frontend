<template>
  <div name="search">
      <solr-autocomplete-input id="input"
      :endpoint="endpoint"
      :collection="collection"
      @autocomplete="completion"
      @enter="submitSearch"/>
      <collection-select id="select" @change="collection = $event"/>
      <span id="count" v-if="count">hits: {{count}}</span>
      <auto-complete-items @clicked="submitPaper" class="auto-items" :results="highlights"/>
      <img v-if="highlights.length" @click="clear" id="close" src="/close.svg"/>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import {CollectionSelect, AutoCompleteItems} from './util';
import {DataNodes} from '@/plugins/vue-cy/nodes';
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
    clear() {
      this.highlights = new Array<HighlitedResult>();
    },
    completion(cmp: {count: number, result: HighlitedResult[]}) {
      this.highlights = cmp.result;
      this.count = cmp.count;
    },

    submitSearch(query: string) {
      this.$cy.controller.addActive(new DataNodes.search(query, this.collection));
      this.query = '';
      this.count = 0;
    },
    async submitPaper(id: string) {
      const paper = await this.$solr.get(this.collection, id);
      this.$cy.controller.addActive(new DataNodes.paper(this.collection, id, paper.doc.title || 'wat'));
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
#close {
  top: 2em;
  height: 2em;
  width: 2em;
  position: absolute;
}
</style>
