export interface AnalysisRequest {
  url: string;
}

export interface ScrapedPage {
  url: string;
  screenshotBase64: string;
  htmlContent: string;
  title: string;
  metaDescription: string;
  h1: string;
  brandColors: string[];
}

export interface OptimizationResult {
  optimizedTitle: string;
  optimizedH1: string;
  optimizedMeta: string;
  optimizedCTA: string;
  improvementScore: {
    before: number;
    after: number;
  };
  callouts: Callout[];
}

export interface Callout {
  label: string;
  description: string;
  type: "seo" | "ux" | "conversion" | "trust";
}

export interface AnalysisSession {
  id: string;
  request: AnalysisRequest;
  scraped?: ScrapedPage;
  result?: OptimizationResult;
  status: "idle" | "scraping" | "optimizing" | "done" | "error";
  error?: string;
}
