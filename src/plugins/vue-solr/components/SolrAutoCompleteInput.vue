<template>
      <input
        ref="input"
        type="search"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="complete($event.target.value)"
        @keyup.enter="enter($event.target.value)"
      />
</template>

<script lang="ts">
import Vue from 'vue';
import debounce from 'lodash/debounce';
import * as COMP from '@/plugins/vue-solr/lib/responses/CompletionResponse';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'SolrAutoCompleteInput',
  components: {  },
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
    placeholder: {
      type: String,
      default: 'title, author, year',
    },
    debounce: {
      type: Boolean,
      default: false,
    },
    options: {
      type: Object,
      default: () => ({
        'hl.simple.pre': '<strong>',
        'hl.simple.post': '</strong>',
        'hl.fragsize': 0,
      }),
    },
  },
  data: () => ({
    active: true,
    response: {} as any,
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log', content);
    },
    enter(query: string) {
      this.$emit('enter', query);
      (this.$refs.input as any).value = '';
      this.complete('');
      this.active = false;
    },
    complete(input: string) {
      this.active = true;
      if (this.debounce) {
        this.db(input);
      } else {
        this.handleInput(input);
      }
    },
    autocomplete(count: number, result: HighlitedResult[]) {
      if (this.active) {
        this.$emit('autocomplete', {count, result});
      }
    },
    async handleInput(event: string) {
      if (event.length < 2) {
        return this.autocomplete(0, []);
      }
      const payload = {
        q: event,
        hl: 'true',
        ...this.options,
      };
      const d: any = await this.$solr.pass_through_solr.get(this.endpoint, payload);
      const response = d as COMP.CompletionResponse<COMP.Title>;
      this.response = response;
      const endsWithNgram = ([k, v]: [string, any]) => k.endsWith('ngram');
      const thing: HighlitedResult[] = Object
        .entries(response.highlighting)
        .flatMap(([id, entry]) => Object.entries(entry)
          .filter(endsWithNgram).map(([k, value]) => ({id, value: value[0]})));
      this.autocomplete(response.response.numFound, thing);
    },
    db: debounce(function(this: any, e: string) {
        this.handleInput(e);
    }, 500),
  },
});
</script>
