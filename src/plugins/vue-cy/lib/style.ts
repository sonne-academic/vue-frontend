import {styles} from '../nodes';
const style: cytoscape.Stylesheet[] = [
{
  selector: 'node',
  style: {
    'background-color': '#e00',
    'label': 'data(name)',
  },
},
...styles,
{
  selector: 'node:selected',
  style: {
    // 'border-color': '#e00',
    'background-color': '#ee0',
    // 'border-width': 3,
  },
},
{
  selector: 'edge',
  style: {
    'width': 3,
    'curve-style': 'taxi',
    'line-color': '#eee',
    'target-distance-from-node': 6,
    'target-arrow-color': '#00c',
    'target-arrow-shape': 'triangle',
    'target-arrow-fill': 'filled',
  },
},
];
export default style;
