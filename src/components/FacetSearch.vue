<template>
    <div>
      <input id="search-input" v-model="query" @keyup.enter="submitSearch" type="text" title="search text"/>
      <collection-select @change="collection = $event"/>
      <input id="search-submit" @click="submitSearch" type="button" value="search"/>
      <solr-facet-search-result v-if="numFound" :response="result"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SolrFacetSearchResult from './FacetSearch/FacetSearchResult.vue';
import CollectionSelect from './CollectionSelect.vue';

export default Vue.extend({
  name: 'FacetSearch',
  components: { SolrFacetSearchResult, CollectionSelect },
  data: () => ({
    query: 'author:*Ropinski*',
    lastQuery: '',
    collection: 's2',
    result: {},
    start: 0,
    docs: new Array<any>(),
    facets: ['author', 'journal', 'venue', 'year', 'keywords'],
    pageDocs: new Map<number, any[]>(),
    currentPage: '1',
    numFound: 0,
    rows: 10,
  }),
  watch: {
    currentPage() {
      const page = this.activePage;
      const docs = this.pageDocs.get(page);
      if (docs) {
        this.docs = docs;
        return;
      }
      this.pageDocs.set(page, []);
      this.getPageData(page);
    },
  },
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    submitSearch() {
      this.pageDocs = new Map();
      this.lastQuery = this.query;
      // this.start = 0;
      this.numFound = 0;
      const payload = { params: {
            'debug': false,
            'q': this.lastQuery,
            'facet': 'on',
            'rows': 0,
            'facet.field': this.facets,
            }};
      // const payload = {params: {q: this.lastQuery, rows: this.rows, start: this.start}};
      this.$solr.select({collection: this.collection, payload})
        .then((d: any) => {
          this.result = d;
          this.docs = d.facet_counts;
          this.pageDocs.set(1, d.facet_counts);
          this.numFound = d.response.numFound;
        }).catch(console.error);
    },
    getPageData(page: number) {
      const start = (page - 1) * this.rows;
      const payload = {params: {q: this.lastQuery, rows: this.rows, start}};
      this.$solr.select({collection: this.collection, payload})
        .then((d: any) => {
          this.result = d;
          this.pageDocs.set(page, d.response.docs);
          this.numFound = d.response.numFound;
          if (this.activePage === page) {
            this.docs = d.response.docs;
          }
        }).catch(console.error);
    },
    pageChanged() {
      const page = this.activePage;
      if (this.pageDocs.has(page)) {
        const val = this.pageDocs.get(page);
        if (val) {
          this.docs = val;
          return;
        }
      }
      this.pageDocs.set(page, []);
      this.getPageData(this.activePage);
    },
  },
  computed: {
    pageCount(): number {
      if ( this.numFound === 0) {
        return 0;
      }
      const num = this.numFound / this.rows;
      return Math.floor(num) + 1;
    },
    activePage(): number {
      return Number.parseInt(this.currentPage, 10);
    },
  },
});
</script>

<style scoped>
#search-input {
  width: inherit;
}

.dragger {
  width: inherit;
}

details {
  text-align: left;
}

</style>
