import plugin from '../../lib/plugins/plugin.js';
/* 作者：GloryGods */
/*瞎写的*/
import pkg from 'js-sha3';
const { keccak384 } = pkg;
import { createHash } from 'crypto';

export class example extends plugin {
    constructor() {
        super({
            name: 'finalshell',
            dsc: 'finalshell离线激活',
            event: 'message',
            priority: 5000,
            rule: [{
                reg: /^#离线激活.*$/i, // 匹配"#离线激活+机器码"的格式
                fnc: 'ActivationUtil'
            }]
        });
    }

    async ActivationUtil(e) {
        function md5(msg) {
            return createHash('md5').update(msg, 'utf8').digest('hex');
        }

        let list = e.msg.match(/^#离线激活(.*)$/i); // 捕获 '#离线激活' 后的所有内容
        if (list && list.length > 1) {
            let code = list[1].trim(); // 访问捕获的组并去除空白字符

            let replyMessage = "";
            replyMessage += "finalshell离线激活码\n";
            replyMessage += "版本号 < 3.9.6 (旧版)\n";
            replyMessage += "高级版: " + md5("61305" + code + "8552").substring(8, 24) + "\n";
            replyMessage += "专业版: " + md5("2356" + code + "13593").substring(8, 24) + "\n";

            replyMessage += "版本号 >= 3.9.6 (新版)\n";
            replyMessage += "高级版: " + keccak384(code + "hSf(78cvVlS5E").substring(12, 28) + "\n";
            replyMessage += "专业版: " + keccak384(code + "FF3Go(*Xvbb5s2").substring(12, 28) + "\n";

            await e.reply(replyMessage, true);
        } else {
            await e.reply("机器码格式不正确，请检查输入。");
        }
    }
}
