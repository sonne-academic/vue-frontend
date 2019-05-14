<template>
  <div class="outer">
    <input type="text" v-model="q_filter" placeholder="filter by title, author, year">
    <select-sort
      :collection="collection"
      @facetchanged="sortby = $event"
      @orderchanged="sortdir = $event"
    />
    <span v-if="0 !== pageCount">
      <input min="1" type="number" title="page" :max="pageCount" v-model="currentPage">
      / {{ pageCount }} ({{numFound}} hits)
    </span>
    <search-result v-for="doc in docs" :doc="doc" :key="doc.id" :collection="collection"/>
    <spinner v-if="searchInProgress.get(activePage)"/>
    <span v-else-if="docs.length==0">nothing (0 hits)</span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import { SearchResult } from '../Emitters';
import { Spinner } from '../util';
import debounce from 'lodash/debounce';
import SelectSort from './SelectSort.vue';
export default Vue.extend({
  name: 'EmbeddedSearch',
  components: { SearchResult, Spinner, SelectSort },
  props: {
    query: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
    filters: {
      // type: String,
      required: true,
      default: new Array<string>(),
    },
  },
  data() {
    return {
      sortby: 'year',
      sortdir: 'desc',
      result: {},
      start: 0,
      docs: new Array<any>(),
      pageDocs: new Map<number, any[]>(),
      searchInProgress: new Map<number, boolean>(),
      currentPage: '1',
      numFound: 0,
      rows: 10,
      q_filter: '',
    };
  },
  methods: {
    log(content: any) {
      this.$store.dispatch('log', content);
    },
    submitSearch() {
      this.pageDocs = new Map();
      this.docs = new Array<any>();
      this.searchInProgress = new Map();
      this.currentPage = '1';
      // this.start = 0;
      this.numFound = 0;
      this.getPageData(1);
    },
    getPageData(page: number) {
      const start = (page - 1) * this.rows;
      this.searchInProgress.set(page, true);
      const payload = {
        params: {
          'q': this.query,
          'rows': this.rows,
          start,
          'sort': this.activeSort,
          'defType': 'edismax',
          'qf': 'suggest_lower^10 suggest_ngram',
          'q.op': 'AND',
          'debug': 'query',
          'fq': '',
        },
      };
      if (this.filters) {
        payload.params.q += ' ' + this.filters.join(' ');
      }
      if (this.q_filter) {
        // const flt = this.q_filter
        //   .split(' ').filter((s) => s.length >= 2)
        //   .map((s) => `+(suggest_ngram:${s} | (suggest_lower:${s})^10.0)`);
        // payload.params.q += ' ' + flt.join(' ');
        payload.params.q += ' ' + this.q_filter;
        // console.log(payload.params.q);
      }
      this.$solr.select({ collection: this.collection, payload })
        .then((d) => {
          this.result = d;
          this.pageDocs.set(page, d.result.response.docs);
          this.numFound = d.result.response.numFound;
          if (this.activePage === page) {
            this.docs = d.result.response.docs;
          }
          this.searchInProgress.set(page, false);
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
    db: debounce(function(this: any) {
      this.submitSearch();
    }, 500),
    update() {
      if (this.debounce) {
        this.db();
      } else {
        this.submitSearch();
      }

    },
  },
  computed: {
    debounce() {
      return !!process.env.VUE_APP_DEBOUNCE;
    },
    pageCount(): number {
      if (this.numFound === 0) {
        return 0;
      }
      const quotient = Math.floor(this.numFound / this.rows);
      const remainder = this.numFound % this.rows;
      if (0 === remainder) {
        return quotient;
      } else {
        return quotient + 1;
      }
    },
    activePage(): number {
      return Number.parseInt(this.currentPage, 10);
    },
    activeSort(): string {
      return [this.sortby, this.sortdir].join(' ');
    },
  },
  watch: {
    filters() {
      this.update();
    },
    query() {
      this.update();
    },
    q_filter() {
      this.update();
    },
    collection() {
      this.update();
    },
    currentPage() {
      if (this.activePage > this.pageCount) {
        return;
      }
      const page = this.activePage;
      const docs = this.pageDocs.get(page);
      if (docs) {
        this.docs = docs;
        return;
      }
      this.docs = [];
      this.pageDocs.set(page, []);
      this.getPageData(page);
    },
    numFound() {
      this.$emit('numfound', this.numFound);
    },
    activeSort() {
      this.update();
    },
  },
  mounted() {
    this.update();
  },

});
</script>
<style scoped>
.outer {
  margin-left: 2em;
}
</style>
