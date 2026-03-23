export interface AnalysisRequest {
  url: string;
}

export interface ScrapedPage {
  url: string;
  htmlContent: string;
  title: string;
  metaDescription: string;
  h1: string;
}

export interface Callout {
  label: string;
  description: string;
  type: "seo" | "ux" | "conversion" | "trust";
}

export interface OptimizationResult {
  optimizedHtml: string;
  improvementScore: {
    before: number;
    after: number;
  };
  callouts: Callout[];
}

export interface AnalysisSession {
  id: string;
  request: AnalysisRequest;
  scraped?: ScrapedPage;
  result?: OptimizationResult;
  status: "idle" | "scraping" | "optimizing" | "done" | "error";
  error?: string;
}
