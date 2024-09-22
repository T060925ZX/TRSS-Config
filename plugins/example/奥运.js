import puppeteer from '../../lib/puppeteer/puppeteer.js'

export class OlympicGames extends plugin {
  constructor () {
    super({
      name: '奥运会',
      dsc: '看奥运会怎么样了',
      event: 'message',
      priority: -Infinity,
      rule: [
        {
          reg: /^#?(巴黎)?奥运会?(((奖牌)?(排行)?榜?单?)|赛程)?$/,
          fnc: 'OlympicGames'
        }
      ]
    })
  }

  async OlympicGames (e) {
    if (!puppeteer.browser) await puppeteer.browserInit()
    const page = await puppeteer.browser.newPage()
    const target = e.msg.includes('赛程') ? '%E8%B5%9B%E7%A8%8B' : '%E5%A5%96%E7%89%8C%E6%A6%9C'
    await page.goto('https://tiyu.baidu.com/al/major/home?match=2024%E5%B9%B4%E5%B7%B4%E9%BB%8E%E5%A5%A5%E8%BF%90%E4%BC%9A&tab=' + target)
    const body = await page.$('body')
    const base64 = await body.screenshot()
    page.close().catch((err) => logger.error(err))
    e.reply([segment.image(base64), segment.button([{ text: '中国队加油', callback: '中国队加油！' }])])
    return true
  }
}
