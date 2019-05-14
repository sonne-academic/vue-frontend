<template>
  <details ref="details" @toggle="open = $event.target.open">
    <summary>author position in paper</summary>
    <spinner v-if="loading"/>
    <table v-else>
      <th title="the position of this person in the list of authors on their publications">position</th>
      <th title="the amount of papers where the author was in this position">count</th>
      <th title="the amount of papers where the author was mentioned last">last</th>
      <tr class="alternate" v-for="data in result" :key="data.position">
        <td class="right">{{data.position}}</td>
        <td class="right">{{data.count}}</td>
        <td class="right">{{data.senior_count}}</td>
        <td :style="{width: 50+'%', 'background-color': 'white'}">
          <div class="outerbar"
            :title="data.count"
            :style="{width: 100*(data.count/maxCount)+'%'}"
          >
            <div class="innerbar"
              :title="data.senior_count"
              :style="{width: 100*(data.senior_count/data.count)+'%'}"
            ></div>
          </div>

          <!-- <div class="bart">{{data.count}}</div> -->
        </td>
      </tr>
    </table>
  </details>
</template>

<script lang="ts">
import Vue from 'vue';
import { Spinner } from '../util';

export default Vue.extend({
  name: 'AuthorPosition',
  components: { Spinner },
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
    result: new Array<{ position: number, count: number, senior_count: number }>(),
    loading: true,
    open: false,
  }),
  methods: {
    reset() {
      this.result = [];
      this.loading = true;
    },
    update() {
      this.reset();
      if (this.details.open) {
        this.authorIndexGroup();
      }
    },
    async authorIndexGroup() {
      const scratchspace = '_author_index';

      let result;
      if (!result) {
        console.debug('no data in scratch');
        const data = await this.$solr.author_position(this.collection, this.author, this.docCount);
        result = data.result;
      }
      this.result = result;
      this.loading = false;
    },
  },
  computed: {
    details(): HTMLDetailsElement {
      return this.$refs.details as HTMLDetailsElement;
    },
    maxCount(): number {
      return Math.max(...this.result.map(({ count }) => count));
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
tr.alternate:nth-of-type(2n) {
  background-color: beige;
}
table {
  margin-left: 2em;
  max-width: 80%;
}
.right {
  text-align: right;
}
.outerbar {
  background-color: lightgray;
}
.innerbar {
  background-color: gray;
  /* height: .5em; */
  height: 1.2em;
}
.outerbar > .innerbar:hover {
  background-color: red;
}
.outerbar:hover > .innerbar:hover {
  background-color: green;
}
.outerbar:hover > .innerbar {
  background-color: gray;
}
.outerbar:hover {
  background-color: black;
}
</style>
