<template>
  <details @toggle="open = $event.target.open">
    <summary>{{friendlyName}}</summary>
    <table v-if="items.length > 0">
      <tr v-for="data in items" :key="data.name" >
        <td><simple-emitter :collection="collection" :field="field" :name="data.name"/></td>
        <td class="right">{{data.count}}</td>
      </tr>
    </table>
    <img v-else class="spinner" src="/spinner.svg"/>
  </details>

</template>

<script lang="ts">
function* gen_pairs(arr: any[]) {
  let name: string;
  let count: number;
  while (arr.length) {
    [name, count, ...arr] = arr;
    if (0 === count) {
      continue;
    }
    if (name === '') {
      continue;
    }
    yield { name, count };
  }
}

import Vue from 'vue';
import { FacetResponse, FacetFields } from '@/plugins/vue-solr/lib/responses/FacetResponse';
import SimpleEmitter from './Simple.vue';
export default Vue.extend({
  name: 'SimpleFacetBox',
  components: {SimpleEmitter},
  props: {
    field: {
      type: String,
      required: true,
    },
    friendlyName: {
      type: String,
      required: true,
    },
    collection: {
      type: String,
      required: true,
    },
    queryValue: {
      type: String,
      required: true,
    },
    queryField: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    open: false,
    items: [] as Array<{name: string, count: number}>,
  }),
  methods: {
    async getFacets() {
      const scratchspace = `_facets_${this.field}`;
      const node = this.$cy.controller.activeNodes;
      if (node.length !== 1) {
        throw new Error('[SimpleFacetBox] cannot emit on multiple nodes');
      }
      let result = node.scratch(scratchspace);
      if (!result) {
        const d: any = await this.$solr.select({collection: this.collection, payload: this.payload});
        result = d as FacetResponse;
        node.scratch(scratchspace, result);
      }
      const flds: FacetFields = result.facet_counts.facet_fields;
      Object.entries(flds)
        .forEach(([key, arr]) => (this.items = [...gen_pairs(arr)]));
    },
    update() {
      if (this.open) {
        this.getFacets();
      }
    },
  },
  computed: {
    payload(): any {
      return {
        params: {
          'debug': false,
          'q': `${this.queryField}:"${this.queryValue}"`,
          'facet': 'on',
          'rows': 0,
          'facet.field': this.field,
          },
      };
    },
  },
  watch: {
    open() {this.update(); },
    queryValue() {this.update(); },
    queryField() {this.update(); },
  },
  mounted() {
    this.open = false;
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
.left {
  text-align: left;
}
.right {
  text-align: right;
}
td {
  padding: 0;
  background-color: inherit;
}
tr:nth-of-type(2n-1) {
  background-color: beige;
}
table {
  margin-left: 2em;
  max-width: 80%;
}
img.spinner {
  height: 2em;
  animation: spinner 1s linear infinite;
}
@keyframes spinner {
    0% {
        transform: rotate(0deg);
    } 50% {
        transform: rotate(0deg);
    } 100% {
        transform: rotate(180deg);
    }
}
</style>
