let XxxX = false;
let lastTriggerTime = 0;
const waitTime = 60000; // 60秒

export class Example extends plugin {
  constructor() {
    super({
      name: '喵~',
      dsc: '测试喵',
      event: 'message',
      priority: 250,
      rule: [
        {
          reg: "^喵一个$",
          fnc: 'X'
        }
      ]
    })
  }

  async X(e) {
    const currentTime = Date.now();
    const timeDiff = currentTime - lastTriggerTime;

    if (XxxX) {
      const remainingTime = waitTime - timeDiff;
      if (remainingTime > 0) {
        this.e.reply(`主人~ \n让少女休息${Math.ceil(remainingTime / 1000)}秒吧`, true);
        return;
      }
    }

    XxxX = true;
    lastTriggerTime = currentTime;
    this.e.reply('喵~', true);

    setTimeout(() => {
      XxxX = false;
    }, waitTime);
  }
}