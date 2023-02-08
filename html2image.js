import chrome from 'chrome-aws-lambda'
import puppeteer from 'puppeteer-core'


const isDev = !process.env.AWS_REGION;

export default async (html = '') => {
  await chrome.font('https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf');
  const options = process.env.AWS_REGION
    ? {
        args: chrome.args,
        executablePath: await chrome.executablePath,
        headless: chrome.headless,
      }
    : {
        args: [],
        executablePath:
          process.platform === 'win32'
            ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe'
            : process.platform === 'linux'
            ? '/usr/bin/google-chrome'
            : '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
      }
  const browser = await puppeteer.launch(options)

  const page = await browser.newPage()

  await page.setContent(html)

  const content = await page.$('body')
  const imageBuffer = await content.screenshot({ omitBackground: true })

  await page.close()
  await browser.close()

  return imageBuffer
}