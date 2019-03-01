<template>
  <div name="search">
      <input placeholder="author, title, year" id="search-input" type="text" title="search text"
        v-model="query" 
        @keyup.enter="submitSearch"
      />
      <collection-select @change="collection = $event"/>
      <input id="search-submit" type="button" value="search"
        @click="submitSearch"
      />
      <span v-if="0 !== pageCount">
        <input id="page-input" min="1" type="number" title="page"
          :max="pageCount"
          v-model="currentPage"
        /> / {{ pageCount }}
      </span>
      <search-result 
        v-for="doc in docs" 
        :doc="doc" 
        :key="doc.id"/>

  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import SearchResult from './SearchResult.vue';
import CollectionSelect from './CollectionSelect.vue';

export default Vue.extend({
  name: 'Search',
  components: { SearchResult, CollectionSelect },
  data: () => ({
    query: '',
    activesort: 'outCitations_count dec',
    sortby: ['year desc', 'outCitations_count desc'],
    collection: 's2',
    lastQuery: '',
    result: {},
    start: 0,
    docs: new Array<any>(),
    pageDocs: new Map<number, any[]>(),
    currentPage: '1',
    numFound: 0,
    rows: 10,
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    submitSearch() {
      this.pageDocs = new Map();
      this.lastQuery = this.query;
      // this.start = 0;
      this.numFound = 0;
      this.getPageData(1);
    },
    getPageData(page: number) {
      // dis too slow, sometimes.
      // cursor implementation is solr is not faster, it's slower than normal
      // http://lucene.apache.org/solr/guide/7_4/pagination-of-results.html#cursor-examples
      const start = (page - 1) * this.rows;
      const payload = {params: {
        'q': this.lastQuery,
        'rows': this.rows,
        'debug': 'query',
        start,
        'defType': 'edismax',
        // 'fl': 'title',
        'qf': 'suggest_lower^10 suggest_ngram',
        'q.op': 'AND',
        // 'omitHeader': 'true',
        'sort': 'year desc'}};
      /* using AND:
      +(
        +(suggest_ngram:ropinski | (suggest_lower:ropinski)^10.0)
        +(suggest_ngram:maisch   | (suggest_lower:maisch)^10.0)
      ) */
      /* using OR:
      +(
        (suggest_ngram:ropinski | (suggest_lower:ropinski)^10.0)
        (suggest_ngram:maisch   | (suggest_lower:maisch)^10.0)
      ) */
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
    startTree(stuff: any) {
      this.$emit('starttree', stuff);
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
      this.pageDocs.set(page, []);
      this.getPageData(page);
    },
  },

});
</script>
