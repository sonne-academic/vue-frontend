<template>
  <div class="author-container">
    <h1> {{author}} </h1>
    <div class="co-authors"></div>
    <div class="author-index" v-for="index in result">
      {{index}}
    </div>
  </div>
</template>
<script lang="ts">
interface FacetDetail {
  name: string;
  count: number;
}
import Vue from 'vue';
export default Vue.extend({
  props: {
    author: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    result: new Array<FacetDetail>(),
    coAuthors: [],
    journals: [],
    keywords: [],
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
          this.result = data['result-set'].docs;
        });
    },
  },
  watch: {
    author() {
      this.authorIndexGroup(this.author);
    },
  },
  mounted() {
    this.authorIndexGroup(this.author);
  },
});
</script>

<style scoped>
.author-container {
 position: fixed;
 display: block;
 top: 0;
 right: 0;
 width: 25%;
}
</style>
