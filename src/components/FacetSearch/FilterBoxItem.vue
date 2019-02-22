<template>
  <button class="btn" @click="clicked">{{label}}</button>
</template>

<script lang="ts">
import Vue from 'vue';
import { NumberKeyframeTrack } from 'three';

export default Vue.extend({
  name: 'FilterBoxItem',
   props: {
    label: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
  },
  methods: {
    clicked(e: MouseEvent) {
      this.$emit('clicked', this.label);
    },
  },
});
</script>

<style scoped>
.btn {
  border-radius: 3px;
  border: 1px solid #ccc;
  background: #fff;
  cursor: pointer;
}
.btn:hover {
  background: #ccc;
}
</style>
