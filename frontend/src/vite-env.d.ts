interface ViteTypeOptions {
  strictImportMetaEnv: unknown
}

interface ImportMetaEnv {
  readonly VITE_AUTH0_DOMAIN: string
  readonly VITE_AUTH0_CLIENT_ID: string
  readonly VITE_AUTH0_BACKEND_AUDIENCE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
