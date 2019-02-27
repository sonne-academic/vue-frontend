<template>
  <button class="btn" @click="clicked">{{label}}
    <button @click="filter" class="fltbtn plus">+</button>
    <button @click="filter" class="fltbtn minus">-</button>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

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
    filter(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();
      console.log(e);
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
.btn:hover > .fltbtn {
  visibility: visible;
  float: right;
}
.fltbtn {
  padding: 0;
  margin: 0;
  border-style: none;
  position: relative;
  visibility: hidden;
  float: right;
}
.minus:hover {
  background: #f00;
}
.plus:hover {
  background: #0f0;
}
</style>
