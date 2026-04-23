/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_PATH?: string
  readonly VITE_DEFAULT_OG_IMAGE?: string
  readonly VITE_SITE_URL?: string
  readonly VITE_YANDEX_METRICA_ID?: string
  readonly VITE_YANDEX_SITE_VERIFICATION?: string
  readonly VITE_DEMO_ADMIN_EMAIL?: string
  readonly VITE_DEMO_ADMIN_PASSWORD?: string
  readonly VITE_DEMO_ADMIN_DISPLAY_NAME?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
