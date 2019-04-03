<template>
  <sidebar iconName="paper"> 
    <template #heading>
       {{title}}
    </template>
    <template #main>
      <div>
        <i v-if="doc.journal"><simple-emitter :collection="collection" field="journal" :name="doc.journal"/></i>
        <i v-else-if="doc.venue"><simple-emitter :collection="collection" field="venue" :name="doc.venue"/></i>
        <i v-else-if="doc.booktitle"><simple-emitter :collection="collection" field="booktitle" :name="doc.booktitle"/></i>
        <i v-if="doc.doc_type">({{doc.doc_type}})</i>
      </div>
      <!-- year and authors -->
      <strong>{{doc.year}}</strong> - 
      <span v-for="(author, index) in doc.author" :key="author">
        <simple-emitter :collection="collection" field="author" :name="author"/>
        <span v-if="index+1 < doc.author.length">, </span>
      </span>
      <!-- doi and urls -->
      <div v-if="doc.doiUrl">
        <strong>DOI</strong>: <a :href="doc.doiUrl">{{doc.doi}}</a>
        <div v-for="url in urls" :key="url.host">
          <a :href="url"> {{url.host}} </a>
        </div>
      </div>
      <sidebar-detail v-if="doc.cited_by_count">
        <template #summary><strong>cited by</strong> {{doc.cited_by_count}} publications</template>
        <template #detail><embedded-search :filters="filters" class="emb" :query="q_references" :collection="collection"/></template>
      </sidebar-detail>
      <sidebar-detail v-if="doc.references_count && collection === 's2'">
        <template #summary><strong>cites</strong> {{doc.references_count}} publications</template>
        <template #detail><embedded-search :filters="filters" class="emb" :query="q_cited_by" :collection="collection"/></template>
      </sidebar-detail>
      <sidebar-detail v-if="doc.references_count && collection === 'mag'"> 
        <template #summary><strong>cites</strong> {{doc.references_count}} publications</template>
        <template #detail>
          <sub-query-search class="emb"
            :filters="filters" 
            :query="q_subq" 
            :collection="collection"
            subquery="{!terms f=id v=$row.references}" 
          />
        </template>
      </sidebar-detail>
      <sidebar-detail>
        <template #summary> biblatex </template>
        <template #detail> <la-te-x-formatter :doc="doc" :collection="collection"/> </template>
      </sidebar-detail>

    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleEmitter} from '../Emitters';
import { DocCommon, DocS2, DocDBLP } from '@/plugins/vue-solr/lib/responses/SelectResponse';
import {EmbeddedSearch, LaTeXFormatter, SubQuerySearch} from '../Embed';
import {SidebarDetail, Sidebar} from '../sidebar';

export default Vue.extend({
  name: 'PaperDetails',
  components: {SimpleEmitter, EmbeddedSearch, LaTeXFormatter, SubQuerySearch, SidebarDetail, Sidebar},
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
    q_subq: '',
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
      const response = await this.$solr.get(this.collection, this.paperid);
      this.doc = response.doc as DocCommon;
      this.q_cited_by = `cited_by:${this.paperid}`;
      this.q_references = `references:${this.paperid}`;
      this.q_subq = `id:${this.paperid}`;
      this.$cy.controller.scratch.set(node.id(), '_paper_data', response.doc);
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
      if ('dblp' === this.collection) {
        const d = this.doc as DocDBLP;
        if (d.ee) {
          urls.push(...d.ee.map((inp) => new URL(inp)));
        }
        if (d.url) {
          urls.push(...d.url.map((inp) => {
            if (inp.startsWith('http')) {
              return new URL(inp);
            } else {
              return new URL('https://dblp.org/' + inp);
            }
          }));
        }
      }
      if ('mag' === this.collection) {
        const d: any = this.doc;
        if (d.urls) {
          urls.push(...d.urls.map((s: string) => new URL(s)));
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
