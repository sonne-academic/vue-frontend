<template>

</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    result: {},
  }),
  methods: {
    authorIndexGroup(author: string) {
      const collection = 's2';
      const idx = 'idx';
      const escaped = author.replace(/ /g, '\\ ');
      const search = `search(${collection}, q="author:${escaped}", fl="author, id", sort="id desc", qt=/export)`;
      const select = `select(${search}, indexOf(author, "${author}") as ${idx})`;
      const sort = `sort(${select}, by="${idx} asc")`;
      const rollup = `rollup(${sort}, over="${idx}", count(*))`;
      console.log(rollup);
      this.$solr.pass_through_solr.get(`/${collection}/stream`, {expr: rollup})
        .then((data: any) => {
          console.log(data);
          this.result = data;
        });
    },
  },
  mounted() {
    this.authorIndexGroup('Timo Ropinski');
  },
});
</script>

<style scoped>

</style>
