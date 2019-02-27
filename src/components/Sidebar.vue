<template>
  <div>
    <tabs :tabs="tabs" @changed="currentTab = $event"/>
    <keep-alive>
      <component :is="currentTabComponent"/>
    </keep-alive>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import Search from './Search.vue';
import FacetSearch from './FacetSearch.vue';
import AutoComplete from './AutoComplete.vue';
import Tabs from './Tabs.vue';
export default Vue.extend({
  name: 'Sidebar',
  components: {
    Search,
    FacetSearch,
    AutoComplete,
    Tabs,
  },
  data: () => ({
    tabs: ['search', 'facet-search', 'auto-complete'],
    currentTab: 'auto-complete',
  }),
  computed: {
    currentTabComponent(): string {
      return this.currentTab.toLowerCase();
    },
  },
});
</script>
