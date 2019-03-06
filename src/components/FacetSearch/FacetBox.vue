<template>
  <div> 
    <div>{{label}}</div>
    <facet-box-item
      v-for="item in items"
      :key="item.name"
      :label="item.name"
      :size="item.size"
      @clicked="addfacetActive"
      @cclicked="addfacet"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FacetBoxItem from './FacetBoxItem.vue';
import {SearchNodeData} from '@/plugins/vue-cy/nodes/search';

export default Vue.extend({
  name: 'FacetBox',
  components: {
    FacetBoxItem,
  },
  props: {
    label: {
      type: String,
      required: true,
    },
    items: {
      // type: Array,
      required: true,
    },
  },
  data: () => ({
    author: '',
  }),
  inject: ['getContext'],
  methods: {
    async addfacet(value: string) {
      const cy = await this.$cy.instance;
      // const [nd, ld] = this.context.facet(this.label, value);
      if (this.$cy.controller) {
        this.$cy.controller.addFacet(this.context.id, this.label, value);
      }
      cy.layout({name: 'circle'}).run();
    },
    async addfacetActive(value: string) {
      if (this.label === 'author') {
        // TODO emit?
        this.author = value;
      }
      await this.addfacet(value);
    },
  },
  computed: {
    context(): SearchNodeData {
      return (this as any).getContext();
    },
  },
});
</script>

<style scoped>
.flex {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}
</style>
