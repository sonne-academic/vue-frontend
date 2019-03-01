<template>
  <div class="flex"> 
    <filter-box-item 
      v-for="item in items"
      :key="item.name"
      :label="item.name"
      :size="item.size"
      @clicked="itemtoggle"
    />
    <author-detail-view v-if="author" :author="author"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FilterBoxItem from './FilterBoxItem.vue';
import AuthorDetailView from '../DetailViews/AuthorDetails.vue';
import {FacetNode, Link, Node} from '@/store/modules/navgraph';
interface FacetCommit {next: Node; link: Link; }
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
    // context: '',
  }),
  inject: ['getContext'],
  methods: {
    commitFacet(args: {context: string, node: FacetNode}): Promise<FacetCommit> {
      return this.$store.dispatch('navigateToFacet', args);
    },
    async itemtoggle(e: string) {
      this.author = e;
      const args = {
        context: this.context,
        node: {facetField: this.label, facetValue: e},
      };
      const cmt = await this.commitFacet(args);
      const cy = await this.$cy.instance;
      cy.add({ group: 'nodes', data: cmt.next });
      cy.add({group: 'edges', data: cmt.link});
    },
  },
  computed: {
    context() {
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
