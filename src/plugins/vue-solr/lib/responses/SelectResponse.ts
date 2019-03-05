export interface SearchResponse {
  responseHeader: ResponseHeader;
  response: Response;
  debug: Debug;
}

export interface Debug {  // debug == 'query'
  rawquerystring: string;
  querystring: string;
  parsedquery: string;
  parsedquery_toString: string;
  json: {params: JSONParams; };
  QParser: string;
  altquerystring: null;
  boost_queries: null;
  parsed_boost_queries: any[];
  boostfuncs: null;
}

export interface JSONParams {
  q: string;
  rows: number;
  debug: string;
  start: number;
  defType: string;
  qf: string;
  'q.op': string;
  sort: string;
}

export interface Response {
  numFound: number;
  start: number;
  docs: DocDBLP[]|DocS2[];
}

export interface DocCommon {
  id: string;
  author?: string[];
  journal?: string;
  suggest?: string;
  title?: string;
  year?: number;

  author_lower?: string[];
  author_ngram?: string[];
  journal_lower?: string[];
  journal_ngram?: string[];
  suggest_lower?: string[];
  suggest_ngram?: string[];
  title_lower?: string[];
  title_ngram?: string[];
  _version_?: number;
}

export interface DocS2 extends DocCommon {
  author_count?: number;
  doi?: string;
  doiUrl?: string;
  inCitations_count?: number;
  inCitations?: string[];
  keywords_count?: number;
  keywords?: string[];
  outCitations_count?: number;
  outCitations?: string[];
  pages?: string;
  paperAbstract?: string;
  pdfUrls?: string[];
  pmid?: string;
  s2PdfUrl?: string;
  s2Url?: string;
  sources?: string[];
  venue_lower?: string[];
  venue_ngram?: string[];
  venue?: string;
  volume?: string;
}

export interface DocDBLP extends DocCommon {
  booktitle?: string;
  crossref?: string[];
  ee?: string[];
  mdate?: Date;
  number?: string;
  pages?: string[];
  url?: string[];  // "db/journals/tvcg/tvcg25.html#DuranHRKVV19"
  volume?: string[];
  // informal encyclopedia disambiguation "informal withdrawn" habil withdrawn data software group edited noshow
  publtype?: string;
  // enum article inproceedings proceedings book incollection phdthesis mastersthesis www person data
  pub_type?: string;
  pub_type_str?: string;
  id_ancestor?: string;
  id_descendent?: string;
  booktitle_lower?: string[];
  booktitle_ngram?: string[];
}

export interface ResponseHeader {
  zkConnected: boolean;
  status: number;
  QTime: number;
  params: ResponseHeaderParams;
}

export interface ResponseHeaderParams {
  json: string;
}
