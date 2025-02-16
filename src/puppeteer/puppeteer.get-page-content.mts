import timers from "node:timers/promises"
import useProxy from "@lem0-packages/puppeteer-page-proxy"
import { TargetType, type Viewport } from "puppeteer"
import puppeteer from "puppeteer-extra"
import stealthPlugin from "puppeteer-extra-plugin-stealth"
import UserAgent from "user-agents"

puppeteer.use(stealthPlugin())

export type PuppeteerConfig = {
  proxy: {
    isActive: boolean
    protocol: string
    login: string
    password: string
    url: string
  }
  browser: {
    slowMo: number
    additionalArgs: string[]
    ignoredArgs: string[]
    defaultViewport: Viewport | null
    viewport: Viewport | null
    mode: 'with-head' | 'headless' | 'shell'
    browserEnv: Record<string, string>
    ignoredTargets: TargetType[]
    fakeHeaders: Record<string, string>
    timeout: number
    testUrl: string | null
  }
  userAgent: {
    device: 'desktop' | 'mobile' | 'tablet'
    platform: 'MacIntel' | 'Win32' | 'Linux x86_64' | 'Linux armv81'
  },
}

export const buildPuppeteerGetPageContent = (
  config: PuppeteerConfig
) => async (
  url: string
): Promise<string> => {
  const browser = await puppeteer.launch({
    slowMo: config.browser.slowMo,
    args: config.browser.additionalArgs,
    ignoreDefaultArgs: config.browser.ignoredArgs,
    defaultViewport: config.browser.defaultViewport,
    headless: config.browser.mode === 'shell' ? 'shell' : config.browser.mode === 'headless',
    env: config.browser.browserEnv,
    targetFilter: (target) => !config.browser.ignoredTargets.includes(target.type()),
  })

  const [page] = await browser.pages()

  if (page === undefined) {
    throw new Error('failed to get browser page')
  }

  if (config.proxy.isActive === true) {
    const proxyUrl = `${config.proxy.protocol}://${config.proxy.login}:${config.proxy.password}@${config.proxy.url}` 
    console.log('proxy', proxyUrl)
    await useProxy(page, proxyUrl)
  }

  console.log(1)
  await page.setExtraHTTPHeaders(config.browser.fakeHeaders)
  console.log(2)

  const userAgent = new UserAgent({
    deviceCategory: config.userAgent.device,
    platform: config.userAgent.platform,
  })
  console.log(3, userAgent.toString())
  await page.setUserAgent(userAgent.toString())
  console.log(4)

  await page.setViewport(config.browser.viewport)
  console.log(5)

  if (config.browser.testUrl !== null) {
    await page.goto(config.browser.testUrl, { timeout: 60000 });
    await timers.setTimeout(10_000);
    await page.screenshot({ path: `./screens/${Date.now()}-result.png`, fullPage: true });
    return '';
  }

  console.log('url', url)
  await page.goto(url, { timeout: config.browser.timeout, waitUntil: 'networkidle0' });
  // await page.goto(url, { timeout: config.browser.timeout, waitUntil: 'domcontentloaded' });
  console.log(6)

  const content = await page.content()
  console.log(7, content)

  // await page.close()

  console.log('asd')
  await browser.close()
  console.log('pgf')

  return content
}
