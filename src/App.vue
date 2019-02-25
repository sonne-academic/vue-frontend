<template>
  <div id="app">
    <sidebar id="side" @starttree="startTree"/>
    <three-tree-view name="container" :rootid="rootid"/>
    <global-log/>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import GlobalLog from './components/GlobalLog.vue';
import SearchBox from './components/SearchBox.vue';
// import ThreeTreeView from './components/ThreeTreeView.vue';
import Sidebar from './components/Sidebar.vue';

export default Vue.extend({
  name: 'app',
  components: {
    GlobalLog,
    ThreeTreeView: () => import('./components/ThreeTreeView.vue'),
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
