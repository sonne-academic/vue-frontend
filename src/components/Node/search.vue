<template>
  <sidebar iconName="search">
    <template #heading>{{query}}</template>
    <template #main>
      <embedded-search v-if="collection !== ''" :filters="filters" :query="query" :collection="collection" @numfound="docCount = $event"/>
    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';

import {SearchResult} from '../Emitters';
import {EmbeddedSearch} from '../Embed';
import {Spinner} from '../util';
import {Sidebar, SidebarDetail} from '../sidebar';
export default Vue.extend({
  name: 'SearchDetails',
  components: { SearchResult, Spinner, Sidebar, SidebarDetail, EmbeddedSearch },
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
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  mounted() {
    this.update();
  },

});
</script>
