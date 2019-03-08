<template>
  <div class="tab-container">
    <button v-for="tab in tabs" :key="tab"
      :class="['tab-button', { active: currentTab === tab }]"
      @click="changeTab(tab)"
    >
      {{ tab }}
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  props: {
    tabs: {
      // type: Array, // somehow breaks linting?
      required: true,
      default: new Array<string>(),
    },
    starton: {
      type: String,
      default: undefined,
    },
  },

  data: () => ({
    currentTab: '',
  }),
  methods: {
    changeTab(tab: string) {
      this.currentTab = tab;
      this.$emit('changed', tab);
    },
  },
  created() {
    if (this.starton) {
      this.currentTab = this.starton;
    } else {
      this.currentTab = this.tabs[this.tabs.length - 1];
    }
  },
  mounted() {
    this.changeTab(this.currentTab);
  },
});
</script>

<style scoped>
.tab-button {
  padding: 6px 10px;
  border-top-left-radius: 3px;
  border-top-right-radius: 3px;
  border: 1px solid #ccc;
  cursor: pointer;
  background: #f0f0f0;
  margin-bottom: -1px;
  margin-right: -1px;
}
.tab-button:hover {
  background: #e0e0e0;
}
.tab-button.active {
  background: #e0e0e0;
}
</style>
