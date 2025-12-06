export interface ImpactFactor {
  citationCount: number;
  influentialCitationCount: number;
  referenceCount: number;
}

export interface Paper {
  id: string;
  title: string;
  abstract: string | null;
  authors: string;
  year: number | null;
  impactFactor: ImpactFactor;
  fieldsOfStudy: string[];
  v_quartile_ranking: string | null;
  isOpenAccess?: boolean;
  pdfLink?: string;
  link?: string;
  doi?: string | null;
  journalName?: string | null;
  v_journal_name?: string | null;
  // Additional fields from docs
  downloadable?: boolean;
  engine?: string;
  isPrePrint?: boolean;
  publicationType?: string | null;
  publishedAt?: string | null;
  score?: number | null;
  semanticLink?: string;
  titleLink?: string;
  tldr?: string | null;
  v_country?: string | null;
  v_publisher?: string | null;
}

export interface JobResponse {
  jobId: string;
}

export interface JobStatusResponse {
  status: 'queued' | 'success' | 'error';
  results?: Paper[];
}

export interface CreateJobQueryParams {
  limit?: number;
  fieldsOfStudy?: string; // Comma-separated
  minCitationCount?: number;
  openAccessPdf?: boolean;
  downloadable?: boolean;
  quartileRanking?: string; // Comma-separated Q1,Q2...
  publicationTypes?: string; // Comma-separated
  sort?: string; // field:direction
  year?: string; // YYYY or YYYY:YYYY
}

export interface CreateJobBody {
  callbackUrl?: string;
  enrich?: boolean;
  phrases?: string[];
  query?: string;
}

// Combined type for the client function
export type CreateJobOptions = CreateJobQueryParams & CreateJobBody;
