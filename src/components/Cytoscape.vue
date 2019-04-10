<template>
  <div>
    <div id="controls">
      <a href="https://blog.0ds.de/sonne/">
        <img class="cybtn" src="/about.svg" title="about">
      </a>
      <img class="cybtn" src="/save.svg" title="save to localStorage" @click="save">
      <img class="cybtn" src="/upload.svg" title="upload to sonne" @click="upload">
      <img class="cybtn" src="/layout.svg" title="do layout" @click="layout">
      <img class="cybtn" src="/fit.svg" title="fit graph to window" @click="fit">
      <img class="cybtn" src="/reset_zoom.svg" title="reset zoom" @click="reset_zoom">
    </div>
    <div class="cy" ref="cy"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { FacetResponse } from '../plugins/vue-solr/lib/responses/FacetResponse';
import { RpcResponse, RpcResult } from '../plugins/vue-solr/lib/RpcInterface';
import debounce from 'lodash/debounce';
const activeComponents = ['search-results'];
type evl = (ev: KeyboardEvent) => void;
export default Vue.extend({
  data: () => ({
    nodeMenu: { destroy: () => { return; } },
    coreMenu: { destroy: () => { return; } },
    cdnd: {
      enable: () => { return; },
      disable: () => { return; },
      destroy: () => { return; },
    },
    listener: null as evl | null,
  }),
  methods: {
    save() {
      try {
        this.$cy.controller.saveGraph();
      } catch {
        this.$store.dispatch('log', 'could not save graph, maybe it\'s too large for localStorage?');
      }

    },
    layout() {
      this.$cy.controller.layout();
    },
    fit() {
      this.$cy.controller.fit();
    },
    reset_zoom() {
      this.$cy.controller.reset_zoom();
    },
    async upload() {
      const cy = await this.$cy.instance;
      const data: any = cy.json();
      const uuid = this.current_graph_id;
      const version = 1;
      const elements = data.elements;
      const dataStr = JSON.stringify({ version, elements });
      if (!uuid) {
        const response = await this.$solr.upload_graph(dataStr);
        window.location.search = `${response.result.uuid}`;
      } else {
        const response = await this.$solr.upload_update(dataStr, uuid);
        console.log('sent update');
      }
    },
    async download() {
      const uuid = this.current_graph_id;
      if (!uuid) {
        return;
      }
      const response = await this.$solr.download_graph(uuid);
      const cy = await this.$cy.instance;
      cy.add(response.result.graph.elements);
    },
    autoSave: debounce(function(this: any) {
      if (null === this.current_graph_id) {
        this.upload();
      }
    }, 5000),
    autoUpload: debounce(function(this: any) {
      if (null !== this.current_graph_id) {
        this.upload();
      }
    }, 5000),
    maybeEmit(ev: cytoscape.EventObject) {
      const c = ev.cy.$('node:selected');
      if (0 === c.length) {
        // nothing selected
        this.$emit('setactive', { component: '', id: '' });
      } else if (1 === c.length) {
        const component = c.data('component');
        if ('multi' === component) {
          // c.unselect();
          c.incomers('node').select();
          // return;
        }
        const id = c.data('id');
        this.$emit('setactive', { component, id });
      } else if (1 < c.length) {
        const multi = c.filter('node[component="multi"]');
        if (0 < multi.length) {
          multi.forEach((m) => {
            // m.unselect();
            m.incomers('node').select();
          });
          // return;
        }
        const components: string[] = c.map((node) => {
          const f = node.data('component');
          const n = node.data('name');
          return `${f}:"${n}"`;
        });
        const q = components.join(' AND ');
        // this is where we decide on what to do with multiple nodes
        this.$emit('setactive', { component: 'multi', id: q });
      }
    },
    keypress(ev: KeyboardEvent) {
      if ('Escape' === ev.key) {
        this.$cy.instance.then((cy) => {
          cy.$(':selected').unselect();
        });
      } else if ('Delete' === ev.key) {
        this.$cy.instance.then((cy) => {
          const nodes = cy.$(':selected');
          this.$cy.controller.remove(nodes);
        });
      } else {
        // console.log(ev);
      }
    },
  },
  computed: {
    current_graph_id(): string | null {
      const deeplink = window.location.search;
      if (deeplink) {
        const split = deeplink.replace('?', '').split('=');
        if (split.length === 1) {
          const uuid = decodeURI(split[0]);
          return uuid;
        }
      }
      return null;
    },
  },
  created() {
    if (!this.listener) {
      this.listener = (ev) => this.keypress(ev);
    }
    window.addEventListener('keyup', this.listener);
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
            select: (ele) => {
              this.$cy.controller.remove(ele);
            },
          },
          {
            content: 'log\ndata in\nconsole',
            select(ele) {
              console.log(ele.data());
            },
          },
          {
            content: 'log\nscratch in\nconsole',
            select(ele) {
              console.log(ele.scratch());
            },
          },
        ],
      });
      cy.on('select unselect', 'node', (ev) => { this.maybeEmit(ev); });
      return this.download();
    }).then(() => {
      return this.$cy.instance;
    }).then((cy) => {
      this.maybeEmit({ cy } as cytoscape.EventObject);
      cy.on('add remove data', 'node', (ev) => {
        this.autoUpload();
        this.autoSave();
       });
    }).catch(console.error);
  },
  beforeDestroy() {
    if (this.listener) {
      window.removeEventListener('keyup', this.listener);
    }
    this.$cy.instance.then((cy) => {
      cy.off('select');
      cy.off('unselect');
      cy.off('add remove data');
      cy.unmount();
      this.nodeMenu.destroy();
      this.coreMenu.destroy();
    });
  },
});
</script>
<style>
#controls {
  position: fixed;
  width: 1.5em;
  right: 0.5em;
  top: 0.5em;
  z-index: 1;
}
.cy {
  position: fixed;
  width: 100%;
  height: 100%;
}
.cybtn {
  height: 1.5em;
  width: 1.5em;
  opacity: 0.25;
  border: solid 1px white;
}
.cybtn:hover {
  opacity: 1;
  border: solid 1px red;
}
</style>
