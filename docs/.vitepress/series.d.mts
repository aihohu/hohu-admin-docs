export interface SeriesContext {
  series: '0.1' | '0.2' | null;
  status: 'index' | 'unreleased' | 'maintained';
  zh: boolean;
  indexUrl: string;
  stableUrl: string;
  candidateUrl: string;
}
export function seriesContext(file: string): SeriesContext | null;
