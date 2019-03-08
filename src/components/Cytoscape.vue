<template>
    <div ref="cy"/>
</template>

<script lang="ts">
import Vue from 'vue';
const activeComponents = ['search-results'];
export default Vue.extend({
  data: () => ({
    nodeMenu: {destroy: () => {return; }},
    coreMenu: {destroy: () => {return; }},
  }),
  methods: {
    maybeEmit(ev: cytoscape.EventObject) {
      const c = ev.cy.$('node:selected');
      if (0 === c.length) {
        // nothing selected
        this.$emit('setactive', {component: '', id: ''});
      }
      if (1 === c.length) {
        const component = c.data('component');
        const id = c.data('id');
        this.$emit('setactive', {component, id});
      }
      if (1 < c.length) {
        // this is where we decide on what to do with multiple nodes
        this.$emit('setactive', {component: '', id: ''});
      }
    },
  },
  mounted() {
    const r = this.$refs;
    this.$cy.instance.then((cy) => {
      cy.mount(r.cy as Element);
      this.nodeMenu = cy.cxtmenu({
        selector: 'node',
        openMenuEvents: 'cxttapstart taphold',
        commands: [
          {
            content: 'remove',
            select(ele) {
              console.log( ele.id() );
              ele.unselect();
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
      cy.on('select', (ev) => {this.maybeEmit(ev); });
      cy.on('unselect', (ev) => {this.maybeEmit(ev); });
    });
  },
  beforeDestroy() {
    this.$cy.instance.then((cy) => {
      cy.off('select');
      cy.off('unselect');
      cy.unmount();
      this.nodeMenu.destroy();
      this.coreMenu.destroy();
    });
  },
});
</script>
