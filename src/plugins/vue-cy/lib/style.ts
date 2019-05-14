import { styles } from '../nodes';
const style: cytoscape.Stylesheet[] = [
  {
    selector: 'edge',
    style: {
      'font-family': 'sans-serif',
      // 'label': 'data(name)',
      'color': '#00c',
      'width': 3,
      'curve-style': 'unbundled-bezier',
      'line-color': '#eee',
      'target-distance-from-node': 6,
      'target-arrow-color': '#00c',
      'target-arrow-shape': 'triangle',
      'target-arrow-fill': 'filled',
    },
  },
  {
    selector: 'node',
    style: {
      'font-family': 'sans-serif',
      'background-color': '#e00',
      'label': 'data(name)',
      // 'text-wrap': 'wrap',
      'text-wrap': 'ellipsis',
      'text-max-width': '200',
      'z-index': 10,
    },
  },
  ...styles,
  {
    selector: '.mid',
    style: {
      width: 8,
      height: 8,
      label: '',
    },
  },
  {
    selector: '.pred',
    style: {
      'color': '#0e0',
      'background-color': '#0e0',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'background-color': '#ee0',
    },
  },
];
export default style;
