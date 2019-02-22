<template>
  <div class="flex"> 
    <filter-box-item 
    v-for="item in items"
    :key="item.name"
    :label="item.name"
    :size="item.size"
    @clicked="itemtoggle"/>
    
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FilterBoxItem from './FilterBoxItem.vue';

export default Vue.extend({
  name: 'FilterBox',
  components: {
    FilterBoxItem,
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
  methods: {
    itemtoggle(e: any) {
      console.log(`${this.label}:${e}`);
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
