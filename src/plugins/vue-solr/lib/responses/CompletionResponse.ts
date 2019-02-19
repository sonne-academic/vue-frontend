export interface AuthorCompletionResponse {
  responseHeader: ResponseHeader;
  response: Response;
  highlighting: { [key: string]: AuthorHighlight };
}

export interface AuthorHighlight {
  author_lower: string[];
  author_ngram: string[];
}

export interface TitleCompletionResponse {
  responseHeader: ResponseHeader;
  response: Response;
  highlighting: { [key: string]: TitleHighlight };
}

export interface TitleHighlight {
  title_lower: string[];
  title_ngram: string[];
}

export interface JournalNameCompletionResponse {
  responseHeader: ResponseHeader;
  response: Response;
  highlighting: { [key: string]: JournalNameHighlight };
}

export interface JournalNameHighlight {
  journalName_lower: string[];
  journalName_ngram: string[];
}

export interface VenueCompletionResponse {
  responseHeader: ResponseHeader;
  response: Response;
  highlighting: { [key: string]: VenueHighlight };
}

export interface VenueHighlight {
  venue_lower: string[];
  venue_ngram: string[];
}

export interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  docs: Doc[];
}

export interface Doc {
  author: string[];
}

export interface ResponseHeader {
  zkConnected: boolean;
  status: number;
  QTime: number;
}
