import * as Sentry from '@sentry/vue'
import { AxiosError } from 'axios'
import { NoAlarmException } from '@/lib/exception'
import { ResponseError } from '@/request/axios'
import { type Vue } from '@sentry/vue/types/types'

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
