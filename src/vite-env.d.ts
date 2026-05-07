interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_ABLY_API_KEY: string
  readonly VITE_KLIPY_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}