<template>
  <div class="author-container" v-if="author">
    <h1> {{author}} </h1>
    <dl> 
      <dt>author position in paper</dt>
      <dd v-for="index in result" :key="index.idx"> {{index.idx}}: {{index['count(*)']}} </dd>
      <dt>co-authors</dt>
      <dd v-for="facet in coAuthors" :key="facet.name"> {{facet.name}}: {{facet.count}} </dd>
      <dt>journals</dt>
      <dd v-for="facet in journals" :key="facet.name">{{facet.name}}: {{facet.count}}</dd>
      <dt>keywords</dt>
      <dd v-for="facet in keywords" :key="facet.name">{{facet.name}}: {{facet.count}}</dd>
    </dl>    
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
import {FacetNode, NodeKind, Node} from '@/store/modules/navgraph';
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
  props: {
    author: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      default: 's2',
    },
  },
  data: () => ({
    facets: ['author', 'journal', 'venue', 'year', 'keywords'],
    result: new Array<AuthorIndex>(),
    facetResponse: {} as FacetResponse,
    coAuthors: new Array<FacetDetail>(),
    journals: new Array<FacetDetail>(),
    keywords: new Array<FacetDetail>(),
  }),
  methods: {
    authorIndexGroup() {
      if (null === this.author) {
        return;
      }
      const author = this.author;
      const idx = 'idx';
      const escaped = author.replace(/ /g, '\\ ');
      const search = `search(${this.collection}, q="author:${escaped}", fl="author, id", sort="id desc", qt=/export)`;
      const select = `select(${search}, indexOf(author, "${author}") as ${idx})`;
      const sort = `sort(${select}, by="${idx} asc")`;
      const rollup = `rollup(${sort}, over="${idx}", count(*))`;
      console.log(rollup);
      this.$solr.pass_through_solr.get(`/${this.collection}/stream`, {expr: rollup})
        .then((data: any) => {
          console.log(data);
          this.result = data['result-set'].docs.slice(0, -1);
        }).catch(console.error);
    },
    getFacets() {
      if (null === this.author) {
        return;
      }
      const author = this.author;

      const escaped = author.replace(/ /g, '\\ ');
      const payload = { params: {
            'debug': false,
            'q': `author:${escaped}`,
            'facet': 'on',
            'rows': 0,
            'facet.field': this.facets,
            }};
      this.$solr.select({collection: this.collection, payload})
        .then((d: any) => {
          const tmp = d as FacetResponse;
          this.facetResponse = d;
          const flds = tmp.facet_counts.facet_fields;
          this.coAuthors = [...gen_pairs(flds.author)];
          this.journals = [...gen_pairs(flds.journal)];
          this.keywords = [...gen_pairs(flds.keywords)];
        }).catch(console.error);
    },
    update() {
      this.authorIndexGroup();
      this.getFacets();
    },
  },
  watch: {
    author() {
      this.update();
    },
  },
  computed: {
    currentAuthor(): string | null {
      const c: Node = this.$store.getters.current;
      if (null === c) {
        return null;
      }
      if (NodeKind.FACET !== c.kind) {
        return null;
      }
      const d = c.data as FacetNode;
      if ('author' !== d.facetField) {
        return null;
      }
      return d.facetValue;
    },
  },
  mounted() {
    this.update();
  },
});
</script>

<style scoped>
.author-container {
  position: fixed;
  overflow:auto;
  display: block;
  top: 0;
  right: 0;
  width: 25%;
  height:100%;
}
dt {
  background-color: black;
  color: white;
  padding: 10px;
  position: sticky;
  top: 0;
  left: 0;
  margin: 1em 0;
}
</style>
