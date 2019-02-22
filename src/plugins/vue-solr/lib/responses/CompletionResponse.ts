export interface CompletionResponse<T> {
  responseHeader: ResponseHeader;
  response: Response;
  highlighting: { [key: string]: T };
}

export interface Author {
  author_lower: string[];
  author_ngram: string[];
}

export interface Title {
  title_lower: string[];
  title_ngram: string[];
}

export interface JournalName {
  journalName_lower: string[];
  journalName_ngram: string[];
}

export interface Venue {
  venue_lower: string[];
  venue_ngram: string[];
}

interface Response {
  numFound: number;
  start: number;
  maxScore: number;
  docs: Doc[];
}

interface Doc {
  author: string[];
}

interface ResponseHeader {
  zkConnected: boolean;
  status: number;
  QTime: number;
}
