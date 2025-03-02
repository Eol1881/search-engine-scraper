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
      extraHTTPHeaders: config.browser.fakeHeaders,
    });

    // await context.addCookies([{name: value: domain: path:}]);

    const page = await context.newPage();
    page.setDefaultTimeout(30000);

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

    await page.goto(`https://${url}`, {
      waitUntil: "domcontentloaded",
    });

    let content = await page.content();

    const CONTACT_LINK_SIGNS = [
      "contact",
      "contacts",
      "feedback",
      "контакты",
      "связаться с нами",
      "о нас",
      "напишите нам",
      "техническая поддержка",
      "help",
      "помощь",
      "служба поддержки",
      "связь",
      "обратная связь",
      "сообщить о проблеме",
    ];

    const links = page.locator("a");
    const allLinks = await links.all();

    try {
      for (const link of allLinks) {
        const href = await link.getAttribute("href");
        const text = await link.textContent();
        const isContactsLink =
          CONTACT_LINK_SIGNS.some((x) => href?.includes(x)) || CONTACT_LINK_SIGNS.some((x) => text?.includes(x));
        if (isContactsLink) {
          console.log("Contacts link found", await link.textContent());
          await link.dispatchEvent("click");
          await page.waitForLoadState("domcontentloaded");
          content = content + (await page.content());
          break;
        }
      }
    } catch {
      /* empty */
    }

    await browser.close();

    return content;
  };

// if (config.testUrl.includes("rebrowser")) {
//   await page.evaluate(() => {
//     const windowPatched = window as unknown as Window & { dummyFn: () => void };
//     windowPatched.dummyFn();
//   });
//   await page.exposeFunction("exposedFn", () => console.log("exposedFn call"));
//   await page.evaluate(() => document.getElementById("detections-json"));
// }
