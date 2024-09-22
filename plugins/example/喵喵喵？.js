export class example extends plugin {
  constructor () {
    super({
      name: '兽语转换',
      dsc: '将文字转换成兽语',
      event: 'message',
      priority: 100,
      rule: [
        {
          reg: '^#兽语(.+)$',
          fnc: 'translateToBeastLanguage'
        }
      ]
    })
  }
  
  async translateToBeastLanguage (e) {
    const content = e.raw_message.replace(/^#兽语/, '').trim();
    const beastContent = this.convertToBeastLanguage(content);
    e.reply(`喵${'喵'.repeat(beastContent)}~`);
    return true;
  }
  
  convertToBeastLanguage (text) {
    const textLength = text.length;
    // 假设1个字对应1个喵
    return textLength;
  }
}
