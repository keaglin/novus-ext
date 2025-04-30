export interface SentimentAnalysis {
  score: number;
  suspiciousPhrases: string[];
  indicators: string[];
  details: string;
}

export interface HtmlInspect {
  suspiciousLinks: string[];
  suspiciousScripts: string[];
  scamLanguage: string[];
}

export interface ReportResources {
  title: string;
  url: string;
}

export interface Report {
  summary: string;
  recommendations: string[];
  resources: ReportResources[];
}

export interface AnalysisResponse {
  sentimentAnalysis: SentimentAnalysis;
  htmlInspect: HtmlInspect;
  report: Report;
}
