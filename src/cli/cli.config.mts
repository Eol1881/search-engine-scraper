import process from "node:process";
import { type CliConfig } from "./cli.composer.mts";
import { z } from "zod";

const ProxyConfigSchema = z.object({
  PROXY_IS_ALIVE: z.literal("TRUE").or(z.literal("FALSE")),
  LOCAL_PROXY_PORT: z.string().nonempty(),
});

const proxyConfig = ProxyConfigSchema.parse(process.env);

export const cliConfig: CliConfig = {
  fs: {
    dbPath: "db",
  },
  fsTables: {
    companies: "companies",
  },
  playwright: {
    isTest: false,
    proxy: {
      isActive: proxyConfig.PROXY_IS_ALIVE === "TRUE",
      port: proxyConfig.LOCAL_PROXY_PORT,
    },
    userAgent: {
      device: "desktop",
      platform: "Win32",
    },
    // testUrl: "https://2ip.ru",
    // testUrl: "https://abrahamjuliot.github.io/creepjs/",
    // testUrl: "https://yandex.ru/search/?text=%D0%BF%D0%B8%D0%B4%D1%80&search_source=dzen_desktop_safe&lr=2",
    testUrl: "https://www.scrapingcourse.com/antibot-challenge",
    // testUrl: "https://yandex.ru",
    // testUrl: "https://ya.ru",
    // testUrl: "https://httpbin.org/ip",
    // testUrl: "https://bot-detector.rebrowser.net/",
    // testUrl: "https://antcpt.com/score_detector/",
    browser: {
      headless: false,
      slowMo: 250,
      additionalArgs: [
        // "--no-sandbox",
        // "--disable-setuid-sandbox",
        // "--no-zygote",
        // "--disable-dev-shm-usage",
        // "--disable-gpu",

        "--disable-blink-features=AutomationControlled", // This flag disables the JavaScript property navigator.webdriver from being true. Some websites use this property to detect if the browser is being controlled by automation tools like Puppeteer or Playwright.
        "--disable-extensions", // This flag disables all Chrome extensions. Extensions can interfere with the behavior of the browser and the webpage, so it’s often best to disable them when automating browser tasks.
        "--disable-infobars", // This flag disables infobars on the top of the browser window, such as the “Chrome is being controlled by automated test software” infobar.
        "--no-first-run", // This flag skips the first-run experience in Chrome, which is a series of setup steps shown the first time Chrome is launched.
        // "--enable-webgl", // We can ensure WebGL and hardware acceleration are enabled to replicate the typical capabilities of a human-operated web browser by specifying specific arguments when launching our Chromium browser.
        // "--use-gl=swiftshader", // We can ensure WebGL and hardware acceleration are enabled to replicate the typical capabilities of a human-operated web browser by specifying specific arguments when launching our Chromium browser.
        // "--enable-accelerated-2d-canvas", // We can ensure WebGL and hardware acceleration are enabled to replicate the typical capabilities of a human-operated web browser by specifying specific arguments when launching our Chromium browser.
      ],
      env: { DISPLAY: ":10.0" },
      fakeHeaders: {
        // "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-arch": '"x86"',
        "sec-ch-ua-bitness": '"64"',
        // "sec-ch-ua-full-version": '"115.0.5790.110"',
        // "sec-ch-ua-full-version-list": '"Not/A)Brand";v="99.0.0.0", "Google Chrome";v="115.0.5790.110", "Chromium";v="115.0.5790.110"',
        // "sec-ch-ua-model": '""',
        // "sec-ch-ua-mobile": "?0",
        // "sec-ch-ua-platform": "Windows",
        // "sec-ch-ua-platform-version": "15.0.0",
        "sec-ch-ua-wow64": "?0",
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",

        // "upgrade-insecure-requests": "1",
        // Accept:
        //   "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        // "Accept-Encoding": "gzip, deflate, br",
        // "Accept-Language": "ru-RU,ru;q=0.9",
        // "Cache-Control": "max-age=0",
        // Connection: "keep-alive",
      },
    },
  },
};
