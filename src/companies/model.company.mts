import type { SearchResult } from "../search-results/model.search-result.mts";

export type Company = SearchResult & {
  emails: string[];
  commentary?: string;
};
