<template>
  <div id="app">
    <sidebar id="side" @starttree="startTree"/>
    <cy id='cy'/>
    <!-- <three-tree-view name="container" :rootid="rootid"/> -->
    <global-log id="log"/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalLog from './components/GlobalLog.vue';
import SearchBox from './components/SearchBox.vue';
// import ThreeTreeView from './components/ThreeTreeView.vue';
import Sidebar from './components/Sidebar.vue';
import cy from './components/Cytoscape.vue';

export default Vue.extend({
  name: 'app',
  components: {
    GlobalLog,
   cy,
    // ThreeTreeView: () => import('./components/ThreeTreeView.vue'),
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
body {
  margin: 0;
}

#app {
  font-family: sans-serif;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 0px;
}

#log {
  position: fixed;
  bottom: 0;
  right: 0;
}

#side {
  position: absolute;
  border: 1px solid #ccc;
  width: 33%;
}
#cy {
  position: absolute;
  width: 33%;
  height: 100%;
  left: 33%;
  top: 0;
}
</style>
