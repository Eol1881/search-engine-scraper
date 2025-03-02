import { buildFsGetSearchResults } from "../companies.fs/fs.get-search-results.mts";
import { buildFsSaveCompany } from "../companies.fs/fs.save-company.mts";
import { buildPlaywrightGetPageHtml } from "../companies.playwright/playwright.get-page-html.mts";
import { buildUpdateSavedCompaniesService } from "../companies/service.update-saved-companies.mts";
import { type FsConfig } from "../fs/fs.config.mts";
import { buildFsRead } from "../fs/fs.read.mts";
import { buildFsSave } from "../fs/fs.save.mts";
import { buildPlaywrightGetPageContent, type PlaywrightConfig } from "../playwright/playwright.get-page-content.mts";
import { buildRegexpParseElements } from "../regexp/regexp.parse-elements.mts";

export type CliConfig = {
  playwright: PlaywrightConfig;
  fs: FsConfig;
  fsTables: {
    companies: string;
    searchResults: string;
  };
};

export const buildCli = (config: CliConfig) => {
  const getPageContent = buildPlaywrightGetPageContent(config.playwright);
  const getPageHtml = buildPlaywrightGetPageHtml(getPageContent);
  const parseEmails = buildRegexpParseElements(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);

  const read = buildFsRead(config.fs);
  const save = buildFsSave(config.fs);
  const getSearchResults = buildFsGetSearchResults(config.fsTables.searchResults, read);
  const saveCompany = buildFsSaveCompany(config.fsTables.companies, read, save);

  const updateSavedCompanies = buildUpdateSavedCompaniesService(
    getSearchResults,
    getPageHtml,
    parseEmails,
    saveCompany
  );

  return {
    updateSavedCompanies,
  };
};
