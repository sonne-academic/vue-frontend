import {styles} from '../nodes';
const style: cytoscape.Stylesheet[] = [
{
  selector: 'node',
  style: {
    'background-color': '#e00',
    'label': 'data(name)',
    'text-wrap': 'wrap',
    // 'text-wrap': 'ellipsis',
    'text-max-width': '200',
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
  selector: 'node:selected',
  style: {
    'background-color': '#ee0',
  },
},
{
  selector: 'edge',
  style: {
    'width': 3,
    'curve-style': 'unbundled-bezier',
    'line-color': '#eee',
    'target-distance-from-node': 6,
    'target-arrow-color': '#00c',
    'target-arrow-shape': 'triangle',
    'target-arrow-fill': 'filled',
  },
},
];
export default style;
