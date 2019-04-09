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
      this.$cy.controller.saveGraph();
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
    async upload() {
      const cy = await this.$cy.instance;
      const data: any = cy.json();
      const uuid = this.current_graph_id();
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
      const uuid = this.current_graph_id();
      if (!uuid) {
        return;
      }
      const response = await this.$solr.download_graph(uuid);
      const cy = await this.$cy.instance;
      cy.add(response.result.graph.elements);
    },
    maybeEmit(ev: cytoscape.EventObject) {
      const c = ev.cy.$('node:selected');
      if (0 === c.length) {
        // nothing selected
        this.$emit('setactive', { component: '', id: '' });
      } else if (1 === c.length) {
        const component = c.data('component');
        if ('multi' === component) {
          c.unselect();
          c.incomers('node').select();
          return;
        }
        const id = c.data('id');
        this.$emit('setactive', { component, id });
      } else if (1 < c.length) {
        const multi = c.filter('node[component="multi"]');
        if (0 < multi.length) {
          multi.forEach((m) => {
            m.unselect();
            m.incomers('node').select();
          });
          return;
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
          {
            content: 'ENHANCE',
            select: (ele) => {
              cy.batch(() => {
                ele.data('level', 10000);
                cy.zoomingEnabled(false);
                cy.elements().not(ele).addClass('faded');
                const facets = this.$solr.facets(ele.data('collection'));
                for (const facet of facets) {
                  cy.add({ group: 'nodes', data: { size: 30, name: facet, id: facet, level: 9999 }, classes: 'tmp' });
                  cy.add({ group: 'edges', data: { target: ele.id(), source: facet }, classes: 'tmp' });
                }
                const coll = cy.$('.tmp').union(ele);
                coll.layout({
                  name: 'concentric',
                  animate: 'end',
                  animationDuration: 250,
                  nodeDimensionsIncludeLabels: true,
                }).run();
                coll.nodes('.tmp').forEach((node) => {
                  console.log(`${node.data('name')}:${ele.data('name')}`);
                  const params = {
                    'q': `${ele.data('component')}:"${ele.data('name')}"`,
                    'facet': 'on',
                    'rows': 0,
                    'facet.field': node.data('name'),
                  };
                  node.scratch('_enhance', () => {
                    return this.$solr.select({
                      collection: ele.data('collection'),
                      payload: { params },
                    });
                  });
                  node.on('select', () => {
                    const fun = node.scratch('_enhance');
                    if (!fun) {
                      return;
                    }
                    fun().then((d: RpcResult<FacetResponse>) => {
                      cy.startBatch();
                      for (const [k, v] of Object.entries(d.result.facet_counts.facet_fields)) {
                        let x: any[] = v;
                        const maxSize: number = x[1];
                        console.log(maxSize);
                        let nm;
                        let cn;
                        const arr = new Array<{ name: string, count: number }>();
                        while (x.length) {
                          [nm, cn, ...x] = x;
                          arr.push({ name: nm, count: cn });
                        }
                        arr.sort((a, b) => a.name < b.name ? 1 : -1);
                        arr.forEach(({name, count}) => {
                          const data = {
                            size: 30 + 60 * (count / maxSize),
                            facet: k,
                            level: count,
                            id: `tmp:${k}:${name}`,
                            name,
                          };
                          cy.add({
                            group: 'nodes',
                            data,
                            classes: 'tmp',
                          });
                          cy.add({
                            group: 'edges',
                            data: { source: node.id(), target: `tmp:${k}:${name}` },
                            classes: 'tmp',
                          });
                        });

                        node.on('unselect', () => {
                          // cy.$(`node[facet="${k}"]`).remove();
                        });
                      }

                      cy.endBatch();
                      cy.elements('.tmp').union(ele).layout({
                        name: 'concentric',
                        animate: 'end',
                        animationDuration: 250,
                        nodeDimensionsIncludeLabels: true,
                        directed: true,
                        concentric: (cn: cytoscape.NodeSingular) => (cn.indegree(false)),
                        levelWidth: (nodes: cytoscape.NodeCollection) => nodes.maxIndegree(false) / 4,
                      }).run();
                    });
                  });
                });
                cy.zoomingEnabled(true);
              });
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
    }).catch(console.error);
  },
  beforeDestroy() {
    if (this.listener) {
      window.removeEventListener('keyup', this.listener);
    }
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
