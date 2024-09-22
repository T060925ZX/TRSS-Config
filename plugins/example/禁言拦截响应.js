export class Intercept extends plugin {
  constructor() {
    super({
      name: "禁言拦截指令",
      event: "message.group",
      priority: -Infinity
    })
  }
  accept(e) {
    if (e.group?.all_muted || e.group?.mute_left) {
      logger.debug(`Bot ${logger.yellow(`${e.self_id ?? e.bot.uin}`)} 在群 ${logger.green(`${e.group_id}`)} 被禁言，已拦截命令`)
      return "return"
    }
  }
}