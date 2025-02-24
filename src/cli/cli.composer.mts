import { buildFsSaveCompany } from "../companies.fs/fs.save-company.mts";
import { buildPlaywrightGetPageHtml } from "../companies.playwright/playwright.get-page-html.mts";
import { buildPlaywrightGetSearchPageHtml } from "../companies.playwright/playwright.get-search-page-html.mts";
import { buildUpdateSavedCompaniesService } from "../companies/service.update-saved-companies.mts";
import { type FsConfig } from "../fs/fs.config.mts";
import { buildFsRead } from "../fs/fs.read.mts";
import { buildFsSave } from "../fs/fs.save.mts";
import { buildPlaywrightGetPageContent, type PlaywrightConfig } from "../playwright/playwright.get-page-content.mts";
import { buildRegexpParseElements } from "../regexp/regexp.parse-elements.mts";
import { getYandexUrl } from "../search-engines/yandex.mts";

export type CliConfig = {
  playwright: PlaywrightConfig;
  fs: FsConfig;
  fsTables: {
    companies: string;
  };
};

export const buildCli = (config: CliConfig) => {
  const getPageContent = buildPlaywrightGetPageContent(config.playwright);
  const getSearchPageHtml = buildPlaywrightGetSearchPageHtml(getYandexUrl, getPageContent);
  const getPageHtml = buildPlaywrightGetPageHtml(getPageContent);

  const parseUrls = buildRegexpParseElements(/https:\/\/[^\s"'<>()]+/g);
  const parseEmails = buildRegexpParseElements(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g);

  const read = buildFsRead(config.fs);
  const save = buildFsSave(config.fs);
  const saveCompany = buildFsSaveCompany(config.fsTables.companies, read, save);

  const updateSavedCompanies = buildUpdateSavedCompaniesService(
    getSearchPageHtml,
    parseUrls,
    getPageHtml,
    parseEmails,
    saveCompany
  );

  return {
    updateSavedCompanies,
  };
};
