<template>
    <div>
      <facet-box v-for="field in fields" 
        v-bind:key="field.name" 
        :label="field.name"
        :items="field.values"
      />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import FacetBox from './FacetBox.vue';

function* gen_pairs(arr: any[]) {
  let name: string;
  let size: number;
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
  name: 'FacetSearchResult',
  components: {FacetBox},
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
      this.$store.dispatch('log', content);
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
