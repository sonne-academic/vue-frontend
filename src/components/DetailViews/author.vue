<template>
  <div>
    <h1> {{author}} </h1>
    Publications: {{docCount}}
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
        queryField="author"
        :collection="collection" 
        :friendlyName="friendlyNames[index]"
        :queryValue="author"
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

export default Vue.extend({
  name: 'AuthorDetails',
  components: {SimpleEmitter, SimpleFacetBox},
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
    author: '',
    result: new Array<AuthorIndex>(),
    facetResponse: {} as FacetResponse,
    docCount: 0,
    collection: '',
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
  methods: {
    clog(d: any) {
      console.log(d);
    },
    async authorIndexGroup() {
      if (null === this.author) {
        return;
      }
      const scratchspace = '_author_index';

      let result;
      if (this.$cy.controller) {
        result = this.$cy.controller.getScratchValue(this.nodeid, scratchspace);
      }
      if (!result) {
        console.debug('no data in scratch');
        const author = this.author;
        const idx = 'idx';
        const q = `"author:"${this.author}""`;
        const search = `search(${this.collection}, q=${q}, fl="author, id", sort="id desc", qt=/export)`;
        const select = `select(${search}, indexOf(author, "${author}") as ${idx})`;
        const sort = `sort(${select}, by="${idx} asc")`;
        const rollup = `rollup(${sort}, over="${idx}", count(*))`;
        // console.log(rollup);
        const data: any = await this.$solr.pass_through_solr.get(`/${this.collection}/stream`, {expr: rollup});
        console.log(data);
        result = data['result-set'].docs.slice(0, -1);
        if (this.$cy.controller) {
          this.$cy.controller.setScratchValue(this.nodeid, scratchspace, result);
        }
      }
      this.result = result;
    },
    log(msg: string) {
      this.$store.dispatch('log', `[AuthorDetails] ${msg}`);
    },
    update() {
      this.$cy.instance.then((cy) => {
        const node = cy.$id(this.nodeid);
        if (0 === node.length) {
          throw new Error(`[ERR] no node with ID ${this.nodeid}`);
        }
        return [node.data('name'), node.data('collection')];
      })
      .then(([author, collection]) => {
        this.author = author;
        this.collection = collection;
        return Promise.all([
          this.authorIndexGroup(),
          ]);
      })
      .catch((reason: any) => this.log(reason));
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  mounted() {
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
