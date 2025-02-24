import UserAgent from "user-agents";
import playwright from "playwright";

export type PlaywrightConfig = {
  proxy: { isActive: boolean; port: string };
  isTest: boolean;
  testUrl: string | null;
  browser: {
    slowMo: number;
    additionalArgs: string[];
    headless: boolean;
    env: Record<string, string>;
    fakeHeaders: Record<string, string>;
    timeout: number;
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
      proxy: config.proxy.isActive ? { server: `socks5://localhost:${config.proxy.port}` } : undefined,
    });

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

    // await page.route("**/*.{png,jpg,jpeg}", (route) => route.abort()); /// TODO: abort useless request in order to save traffic (?)

    // await page.type("#user-name", "text", { delay: getRandomDelay() }); // TODO: implement human-like behaviour
    // await page.evaluate(() => window.scrollBy(0, window.innerHeight)); // TODO: implement human-like behaviour

    await page.mouse.move(Math.random() * 800, Math.random() * 600);
    await page.waitForTimeout(1000);

    if (config.isTest && config.testUrl) {
      await page.goto(config.testUrl, { waitUntil: "domcontentloaded" });
      await page.screenshot({
        path: `./screens/${Date.now()}-result.png`,
        fullPage: true,
      });
      await page.waitForTimeout(1000000);
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
