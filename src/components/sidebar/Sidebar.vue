<template>
  <div class="sidebar">
    <header>
      <h2>
        <img :src="icon">
        <slot name="heading"></slot>
      </h2>
    </header>
    <main>
      <slot name="main"></slot>
    </main>
    <footer>
      <slot name="footer"></slot>
    </footer>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'Sidebar',
  props: {
    iconName: {
      type: String,
      required: true,
    },
  },
  computed: {
    icon(): string {
      return `/${this.iconName}.svg`;
    },
  },
});
</script>
<style scoped>
h2 > img {
  height: 1em;
}
</style>
