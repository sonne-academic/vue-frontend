<template>
    <div>
      <details>
        <summary>{{data.title}}</summary>
        <details v-if="data.entities">
          <summary>entities</summary>
           {{ data.entities.join(', ') }}
        </details>
        <button @click="startTreeThree">three</button>
      </details>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'SearchResult',
  props: {
    data: {
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
      this.$emit('starttree', {id: this.data.id});
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
