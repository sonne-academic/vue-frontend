<template>
  <img class="spinner" src="/spinner.svg"/>
</template>
<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'spinner',
});
</script>

<style>
img.spinner {
  height: 2em;
  animation: spinner 1s linear infinite;
}
@keyframes spinner {
    0% {
        transform: rotate(0deg);
    } 50% {
        transform: rotate(0deg);
    } 100% {
        transform: rotate(180deg);
    }
}
</style>
