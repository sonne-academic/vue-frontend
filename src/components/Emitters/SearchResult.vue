<template>
  <div>
    <h4><paper-emitter :name="doc.title" :collection="collection" :id="doc.id"/></h4>
    <div>
      <i v-if="doc.journal"><simple-emitter :collection="collection" field="journal" :name="doc.journal"/></i>
      <i v-else-if="doc.venue"><simple-emitter :collection="collection" field="venue" :name="doc.venue"/></i>
    </div>
    {{doc.year}} -
    <author-list :authors="doc.author" :collection="collection"/>
    <div v-if="doc.cited_by_count">
      <strong>cited: </strong>{{doc.cited_by_count}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import SimpleEmitter from './Simple.vue';
import PaperEmitter from './Paper.vue';
import AuthorList from './AuthorList.vue';

export default Vue.extend({
  name: 'SearchResult',
  components: {SimpleEmitter, PaperEmitter, AuthorList},
  props: {
    doc: {
      type: Object,
      required: true,
    },
    collection: {
      required: true,
      type: String,
    },
  },
});
</script>

<style scoped>
details details {
  margin-left:10px;
}
h4 {
  margin-bottom: 0;
}
</style>
