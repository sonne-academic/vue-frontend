<template>
  <div class="author-container" v-if="author">
    <h1> {{author}} </h1>
    Publications: {{docCount}}
    <dl> 
      <dt>author position in paper</dt>
            <table>
        <tr v-for="index in result" :key="index.idx">
          <td class="right">{{index.idx+1}}</td><td class="right">{{index['count(*)']}}</td>
        </tr>
      </table>

      <span v-for="fdata in facetdata" :key="fdata[0]">
        <dt>{{fdata[0]}}</dt>
        <table>
          <tr v-for="data in fdata[1]" :key="data.name" >
            <td><simple-emitter :field="fdata[0]" :name="data.name"/></td><td class="right">{{data.count}}</td>
          </tr>
        </table>
      </span>
    </dl>    
  </div>
</template>

<style scoped>
/* dl {
  height: 90%;
  overflow-y: auto;
} */
.left {
  text-align: left;
}
.right {
  text-align: right;
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
tr:hover {
  color: white;
  background-color: black;
  cursor: pointer;
}
dd:nth-of-type(2n) {
  background-color: beige;
}
dd:hover {
  color: white;
  background-color: black;
  cursor: pointer;
}
dt {
  background-color: black;
  color: white;
  padding: 0.5em;
  position: sticky;
  top: 0;
  margin: 1em 0;
}
</style>

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
import {SimpleEmitter} from '../Emitters';

function* gen_pairs(arr: any[]) {
  let name: string;
  let count: number;
  while (arr.length) {
    [name, count, ...arr] = arr;
    if (0 === count) {
      continue;
    }
    if (name === '') {
      continue;
    }
    yield { name, count };
  }
}

export default Vue.extend({
  name: 'AuthorDetails',
  components: {SimpleEmitter},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
    collection: {
      type: String,
      default: 's2',
    },
  },
  data: () => ({
    facets: ['author', 'journal', 'venue', 'year', 'keywords'],
    author: '',
    result: new Array<AuthorIndex>(),
    facetResponse: {} as FacetResponse,
    coAuthors: new Array<FacetDetail>(),
    journals: new Array<FacetDetail>(),
    keywords: new Array<FacetDetail>(),
    facetdata: new Map<string, FacetDetail[]>(),
    docCount: 0,
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
  methods: {
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
        const escaped = author.replace(/ /g, '\\ ');
        const search = `search(${this.collection}, q="author:${escaped}", fl="author, id", sort="id desc", qt=/export)`;
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
    async getFacets() {
      if (null === this.author) {
        return;
      }
      const scratchspace = '_author_facets';
      const cy = await this.$cy.instance;
      const node = cy.$id(this.nodeid);
      let result = node.scratch(scratchspace);
      if (!result) {
        const author = this.author;

        const escaped = author.replace(/ /g, '\\ ');
        const payload = { params: {
              'debug': false,
              'q': `author:${escaped}`,
              'facet': 'on',
              'rows': 0,
              'facet.field': this.facets,
              }};
        const d: any = await this.$solr.select({collection: this.collection, payload});
        result = d as FacetResponse;
        node.scratch(scratchspace, result);
      }
      this.facetResponse = result;
      this.docCount = result.response.numFound;
      const flds: FacetFields = result.facet_counts.facet_fields;
      Object.entries(flds)
        .forEach(([key, arr]) => (this.facetdata.set(key, [...gen_pairs(arr)])));

      this.coAuthors = [...gen_pairs(flds.author)];
      this.journals = [...gen_pairs(flds.journal)];
      this.keywords = [...gen_pairs(flds.keywords)];
    },
    log(msg: string) {
      this.$store.dispatch('log', `[AuthorDetails] ${msg}`);
    },
    emitNode(kind: string, value: string) {
      if (this.$cy.controller) {
        this.$cy.controller.addFacet(this.nodeid, kind, value);
      }
    },
    update() {
      this.$cy.instance.then((cy) => {
        const node = cy.$id(this.nodeid);
        if (0 === node.length) {
          throw new Error(`[ERR] no node with ID ${this.nodeid}`);
        }
        return node.data('name');
      })
      .then((author: string) => {
        this.author = author;
        return Promise.all([
          this.authorIndexGroup(),
          this.getFacets()]);
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

