<template>
      <input
        ref="input"
        type="search"
        :placeholder="placeholder"
        :aria-label="placeholder"
        @input="complete($event.target.value)"
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
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    complete(input: string) {
      if (this.debounce) {
        this.db(input);
      } else {
        this.handleInput(input);
      }
    },
    autocomplete(result: HighlitedResult[]) {
      this.$emit('autocomplete', result);
    },
    async handleInput(event: string) {
      if (event.length < 2) {
        return this.autocomplete([]);
      }
      const payload = {
        q: event,
        hl: 'true',
        ...this.options,
      };
      const d: any = await this.$solr.pass_through_solr.get(this.endpoint, payload);
      const response = d as COMP.CompletionResponse<COMP.Title>;
      const endsWithNgram = ([k, v]: [string, any]) => k.endsWith('ngram');
      const thing: HighlitedResult[] = Object
        .entries(response.highlighting)
        .flatMap(([id, entry]) => Object.entries(entry)
          .filter(endsWithNgram).map(([k, value]) => ({id, value})));
      this.autocomplete(thing);
    },
    db: debounce(function(this: any, e: string) {
        this.handleInput(e);
    }, 500),
  },
});
</script>
