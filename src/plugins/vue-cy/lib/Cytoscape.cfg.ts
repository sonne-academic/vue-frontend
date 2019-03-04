const cfg: cytoscape.CytoscapeOptions = {
  style: [{
    selector: 'node',
    style: {
      'background-color': '#666',
      'label': 'data(id)',
    },
  },
  {
    selector: 'node[kind="search"]',
    style: {
      'background-color': '#eee',
      'label': 'data(query)',
      'background-image': '/close.min.svg',
      'background-fit': 'contain',
    },
  },
  {
    selector: 'node[kind="facet"][field="author"]',
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
    selector: 'node[kind="facet"][field="journal"]',
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
