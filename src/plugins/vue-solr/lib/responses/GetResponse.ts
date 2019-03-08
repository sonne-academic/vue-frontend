export interface GetResponse {
  doc: Doc;
}

export interface Doc {
  pmid?: string;
  year?: number;
  outCitations?: string[];
  s2Url?: string;
  s2PdfUrl?: string;
  id?: string;
  paperAbstract?: string;
  pdfUrls?: string[];
  title?: string;
  doi?: string;
  sources?: string[];
  doiUrl?: string;
  venue?: string;
  author?: string[];
  journal?: string;
  pages?: string;
  volume?: string;
  inCitations_count?: number;
  outCitations_count?: number;
  keywords_count?: number;
  author_count?: number;
  suggest?: string;
  _version_?: number;
}
