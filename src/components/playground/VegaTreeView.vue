<template>
    <div :id="name" :title="name"/>
</template>

<script lang="ts">
import Vue from 'vue';
import {View, Warn} from 'vega';
import {IdParent} from '@/store/modules/idtree';

export default Vue.extend({
  name: 'VegaTreeView',
  props: {
    name: {
      type: String,
      required: true,
    },
  },
  data: () => ({

  }),
  methods: {
    log(content: any) {
      this.$store.dispatch('log/log', content);
    },
  },
  computed: {
    contents(): IdParent[] {
      return this.$store.getters['idtree/idContent'];
    },
    view(): View {
      return this.$store.getters['idtree/getView'];
    },
  },
  mounted() {
    this.view.renderer('canvas')
      // .logLevel(Warn)
      .initialize('#' + this.name)
      .hover()
      .run();
  },

});
</script>

<style scoped>

</style>
