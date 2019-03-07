declare module 'cytoscape-dagre' {
  interface DagreLayoutOptions extends cytoscape.BaseLayoutOptions,cytoscape.AnimatedLayoutOptions {
    name: 'dagre';
    // the separation between adjacent nodes in the same rank
    nodeSep: number; //50 
    // the separation between adjacent edges in the same rank
    edgeSep: number; //10
    // the separation between adjacent nodes in the same rank
    rankSep: number; //10
    rankDir: 'TB'|'LR'; // 'TB' for top to bottom flow; 'LR' for left to right;
    // Type of algorithm to assign a rank to each node in the input graph. 
    // Possible values: 'network-simplex'; 'tight-tree' or 'longest-path'
    ranker: 'network-simplex'|'tight-tree'|'longest-path'; 
    // number of ranks to keep between the source and target of the edge
    minLen: (edge: cytoscape.EdgeSingular) => number;
    // higher weight edges are generally made shorter and straighter than lower weight edges
    edgeWeight: (edge: cytoscape.EdgeSingular) => number;
    // general layout options
    fit: boolean;//true; // whether to fit to viewport
    padding: number;//30; // fit padding
    boundingBox: cytoscape.BoundingBox12|cytoscape.BoundingBoxWH; //undefined; // constrain layout bounds; { x1; y1; x2; y2 } or { x1; y1; w; h }
    // whether labels should be included in determining the space used by a node
    nodeDimensionsIncludeLabels: boolean; //false
    // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
    spacingFactor: number; //undefined 
    //function( node; i ){ return true; }; 
    // whether to animate specific nodes when animation is on; non-animated nodes immediately go to their final positions
    animateFilter: (node: cytoscape.NodeSingular, i: number) => true;
    // function( node; pos ){ return pos; }; // a function that applies a transform to the final node position
    transform: (node: cytoscape.NodeSingular, pos: cytoscape.Position) => cytoscape.Position;
}
}