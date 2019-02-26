<template>
    <div class="doc">
      <details>
        <summary>{{doc.title}}</summary>
        <details v-if="doc.entities">
          <summary>entities</summary>
           {{ doc.entities.join(', ') }}
        </details>

      {{doc.year}}
      <strong v-if="doc.journal">, {{doc.journal}}</strong>
      <strong v-else-if="doc.venue">, {{doc.venue}}</strong>      

      <div v-if="doc.author">
        <strong v-if="doc.author">Authors:</strong>
        <span v-for="author in doc.author" :key="author"> {{author}}, </span>
      </div>
      
      <div v-if="doc.inCitations"> 
        <strong>cited: </strong>{{doc.inCitations_count}}
      </div>
        <button @click="startTreeThree">three</button>
      </details>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SearchResult',
  props: {
    doc: {
      type: Object,
      required: true,
      default: {},
    },
  },
  data: () => ({
  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
    startTreeThree(e: Event) {
      this.$emit('starttree', {id: this.doc.id});
    },
  },
});
</script>

<style scoped>
details details {
  margin-left:10px;
}

details {
  text-align: left;
}
</style>
