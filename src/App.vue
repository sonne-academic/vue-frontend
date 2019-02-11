<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <sidebar id="side" @starttree="startTree"/>
    <three-tree-view name="container" :rootid="rootid"/>
    <!-- <search-box @starttree="startTree"/> -->
    <global-log/>
    <!-- <facet-search-box/> -->
    
    <!-- <vega-tree-view name="vegaTree"/> -->
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import GlobalLog from './components/GlobalLog.vue';
import SolrManagement from './components/SolrManagement.vue';
import FacetSearchBox from './components/SolrFacetSearchBox.vue';
import SearchBox from './components/SearchBox.vue';
import ThreeTreeView from './components/ThreeTreeView.vue';
import VegaTreeView from './components/VegaTreeView.vue';
import Sidebar from './components/Sidebar.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld,
    SolrManagement,
    GlobalLog,
    SearchBox,
    FacetSearchBox,
    ThreeTreeView,
    VegaTreeView,
    Sidebar,
  },
  data: () => ({
    rootid: 'none',
  }),
  methods: {
    startTree(stuff: any) {
      this.rootid = stuff.id;
    },
  },
});
</script>

<style>
#app {
  font-family: sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

body {
  margin: 0;
}
/* #viz {
  float: right;
} */

#side {
  float: left;
  position: absolute;
}

</style>
