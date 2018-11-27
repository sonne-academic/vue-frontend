<template>
  <div id="app">
    <!-- <img alt="Vue logo" src="./assets/logo.png"> -->
    <!-- <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/> -->
    <search-box/>
    <global-log/>
    <facet-search-box/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import HelloWorld from './components/HelloWorld.vue';
import GlobalLog from './components/GlobalLog.vue';
import SolrManagement from './components/SolrManagement.vue';
import FacetSearchBox from './components/SolrFacetSearchBox.vue';
import SearchBox from './components/SearchBox.vue';

export default Vue.extend({
  name: 'app',
  components: {
    HelloWorld,
    SolrManagement,
    GlobalLog,
    SearchBox,
    FacetSearchBox,
  },
});
</script>

<style>
#app {
  font-family: sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
