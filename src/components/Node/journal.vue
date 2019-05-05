<template>
  <sidebar iconName="journal">
    <template #heading>{{journalName}}</template>
    <template #main>
      <sidebar-detail :alwaysLoad=true>
        <template #summary>Publications: {{docCount}}</template>
        <template #detail>
          <embedded-search
            :query="embQuery"
            :collection="collection"
            :filters="filters"
            @numfound="docCount = $event"

          />
        </template>
      </sidebar-detail>

      <simple-facet-box
        v-for="(facet, index) in facets"
        :key="facet"
        :field="facet"
        :collection="collection"
        :friendlyName="friendlyNames[index]"
        :parentQuery="embQuery"
        :filters="filters"
      />
    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';
import { SimpleFacetBox } from '../Emitters';
import { EmbeddedSearch } from '../Embed';
import { Sidebar, SidebarDetail } from '../sidebar';
export default Vue.extend({
  name: 'JournalDetails',
  components: { SimpleFacetBox, EmbeddedSearch, Sidebar, SidebarDetail },
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    name: 'journal',
    journalName: '',
    docCount: 0,
    collection: '',
    embQuery: '',
    filters: [],
  }),
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.journalName = node.data('name');
      this.collection = node.data('collection');
      this.embQuery = `${this.name}:"${this.journalName}"`;
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  computed: {
    facets(): string[] {
      return this.$solr.facets(this.collection);
    },
    friendlyNames(): string[] {
      return this.$solr.facets(this.collection);
    },
  },
  created() {
    this.update();
  },
});
</script>
