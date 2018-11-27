<template>
  <div class="endpoint-container">
  </div>
</template>
<script lang="ts">
import Vue from 'vue';

import { SolrCommandSocket } from '@/solr/SolrCommandSocket';
import Command from '@/solr/Command';
import Endpoint from '@/solr/Endpoint';
import store from '@/store';

import Draggable from './Draggable.vue';


export default Vue.extend({
  name: 'SolrEndpointSpec',
  components: { Draggable },
  props: {},
  data: () => ({
    query: '/collections/s2',
    response: '',
    cmds: {},
    ep: {},
    cmd: new SolrCommandSocket(),
    collections: [],
  }),
  methods: {
    log(content: any) {
      store.dispatch('log/log', content);
    },
    submitSearch() {
      this.cmd
        .get_endpoint(this.query)
        .then((d: Endpoint) => {
          this.response = JSON.stringify(d, null, 2);
          this.cmds = d.commands;
          this.ep = d;
          this.log(JSON.stringify(d));
        })
        .catch(console.error);
    },
  },
  beforeDestroy() {
    this.cmd.close();
  },
});
</script>

<style scoped>
</style>
