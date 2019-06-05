<template>
  <sidebar iconName="search">
    <template #heading>{{query}}</template>
    <template #main>
      <div>
        Source:
        <collection-select @change="updateCollection" :initCollection="collection"/>
      </div>
      <sidebar-detail class="filters">
        <template #summary>Filters</template>
        <template #detail>
          <simple-facet-box
            v-for="facet in facets"
            :params="search"
            op="OR"
            :key="facet"
            :field="facet"
            :collection="collection"
            :friendlyName="facet"
            :parentQuery="query"
            :filters="filters"
          />
        </template>
      </sidebar-detail>
      <embedded-search
        v-if="collection !== ''"
        ref="search"
        :filters="filters"
        :query="query"
        :collection="collection"
        @numfound="docCount = $event"
      />
    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';

import { SearchResult } from '../Emitters';
import { EmbeddedSearch } from '../Embed';
import { Spinner } from '../util';
import { Sidebar, SidebarDetail } from '../sidebar';
import { CollectionSelect } from '@/plugins/vue-solr/components';
import { SimpleFacetBox } from '../Emitters';

export default Vue.extend({
  name: 'SearchDetails',
  components: { SearchResult, Spinner, Sidebar, SidebarDetail, EmbeddedSearch, CollectionSelect, SimpleFacetBox },
  props: {
    nodeid: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      filters: [],
      collection: '',
      query: '',
      docCount: 0,
    };
  },
  methods: {
    update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.collection = node.data('collection');
      this.query = node.data('query');
    },
    updateCollection(collection: string) {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      node.data('collection', collection);
      this.collection = collection;
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
    collection() {
      this.update();
    },
  },
  computed: {
    facets(): string[] {
      return this.$solr.facets(this.collection);
    },
    search(): any {
      return (this.$refs.search as any).makePayload(1);
    },
  },
  mounted() {
    this.update();
  },

});
</script>
<style scoped>
.filters > * {
  margin: 1em;
}
</style>
