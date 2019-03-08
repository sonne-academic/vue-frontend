<template>
  <div>
    <h1> {{value}} </h1>
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
  name: 'VenueDetails',
  components: {SimpleFacetBox},
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
      this.$cy.instance.then((cy) => {
        const node = cy.$id(this.nodeid);
        if (0 === node.length) {
          throw new Error(`[ERR] no node with ID ${this.nodeid}`);
        }
        this.value = node.data('name');
        this.collection = node.data('collection');
      });

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

