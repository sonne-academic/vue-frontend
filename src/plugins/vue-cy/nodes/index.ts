import * as author from './author';
import * as venue from './venue';
import * as journal from './journal';
import * as search from './search';
import * as paper from './paper';

const DataNodes = {
  author: author.Data,
  journal: journal.Data,
  search: search.Data,
  venue: venue.Data,
  paper: paper.Data,
};
const styles = [
  author.style,
  journal.style,
  search.style,
  venue.style,
  paper.style,
];
export {DataNodes, styles};
