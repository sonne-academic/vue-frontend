<template>
  <div class="search">
    <button v-for="tab in tabs"
      :key="tab"
      :class="['tab-button', { active: currentTab === tab }]"
      @click="currentTab = tab"
    >{{ tab }}</button>
    <auto-complete-input 
      :endpoint="endpoint"
      @autocomplete="highlights = $event"/>
  
    <auto-complete-items :results="highlights"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as COMP from '@/plugins/vue-solr/lib/responses/CompletionResponse';
import AutoCompleteInput from './AutoComplete/AutoCompleteInput.vue';
import AutoCompleteItems from './AutoComplete/AutoCompleteItems.vue';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'AutoComplete',
  components: { AutoCompleteInput, AutoCompleteItems },
  data: () => ({
    highlights: new Array<HighlitedResult>(),
    tabs: ['title', 'author', 'journal', 'venue'],
    currentTab: 'title',
    collection: 's2',
  }),
  computed: {
    endpoint(): string {
      return `/${this.collection}/suggest/${this.currentTab}`;
    },
  },
});
</script>

<style scoped>
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
</style>
