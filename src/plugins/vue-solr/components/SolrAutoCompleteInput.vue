<template>
      <input
        ref="input"
        type="search"
        :placeholder="placeholder"
        :aria-label="placeholder"
        
        @focus="isFocused = true"
        @input="handleInput($event.target.value)"
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
  name: 'AutoCompleteInput',
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
  },
  data: () => ({
    placeholder: 'title, author, year',
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    handleInput(event: string) {
      if (event.length < 2) {
        return;
      }
      const payload = {
        'q': event,
        'hl': 'true',
        'hl.simple.pre': '<strong>',
        'hl.simple.post': '</strong>',
        'hl.fragsize': 0,
      };
      this.$solr.pass_through_solr.get(this.endpoint, payload)
      .then((d: any) => {
        const response = d as COMP.CompletionResponse<COMP.Title>;
        const highlights = new Array<HighlitedResult>();
        for (const key of Object.keys(response.highlighting)) {
          const title = response.highlighting[key];
          for (const [k, v] of Object.entries(title)) {
            if (! k.endsWith('ngram')) {
              continue;
            }
            v.forEach((val: string) => {
              highlights.push({
                id: key,
                value: val,
              });
            });
          }
        }
        this.$emit('autocomplete', highlights);
      })
      .catch(this.log);
    },
    db: debounce(function(this: any, e: string) {
        this.handleInput(e);
    }, 500),
  },
});
</script>
