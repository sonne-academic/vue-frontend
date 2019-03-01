<template>
    <div>
      <input id="search-input" v-model="query" @keyup.enter="submitSearch" type="text" title="search text"/>
      <collection-select @change="collection = $event"/>
      <input id="search-submit" @click="submitSearch" type="button" value="search"/>
      <button @click="layout"/>
      <facet-search-result v-if="result" :response="result"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapActions } from 'vuex';
import {SearchNode, Node} from '@/store/modules/navgraph';
import FacetSearchResult from './FacetSearch/FacetSearchResult.vue';
import CollectionSelect from './CollectionSelect.vue';

export default Vue.extend({
  name: 'FacetSearch',
  components: { FacetSearchResult, CollectionSelect },
  data: () => ({
    query: 'author:*Ropinski*',
    collection: 's2',
    result: null,
    context: '',
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
  methods: {
    layout() {
      this.$cy.instance.then((cy) => {
        cy.layout({name: 'grid'}).run();
      });
    },
    getContext() {return this.context; },
    commitSearch(node: SearchNode): Promise<Node> {
      return this.$store.dispatch('changeSearchRoot', node);
    },
    log(content: any) {
      this.$store.dispatch('log/log', content);
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
      const data = await this.commitSearch({collection: this.collection, query: this.query});
      this.context = data.id;
      const cy = await this.$cy.instance;
      cy.add({group: 'nodes', data});
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
