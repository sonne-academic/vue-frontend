<template>
  <div>
    <h1> <img src="/author.svg"/> {{value}} </h1>
    <details>
      <summary>Filters: {{filters.length}}</summary>
      <div v-for="filter in filters" :key="filter"
      @click="removeFilter(filter)">
        {{filter}}
      </div>
    </details>
    
    <details>
      <summary>Publications: {{docCount}}</summary>
      <embedded-search :filters="filters" :query="embQuery" :collection="collection" @numfound="docCount = $event"/>
    </details>
    <span>
      <details @toggle="clog($event.target.open)"> 
        <summary>author position in paper</summary>
        <table>
          <tr v-for="index in result" :key="index.idx">
            <td class="right">{{index.idx+1}}</td>
            <td class="right">{{index['count(*)']}}</td>
          </tr>
        </table>
      </details>
      <simple-facet-box v-for="(facet, index) in facets" :key="facet" 
        :field="facet"
        :queryField="name"
        :collection="collection" 
        :friendlyName="friendlyNames[index]"
        :queryValue="value"
        @filter="doFilter"
        :filters="filters"
      />

    </span>    
  </div>
</template>

<script lang="ts">
interface FacetDetail {
  name: string;
  count: number;
}
interface AuthorIndex {
  idx: number;
  'count(*)': number;
}
import Vue from 'vue';
import {FacetResponse, FacetFields} from '@/plugins/vue-solr/lib/responses/FacetResponse';
import {SimpleEmitter, SimpleFacetBox} from '../Emitters';
import {EmbeddedSearch} from '../Embed';

export default Vue.extend({
  name: 'AuthorDetails',
  components: {SimpleEmitter, SimpleFacetBox, EmbeddedSearch},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    facets: ['author', 'journal', 'venue', 'year', 'keywords'],
    friendlyNames: [
      'co-authors',
      'published in journals',
      'published on venues',
      'publications in years',
      'associated keywords',
    ],
    name: 'author',
    value: '',
    result: new Array<AuthorIndex>(),
    facetResponse: {} as FacetResponse,
    docCount: 0,
    collection: '',
    embQuery: '',
    filters: new Array<string>(),
  }),
  methods: {
    removeFilter(name: string) {
      this.filters = this.filters.filter((val) => val !== name);
    },
    doFilter(filter: string) {
      this.filters.push(filter);
      const node = this.$cy.controller.getNodeById(this.nodeid);
      node.data('filters', this.filters);
    },
    clog(d: any) {
      console.log(d);
    },
    async authorIndexGroup() {
      const scratchspace = '_author_index';

      let result;
      result = this.$cy.controller.scratch.get(this.nodeid, scratchspace);
      if (!result) {
        console.debug('no data in scratch');
        const author = this.value;
        const idx = 'idx';
        const q = `"author:"${this.value}""`;
        const search = `search(${this.collection}, q=${q}, fl="author, id", sort="id desc", qt=/export)`;
        const select = `select(${search}, indexOf(author, "${author}") as ${idx})`;
        const sort = `sort(${select}, by="${idx} asc")`;
        const rollup = `rollup(${sort}, over="${idx}", count(*))`;
        const data: any = await this.$solr.pass_through_solr.get(`/${this.collection}/stream`, {expr: rollup});
        console.log(rollup);
        console.log(data);
        result = data['result-set'].docs.slice(0, -1);
        if (this.$cy.controller) {
          this.$cy.controller.scratch.set(this.nodeid, scratchspace, result);
        }
      }
      this.result = result;
    },
    log(msg: string) {
      this.$store.dispatch('log', `[AuthorDetails] ${msg}`);
    },
    update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.value = node.data('name');
      this.collection = node.data('collection');
      const filters = node.data('filters');
      if (filters) {
        this.filters = filters;
      } else {
        this.filters = [];
      }
      this.embQuery = `+(${this.name}:"${this.value}")`;
      this.authorIndexGroup();
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  created() {
    this.update();
  },
});
</script>

<style scoped>
.right {
  text-align: right;
  min-width: 2em;
}

td {
  padding: 0;
  background-color: inherit;
}
tr:nth-of-type(2n) {
  background-color: beige;
}
table {
  margin-left: 2em;
  max-width: 80%;
}
summary {
  background-color: black;
  color: white;
  padding: 0.5em;
  position: sticky;
  top: 0;
  margin: 1em 0;
}
</style>
