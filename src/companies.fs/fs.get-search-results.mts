import type { SearchResult } from "../search-results/model.search-result.mts";
import type { Service } from "../lib/service.mts";

export const buildFsGetSearchResults =
  (inputTableName: string, read: Service<[tableName: string], string>) => async (): Promise<SearchResult[]> => {
    const fileName = inputTableName + ".json";
    const rawSearchResults = await read(fileName);
    return JSON.parse(rawSearchResults);
  };
