<template>
  <div class="flex"> 
    <author-detail-view v-if="author" :author="author"/>
    <filter-box-item 
      v-for="item in items"
      :key="item.name"
      :label="item.name"
      :size="item.size"
      @clicked="addfacet"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FilterBoxItem from './FilterBoxItem.vue';
import AuthorDetailView from '../DetailViews/AuthorDetails.vue';
import {SearchNodeData} from '@/plugins/vue-cy/nodes/search';

export default Vue.extend({
  name: 'FilterBox',
  components: {
    FilterBoxItem,
    AuthorDetailView,
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
      if (this.label === 'author') {
        this.author = value;
      }
      const cy = await this.$cy.instance;
      const [nd, ld] = this.context.facet(this.label, value);
      cy.add({group: 'nodes', data: nd});
      cy.add({group: 'edges', data: ld});
      cy.layout({name: 'circle'}).run();
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
