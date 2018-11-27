<template>
  <div class="log-container">
    <textarea 
    rows=10 
    cols=80 
    id="global-log" 
    readonly 
    title="log" 
    v-model="logText"></textarea>
  </div>
</template>

<script lang="ts">
import { mapGetters } from 'vuex';
import { Log } from '@/store/modules/log';
import Vue from 'vue';
import store from '@/store';
export default Vue.extend({
  name: 'GlobalLog',
  computed: {
    logContent(): Log[] {
      return store.getters['log/logContent'];
    },
    logText(): string {
      return this.logContent.reduce((prev, next) => prev + '\n' + JSON.stringify(next), '');
    },
  },
});
</script>

<style scoped>
.log-container {
  position: fixed;
  bottom: 0;
  right: 0;
}
textarea {
  position: fixed;
  bottom: 0;
  right: 0;
}
</style>
