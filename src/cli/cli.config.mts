import process from "node:process"
import { TargetType } from "puppeteer";
import { type CliConfig } from "./cli.composer.mts";
import { z } from "zod";

const ProxyConfigSchema = z.object({
  PROXY_IS_ALIVE: z.literal('TRUE').or(z.literal('FALSE')),
  PROXY_PROTOCOL: z.string().nonempty(),
  PROXY_LOGIN: z.string().nonempty(),
  PROXY_PASSWORD: z.string().nonempty(),
  PROXY_URL: z.string().nonempty(),
})

const proxyConfig = ProxyConfigSchema.parse(process.env)

export const cliConfig: CliConfig = {
  fs: {
    dbPath: "db",
  },
  fsTables: {
    companies: "companies",
  },
  puppeteer: {
    proxy: {
      isActive: proxyConfig.PROXY_IS_ALIVE === 'TRUE',
      protocol: proxyConfig.PROXY_PROTOCOL,
      login: proxyConfig.PROXY_LOGIN,
      password: proxyConfig.PROXY_PASSWORD,
      url: proxyConfig.PROXY_URL,
    },
    userAgent: {
      device: 'desktop',
      platform: 'Win32',
    },
    browser: {
      // testUrl: 'https://abrahamjuliot.github.io/creepjs/',
      testUrl: null,
      slowMo: 250,
      additionalArgs: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-infobars',
        '--no-zygote',
        '--disable-dev-shm-usage',
        '--disable-gpu',
      ],
      ignoredArgs: [
        '--disable-extensions'
      ],
      defaultViewport: null,
      viewport: { width: 1280, height: 720 },
      mode: 'with-head',
      browserEnv: { DISPLAY: ':10.0' },
      ignoredTargets: [TargetType.OTHER],
      timeout: 0,
      fakeHeaders: {
        "sec-ch-ua": '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
        "sec-ch-ua-full-version": '"115.0.5790.110"',

        "sec-ch-ua-model": '""',
        "sec-ch-ua-arch": '"x86"',
        "sec-ch-ua-bitness": '"64"',
        "sec-ch-ua-platform": "Linux",
        "sec-ch-ua-platform-version": "15.0.0",
        "sec-ch-ua-full-version-list":
          '"Not/A)Brand";v="99.0.0.0", "Google Chrome";v="115.0.5790.110", "Chromium";v="115.0.5790.110"',

        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-wow64": "?0",

        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "same-origin",
        "sec-fetch-user": "?1",

        "upgrade-insecure-requests": "1",

        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "ru-RU,ru;q=0.9",

        "Cache-Control": "max-age=0",
        Connection: "keep-alive",
      },
    },
  },
}
