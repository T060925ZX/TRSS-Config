import plugin from '../../lib/plugins/plugin.js'

export class example extends plugin {
  constructor() {
    super({
      name: '原神启动',
      dsc: '其实就是通过API发图片啦',
      event: 'message',
      priority: 250,
      rule: [
        {
          reg: '原神启动',
          fnc: '启动'
        }
      ]
    })
  }
  async 启动(e) {
    logger.info('[原神启动.js插件]')
    let url1 = encodeURI(`https://img.kookapp.cn/attachments/2023-08/24/8YjyPQI9Fo0pk1hc.jpeg`)
    let url2 = encodeURI(`https://img.kookapp.cn/attachments/2023-08/24/ZqISNLDgV90pk1hc.jpeg`)
    let url3 = encodeURI(`https://img.kookapp.cn/attachments/2023-08/24/kCcIH09XS00pk1hc.jpeg`)
    let url4 = encodeURI(`https://img.kookapp.cn/attachments/2023-08/24/dEDcHHuYnn0pk1hc.jpeg`)
    
    // 使用消息段落数组来一次性发送多个图片
    const imageSegments = [
      segment.image(url1),
      segment.image(url2),
      segment.image(url3),
      segment.image(url4)
    ];
    
    await this.e.reply(imageSegments, true);
  }
}
