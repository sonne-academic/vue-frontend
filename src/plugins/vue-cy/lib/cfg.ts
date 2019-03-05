const cfg: cytoscape.CytoscapeOptions = {
  style: [{
    selector: 'node',
    style: {
      'background-color': '#666',
      'label': 'data(id)',
    },
  },
  {
    selector: 'node[component="search"]',
    style: {
      'background-color': '#eee',
      'label': 'data(query)',
      'background-image': '/close.min.svg',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'node[component="facet"][field="author"]',
    style: {
      'background-color': '#eee',
      'label': 'data(value)',
      // 'shape': 'pentagon',
      'background-image': '/author.svg',
      'background-width': '75%',
      'background-height': '75%',
      // 'background-fit': 'contain',
    },
  },
  {
    selector: 'node[component="facet"][field="journal"]',
    style: {
      'background-color': '#eee',
      'label': 'data(value)',
      // 'background-image': '/author.svg',
      // 'background-width': '75%',
      // 'background-height': '75%',
      // 'background-fit': 'contain',
    },
  },
  {
    selector: 'node:selected',
    style: {
      'border-color': '#e00',
      'border-width': 3,
    },
  },
  {
    selector: 'edge',
    style: {
      'width': 3,
      'line-color': '#eee',
      'target-arrow-color': '#ccc',
      'target-arrow-shape': 'triangle',
    },
  },
],
};
export default cfg;
