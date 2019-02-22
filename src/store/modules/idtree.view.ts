import {parse} from 'vega';

const spec = parse({
  $schema: 'https://vega.github.io/schema/vega/v4.json',
  width: 1120,
  height: 987,
  padding: 0,

  signals: [
    {
      name: 'labels', value: true,
      bind: {input: 'checkbox'},
    },
    {
      name: 'layout', value: 'tidy',
      bind: {input: 'radio', options: ['tidy', 'cluster']},
    },
    {
      name: 'links', value: 'diagonal',
      bind: {
        input: 'select',
        options: ['line', 'curve', 'diagonal', 'orthogonal'],
      },
    },
  ],
  data: [
    {
      name: 'tree',
      values: [],
      transform: [
        {
          type: 'stratify',
          key: 'id',
          parentKey: 'parent',
        },
        {
          type: 'tree',
          method: {signal: 'layout'},
          size: [{signal: 'height'}, {signal: 'width - 100'}],
          as: ['y', 'x', 'depth', 'children'],
        },
      ],
    },
    {
      name: 'links',
      source: 'tree',
      transform: [
        { type: 'treelinks' },
        {
          type: 'linkpath',
          orient: 'horizontal',
          shape: {signal: 'links'},
        },
      ],
    },
  ],
  scales: [
    {
      name: 'color',
      type: 'sequential',
      range: {scheme: 'magma'},
      domain: {data: 'tree', field: 'depth'},
      zero: true,
    },
  ],

  marks: [
    {
      type: 'path',
      from: {data: 'links'},
      encode: {
        update: {
          path: {field: 'path'},
          stroke: {value: '#ccc'},
        },
      },
    },
    {
      type: 'symbol',
      from: {data: 'tree'},
      encode: {
        enter: {
          size: {value: 100},
          stroke: {value: '#fff'},
        },
        update: {
          x: {field: 'x'},
          y: {field: 'y'},
          fill: {scale: 'color', field: 'depth'},
        },
      },
    },
    {
      type: 'text',
      from: {data: 'tree'},
      encode: {
        enter: {
          text: {field: 'name'},
          fontSize: {value: 9},
          baseline: {value: 'middle'},
        },
        update: {
          x: {field: 'x'},
          y: {field: 'y'},
          dx: {signal: 'datum.children ? -7 : 7'},
          align: {signal: 'datum.children ? \'right\' : \'left\''},
          opacity: {signal: 'labels ? 1 : 0'},
        },
      },
    },
  ],
});

export default spec;