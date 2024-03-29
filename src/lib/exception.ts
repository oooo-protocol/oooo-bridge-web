/**
 * 所有该类型的异常都非程序异常, 而是用户操作报错, 不需要上报到 Sentry
 * 例如: 用户未安装该钱包
 */
export class NoAlarmException extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NoAlarmException'
  }
}
