export class XxxX extends plugin {
  constructor() {
    super({
      name: '说话',
      event: 'message',
      permission: 'master',
      rule: [
        {
          reg: '^说话$',
          fnc: 'X'
        }
      ]
    });
  }

  async X(e) {
    const jsonArray = [
      `{
        "app": "com.tencent.eventshare.lua",
        "desc": "",
        "bizsrc": "tianxuan.business",
        "view": "eventshare",
        "ver": "0.0.0.1",
        "prompt": "我喜欢你",
        "meta": {
          "eventshare": {
            "button1URL": "https:\\/\\/ys.mihoyo.com\\/?utm_source=adbdpz&from_channel=adbdpz#\\/",
            "button1disable": false,
            "button1title": "是的，我想",
            "button2URL": "https:\\/\\/sr.mihoyo.com\\/ad?from_channel=adbdpz&utm_source=mkt&utm_medium=branding&utm_campaign=871858",
            "button2disable": false,
            "button2title": "不，算了",
            "buttonNum": 2,
            "jumpURL": "https:\\/\\/h5.qzone.qq.com\\/v2\\/vip\\/card\\/page\\/home?_wv=16778146&enteranceId=shareark&visitUin=3470558502",
            "preview": "https:\\/\\/tianquan.gtimg.cn\\/\\/chatBg\\/\\/item\\/\\/51841\\/\\/newPreview2.png",
            "tag": "QQ",
            "tagIcon": "http:\\/\\/gchat.qpic.cn\\/gchatpic_new\\/0\\/0-0-C5B80B435F21247D9BC6225EAA9A3A76\\/0?term=2",
            "title": "是否进入虚拟猫娘世界Neko World"
          }
        },
        "config": {
          "autosize": 0,
          "collect": 0,
          "ctime": 1707209474,
          "forward": 1,
          "height": 336,
          "reply": 0,
          "round": 1,
          "token": "68fb63bdfc5fd39744233bcc72b1ef66",
          "type": "normal",
          "width": 263
        }
      }`,
      `{
        "app": "com.tencent.eventshare.lua",
        "desc": "",
        "bizsrc": "tianxuan.business",
        "view": "eventshare",
        "ver": "0.0.0.1",
        "prompt": "我喜欢你",
        "appID": "",
        "sourceName": "",
        "actionData": "",
        "actionData_A": "",
        "sourceUrl": "",
        "meta": {
          "eventshare": {
            "button1URL": "http:\\/\\/api.yujn.cn\\/api\\/qqmp.php?qq=2973766862",
            "button1disable": false,
            "button1title": "是的，我想",
            "button2URL": "",
            "button2disable": false,
            "button2title": "不，算了",
            "buttonNum": 2,
            "jumpURL": "http:\\/\\/api.yujn.cn\\/api\\/qqmp.php?qq=2973766862",
            "preview": "https:\\/\\/tianquan.gtimg.cn\\/chatBg\\/item\\/52373\\/newPreview2.png",
            "tag": "QQ",
            "tagIcon": "http:\\/\\/gchat.qpic.cn\\/gchatpic_new\\/0\\/0-0-C5B80B435F21247D9BC6225EAA9A3A76\\/0?term=2",
            "title": "是否进入内鬼小南梁的身体"
          }
        },
        "config": {
          "autosize": 0,
          "collect": 0,
          "ctime": 1708445428,
          "forward": 1,
          "height": 336,
          "reply": 0,
          "round": 1,
          "token": "ec15bad08e54852f770f871f785200f8",
          "type": "normal",
          "width": 263
        },
        "text": "",
        "extraApps": [],
        "sourceAd": "",
        "extra": ""
      }`
    ];

    const randomIndex = Math.floor(Math.random() * jsonArray.length);
    e.reply(segment.json(jsonArray[randomIndex]));
  }
}
