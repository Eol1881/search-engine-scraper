import type { Service } from "@/lib/service.mts";

export const buildPuppeteerGetSearchPageHtml =
  (getUrl: (search: string, page: number) => string, getPageContent: Service<[url: string], string>) =>
  async (search: string, page: number): Promise<string> => {
    const url = getUrl(search, page);
    return await getPageContent(url);
  };
