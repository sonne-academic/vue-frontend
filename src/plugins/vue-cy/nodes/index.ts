import * as search from './search';
import * as paper from './paper';

// simple nodes (i.e. facets)
import * as author from './author';
import * as venue from './venue';
import * as journal from './journal';
import * as keywords from './keywords';
import * as multi from './multi';

import { NodeData } from './base';

const simpleBuilder = (field: string, collection: string, value: string): NodeData => {
  switch (field) {
    case 'author': return new author.Data(collection, value);
    case 'venue': return new venue.Data(collection, value);
    case 'keywords': return new keywords.Data(collection, value);
    case 'journal': return new journal.Data(collection, value);
    default: throw new Error(`cannot create instance for ${field}`);
  }
};

const DataNodes = {
  author: author.Data,
  journal: journal.Data,
  search: search.Data,
  venue: venue.Data,
  paper: paper.Data,
  keyword: keywords.Data,
  multi: multi.Data,
};
const styles = [
  author.style,
  journal.style,
  search.style,
  venue.style,
  paper.style,
  keywords.style,
  // multi.style,
];
export {DataNodes, styles, simpleBuilder};
