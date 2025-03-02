import type { Service } from "../lib/service.mts";
import type { Company } from "./model.company.mts";
import type { SearchResult } from "../search-results/model.search-result.mts";

export const buildUpdateSavedCompaniesService =
  (
    getSearchResults: Service<[], SearchResult[]>,
    getPageHtml: Service<[url: string], string>,
    parsePageEmails: Service<[html: string], string[]>,
    saveCompany: Service<[Company], void>
  ) =>
  async (): Promise<void> => {
    const searchResults = await getSearchResults();
    for await (const searchResult of searchResults) {
      for await (const link of searchResult.links) {
        const pageHtml = await getPageHtml(link.url);
        const companyEmails = await parsePageEmails(pageHtml);
        await saveCompany({ ...searchResult, emails: companyEmails });
      }
    }
  };
