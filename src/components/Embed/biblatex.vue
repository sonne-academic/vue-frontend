<template>
  <div> 
    <div>@{{kind}}<span>{</span>{{id}}, </div>
    <div>title={{title}},</div>
    <div>author=<span>{</span>{{author}}<span>}</span>,</div>
    <div v-if="journaltitle">journaltitle={{journaltitle}},</div>
    <div>year={{year}},</div>
    <div v-if="pages">pages={{pages}},</div>
    <div v-if="doi">doi={{doi}},</div>
    <div v-if="booktitle">booktitle={{booktitle}},</div>
    <div v-if="volume">volume={{volume}},</div>
    <div>}</div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DocDBLP } from '@/plugins/vue-solr/lib/responses/SelectResponse';
const quoted = (s: string) => '"' + s + '"';
const DBLP = 'dblp';
const S2 = 's2';
const MAG = 'mag';
export default Vue.extend({
  name: 'LaTeXFormatter',
  props: {
    doc: {
      type: Object,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
  },
  computed: {
    kind(): string {
      if (DBLP === this.collection) {
        const d = this.doc as DocDBLP;
        return d.doc_type;
      }
      if (S2 === this.collection) {
        if (this.doc.journal) {
          return 'article';
        }
        if (this.doc.venue) {
          return 'incollection';
        }
        return 'UNKNOWN';
      }
      if (MAG === this.collection) {
        switch (this.doc.doc_type) {
          case 'Journal': return 'article';
          case 'Patent': return 'patent';
          case 'Conference': return 'inproceedings';
          case 'BookChapter': return 'inbook';
          case 'Book': return 'book';
          case 'Dataset': return 'online';
          default: return 'NOMATCH:MAG';
        }
      }
      return `no rule for ${this.collection}`;
    },
    id(): string {
      return `${this.collection}:${this.doc.id}`;
    },
    author(): string {
      if (this.doc.author) {
        return this.doc.author.join(' and ');
      }
      return '';
    },
    journaltitle(): string {
      if (this.kind !== 'article') {
        return '';
      }
      if (DBLP === this.collection) {
        return quoted(this.doc.journal);
      }
      if (S2 === this.collection || MAG === this.collection) {
        if (this.doc.journal) {
          return quoted(this.doc.journal);
        }
        return '';
      }
      return `no rule for ${this.collection}`;
    },
    title(): string {
      return quoted(this.doc.title);
    },
    pages(): string {
      if (DBLP === this.collection) {
        return quoted(this.doc.pages[0]);
      }
      if (S2 === this.collection) {
        if (this.doc.pages) {
          return quoted(this.doc.pages);
        }
        return '';
      }
      if (MAG === this.collection) {
        let page = '';
        if (this.doc.firstpage) {
          page += this.doc.firstpage;
          if (this.doc.lastpage) {
            page += '-' + this.doc.lastpage;
          }
          return quoted(page);
        }
        return '';
      }
      return `no rule for ${this.collection}`;
    },
    year(): string {
      return quoted(this.doc.year);
    },
    booktitle(): string {
      const oneOf = ['incollection', 'inproceedings'];
      if (oneOf.indexOf(this.kind)) {
        return '';
      }
      if (S2 === this.collection) {
        if (this.doc.venue) {
          return quoted(this.doc.venue);
        }
        return '';
      }
      if (DBLP === this.collection) {
        return quoted(this.doc.booktitle);
      }
      return `no rule for ${this.collection}`;
    },
    doi(): string {
      if (this.doc.doi) {
        return this.doc.doi;
      }
      return '';
    },
    volume(): string {
      if (S2 === this.collection || MAG === this.collection) {
        if (this.doc.volume) {
          return quoted(this.doc.volume);
        }
        return '';
      }
      return `no rule for ${this.collection}`;
    },
  },
});
</script>
