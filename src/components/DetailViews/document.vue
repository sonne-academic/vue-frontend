<template>
  <div>
    <h1> <img src="/document.svg"/> {{value}} </h1>
    Publications: {{docCount}}
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
export default Vue.extend({
  name: 'SocumentDetails',
  components: {SimpleFacetBox},
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    facets: ['author', 'document', 'year', 'keywords'],
    friendlyNames: ['authors', 'documents', 'years', 'associated keywords'],
    name: 'document',
    value: '',
    docCount: 0,
    collection: '',
  }),
  provide(this: any) {
    return {
      getContext: this.getContext,
    };
  },
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