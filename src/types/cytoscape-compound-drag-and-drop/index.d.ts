declare module 'cytoscape-compound-drag-and-drop' {
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
  }
  interface CompundObject {
    disable: () => void;
    enable: () => void;
    destroy: () => void;
  }
}