<template>
  <div> 
    <div>@{{kind}}<span>{</span>{{id}}, </div>
    <div>title={{title}},</div>
    <div>author=<span>{</span>{{author}}<span>}</span>,</div>
    <div v-if="journaltitle">journaltitle={{journaltitle}},</div>
    <div>year={{year}},</div>
    <div>pages={{pages}},</div>
    <div v-if="doi">doi={{doi}},</div>
    <div v-if="booktitle">booktitle={{booktitle}},</div>
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
      return `no rule for ${this.collection}`;
    },
    id(): string {
      return `${this.collection}:${this.doc.id}`;
    },
    author(): string {
      return this.doc.author.join(' and ');
    },
    journaltitle(): string {
      if (this.kind !== 'article') {
        return '';
      }
      if (DBLP === this.collection) {
        return quoted(this.doc.journal);
      }
      if (S2 === this.collection) {
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
        return quoted(this.doc.pages);
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
      if (DBLP === this.collection) {
        if (this.doc.ee) {
          const ee: string[] = this.doc.ee;
          const dois = ee.map((s) => new URL(s))
            .filter((u) => u.host.endsWith('doi.org'));
          if (1 <= dois.length) {
            return quoted(dois[0].pathname.slice(1));
          }
          return '';
        }
      }
      if (S2 === this.collection) {
        if (this.doc.doi) {
          return quoted(this.doc.doi);
        }
        return '';
      }
      return `no rule for ${this.collection}`;
    },
    volume(): string {
      if (S2 === this.collection) {
        return this.doc.volume;
      }
      return `no rule for ${this.collection}`;
    },
  },
});
</script>
