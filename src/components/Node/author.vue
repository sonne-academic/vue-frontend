<template>
  <sidebar iconName="author">
    <template #heading>{{author}}</template>
    <template #main>
      <div>
        Source:
        <collection-select @change="changeCollection" :initCollection="collection"/>
      </div>
      <sidebar-detail>
        <template #summary>Filters: {{filters.length}}</template>
        <template #detail>
          <div v-for="filter in filters" :key="filter" @click="removeFilter(filter)">{{filter}}</div>
        </template>
      </sidebar-detail>
      <sidebar-detail>
        <template #summary>Publications: {{docCount}}</template>
        <template #detail>
          <embedded-search
            :filters="filters"
            :query="embQuery"
            :collection="collection"
            @numfound="docCount = $event"
          />
        </template>
      </sidebar-detail>
      <span>
        <span v-if="docCount > 0">
          <author-position :collection="collection" :author="author" :docCount="docCount"/>
        </span>
        <simple-facet-box
          v-for="(facet, index) in facets"
          :key="facet"
          :field="facet"
          :collection="collection"
          :friendlyName="friendlyNames[index]"
          @filter="doFilter"
          :filters="filters"
          :parentQuery="embQuery"
        />
      </span>
    </template>
  </sidebar>
</template>

<script lang="ts">
interface FacetDetail {
  name: string;
  count: number;
}
import Vue from 'vue';
import { FacetResponse, FacetFields } from '@/plugins/vue-solr/lib/responses/FacetResponse';
import { SimpleEmitter, SimpleFacetBox } from '../Emitters';
import { EmbeddedSearch, AuthorPosition } from '../Embed';
import { Sidebar, SidebarDetail } from '@/components/sidebar';
import { CollectionSelect } from '@/plugins/vue-solr/components';

const friendlyMap = new Map<string, string>([
  ['author', 'co-authors'],
  ['journal', 'published in journals'],
  ['venue', 'published in venues'],
  ['year', 'publications in years'],
  ['keywords', 'associated keywords'],
]);
export default Vue.extend({
  name: 'AuthorDetails',
  components: {
    SimpleEmitter,
    SimpleFacetBox,
    EmbeddedSearch,
    AuthorPosition,
    Sidebar,
    CollectionSelect,
    SidebarDetail,
  },
  props: {
    nodeid: {
      required: true,
      type: String,
    },
  },
  data: () => ({
    fieldname: 'author',
    author: '',
    facetResponse: {} as FacetResponse,
    docCount: 0,
    collection: '',
    embQuery: '',
    filters: new Array<string>(),
  }),
  computed: {
    facets(): string[] {
      return this.$solr.facets(this.collection);
    },
    friendlyNames(): string[] {
      return this.facets.map((k) => friendlyMap.get(k) || k);
    },
  },
  methods: {
    getNode() {
      return this.$cy.controller.getNodeById(this.nodeid);
    },
    removeFilter(name: string) {
      this.filters = this.filters.filter((val) => val !== name);
    },
    doFilter(filter: string) {
      this.filters.push(filter);
      this.getNode().data('filters', this.filters);
    },
    clog(d: any) {
      console.log(d);
    },
    log(msg: string) {
      this.$store.dispatch('log', `[AuthorDetails] ${msg}`);
    },
    update() {
      const node = this.getNode();
      this.author = node.data('name');
      this.collection = node.data('collection');
      const filters = node.data('filters');
      if (filters) {
        this.filters = filters;
      } else {
        this.filters = [];
      }
      this.embQuery = `${this.fieldname}:"${this.author}"`;
    },
    changeCollection(ev: string) {
      this.getNode().data('collection', ev);
      this.collection = ev;
    },
  },
  watch: {
    nodeid() {
      this.update();
    },
    collection() {
      this.update();
    },
  },
  created() {
    this.update();
  },
});
</script>
