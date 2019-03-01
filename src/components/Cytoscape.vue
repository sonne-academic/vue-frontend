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
import cfg from './Cytoscape';
export default Vue.extend({
  mounted() {
    const r = this.$refs;
    this.$cy.setConfig({style});
    this.$cy.instance.then((cy) => {
      console.log('mounting');
      cy.mount(r.cy as Element);
      for (const [eventType, callback] of Object.entries(this.$listeners)) {
       cy.on(eventType, (event) => (callback as cytoscape.EventHandler)(event));
      }

    });
  },
  beforeDestroy() {
    this.$cy.instance.then((cy) => {
      console.log('umounting');
      cy.unmount();
    });
  },
});
</script>
