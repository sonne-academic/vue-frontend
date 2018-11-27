<template>
  <Draggable name="manager">
    <span class="dragger">&#127989;</span>
    <button @click="submitSearch">Endpoint</button>
    <button>Author</button>
    <button>Title</button>
    
    <div>
      <input id="search-input" v-model="query" type="text" title="search text"/>
      <input id="search-submit" @click="submitSearch" type="button" value="Send"/>
      <details v-for="cmd in cmds" :key="cmd.endpoint">
        <summary> {{cmd.method}}: {{cmd.endpoint}}</summary>
        {{cmd}}
      </details>

    </div>

  </Draggable>

</template>

<script lang="ts">
import { mapActions } from 'vuex';
import Vue from 'vue';

import { SolrCommandSocket } from '@/solr/SolrCommandSocket';
import Command from '@/solr/Command';
import Endpoint from '@/solr/Endpoint';
import store from '@/store';

import Draggable from './Draggable.vue';


export default Vue.extend({
  name: 'SolrManagement',
  components: { Draggable },
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
#search-input {
  width: inherit;
}

.dragger {
  width: inherit;
}

details {
  text-align: left;
}

textarea {
  position: fixed;
  right: 0;
  bottom: 0;
}
</style>
