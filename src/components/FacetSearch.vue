<template>
    <div>
      <input placeholder="author, title, year" id="search-input" v-model="query" @keyup.enter="submitSearch" type="text" title="search text"/>
      <collection-select @change="collection = $event"/>
      <input id="search-submit" @click="submitSearch" type="button" value="search"/>
      <facet-search-result v-if="result" :response="result"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
// import {SearchNode, Node} from '@/store/modules/navgraph';
import FacetSearchResult from './FacetSearch/FacetSearchResult.vue';
import CollectionSelect from './CollectionSelect.vue';
import {Data} from '@/plugins/vue-cy/nodes/search';

export default Vue.extend({
  name: 'FacetSearch',
  components: { FacetSearchResult, CollectionSelect },
  data: () => ({
    query: '',
    collection: 's2',
    result: null,
    context: {} as Data,
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
  methods: {
    getContext() { return this.context; },
    log(content: any) {
      this.$store.dispatch('log', content);
    },
    async submitSearch() {
      const payload = { params: {
        'q': this.query,
        'facet': 'on',
        'rows': 0,
        'facet.field': this.facets,
        'defType': 'edismax',
        'qf': 'suggest_lower^10 suggest_ngram',
        'q.op': 'AND',
        }};
      this.result = await this.$solr.select({collection: this.collection, payload}) as any;
      const data = new Data(this.query, this.collection);
      this.context = data;
      const cy = await this.$cy.instance;
      if (this.$cy.controller) {
        this.$cy.controller.addFacetSearch(this.query, this.collection);
      }
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
