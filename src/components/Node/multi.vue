<template>
  <sidebar iconName="multi">
    <template #heading> {{query}} </template>
    <template #main> 
      <sidebar-detail>
        <template #summary>Publications: {{docCount}}</template>
        <template #detail>       
          <embedded-search 
            :query="query" 
            :collection="collection" 
            @numfound="docCount = $event"
            :filters="filters"/>
        </template>
      </sidebar-detail>

      <simple-facet-box v-for="(facet, index) in facets" :key="facet" 
        :field="facet"
        :collection="collection" 
        :friendlyName="friendlyNames[index]"
        :filters="filters"
        :parentQuery="query"
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
  name: 'MultiQuery',
  components: {SimpleFacetBox, EmbeddedSearch, Sidebar, SidebarDetail},
  data: () => ({
    friendlyNames: [],
    query: '',
    docCount: 0,
    collection: '',
    filters: [],
  }),
  props: {
    nodeid: {
      type: String,
      required: true,
    },
  },
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    update() {
      const nodes = this.$cy.controller.activeNodes;
      this.collection = nodes.data('collection');
      const allowed = this.$solr.facets(this.collection);
      this.query = nodes.map((node) => {
        const n = node.data('name');
        const c = node.data('component');
        if (0 > allowed.indexOf(c)) {
          return '';
        }
        return `${c}:"${n}"`;
      }).join(' ');
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  computed: {
    facets(): string[] {
      return [];
      return this.$solr.facets(this.collection);
    },
  },
  created() {
    this.update();
  },
});
</script>

