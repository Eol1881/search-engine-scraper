import type { Service } from "../lib/service.mts";
import type { Company } from "./model.company.mts";

export const buildUpdateSavedCompaniesService = (
  getSearchPageHtml: Service<[search: string, page: number], string>,
  parsePageUrls: Service<[html: string], string[]>,
  getPageHtml: Service<[url: string], string>,
  parsePageEmails: Service<[html: string], string[]>,
  saveCompany: Service<[Company], void>,
) => async (
  search: string,
  start: number,
  limit: number,
): Promise<void> => {
  const pages = Array.from({ length: limit }).map((_, index) => index + start)
  for await (const page of pages) {
    const searchPageHtml = await getSearchPageHtml(search, page)
    const searchPageUrls = await parsePageUrls(searchPageHtml)
    for await (const pageUrl of searchPageUrls) {
      const pageHtml = await getPageHtml(pageUrl)
      const companyEmails = await parsePageEmails(pageHtml)
      await saveCompany({ url: pageUrl, emails: companyEmails })
    }
  }
};
