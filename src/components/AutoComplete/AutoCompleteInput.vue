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
  },
  data: () => ({
    placeholder: 'lol',
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    handleInput(event: string) {
      if (event.length < 2) {
        return;
      }
      const payload = {q: event, hl: 'true'};
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
                value: val.replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>'),
              });
            });
          }
        }
        this.$emit('autocomplete', highlights);
      })
      .catch(this.log);
    },
  },
});
</script>

<style scoped>
</style>
