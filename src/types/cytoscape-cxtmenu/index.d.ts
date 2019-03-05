declare module 'cytoscape-cxtmenu' {
  export interface Command {
    fillColor?: string;
    content?: string;
    contentStyle?: string;
    select?: (ele: cytoscape.CollectionReturnValue) => void;
    enabled?: boolean;

  }

  export interface Destructor {
    destroy: () => void;
  }

  export interface MenuArgs {
    menuRadius?: number; // the radius of the circular menu in pixels
    selector: cytoscape.Selector; // elements matching this Cytoscape.js selector will trigger cxtmenus
    commands: Command[]; // an array of commands to list in the menu or a function that returns the array
    fillColor?: string; // 'rgba(0, 0, 0, 0.75)', // the background colour of the menu
    activeFillColor?: string; // 'rgba(1, 105, 217, 0.75)', // the colour used to indicate the selected command
    activePadding?: number; // 20, // additional size in pixels for the active command
    indicatorSize?: number; // 24, // the size in pixels of the pointer to the active command
    separatorWidth?: number; // 3; // the empty spacing in pixels between successive commands
    spotlightPadding?: number; // 4; // extra spacing in pixels between the element and the spotlight
    minSpotlightRadius?: number; // 24; // the minimum radius in pixels of the spotlight
    maxSpotlightRadius?: number; // 38; // the maximum radius in pixels of the spotlight
    openMenuEvents?: string; // 'cxttapstart taphold'; // space-separated cytoscape events that will open the menu; only `cxttapstart` and/or `taphold` work here
    itemColor?: string; // 'white'; // the colour of text in the command's content
    itemTextShadowColor?: string; // 'transparent'; // the text shadow colour of the command's content
    zIndex?: number; // 9999; // the z-index of the ui div
    atMouse?: boolean; // false; // draw menu at mouse position
  }
}
