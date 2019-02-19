<template>
  <div name="search">
      <input
        ref="input"
        type="search"
        :class="`form-control ${inputClass}`"
        :placeholder="placeholder"
        :aria-label="placeholder"
        
        @focus="isFocused = true"
        @blur="handleBlur"
        @input="handleInput($event.target.value)"
        autocomplete="off"
      />
      <search-box-result 
      v-for="doc in docs" 
      :data="doc" 
      :key="doc.id"
      @starttree="startTree"/>

      <div v-for="k in highlights" :key='k.id'>
        <div v-html="k.value"></div>
      </div>

  </div>

</template>

<script lang="ts">
import { mapActions } from 'vuex';
import Vue from 'vue';
import * as COMP from '@/plugins/vue-solr/lib/responses/CompletionResponse';
import SearchBoxResult from './SearchBoxResult.vue';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'AutoComplete',
  components: {  },
  data: () => ({
    query: 'authors:*Ropinski*',
    inputClass: 'lol',
    placeholder: 'lol',
    inputValue: '',
    result: {},
    start: 0,
    docs: new Array<any>(),
    highlights: new Array<HighlitedResult>(),
    pageDocs: new Map<number, any[]>(),
    currentPage: '1',
    numFound: 0,
    rows: 10,
  }),
  watch: {
  },
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    handleInput(event: string) {
      if (event.length < 2) {
        return;
      }
      const payload = {q: event, hl: 'true'};
      this.$solr.send_command('pass_through_solr', 'GET', '/s2/suggest/title', payload)
      .then((d: any) => {
        const response = d as COMP.TitleCompletionResponse;
        this.result = d;
        this.highlights = [];
        for (const key of Object.keys(response.highlighting)) {
          const x = response.highlighting[key].title_ngram;
          x.forEach((val) => {
            this.highlights.push({
              id: key,
              value: val.replace(/<em>/g, '<b>').replace(/<\/em>/g, '</b>'),
            });
          });
        }
      })
      .catch(console.error);
    },
    handleBlur(event: any) {
      // triggered when window loses focus
      // console.log('blurevent');
      // console.log(event);
    },
    startTree(stuff: any) {
      this.$emit('starttree', stuff);
    },
  },
  computed: {
    pageCount(): number {
      if ( this.numFound === 0) {
        return 0;
      }
      const num = this.numFound / this.rows;
      return Math.floor(num) + 1;
    },
    activePage(): number {
      return Number.parseInt(this.currentPage, 10);
    },
  },
});
</script>

<style scoped>
#search-input {
  width: inherit;
}

.dragger {
  width: inherit;
}

details {
  text-align: left;
}

</style>
