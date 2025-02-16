import { buildFsSaveCompany } from "../companies.fs/fs.save-company.mts"
import { buildPuppeteerGetPageHtml } from "../companies.puppeteer/puppeteer.get-page-html.mts"
import { buildPuppeteerGetSearchPageHtml } from "../companies.puppeteer/puppeteer.get-search-page-html.mts"
import { buildUpdateSavedCompaniesService } from "../companies/service.update-saved-companies.mts"
import { type FsConfig } from "../fs/fs.config.mts"
import { buildFsRead } from "../fs/fs.read.mts"
import { buildFsSave } from "../fs/fs.save.mts"
import { buildPuppeteerGetPageContent, type PuppeteerConfig } from "../puppeteer/puppeteer.get-page-content.mts"
import { buildRegexpParseElements } from "../regexp/regexp.parse-elements.mts"
import { getGoogleUrl } from "../search-engines/google.mts"
import { getYandexUrl } from "../search-engines/yandex.mts"

export type CliConfig = {
  puppeteer: PuppeteerConfig
  fs: FsConfig
  fsTables: {
    companies: string
  }
}

export const buildCli = (config: CliConfig) => {
  const getPageContent = buildPuppeteerGetPageContent(config.puppeteer)
  const getSearchPageHtml = buildPuppeteerGetSearchPageHtml(getGoogleUrl, getPageContent)
  const getPageHtml = buildPuppeteerGetPageHtml(getPageContent)

  const parseUrls = buildRegexpParseElements(/https:\/\/[^\s"'<>()]+/g)
  const parseEmails = buildRegexpParseElements(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g)

  const read = buildFsRead(config.fs)
  const save = buildFsSave(config.fs)
  const saveCompany = buildFsSaveCompany(config.fsTables.companies, read, save)

  const updateSavedCompanies = buildUpdateSavedCompaniesService(
    getSearchPageHtml,
    parseUrls,
    getPageHtml,
    parseEmails,
    saveCompany,
  )

  return {
    updateSavedCompanies,
  }
}
