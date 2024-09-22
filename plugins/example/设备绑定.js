import MysInfo from "../genshin/model/mys/mysInfo.js"
import axios from 'axios'

export class Handler extends plugin {
  constructor () {
    super({
      name: '小新枝',
      priority: -100000000000000000000000,
      namespace: '小新枝',
      handler: [{
        key: 'mys.req.err',
        fn: 'mysReqErrHandler'
      }],
      rule: [
        {
          reg: '^#绑定设备([\\s\\S]*)$',
          fnc: 'sendJson'
        },
        {
          reg: "#?绑定帮助",
          fnc: "shebei",
        },
      ]
    })
  }

  async mysReqErrHandler (e, args, reject) {
    let { data, mysApi, type } = args
    if (![1034, 5003, 10035, 10041].includes(Number(args?.res?.retcode))) {
      return reject()
    }
    const match = args.mysApi.cookie.match(/ltuid=(\d+)/)
    const fp = await redis.get(`yz:fp:${match[1]}`)
    let _fp
    if (fp) {
      _fp = JSON.parse(fp)
      logger.debug(_fp)
    } else {
      return reject()
    }
    try {
      if (data?.headers) {
        data.headers = {
          ...data.headers,
          'x-rpc-device_fp': _fp.data.device_fp
        }
      } else {
        if (!data) data = {}
        data.headers = { 'x-rpc-device_fp': _fp.data.device_fp }
      }
      let res = await mysApi.getData(type, data)
      if (![1034, 5003, 10035, 10041].includes(Number(res?.retcode))) {
        logger.debug(res)
        return res
      }
      return reject()
    } catch (err) { logger.info(err) }
    return reject()
  }

  async sendJson (e) {
    let message = e.msg.replace('#绑定设备', '')
    let uid = await MysInfo.getUid(e, false)
    if (!uid) return false
    let ck = await MysInfo.checkUidBing(uid, e)
    if (!ck) {
      e.reply(['请先绑定ck再使用绑定设备~'], true)
      return true
    }
    return await this.bindDevice(e, message, ck)
  }

  async bindDevice (e, message, cookie) {
    try {
      const info = JSON.parse(message)
      if (!this.validateDeviceInfo(info)) {
        if (info?.device_fp) {
          let data = info
          const parse = { data }
          redis.set(`yz:fp:${cookie.ltuid}`, JSON.stringify(parse))
          e.reply('绑定成功')
          return false
        }
        e.reply('设备信息格式错误', false, { at: true, recallMsg: 100 })
        return false
      }

      const { deviceName, deviceModel, oaid, deviceFingerprint, deviceBoard } = info
      const deviceBrand = deviceFingerprint.split('/')[0]

      const headers = this.getCommonHeaders(cookie, deviceName, deviceModel, deviceBrand)

      const fpResponse = await axios.post('https://public-data-api.mihoyo.com/device-fp/api/getFp', {
        app_name: 'bbs_cn',
        bbs_device_id: `${this.getDeviceGuid()}`,
        device_fp: '38d7faa51d2b6',
        device_id: '35315696b7071100',
        ext_fields: `{"proxyStatus":1,"isRoot":1,"romCapacity":"512","deviceName":"Xperia 1","productName":"${deviceModel}","romRemain":"456","hostname":"BuildHost","screenSize":"1096x2434","isTablet":0,"aaid":"${this.getDeviceGuid()}","model":"${deviceModel}","brand":"${deviceBrand}","hardware":"qcom","deviceType":"${deviceName}","devId":"REL","serialNumber":"unknown","sdCapacity":107433,"buildTime":"1633631032000","buildUser":"BuildUser","simState":1,"ramRemain":"96757","appUpdateTimeDiff":1722171241616,"deviceInfo":"${deviceFingerprint}","vaid":"${this.getDeviceGuid()}","buildType":"user","sdkVersion":"30","ui_mode":"UI_MODE_TYPE_NORMAL","isMockLocation":0,"cpuType":"arm64-v8a","isAirMode":0,"ringMode":2,"chargeStatus":1,"manufacturer":"${deviceBrand}","emulatorStatus":0,"appMemory":"512","osVersion":"11","vendor":"unknown","accelerometer":"-0.084346995x8.73799x4.6301117","sdRemain":96600,"buildTags":"release-keys","packageName":"com.mihoyo.hyperion","networkType":"WiFi","oaid":"${oaid}","debugStatus":1,"ramCapacity":"107433","magnetometer":"-13.9125x-17.8875x-5.4750004","display":"${deviceModel}","appInstallTimeDiff":1717065300325,"packageVersion":"2.20.2","gyroscope":"0.017714571x-4.5813544E-4x0.0015271181","batteryStatus":76,"hasKeyboard":0,"board":"${deviceBoard}"}`,
        platform: '2',
        seed_id: `${this.getSeed_id()}`,
        seed_time: new Date().getTime() + '',
      }, { headers })

      if (!fpResponse.data.data) {
        throw new Error('Failed to get device fingerprint')
      }

      const { device_fp } = fpResponse.data.data
      redis.set(`yz:fp:${cookie.ltuid}`, JSON.stringify(fpResponse.data))
      logger.debug(device_fp)
      const updatedHeaders = { ...headers, 'x-rpc-device_fp': device_fp }
      const commonParams = this.getCommonParams(deviceBrand, deviceModel)

      const Login = await axios.post('https://bbs-api.miyoushe.com/apihub/api/deviceLogin', commonParams, { headers: updatedHeaders })

      const Device = await axios.post('https://bbs-api.miyoushe.com/apihub/api/saveDevice', commonParams, { headers: updatedHeaders })
      const result = await Promise.all([Login.data, Device.data])
      logger.debug(`[米游社][设备登录]${JSON.stringify(result)}`)
      e.reply('绑定成功')
    } catch (error) {
      logger.error('Error binding device:', error)
      e.reply('绑定失败，请稍后再试')
    }
  }

  validateDeviceInfo (info) {
    // 验证设备信息逻辑  
    return (
      info &&
      info.deviceName &&
      info.deviceModel &&
      info.oaid &&
      info.deviceFingerprint &&
      info.deviceProduct &&
      info.deviceBoard
    )
  }
  getCommonParams (deviceBrand, deviceModel) {
    return {
      app_version: '2.73.1',
      device_id: `${this.getDeviceGuid()}`,
      device_name: `${deviceBrand}${deviceModel}`,
      os_version: '33',
      platform: 'Android',
      registration_id: this.getSeed_id(19),
    }
  }
  getCommonHeaders (cookie, deviceName, deviceModel, deviceBrand) {
    return {
      "x-rpc-app_version": "2.73.1",
      "User-Agent": "Mozilla/5.0 (Linux; Android 11; J9110 Build/55.2.A.4.332; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/124.0.6367.179 Mobile Safari/537.36 miHoYoBBS/2.73.1",
      "x-rpc-sys_version": "12",
      "x-rpc-client_type": "2",
      "x-rpc-channel": "mihoyo",
      "Referer": "https://act.mihoyo.com/",
      "Origin": "https://act.mihoyo.com",
      "cookie": cookie.ck,
      "x-rpc-device_id": `${this.getDeviceGuid()}`,
      "x-rpc-device_name": `${deviceName}`,
      "x-rpc-device_model": `${deviceModel}`,
      "x-rpc-csm_source": "myself"
    }
  }

  async shebei(e) {
    const msg = [{
      nickname: this.e.sender.card || this.e.user_id,
      user_id: this.e.user_id,
      message: segment.text('绑定设备帮助\nhttps://mirror.ghproxy.com/https://raw.githubusercontent.com/forchannot/get_device_info/main/app/build/outputs/apk/debug/app-debug.apk\n1. 使用常用米游社手机下载以上APK，并安装\n2. 打开后点击按钮复制\n3. 给机器人发送"#绑定设备+设备信息"指令\n4. 机器人会提示发送设备信息\n5. 粘贴设备信息发送\n6. 提示绑定成功')
    }]
    let A = Bot.makeForwardMsg(msg)
    await e.reply(A)
  }

  getDeviceGuid () {
    function S4 () {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    }

    return (S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4())
  }
  getSeed_id (length = 16) {
    const characters = '0123456789abcdef'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += characters[Math.floor(Math.random() * characters.length)]
    }
    return result
  }
}





