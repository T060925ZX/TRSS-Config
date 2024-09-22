import path from 'path';
import fs from 'fs';
import yaml from 'yaml';
import lodash from 'lodash'

const _path = process.cwd().replace(/\\/g, '/')

function getconfig(name) {
    const _path = process.cwd().replace(/\\/g, '/')
    let cfgyaml = `${_path}/config/${name}.yaml`
    const configData = fs.readFileSync(cfgyaml, 'utf8');
    let config = yaml.parse(configData);
    return { config };
}

export function supportGuoba() {
    return {
        pluginInfo: {
            name: `ICQQ-Plugin`,
            title: 'ICQQ插件',
            author: '@时雨◎星空',
            authorLink: 'https://gitee.com/TimeRainStarSky',
            link: 'https://gitee.com/TimeRainStarSky/Yunzai-ICQQ-Plugin',
            isV3: true,
            isV2: false,
            description: `ICQQ插件`,
            icon: 'svg-spinners:8-dots-rotate',
            iconColor: '#d19f56',
        },
        configInfo: {
            schemas: [
                {
                    component: 'Divider',
                    label: 'Markdown设置'
                },
                {
                    field: 'markdown.mode',
                    label: 'mode',
                    component: 'Switch',
                }, {
                    field: 'markdown.button',
                    label: 'button',
                    component: 'Switch',
                }, {
                    field: 'markdown.callback',
                    label: 'callback',
                    component: 'Switch',
                },
                {
                    component: 'Divider',
                    label: '签名设置'
                },
                {
                    field: 'bot.sign_api_addr',
                    label: 'QQ签名地址',
                    component: 'Input',
                    required: true,
                    componentProps: {
                        placeholder: '请输入QQ签名地址',
                    }
                },
                {
                    component: 'Divider',
                    label: 'BOT设置'
                }, {
                    field: 'token',
                    label: 'Token',
                    bottomHelpMessage: 'QQ号:密码(留空扫码):登录设备:版本号:独立签名地址',
                    component: 'GTags',
                }
                
            ],
            async getConfigData() {
                let { config } = getconfig(`ICQQ`)
                return config;
            },
            async setConfigData(data, { Result }) {
                // 1.读取现有配置文件
                const configFilePath = path.join(_path, 'config', 'ICQQ.yaml');
                let config = {};
                if (fs.existsSync(configFilePath)) {
                    const configContent = fs.readFileSync(configFilePath, 'utf8');
                    config = yaml.parse(configContent) || {};
                }
                // 2. 更新配置对象
                for (const [keyPath, value] of Object.entries(data)) {
                    lodash.set(config, keyPath, value);
                }
                // 3. 将更新后的配置对象写回文件
                const updatedConfigYAML = yaml.stringify(config);
                fs.writeFileSync(configFilePath, updatedConfigYAML, 'utf8');
                logger.mark(`[ICQQ插件:配置文件]配置文件更新`)
                return Result.ok({}, '保存成功~');
            }
        }
    }
}