import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import * as Sentry from '@sentry/vue'

import App from './App.vue'

const app = createApp(App)

Sentry.init({
  app,
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.vueIntegration({
      tracingOptions: {
        trackComponents: true
      }
    })
  ],
  tracesSampleRate: 1.0,
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', 'https://horse-racing.vercel.app/']
})

app.config.errorHandler = (err, _, info) => {
  console.error('Error:', err, info)

  Sentry.captureException(err, {
    level: 'error',
    extra: {
      info
    }
  })
}

app.use(createPinia())

app.mount('#app')
