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
  mounted() {
    const r = this.$refs;
    this.$cy.setConfig(config, this.preconfig);
    this.$cy.instance.then((cy) => {
      console.log('mounting');
      cy.mount(r.cy as Element);
      this.menu = cy.cxtmenu({
        selector: 'node, edge',
        openMenuEvents: 'cxttapstart taphold',
        commands: [
          {
            content: 'remove',
            select(ele) {
              console.log( ele.id() );
              ele.remove();
            },
          },

          {
            content: 'name',
            select(ele) {
              console.log( ele.data('name') );
            },
            enabled: false,
          },

          {
            content: 'Text',
            select(ele) {
              console.log( ele.position() );
            },
          },
        ],
      });
      for (const [eventType, callback] of Object.entries(this.$listeners)) {
       cy.on(eventType, (event) => (callback as cytoscape.EventHandler)(event));
      }
    });
  },
  beforeDestroy() {
    this.$cy.instance.then((cy) => {
      console.log('umounting');
      cy.unmount();
      this.menu.destroy();
    });
  },
});
</script>
