<template>
  <div id="app">
    <!-- <sidebar id="side" @starttree="startTree"/> -->
    <cy id="cy" @setactive="setActive"/>
    <search-box id="search" @setactive="setActive"/>
      <!-- @tap="log" -->
    <!-- <three-tree-view name="container" :rootid="rootid"/> -->
    <component id="active" :nodeid="activeId" :is="activeComponent"/>
    <component id="passive" :nodeid="passiveId" :is="passiveComponent"/>
    <global-log id="log"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalLog from './components/GlobalLog.vue';
import SearchBox from './components/SearchBox.vue';
// import ThreeTreeView from './components/ThreeTreeView.vue';
import Sidebar from './components/Sidebar.vue';
import SearchResults from './components/SearchResults.vue';
import cy from './components/Cytoscape.vue';
import FacetSearch from './components/FacetSearch.vue';
import {detailComponents} from './components/DetailViews';
export default Vue.extend({
  name: 'app',
  components: {
    GlobalLog,
    SearchResults,
    SearchBox,
    ...detailComponents,
    FacetSearch,
    cy,
    // ThreeTreeView: () => import('./components/ThreeTreeView.vue'),
    Sidebar,
  },
  data: () => ({
    activeComponent: '',
    activeId: '',
    passiveComponent: '',
    passiveId: '',
  }),
  methods: {
    log(e: any) {
      console.log(e);
    },
    setActive(opts: {component: string, id: string}) {
      this.activeComponent = opts.component;
      this.activeId = opts.id;
    },
    setPassive(opts: {component: string, id: string}) {
      this.passiveComponent = opts.component;
      this.passiveId = opts.id;
    },
  },
});
</script>

<style>
body {
  margin: 0;
}
h1>img {
  height: 1em;
}
.emitter:hover {
  background-color: black;
  color: white;
  cursor: pointer;
}

#app {
  font-family: sans-serif;
  color: #2c3e50;
  margin-top: 0px;
  /* overflow-y: visible; */
  width:100%;
  height:100%;
}

#log {
  position: fixed;
  bottom: 0;
  right: 0;
}

#active {
  position: fixed;
  border: 1px solid #ccc;
  width: 33%;
  height: 100%;
  background-color: white;
  overflow: auto;
  z-index: 1;
}
#cy {
  position: fixed;
  /* border: 1px solid #ccc; */
  width: 100%;
  height: 100%;
  /* left: 33%;
  top: 0; */
  z-index: 0;
}
#search {
  position: fixed;
  top: 0;
  width: 33%;
  left: 50%;
  transform: translateX(-50%);
  overflow: visible;
}
</style>
