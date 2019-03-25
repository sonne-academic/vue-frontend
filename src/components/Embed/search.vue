<template>
  <div>
    <input id="filter-input" type="text" v-model="q_filter" placeholder="filter harder"/>
    <span v-if="0 !== pageCount">
      <input id="page-input" min="1" type="number" title="page"
        :max="pageCount"
        v-model="currentPage"
      /> / {{ pageCount }} ({{numFound}} hits)
    </span>
    <search-result 
      v-for="doc in docs" 
      :doc="doc" 
      :key="doc.id"
      :collection="collection"
      />
    <spinner v-if="searchInProgress.get(activePage)"/>
    <span v-else-if="docs.length==0"> nothing (0 hits) </span>

  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import {SearchResult} from '../Emitters';
import spinner from '../util/spinner.vue';
export default Vue.extend({
  name: 'EmbeddedSearch',
  components: { SearchResult, spinner },
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
      activesort: 'year desc',
      sortby: ['year desc', 'cited_by_count desc'],
      sortdir: 'desc',
      sortdirs: ['desc', 'asc'],
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
      this.searchInProgress = new Map();
      this.currentPage = '1';
      // this.start = 0;
      this.numFound = 0;
      this.getPageData(1);
    },
    getPageData(page: number) {
      const start = (page - 1) * this.rows;
      this.searchInProgress.set(page, true);
      const payload = {params: {
        q: this.query + ' ' + this.filters.join(' '),
        rows: this.rows,
        start,
        sort: `year ${this.sortdir}`}};
      if (this.q_filter) {
        const flt = this.q_filter
          .split(' ').filter((s) => s !== '')
          .map((s) => `+(suggest_ngram:${s} | (suggest_lower:${s})^10.0)`);
        payload.params.q += ' ' + flt.join(' ');
        console.log(payload.params.q);
      }
      this.$solr.select({collection: this.collection, payload})
        .then((d: any) => {
          this.result = d;
          this.pageDocs.set(page, d.response.docs);
          this.numFound = d.response.numFound;
          if (this.activePage === page) {
            this.docs = d.response.docs;
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
    update() {
      this.submitSearch();
    },
  },
  computed: {
    pageCount(): number {
      if ( this.numFound === 0) {
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
  },
  mounted() {
    this.update();
  },

});
</script>
