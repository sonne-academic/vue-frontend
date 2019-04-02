<template>
  <details ref='details' @toggle="open = $event.target.open">
    <summary>author position in paper</summary>
    <spinner v-if="loading"/>
    <table v-else>
      <th>position</th> <th>count</th>
      <tr v-for="index in result" :key="index.idx">
        <td class="right">{{index.idx+1}}</td>
        <td class="right">{{index['count(*)']}}</td>
      </tr>
    </table>
  </details>

</template>

<script lang="ts">
import Vue from 'vue';
import {Spinner} from '../util';

export default Vue.extend({
  name: 'AuthorPosition',
  components: {Spinner},
  props: {
    author: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
    docCount: {
      type: Number,
      required: true,
    },
  },
  data: () => ({
    result: {},
    loading: true,
    open: false,
  }),
  methods: {
    reset() {
      this.result = {};
      this.loading = true;
    },
    update() {
      this.reset();
      if (this.details.open) {
        this.authorIndexGroup();
      }
    },
    async authorIndexGroup() {
      console.log(this.details);
      const scratchspace = '_author_index';

      let result;
      if (!result) {
        console.debug('no data in scratch');
        const author = this.author;
        const idx = 'idx';
        const q = `"author:"${author}""`;
        const search = `search(${this.collection},
          q=${q},
          fl="author, id", sort="id desc", qt=/select, rows=${this.docCount})`;
        const select = `select(${search}, indexOf(author, "${author}") as ${idx})`;
        const sort = `sort(${select}, by="${idx} asc")`;
        const rollup = `rollup(${sort}, over="${idx}", count(*))`;
        const data: any = await this.$solr.pass_through_solr.get(`/${this.collection}/stream`, {expr: rollup});
        result = data['result-set'].docs.slice(0, -1);
      }
      this.result = result;
      this.loading = false;
    },
  },
  computed: {
    details(): HTMLDetailsElement {
      return this.$refs.details as HTMLDetailsElement;
    },
  },
  watch: {
    open() {
      this.update();
    },
  },
});
</script>
<style scoped>
summary {
  background-color: black;
  color: white;
  padding: 0.5em;
  position: sticky;
  top: 0;
  margin: 1em 0;
}
td {
  padding: 0;
  background-color: inherit;
}
tr:nth-of-type(2n) {
  background-color: beige;
}
table {
  margin-left: 2em;
  max-width: 80%;
}
.right {
  text-align: right;
}

</style>
