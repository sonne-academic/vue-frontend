import cytoscape, { LayoutOptions, Layouts } from 'cytoscape';
import * as cm from 'cytoscape-cxtmenu';
import * as cd from 'cytoscape-dagre';
import * as cdnd from 'cytoscape-compound-drag-and-drop';

declare module 'cytoscape' {
  type LayoutExtensions = LayoutOptions | cd.DagreLayoutOptions;
  export interface Core {
    cxtmenu: (args: cm.MenuArgs) => cm.Destructor;
    compoundDragAndDrop: (options?: cdnd.CompoundOptions) => cdnd.CompundObject;
  }
  // export interface CytoscapeOptions {
  //   layout?: LayoutOptions | cd.DagreLayoutOptions;
  // }
  export interface CoreLayout {
    layout(layout: LayoutExtensions): Layouts;
    makeLayout(options: LayoutExtensions): Layouts;
    createLayout(options: LayoutExtensions): Layouts;
  }
  interface CollectionLayout {
    layout(options: LayoutExtensions): Layouts;
    makeLayout(options: LayoutExtensions): Layouts;
    createLayout(options: LayoutExtensions): Layouts;
  }
  namespace Css {
    export interface Node {
      'events'?: 'no' | 'yes';
      'text-events'?: 'no' | 'yes';
    }
  }
}
