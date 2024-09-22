import { segment } from 'oicq';
import plugin from '../../../lib/plugins/plugin.js';

/**
本插件由瑜笙编写随便外传随便改
首发QQ交流群 720290263
*/

export class example extends plugin {
    constructor() {
        super({
            name: 'ban',
            dsc: 'ban',
            event: 'notice.group.ban',
            priority: -10,
            rule: [
                {
                    reg: '',
                    fnc: 'ban'
                }
            ]
        });
    }

    async ban(e) {
    if (e.duration === 0){return false}
        let msg = `\n你怎么不说话了 是因为不喜欢吗？`
            if (e.sub_type === 'ban') {
            e.reply([
                segment.at(e.user_id),
                msg
            ]);
            return false
        }
        return false
    }
}