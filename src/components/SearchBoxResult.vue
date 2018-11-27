<template>
    <div>
      <details>
        <summary> {{data.title}}</summary>
        <details v-if="data.entities">
          <summary>entities</summary>
           {{ data.entities.join(', ') }}
        </details>
      </details>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

import store from '@/store';

export default Vue.extend({
  name: 'SearchBoxResult',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data: () => ({
  }),
  methods: {
    log(content: any) {
      store.dispatch('log/log', content);
    },
  },
});
</script>

<style scoped>
.subspan, ul {
  margin: 0;
  margin-left: 10px;
  padding: 0;
}

li {
  margin-left: 20px;
}

details details {
  margin-left:10px;
}

.dragger {
  width: inherit;
}

details {
  text-align: left;
}

</style>
