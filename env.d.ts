/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DSN: string
  readonly VITE_SENTRY_ORG: string
  readonly VITE_SENTRY_PROJECT: string
}
