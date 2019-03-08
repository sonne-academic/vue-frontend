<template>
  <div>
    <h4><span>{{doc.title}}</span></h4>
    <div>
      <i v-if="doc.journal"><simple-emitter :collection="collection" field="journal" :name="doc.journal"/></i>
      <i v-else-if="doc.venue"><simple-emitter :collection="collection" field="venue" :name="doc.venue"/></i>
    </div>
    {{doc.year}} - <span v-for="(author, index) in doc.author" :key="author">
      <simple-emitter :collection="collection" field="author" :name="author"/><span v-if="index+1 < doc.author.length">, </span></span>
    <!-- <details v-if="doc.keywords">
      <summary>keywords</summary>
        {{ doc.keywords.join(', ') }}
    </details> -->
    <!-- {{doc.id}} -->

    
    <!-- <span v-for="url in doc.pdfUrls" ey="url"> i;<a :href="url">PDF</a> </span>     -->
    <div v-if="doc.inCitations"> 
      <strong>cited: </strong>{{doc.inCitations_count}}
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleEmitter} from './Emitters';

export default Vue.extend({
  name: 'SearchResult',
  components: {SimpleEmitter},
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
