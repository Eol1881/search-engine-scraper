import type { Service } from "@/lib/service.mts";

export const buildPuppeteerGetPageHtml =
  (getPageContent: Service<[url: string], string>) =>
  async (url: string): Promise<string> => {
    return await getPageContent(url);
  };
