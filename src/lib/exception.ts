/**
 * Exception that no need to report to sentry
 * For example: user not install wallet
 */
export class NoAlarmException extends Error {
  constructor (message: string) {
    super(message)
    this.name = 'NoAlarmException'
  }
}

export class UserRejectException extends NoAlarmException {
  constructor () {
    super('User rejected the operation')
  }
}
