<template>
  <div>
    <tabs :tabs="tabs" @changed="currentTab = $event"/>
    <solr-autocomplete-input 
      :endpoint="endpoint"
      :collection="collection"
      @autocomplete="highlights = $event"/>
    <collection-select @change="collection = $event"/>
  
    <auto-complete-items class="auto-items" 
      :results="highlights"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import * as COMP from '@/plugins/vue-solr/lib/responses/CompletionResponse';
import AutoCompleteItems from './AutoComplete/AutoCompleteItems.vue';
import CollectionSelect from './CollectionSelect.vue';
import Tabs from './Tabs.vue';
interface HighlitedResult {
  id: string;
  value: string;
}
export default Vue.extend({
  name: 'AutoComplete',
  components: {
    AutoCompleteItems,
    CollectionSelect,
    Tabs,
  },
  data: () => ({
    highlights: new Array<HighlitedResult>(),
    tabs: ['title', 'author', 'journal', 'venue', 'suggest'],
    currentTab: 'suggest',
    collection: 's2',
  }),
  computed: {
    endpoint(): string {
      if ('suggest' === this.currentTab) {
        return `/${this.collection}/suggest`;
      } else {
        return `/${this.collection}/suggest/${this.currentTab}`;
      }
    },
  },
});
</script>

<style scoped>
.auto-items {
  position: absolute;
  width: 200%;
  background-color: #fff;
}
.auto-items:hover {
  position: absolute;
  border-color: #ccc;
  border-width: 1px;
}
</style>
