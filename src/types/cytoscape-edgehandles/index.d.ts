declare module 'cytoscape-edgehandles' {
  interface CompoundOptions {
    // filter function to specify which nodes are valid to grab and drop into other nodes
    grabbedNode?: (node: cytoscape.NodeSingular) => boolean;
    // filter function to specify which parent nodes are valid drop targets
    dropTarget?: (node: cytoscape.NodeSingular) => boolean;
    // filter function to specify which orphan nodes are valid drop siblings
    dropSibling?: (node: cytoscape.NodeSingular) => boolean;
    // specifies element json for parent nodes added by dropping an orphan node on another orphan (a drop sibling)
    newParentNode?: (grabbedNode: cytoscape.NodeSingular, dropSibling: cytoscape.NodeSingular) => cytoscape.ElementDefinition;
    // make dragging over a drop target easier by expanding the hit area by this amount on all sides
    overThreshold?: number; // 10,
    // make dragging out of a drop target a bit harder by expanding the hit area by this amount on all sides
    outThreshold?: number; // 10
    preview?: boolean; // true, // whether to show added edges preview before releasing selection
    hoverDelay?: number; // 150, // time spent hovering over a target node before it is considered selected
    handleNodes?: string; //'node', // selector/filter function for whether edges can be made from a given node
    snap?: boolean; // false, // when enabled, the edge can be drawn by just moving close to a target node
    snapThreshold?: number; // 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
    snapFrequency?: number; // 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
    noEdgeEventsInDraw?: boolean; // false, // set events:no to edges during draws, prevents mouseouts on compounds
    disableBrowserGestures?: boolean; // true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
    handlePosition?: (node: cytoscape.NodeSingular) => string;
    // function( node ){
    //   return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
    // },
    handleInDrawMode?: boolean // false, // whether to show the handle in draw mode
    edgeType?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular) => string
    // function( sourceNode, targetNode ){
      // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
      // returning null/undefined means an edge can't be added between the two nodes
    //  return 'flat';
    // },
    loopAllowed?: (node: cytoscape.NodeSingular) => boolean;
    // function( node ){
      // for the specified node, return whether edges from itself to itself are allowed
    //  return false;
    // },
    nodeLoopOffset?: number; // -50, // offset for edgeType: 'node' loops
    nodeParams?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular) => cytoscape.Singular;
    // function( sourceNode, targetNode ){
      // for edges between the specified source and target
      // return element object to be passed to cy.add() for intermediary node
    //  return {};
    // },
    edgeParams?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular, i: number) => cytoscape.Singular;
    // function( sourceNode, targetNode, i ){
      // for edges between the specified source and target
      // return element object to be passed to cy.add() for edge
      // NB: i indicates edge index in case of edgeType: 'node'
      // return {};
    // },
    ghostEdgeParams?: () => cytoscape.Singular;
    // function(){
      // return element object to be passed to cy.add() for the ghost edge
      // (default classes are always added for you)
    //  return {};
    // },
    show?: (sourceNode: cytoscape.NodeSingular) => void;
    // function( sourceNode ){
      // fired when handle is shown
    //},
    hide?: (sourceNode: cytoscape.NodeSingular) => void;
    // function( sourceNode ){
      // fired when the handle is hidden
    // },
    start?: (sourceNode: cytoscape.NodeSingular) => void;
    // function( sourceNode ){
      // fired when edgehandles interaction starts (drag on handle)
    //},
    complete?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular,addedEles: cytoscape.Collection) => void;
    // function( sourceNode, targetNode, addedEles ){
      // fired when edgehandles is done and elements are added
    // },
    stop?: (sourceNode: cytoscape.NodeSingular) => void;
    // function( sourceNode ){
      // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
    // },
    cancel?: (sourceNode: cytoscape.NodeSingular, cancelledTargets: cytoscape.Collection) => void;
    // function( sourceNode, cancelledTargets ){
      // fired when edgehandles are cancelled (incomplete gesture)
    // },
    hoverover?:  (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular) => void;
    // function( sourceNode, targetNode ){
      // fired when a target is hovered
    // },
    hoverout?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular) => void;
    // function( sourceNode, targetNode ){
      // fired when a target isn't hovered anymore
    // },
    previewon?: (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular, previewEles: cytoscape.Collection) => void;
    // function( sourceNode, targetNode, previewEles ){
      // fired when preview is shown
    // },
    previewoff?:  (sourceNode: cytoscape.NodeSingular, targetNode: cytoscape.NodeSingular, previewEles: cytoscape.Collection) => void;
    // function( sourceNode, targetNode, previewEles ){
      // fired when preview is hidden
    // },
    drawon?: () => void;
    // function(){
      // fired when draw mode enabled
    // },
    drawoff?: () => void;
    // function(){
      // fired when draw mode disabled
    // }
  }
  interface CompoundObject {
    start: ( sourceNode: cytoscape.NodeSingular ) => void;  // manually start the gesture (as if the handle were already held)
    stop: () => void;  // manually completes or cancels the gesture
    hide: () => void;  // remove the handle node from the graph
    disable: () => void;  // : disables edgehandles behaviour
    enable: () => void;  // enables edgehandles behaviour
    enableDrawMode: () => void;  // turn on draw mode (the entire node body acts like the handle)
    disableDrawMode: () => void;  // turn off draw mode
    destroy: () => void;  // remove edgehandles behaviour
  }
}
