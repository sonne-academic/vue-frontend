const cfg: cytoscape.CytoscapeOptions = {

  boxSelectionEnabled: false,
  autounselectify: true,

  layout: {
    name: 'circle',
  },

  style: [ // the stylesheet for the graph
    {
      selector: 'node',
      style: {
        'background-color': '#666',
        'label': 'data(id)',
      },
    },
    {
      selector: 'edge',
      style: {
        'width': 3,
        'line-color': '#ccc',
        'target-arrow-color': '#ccc',
        'target-arrow-shape': 'triangle',
      },
    },
  ],
};
export default cfg;
