<template>
    <div :id="name" :title="name"/>
</template>

<script lang="ts">
import Vue from 'vue';
import {View, parse, Signal} from 'vega';
import store from '@/store';

const tau = Math.PI * 2;

const signals: Signal[] = [
        {
          name: 'startAngle', value: 0,
          bind: {input: 'range', min: 0, max: tau, step: 0.01},
        },
        {
          name: 'endAngle', value: tau,
          bind: {input: 'range', min: 0, max: tau, step: 0.01},
        },
        {
          name: 'padAngle', value: 0.005,
          bind: {input: 'range', min: 0, max: 0.1},
        },
        {
          name: 'innerRadius', value: 100,
          bind: {input: 'range', min: 0, max: 90, step: 1},
        },
        {
          name: 'cornerRadius', value: 0,
          bind: {input: 'range', min: 0, max: 10, step: 0.5},
        },
        {
          name: 'sort', value: false,
          bind: {input: 'checkbox'},
        },
        {
          name: 'color', value: '#333',
          bind: {input: 'color'},
        },
      ];

export default Vue.extend({
  name: 'VegaPieChart',
  props: {
    values: {
      // type: Array,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  data: () => ({
    view: {},
  }),
  methods: {
    log(content: any) {
      store.dispatch('log/log', content);
    },
  },
  mounted() {
    const spec = parse({
      $schema: 'https://vega.github.io/schema/vega/v4.json',
      width: 300,
      height: 300,
      autosize: 'none',
      config: {
        events: {
          defaults: {
            prevent: true,
          },
        },
      },
      signals,
      data: [
        {
          name: 'table',
          values: this.values,
          transform: [
            {
              type: 'pie',
              field: 'size',
              startAngle: {signal: 'startAngle'},
              endAngle: {signal: 'endAngle'},
              sort: {signal: 'sort'},
            },
          ],
        },
      ],
      marks: [
        {
          type: 'arc',
          from: {data: 'table'},
          encode: {
            enter: {
              fill: {signal: 'color'},
              x: {signal: 'width / 2'},
              y: {signal: 'height / 2'},
              tooltip: {signal: 'datum.name +": "+ datum.size'},
            },
            update: {
              startAngle: {field: 'startAngle'},
              endAngle: {field: 'endAngle'},
              padAngle: {signal: 'padAngle'},
              fill: {signal: 'color'},
              innerRadius: {signal: 'innerRadius'},
              outerRadius: {signal: 'width / 2'},
              cornerRadius: {signal: 'cornerRadius'},
            },
            hover: {
              fill: {value: '#f00'},
            },
          },
        },
      ],
    });

    this.view = new View(spec)
      .renderer('canvas')
      .initialize('#' + this.name)
      .hover()
      .run();
  },
});
</script>

<style scoped>

</style>
