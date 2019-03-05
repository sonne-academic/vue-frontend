import cytoscape from 'cytoscape';
import * as cm from 'cytoscape-cxtmenu';

declare module 'cytoscape' {
  export interface Core {
    cxtmenu: (args: cm.MenuArgs) => cm.Destructor;
  }
}
