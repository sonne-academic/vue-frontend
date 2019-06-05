<template>
  <span>
    <span v-for="(author, index) in nobreak" :key="author">
      <simple-emitter :collection="collection" field="author" :name="author"/>
      <span v-if="index+1 < nobreak.length">,</span>
    </span>
    <details v-if="rest.length > 0">
      <summary>{{rest.length}} more</summary>
      <span v-for="(author, index) in rest" :key="author">
        <simple-emitter :collection="collection" field="author" :name="author"/>
        <span v-if="index+1 < rest.length">,</span>
      </span>
    </details>
  </span>
</template>

<script lang="ts">
import Vue from 'vue';
import SimpleEmitter from './Simple.vue';

export default Vue.extend({
  name: 'AuthorList',
  components: { SimpleEmitter },
  props: {
    authors: {
      required: true,
      default: [],
    },
    breakCount: {
      type: Number,
      default: 5,
    },
    collection: {
      type: String,
      required: true,
    },
  },
  computed: {
    nobreak(): any[] {
      if (this.authors.length > this.breakCount) {
        return [this.authors[0]];
      }
      return this.authors;
    },
    rest(): any[] {
      if (this.authors.length > this.breakCount) {
        return this.authors.filter((val, index) => index > 0);
      }
      return [];
    },
  },
});
</script>
<style scoped>
details {
  display: inline;
}
</style>
