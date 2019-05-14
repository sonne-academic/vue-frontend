<template>
  <sidebar iconName="multi">
    <template #heading> Multiple Nodes:
      <div v-for="thing in fieldvalues()" :key="thing.field+thing.value">
        <img :src="'/'+thing.field+'.svg'"> {{thing.value}}
      </div>
    </template>
    <template #main>
      <sidebar-detail :alwaysLoad=true>
        <template #summary>Publications: {{docCount}}</template>
        <template #detail>
          <embedded-search
            :query="query"
            :collection="collection"
            @numfound="docCount = $event"
            :filters="filters"/>
        </template>
      </sidebar-detail>

      <simple-facet-box v-for="facet in facets" :key="facet"
        :field="facet"
        :collection="collection"
        :friendlyName="facet"
        :filters="filters"
        :parentQuery="query"
      />
    </template>
    <template #footer>
      <span v-if="ignored().length">
        ignored:
      </span>
      <div v-for="thing in ignored()" :key="thing.field+thing.value">
        <img :src="'/'+thing.field+'.svg'"> {{thing.value}}
      </div>
    </template>
  </sidebar>
</template>

<script lang="ts">
import Vue from 'vue';
import {SimpleFacetBox} from '../Emitters';
import {EmbeddedSearch} from '../Embed';
import {Sidebar, SidebarDetail} from '../sidebar';

interface FieldValue {
  field: string;
  value: string;
}

export default Vue.extend({
  name: 'MultiQuery',
  components: {SimpleFacetBox, EmbeddedSearch, Sidebar, SidebarDetail},
  data: () => ({
    friendlyNames: [],
    query: '',
    header: '',
    docCount: 0,
    collection: '',
    filters: [],
  }),
  props: {
    nodeid: {
      type: String,
      required: true,
    },
  },
  methods: {
    log(msg: string) {
      this.$store.dispatch('log', `[${name}-details] ${msg}`);
    },
    update() {
      const nodes = this.$cy.controller.activeNodes;
      this.collection = nodes.data('collection');
      const allowed = this.$solr.facets(this.collection);
      this.query = nodes.map((node) => {
        const n = node.data('name');
        const c = node.data('component');
        if (0 > allowed.indexOf(c)) {
          return '';
        }
        return `${c}:"${n}"`;
      }).join(' ');
    },
    fieldvalues(): FieldValue[] {
      const nodes = this.$cy.controller.activeNodes;
      this.collection = nodes.data('collection');
      const allowed = this.$solr.facets(this.collection);
      return nodes.filter((node) => {
          return 0 <= allowed.indexOf(node.data('component'));
        })
        .map((node) => {
        const value = node.data('name');
        const field = node.data('component');
        return {field, value};
      });
    },
    ignored(): FieldValue[] {
      const nodes = this.$cy.controller.activeNodes;
      this.collection = nodes.data('collection');
      const allowed = this.$solr.facets(this.collection);
      return nodes.filter((node) => {
        const idx = allowed.indexOf(node.data('component'));
        console.log(idx);
        return 0 > allowed.indexOf(node.data('component'));
        })
        .map((node) => {
        const value = node.data('name');
        const field = node.data('component');
        console.log(field + value);
        return {field, value};
      });
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
  },
  computed: {
    facets(): string[] {
      return this.$solr.facets(this.collection);
    },
  },
  created() {
    this.update();
  },
});
</script>
