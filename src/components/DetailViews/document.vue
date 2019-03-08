<template>
  <div class="author-container" v-if="author">
    <h1> {{author}} </h1>
    Publications: {{docCount}}
    <dl> 
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
tr:nth-of-type(2n-1) {
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
  name: 'PaperDetails',
  components: {SimpleEmitter},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    facets: ['author', 'journal', 'venue', 'year', 'keywords'],
    author: '',
    facetResponse: {} as FacetResponse,
    facetdata: new Map<string, FacetDetail[]>(),
    docCount: 0,
    collection: '',
    id: '',
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
  methods: {
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
              'q': `journal:"${author}"`,
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
    },
    log(msg: string) {
      this.$store.dispatch('log', `[PaperDetails] ${msg}`);
    },
    emitNode(kind: string, value: string) {
      if (this.$cy.controller) {
        this.$cy.controller.addFacet(this.nodeid, this.collection, kind, value);
      }
    },
    update() {
      this.$cy.instance.then((cy) => {
        const node = cy.$id(this.nodeid);
        if (0 === node.length) {
          throw new Error(`[ERR] no node with ID ${this.nodeid}`);
        }
        return node.data('collection'), node.data('pid');
      })
      .then(([collection, id]) => {
        this.collection = collection;
        this.id = id;
        return Promise.all([
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

