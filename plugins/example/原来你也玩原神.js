export class example extends plugin {
  constructor () {
    super({
      name: '原来你也玩原神',
      dsc: '玩原神导致的',
      event: 'message',
      priority: -114514,
      rule: [
        {
          reg: '原来你也玩原神',
          fnc: '玩原神导致的'
        }
      ]
    })
  }
  async 玩原神导致的 (e) {
    logger.info('[感觉不如原神.js插件]')
    let url = encodeURI(`https://img.kookapp.cn/attachments/2023-09/06/64f7c6264a974.mp4`)
    await this.e.reply(segment.video(url))
    return;
  }
}