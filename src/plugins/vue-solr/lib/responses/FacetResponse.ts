export interface FacetResponse {
  responseHeader: ResponseHeader;
  response: Response;
  facet_counts: FacetCounts;
}

export interface FacetCounts {
  facet_queries: Facet;
  facet_fields: FacetFields;
  facet_ranges: Facet;
  facet_intervals: Facet;
  facet_heatmaps: Facet;
}

export interface FacetFields {
  author: Array<number | string>;
  journal: Array<number | string>;
  venue: Array<number | string>;
  year: Array<number | string>;
  keywords: Array<number | string>;
}

export interface Facet {
  placeholder: string;
}

export interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  docs: any[];
}

export interface ResponseHeader {
  zkConnected: boolean;
  status: number;
  QTime: number;
  params: Params;
}

export interface Params {
  json: string;
}
