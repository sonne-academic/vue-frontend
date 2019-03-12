<template>
  <div>
    <h1> <img src="/multi.svg"/> {{query}} </h1>
    <details>
      <summary>Publications: {{docCount}}</summary>
      <embedded-search 
        :query="query" 
        :collection="collection" 
        @numfound="docCount = $event"
        :filters="filters"/>
    </details>

    <simple-facet-box v-for="(facet, index) in facets" :key="facet" 
      :field="facet"
      :queryField="name"
      :collection="collection" 
      :friendlyName="friendlyNames[index]"
      :queryValue="query"
      :filters="filters"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleFacetBox} from '../Emitters';
import {EmbeddedSearch} from '../Embed';
export default Vue.extend({
  name: 'MultiQuery',
  components: {SimpleFacetBox, EmbeddedSearch},
  data: () => ({
    facets: [],
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
      const allowed = ['venue', 'journal', 'keywords', 'author'];
      const nodes = this.$cy.controller.activeNodes;
      this.collection = nodes.data('collection');
      this.query = nodes.map((node) => {
        const n = node.data('name');
        const c = node.data('component');
        if (0 > allowed.indexOf(c)) {
          return '';
        }
        return `+(${c}:"${n}")`;
      }).join(' ');
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

