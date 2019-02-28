<template>
  <div ref="cy"/>
</template>

<script lang="ts">
const style = [ // the stylesheet for the graph
  {
    selector: 'node',
    style: {
      'background-color': '#666',
      'label': 'data(id)',
    },
  },

  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#ccc',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
    },
  },
];
import Vue from 'vue';
export default Vue.extend({
  mounted() {
    const r = this.$refs;
    this.$cy.setConfig({style});
    this.$cy.instance.then((cy) => {
      cy.mount(r.cy as Element);
    });
  },
});
</script>
