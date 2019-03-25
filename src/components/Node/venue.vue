<template>
  <div>
    <h1> <img src="/venue.svg"/> {{value}} </h1>
    <details>
      <summary>Publications: {{docCount}}</summary>
      <embedded-search :query="embQuery" :collection="collection" @numfound="docCount = $event"/>
    </details>
    <simple-facet-box v-for="(facet, index) in facets" :key="facet" 
      :field="facet"
      :queryField="name"
      :collection="collection" 
      :friendlyName="friendlyNames[index]"
      :queryValue="value"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleFacetBox} from '../Emitters';
import {EmbeddedSearch} from '../Embed';
export default Vue.extend({
  name: 'VenueDetails',
  components: {SimpleFacetBox, EmbeddedSearch},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    facets: ['author', 'venue', 'year', 'keywords'],
    friendlyNames: ['authors', 'venues', 'years', 'associated keywords'],
    name: 'venue',
    value: '',
    docCount: 0,
    collection: '',
    embQuery: '',
  }),
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    update() {
      const node = this.$cy.controller.getNodeById(this.nodeid);
      this.value = node.data('name');
      this.collection = node.data('collection');
      this.embQuery = `+(${this.name}:"${this.value}")`;
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