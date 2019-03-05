<template>  
  <div ref="cy"/>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  data: () => ({
    nodeMenu: {destroy: () => {return; }},
    coreMenu: {destroy: () => {return; }},
  }),
  mounted() {
    const r = this.$refs;
    this.$cy.instance.then((cy) => {
      console.log('mounting');
      cy.mount(r.cy as Element);
      this.nodeMenu = cy.cxtmenu({
        selector: 'node',
        openMenuEvents: 'cxttapstart taphold boxend',
        commands: [
          {
            content: 'remove',
            select(ele) {
              console.log( ele.id() );
              ele.remove();
            },
          },

          {
            content: 'size',
            select(ele) {
              console.log( ele );
            },
            enabled: true,
          },

          {
            content: 'Text',
            select(ele) {
              console.log( ele.position() );
            },
          },
        ],
      });
      this.coreMenu = cy.cxtmenu({
        selector: 'core',
        openMenuEvents: 'cxttapstart taphold',
        commands: [
          {
            content: 'search',
            select: (e) => {this.$emit('newsearch'); },
          },

          {
            content: 'facet-search',
            select(ele) {
              console.log( ele );
            },
            enabled: false,
          },

          {
            content: 'auto-complete',
            select(ele) {
              console.log( ele );
            },
          },
        ],
      });
      for (const [eventType, callback] of Object.entries(this.$listeners)) {
       cy.on(eventType, (event) => (callback as cytoscape.EventHandler)(event));
      }
      cy.on('select', (ev) => {
        // select fires multiple times when box-selecting.
        // const t: cytoscape.CollectionReturnValue = ev.target;
        const t = ev.cy.$('node:selected');
        if (1 === t.length) {
          this.$emit('single', {component: t.data('component'), props: t.data('props')});
          console.log(`single element selected ${t.data('component')}`);
        }
      });
      cy.on('data', (ev) => {
        console.error('DATA CHANGED!');
        console.error(ev);
      });
    });
  },
  beforeDestroy() {
    this.$cy.instance.then((cy) => {
      console.log('umounting');
      cy.off('select');
      cy.off('data');
      cy.unmount();
      this.nodeMenu.destroy();
      this.coreMenu.destroy();
    });
  },
});
</script>
