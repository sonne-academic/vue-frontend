<template>
    <div>
      <input id="search-input" v-model="query" @keyup.enter="submitSearch" type="text" title="search text"/>
      <input id="search-submit" @click="submitSearch" type="button" value="search"/>
      <span v-if="0 !== pageCount">
      <input id="page-input" 
        v-model="currentPage" 
        min="1" :max="pageCount" type="number" title="page"
        />
      / {{ pageCount }}
      
      </span>
      <solr-facet-search-result v-if="numFound" :response="result"/>
      <!-- <details v-for="doc in docs" :key="doc.id">
        <summary> {{doc.title}}</summary>
         {{doc}}
      </details> -->
    </div>
</template>

<script lang="ts">
import { mapActions } from 'vuex';
import Vue from 'vue';

import { SolrCommandSocket } from '@/solr/SolrCommandSocket';
import SolrFacetSearchResult from './SolrFacetSearchResult.vue';
import store from '@/store';


import Draggable from './Draggable.vue';

export default Vue.extend({
  name: 'FacetSearch',
  components: { Draggable, SolrFacetSearchResult },
  data: () => ({
    query: 'authors.name:*Ropinski*',
    lastQuery: '',
    result: {},
    start: 0,
    docs: new Array<any>(),
    facets: ['authors.name', 'journalName', 'venue', 'year', 'entities'],
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
      store.dispatch('log/log', content);
    },
    submitSearch() {
      this.pageDocs = new Map();
      this.lastQuery = this.query;
      // this.start = 0;
      this.numFound = 0;
      const payload = { params: {
            'debug': true,
            'q': this.lastQuery,
            'facet': 'on',
            'rows': 0,
            'facet.field': this.facets,
            }};
      // const payload = {params: {q: this.lastQuery, rows: this.rows, start: this.start}};
      this.$solr.send_command('pass_through', 'GET', '/collections/s2/select', payload)
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
      this.$solr.send_command('pass_through', 'GET', '/collections/s2/select', payload)
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
