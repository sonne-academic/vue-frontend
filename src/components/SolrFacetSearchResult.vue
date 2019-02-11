<template>
    <div>
      <details v-for="field in fields" v-bind:key="field.name">
        <summary> {{ field.name }} </summary>
        <vega-pie-chart 
          v-bind="field"/>
      </details>
        
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import store from '@/store';
import VegaPieChart from './VegaPieChart.vue';

function* gen_pairs(arr: any[]) {
  let name;
  let size;
  while (arr.length) {
    [name, size, ...arr] = arr;
    if (0 === size) {
      continue;
    }
    if (name === '') {
      continue;
    }
    yield { name, size };
  }
}

function* gen_kw(input: any) {
  for (const key of Object.keys(input)) {
    yield {name: key.replace('.', '_'), values: [...gen_pairs(input[key])]};
  }
}

export default Vue.extend({
  name: 'SolrFacetSearchResult',
  components: {VegaPieChart},
  props: {
    response: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
  }),
  methods: {
    log(content: any) {
      store.dispatch('log/log', content);
    },
  },
  computed: {
    fields(): any[] {return [...gen_kw(this.response.facet_counts.facet_fields)]; },
    heatmaps(): any[] {return [...gen_kw(this.response.facet_counts.facet_heatmaps)]; },
    intervals(): any[] {return [...gen_kw(this.response.facet_counts.facet_intervals)]; },
    queries(): any[] {return [...gen_kw(this.response.facet_counts.facet_queries)]; },
    ranges(): any[] {return [...gen_kw(this.response.facet_counts.facet_ranges)]; },
  },
});
</script>

<style scoped>

</style>
