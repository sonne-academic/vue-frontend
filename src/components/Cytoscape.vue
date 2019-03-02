<template>  
  <div ref="cy"/>
</template>

<script lang="ts">

import Vue from 'vue';
import config from './Cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
export default Vue.extend({
  data: () => ({
    menu: {} as cxtmenu.Destructor,
  }),
  methods: {
    preconfig(mod: {default: any, use: (c: any) => void}) {
      mod.use(cxtmenu);
    },
  },
  {
    selector: 'node[kind=\"search\"]',
    style: {
      'background-color': '#eee',
      'label': 'data(query)',
      'background-image': '/close.min.svg',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'node[kind=\"facet\"][field=\"author\"]',
    style: {
      'background-color': '#eee',
      'label': 'data(value)',
      'background-image': '/author.svg',
      'background-width': '75%',
      'background-height': '75%',
      // 'background-fit': 'contain',
    },
  },
  {
    selector: 'node[kind=\"facet\"][field=\"journal\"]',
    style: {
      'background-color': '#eee',
      'label': 'data(value)',
      // 'background-image': '/author.svg',
      // 'background-width': '75%',
      // 'background-height': '75%',
      // 'background-fit': 'contain',
    },
  },

  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#eee',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
    },
  },
],
};
import Vue from 'vue';
import cfg from './Cytoscape';
export default Vue.extend({
  mounted() {
    const r = this.$refs;
    this.$cy.setConfig(config);
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
