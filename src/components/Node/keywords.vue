<template>
  <sidebar iconName="keywords">
    <template #heading> {{value}} </template>
    <template #main>
      <sidebar-detail :alwaysLoad=true>
        <template #summary> Publications: {{docCount}} </template>
        <template #detail> <embedded-search :filters="filters" :query="embQuery" :collection="collection" @numfound="docCount = $event"/> </template>
      </sidebar-detail>

      <simple-facet-box v-for="(facet, index) in facets" :key="facet"
        :field="facet"
        :collection="collection"
        :friendlyName="friendlyNames[index]"
        :filters="filters"
        :parentQuery="embQuery"
      />

    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleFacetBox} from '../Emitters';
import {EmbeddedSearch} from '../Embed';
import {Sidebar, SidebarDetail} from '../sidebar';
export default Vue.extend({
  name: 'JournalDetails',
  components: {SimpleFacetBox, EmbeddedSearch, Sidebar, SidebarDetail},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    name: 'keywords',
    value: '',
    docCount: 0,
    collection: '',
    filters: [],
  }),
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.value = node.data('name');
      this.collection = node.data('collection');
    },
  },
  computed: {
    embQuery(): string {
      return `${this.name}:"${this.value}"`;
    },
    facets(): string[] {
      return this.$solr.facets(this.collection);
    },
    friendlyNames(): string[] {
      return this.$solr.facets(this.collection);
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  created() {
    this.update();
  },
});
</script>
