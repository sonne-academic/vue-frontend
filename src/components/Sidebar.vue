<template>
  <div class="sidebarcontainer" >
    <div class="tab-container">
    <button
      v-for="tab in tabs"
      :key="tab"
      :class="['tab-button', { active: currentTab === tab }]"
      @click="currentTab = tab"
    >{{ tab }}</button>
    </div>
    <keep-alive>
    <component
      v-bind:is="currentTabComponent"
      @starttree="startTree"
      class="tab"
    ></component>
    </keep-alive>
  </div>

</template>

<script lang="ts">
import Vue from 'vue';

import Search from './Search.vue';
import FacetSearch from './FacetSearch.vue';

export default Vue.extend({
  name: 'Sidebar',
  components: { Search, FacetSearch},
  data: () => ({
    tabs: ['search', 'facet-search'],
    query: 'authors.name:*Ropinski*',
    lastQuery: '',
    result: {},
    start: 0,
    docs: new Array<any>(),
    pageDocs: new Map<number, any[]>(),
    currentPage: '1',
    numFound: 0,
    rows: 10,
    pageCount: 0,
    visible: 'block',
    currentTab: 'search',
  }),
  methods: {
    toggleVisible(event: any) {
      if (this.visible === 'block!important') {
        this.visible = 'none';
      } else {
        this.visible = 'block!important';
      }
    },
    startTree(stuff: any) {
      this.$emit('starttree', stuff);
    },
  },
  computed: {
    currentTabComponent(): string {
      return this.currentTab.toLowerCase();
    },
  },
});
</script>

<style scoped>
.sidebarcontainer {
  width:25%;
  background-color: #fff;
}
.sidebar {
  height:100%;
  width: 25%;
  background-color:#fff;
  position:fixed!important;
  z-index:1;
  overflow:auto
}

.tab-container {
  float: left;
}

.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
.tab {
  border: 1px solid #ccc;
  padding: 10px;
}
@media (min-width:993px){
  .w3-modal-content{width:900px}
  .w3-hide-large{display:none!important}
  /* .sidebar.collapse{display:block!important} */
}
.animate-left{
  position:relative;
  animation:animateleft 0.4s
}
@keyframes animateleft{
  from{left:-300px;opacity:0} 
  to{left:0;opacity:1}
}
@media (max-width:992px){
  .sidebar.collapse{display:none}
  .w3-main{margin-left:0!important;margin-right:0!important}
  .w3-auto{max-width:100%}
}
.dragger {
  width: inherit;
}

details {
  text-align: left;
}

</style>
