/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Only needed to point the form somewhere other than /api/waitlist. */
  readonly VITE_WAITLIST_ENDPOINT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
