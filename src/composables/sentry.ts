import * as Sentry from '@sentry/vue'
import { AxiosError } from 'axios'
import { NoAlarmException } from 'oooo-components/lib/exception'
import { ResponseError } from '@/request/axios'
import { type Vue } from '@sentry/vue/types/types'

/**
 * disable errors originating from injected scripts such as Google Tag Manager
 * @param event Sentry event
 * @returns boolean
 */
function isInjectedCode (event: Sentry.Event | undefined): boolean {
  const frames = event?.exception?.values?.[0]?.stacktrace?.frames

  if (!frames || frames.length === 0) return false

  const firstFrame = frames[0]
  if (firstFrame.filename === '<anonymous>') {
    return true
  }

  const lastFrame = frames[frames.length - 1]
  if (
    typeof lastFrame.filename === 'string' &&
  (lastFrame.filename === window.location.pathname ||
    (lastFrame.filename.startsWith(window.location.origin) &&
      // static file should not be considered as injected code. We use react-script currently, and all js-generated files are in this "static" directory.
      !lastFrame.filename.includes('/static/')))
  ) {
    return true
  }

  if (
    frames.some(
      (frame) =>
        typeof frame.filename === 'string' &&
      (frame.filename.startsWith('http://www.googletagmanager.com') ||
        frame.filename.startsWith('https://googleads.'))
    )
  ) {
    return true
  }

  return false
}

export const initSentry = (app: Vue) => {
  if (import.meta.env.VITE_MODE !== 'dev') {
    Sentry.init({
      app,
      environment: import.meta.env.VITE_MODE,
      dsn: 'https://f975000a3164f8ca03680bd3d5c4d25a@o4506929691295744.ingest.us.sentry.io/4506929706237952',
      integrations: [
        Sentry.browserTracingIntegration()
      ],
      // Set tracesSampleRate to 1.0 to capture 100%
      // of transactions for performance monitoring.
      // We recommend adjusting this value in production
      tracesSampleRate: 1.0,
      tracePropagationTargets: ['localhost', import.meta.env.VITE_REQUEST_DOMAIN],
      beforeSend (event, hint) {
        const error = hint.originalException
        if (
          isInjectedCode(event) ||
          error instanceof NoAlarmException ||
          error instanceof AxiosError ||
          error instanceof ResponseError
        ) {
          return null
        }
        return event
      }
    })
  }
}
