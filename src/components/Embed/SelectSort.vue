<template>
  <div>
    <select @change="$emit('facetchanged', $event.target.value)">
      <option v-for="facet in facets" :key="facet">{{facet}}</option>
    </select>
    <select @change="$emit('orderchanged', $event.target.value)">
      <option v-for="ord in order" :key="ord">{{ord}}</option>
    </select>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'SelectSort',
  props: {
    collection: {
      type: String,
      required: true,
    },
  },
  computed: {
    facets(): string[] {
      const sorts = ['year', 'title'];
      if ('mag' === this.collection || 's2' === this.collection) {
        return [...sorts, 'cited_by_count'];
      } else {
        return sorts;
      }
    },
    order(): string[] {
      return ['desc', 'asc'];
    },
  },
});
</script>
