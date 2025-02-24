import UserAgent from "user-agents";
import playwright from "playwright";

export type PlaywrightConfig = {
  proxy: {
    isActive: boolean;
    protocol: string;
    login: string;
    password: string;
    url: string;
  };
  browser: {
    slowMo: number;
    additionalArgs: string[];
    headless: boolean;
    env: Record<string, string>;
    fakeHeaders: Record<string, string>;
    timeout: number;
    testUrl: string | null;
  };
  userAgent: {
    device: "desktop" | "mobile" | "tablet";
    platform: "MacIntel" | "Win32" | "Linux x86_64" | "Linux armv81";
  };
};

export const buildPlaywrightGetPageContent =
  (config: PlaywrightConfig) =>
  async (url: string): Promise<string> => {
    const browser = await playwright.chromium.launch({
      slowMo: config.browser.slowMo,
      headless: config.browser.headless,
      args: config.browser.additionalArgs,
      env: config.browser.env,
    });

    // if (config.proxy.isActive === true) {
    //   const proxyUrl = `${config.proxy.protocol}://${config.proxy.login}:${config.proxy.password}@${config.proxy.url}`
    //   console.log('proxy', proxyUrl)
    //   await useProxy(page, proxyUrl)
    // }

    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      locale: "ru-RU",
      timezoneId: "Europe/Moscow",
      userAgent: new UserAgent({
        deviceCategory: config.userAgent.device,
        platform: config.userAgent.platform,
      }).toString(),
      // geolocation: { longitude: 12.4924, latitude: 41.8902 },
      // permissions: ["geolocation"],
      extraHTTPHeaders: config.browser.fakeHeaders,
    });

    await context.addCookies([
      {
        name: "sample_cookie",
        value: "0b484c21dba17c9e2fff8a4da0bac12d",
        domain: "www.sample.com",
        path: "/",
      },
    ]);

    const page = await context.newPage();

    // https://yandex.ru/search/?text=%D0%BF%D0%B8%D0%B4%D1%80&search_source=dzen_desktop_safe&lr=2
    // await page.goto("https://abrahamjuliot.github.io/creepjs/", { waitUntil: "domcontentloaded" });

    // await page.type("#user-name", "text", { delay: getRandomDelay() });
    // await page.evaluate(() => window.scrollBy(0, window.innerHeight));

    await page.mouse.move(Math.random() * 800, Math.random() * 600);
    await page.waitForTimeout(1000);

    if (config.browser.testUrl !== null) {
      await page.goto(config.browser.testUrl, {
        waitUntil: "domcontentloaded",
      });
      await page.waitForTimeout(1000000);
      await page.screenshot({
        path: `./screens/${Date.now()}-result.png`,
        fullPage: true,
      });
      return "";
    }

    await page.goto(url, {
      timeout: config.browser.timeout,
      waitUntil: "domcontentloaded",
    });

    const content = await page.content();

    await browser.close();

    return content;
  };
