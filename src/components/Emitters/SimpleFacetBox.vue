<template>
  <sidebar-detail ref="details"
    @opened="open=true"
    @closed="open=false">
    <template #summary>
      {{friendlyName}}
    </template>
    <template #detail>
    <spinner v-if="loading"/>
    <span v-else-if="error"> error :( </span>
    <table v-else-if="items.length > 0">
      <tr v-for="data in items" :key="data.name" >
        <td ><img id="neg" src="/negative.svg" @click="emitFilter(data.name)"/></td>
        <td><simple-emitter :collection="collection" :field="field" :name="data.name"/></td>
        <td class="right">{{data.count}}</td>
      </tr>
    </table>
    <span v-else> nothing found </span>
    </template>
  </sidebar-detail>
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
import {Spinner} from '../util/';
import {SidebarDetail} from '@/components/sidebar';

export default Vue.extend({
  name: 'SimpleFacetBox',
  components: {SimpleEmitter, Spinner, SidebarDetail},
  props: {
    parentQuery: {
      type: String,
      required: true,
    },
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
    filters: {
      // type: string[],
      default: new Array<string>(),
    },
  },
  data: () => ({
    open: false,
    items: [] as Array<{name: string, count: number}>,
    loading: false,
    error: false,
  }),
  methods: {
    emitFilter(value: string) {
      this.$emit('filter', `-(${this.field}:"${value}")`);
    },
    async getFacets(): Promise<FacetResponse> {
      const scratchspace = this.scratchspace;
      const node = this.getNode();
      let result = node.scratch(scratchspace);
      if (result) {
        return result;
      }
      const d = await this.$solr.select({collection: this.collection, payload: this.payload});
      result = d.result as FacetResponse;
      node.scratch(scratchspace, result);
      return result;
    },
    async update() {
      if (this.open) {
        this.loading = true;
        this.error = false;
        try {
          const result = await this.getFacets();
          const flds: FacetFields = result.facet_counts.facet_fields;
          Object.entries(flds)
            .forEach(([key, arr]) => (this.items = [...gen_pairs(arr)]));
        } catch {
          this.error = true;
        } finally {
          this.loading = false;
        }
      }
    },
    getNode() {
      const node = this.$cy.controller.activeNodes;
      if (node.length !== 1) {
        throw new Error('[SimpleFacetBox] cannot emit on multiple nodes');
      }
      return node;
    },
    resetScratch() {
      const node = this.getNode();
      node.removeScratch(this.scratchspace);
    },
  },
  computed: {
    scratchspace(): string {
      return `_facets_${this.collection}_${this.field}`;
    },
    payload(): any {
      let q = this.parentQuery;
      q += ' ' + this.filters.join(' ');
      return {
        params: {
          'debug': false,
          q,
          'facet': 'on',
          'rows': 0,
          'facet.field': this.field,
          },
      };
    },
    details(): any {
      return this.$refs.details as any;
    },
  },
  watch: {
    open() {this.update(); },
    filters() {
      this.resetScratch();
      this.update();
      },
    queryValue() {
      this.details.close();
    },
    queryField() {
      this.details.close();
    },
    collection() {
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
#neg {
  opacity: 0.25;
}
#neg:hover {
  opacity: 1;
}
</style>
