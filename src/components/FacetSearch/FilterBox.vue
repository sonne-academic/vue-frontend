<template>
  <div class="flex"> 
    <filter-box-item 
    v-for="item in items"
    :key="item.name"
    :label="item.name"
    :size="item.size"
    @clicked="itemtoggle"/>
    <author-detail-view v-if="author" :author="author"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FilterBoxItem from './FilterBoxItem.vue';
import AuthorDetailView from '../DetailViews/AuthorDetails.vue';

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
  methods: {
    itemtoggle(e: any) {
      console.log(`${this.label}:${e}`);
      this.author = e;
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
