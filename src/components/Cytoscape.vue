<template>
<div>
    <img class="cybtn" id="save" src="/save.svg" title="save to localStorage" @click="save">
    <img class="cybtn" id="layout" src="/layout.svg" title="do layout" @click="layout">
    <div class="cy" ref="cy"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
const activeComponents = ['search-results'];
export default Vue.extend({
  data: () => ({
    nodeMenu: {destroy: () => {return; }},
    coreMenu: {destroy: () => {return; }},
    cdnd: {enable: () => {return; }, disable: () => {return; }, destroy: () => {return; }},
  }),
  methods: {
    save() {
      this.$cy.controller.saveGraph();
    },
    layout() {
      this.$cy.controller.layout();
    },
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
        const components: string[] = c.map((node) => {
          const f = node.data('component');
          const n = node.data('name');
          return `${f}:"${n}"`;
        });
        const q = components.join(' AND ');
        console.log(q);
        // this is where we decide on what to do with multiple nodes
        this.$emit('setactive', {component: 'multi', id: q});
      }
    },
  },
  mounted() {
    const r = this.$refs;
    this.$cy.instance.then((cy) => {
      // cy.compoundDragAndDrop();
      cy.mount(r.cy as Element);
      this.nodeMenu = cy.cxtmenu({
        selector: 'node, edge',
        openMenuEvents: 'cxttapstart taphold',
        commands: [
          {
            content: 'remove',
            select(ele) {
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
      this.maybeEmit({cy} as cytoscape.EventObject);
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
<style>
.cy {
  position: fixed;
  width: 100%;
  height: 100%;
}
.cybtn {
  position: absolute;
  right: 0.5em;
  height: 1.5em;
  width: 1.5em;
  opacity: 0.25;
  z-index: 1;
}
.cybtn:hover {
  opacity: 1;
  border: solid 1px red;
}
#save {
  top: 0.5em;
}
#layout {
  top: 2.5em;
}
</style>
