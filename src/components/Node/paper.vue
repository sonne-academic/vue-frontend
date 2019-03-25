<template>
  <div>
    <h4> <img src="/paper.svg"/> {{title}} </h4>
    <div>
      <i v-if="doc.journal"><simple-emitter :collection="collection" field="journal" :name="doc.journal"/></i>
      <i v-else-if="doc.venue"><simple-emitter :collection="collection" field="venue" :name="doc.venue"/></i>
      <i v-else-if="doc.booktitle"><simple-emitter :collection="collection" field="booktitle" :name="doc.booktitle"/></i>
    </div>
    <strong>{{doc.year}}</strong> - 
    <span v-for="(author, index) in doc.author" :key="author">
      <simple-emitter :collection="collection" field="author" :name="author"/>
      <span v-if="index+1 < doc.author.length">, </span>
    </span>
    <details v-if="doc.cited_by"> 
      <summary><strong>cited by</strong> {{doc.cited_by_count}} publications</summary>
      <embedded-search :filters="filters" class="emb" :query="q_references" :collection="collection"/>
    </details>
    <details v-if="doc.references"> 
      <summary><strong>cites</strong> {{doc.references_count}} publications</summary>
      <embedded-search :filters="filters" class="emb" :query="q_cited_by" :collection="collection"/>
    </details>
    <a v-if="doc.doiUrl" :href="doc.doiUrl">DOI: {{doc.doi}}</a>
    <div v-for="url in urls" :key="url.host">
    <a :href="url"> {{url.host}} </a>
    </div>
    <div v-if="doc.paperAbstract">
      <strong>Abstract: </strong>
      <i>{{doc.paperAbstract}}</i>
    </div>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleEmitter} from '../Emitters';
import { DocCommon, DocS2 } from '@/plugins/vue-solr/lib/responses/SelectResponse';
import {EmbeddedSearch} from '../Embed';
export default Vue.extend({
  name: 'PaperDetails',
  components: {SimpleEmitter, EmbeddedSearch},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    title: '',
    docCount: 0,
    collection: '',
    doc: {} as DocCommon,
    paperid: '',
    q_cited_by: '',
    q_references: '',
    filters: [],
  }),
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    async update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.title = node.data('name');
      this.collection = node.data('collection');
      this.paperid = node.data('pid');
      this.q_cited_by = `+(cited_by:${this.paperid})`;
      this.q_references = `+(references:${this.paperid})`;
      const response = await this.$solr.get(this.collection, this.paperid);
      this.doc = response.doc as DocCommon;

    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  computed: {
    urls(): URL[] {
      const urls = [];
      if ('s2' === this.collection) {
        const d = this.doc as DocS2;
        if (d.pdfUrls) {
          urls.push(...d.pdfUrls.map((inp: string) => new URL(inp)));
        }
      }
      for (const url of urls) {
        console.log(url.host);
      }
      return urls;
    },
  },
  created() {
    this.update();
  },
});
</script>
<style scoped>
.emb {
  margin-left: 2em;
}
</style>
