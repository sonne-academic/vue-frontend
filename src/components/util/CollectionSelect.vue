<template>
  <select @change="$emit('change',$event.target.value)">
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
  mounted() {
    this.$emit('change', this.$solr.collections[0]);
  },
});
</script>
