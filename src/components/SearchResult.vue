<template>
  <details>
    <summary>{{doc.title}}</summary>
    <details v-if="doc.keywords">
      <summary>keywords</summary>
        {{ doc.keywords.join(', ') }}
    </details>
    {{doc.id}}

    {{doc.year}}
    <strong v-if="doc.journal">, {{doc.journal}}</strong>
    <strong v-else-if="doc.venue">, {{doc.venue}}</strong>      
    <span v-for="url in doc.pdfUrls" :key="url"> &nbsp;<a :href="url">PDF</a> </span>
    <div v-if="doc.author">
      <strong v-if="doc.author">Authors:</strong>
      <span v-for="author in doc.author" :key="author"> {{author}}, </span>
    </div>
    
    <div v-if="doc.inCitations"> 
      <strong>cited: </strong>{{doc.inCitations_count}}
    </div>
  </details>
</template>

<script lang="ts">
import Vue from 'vue';
interface Doc {
  id: string;
  year: number;
  title: string;
  pmid: string;
  s2Url: string;
  s2PdfUrl: string;
  paperAbstract: string;
  pdfUrls?: string[];
  doi: string;
  doiUrl: string;
  venue: string;
  author: string[];
  journal: string;
  pages: string;
  volume: string;
  keywords?: string[];
  inCitations?: string[];
  outCitations?: string[];

  inCitations_count: number;
  outCitations_count: number;
  keywords_count: number;
  author_count: number;
  suggest: string;
  _version_: number;
  sources?: string[];
  suggest_lower: string[];
  suggest_ngram: string[];
  title_lower: string[];
  title_ngram: string[];
  venue_lower: string[];
  venue_ngram: string[];
  author_lower: string[];
  author_ngram: string[];
  journal_lower: string[];
  journal_ngram: string[];
}
export default Vue.extend({
  name: 'SearchResult',
  props: {
    doc: {
      type: Object,
      required: true,
      default: {} as Doc,
    },
  },
});
</script>

<style scoped>
details details {
  margin-left:10px;
}

details {
  text-align: left;
}
</style>
