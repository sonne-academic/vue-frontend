<template>
    <div>
      <input id="search-input" v-model="query" @keyup.enter="submitSearch" type="text" title="search text"/>
      <collection-select @change="collection = $event"/>
      <input id="search-submit" @click="submitSearch" type="button" value="search"/>
      <facet-search-result v-if="result" :response="result"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import {SearchNode} from '@/store/modules/navgraph';
import FacetSearchResult from './FacetSearch/FacetSearchResult.vue';
import CollectionSelect from './CollectionSelect.vue';

export default Vue.extend({
  name: 'FacetSearch',
  components: { FacetSearchResult, CollectionSelect },
  data: () => ({
    query: 'author:*Ropinski*',
    collection: 's2',
    result: null,
  }),
  methods: {
    commitSearch(node: SearchNode) {
      this.$store.dispatch('changeSearchRoot', node);
    },
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    submitSearch() {
      const payload = { params: {
        'q': this.query,
        'facet': 'on',
        'rows': 0,
        'facet.field': this.facets,
        'defType': 'edismax',
        'qf': 'suggest_lower^10 suggest_ngram',
        'q.op': 'AND',
        }};
      this.$solr.select({collection: this.collection, payload})
        .then((d: any) => {
          this.result = d;
          this.commitSearch({collection: this.collection, query: this.query});
        }).catch(console.error);

    },
  },
  computed: {
    facets() {
      if ('s2' === this.collection) {
        return ['author', 'journal', 'venue', 'year', 'keywords'];
      }
      if ('dblp' === this.collection) {
        return ['author', 'journal', 'booktitle', 'year'];
      }
      return [];
    },
  },
  watch: {
    collection() {
      this.submitSearch();
    },
  },
});
</script>
