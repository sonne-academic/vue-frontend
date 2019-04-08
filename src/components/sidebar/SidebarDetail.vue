<template>
  <details ref="details" @toggle="toggled">
    <summary>
      <slot name="summary"></slot>
    </summary>
    <slot v-if="open || alwaysLoad" name="detail"></slot>
  </details>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'SidebarDetail',
  props: {
    alwaysLoad: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    open: false,
  }),
  methods: {
    toggled(ev: any) {
      if (this.details.open) {
        this.$emit('opened');
        this.open = true;
      } else {
        this.$emit('closed');
        this.open = false;
      }
    },
    close() {
      this.details.open = false;
    },
  },
  computed: {
    details(): HTMLDetailsElement {
      return this.$refs.details as HTMLDetailsElement;
    },
  },
  mounted() {
    this.open = false;
  },
});
</script>
<style scoped>
summary {
  background-color: black;
  color: white;
  padding: 0.5em;
  position: sticky;
  top: 0;
  margin: 1em 0;
}
</style>
