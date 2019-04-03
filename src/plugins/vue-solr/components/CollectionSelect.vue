<template>
  <select ref="select" @change="$emit('change',$event.target.value)">
    <option 
      v-for="c in $solr.collections" :key="c" 
      :value="c"
    > {{c}}
    </option>
  </select>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CollectionSelect',
  props: {
    initCollection: {
      type: String,
      default: '',
    },
  },
  mounted() {
    if (this.initCollection === '') {
      this.$emit('change', this.$solr.collections[0]);
    } else {
      for (const o of this.select)  {
        if (o.nodeName === 'OPTION') {
          const opt = o as HTMLOptionElement;
          if (opt.value === this.initCollection) {
            opt.selected = true;
          }
        }
      }
      this.$emit('change', this.initCollection);
    }
  },
  computed: {
    select(): HTMLSelectElement {
      return this.$refs.select as HTMLSelectElement;
    },
  },
});
</script>
