type YmStub = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number }

export function getYandexMetrikaId(): number | null {
  const raw = import.meta.env.VITE_YANDEX_METRICA_ID?.trim()
  if (!raw) return null
  const n = Number(raw)
  return Number.isFinite(n) && n > 0 ? n : null
}

let metrikaInitStarted = false

/** Подключает счётчик только при заданном VITE_YANDEX_METRICA_ID. */
export function initYandexMetrika(): void {
  const id = getYandexMetrikaId()
  if (id === null || typeof window === 'undefined' || metrikaInitStarted) return
  metrikaInitStarted = true

  const m = window as Window & { ym?: YmStub }
  const i = 'ym' as const
  m[i] =
    m[i] ||
    function (...args: unknown[]) {
      ;(m[i]!.a = m[i]!.a || []).push(args)
    }
  m[i]!.l = Date.now()

  const src = `https://mc.yandex.ru/metrika/tag.js?id=${id}`
  for (let j = 0; j < document.scripts.length; j++) {
    if (document.scripts[j]!.src === src) return
  }

  const k = document.createElement('script')
  const a = document.getElementsByTagName('script')[0]!
  k.async = true
  k.src = src
  a.parentNode!.insertBefore(k, a)

  m[i]!(id, 'init', {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    referrer: document.referrer,
    url: location.href,
    accurateTrackBounce: true,
    trackLinks: true,
  })
}

export function yandexMetrikaHit(url: string): void {
  const mid = getYandexMetrikaId()
  const m = window as Window & { ym?: (...args: unknown[]) => void }
  if (mid === null || typeof m.ym !== 'function') return
  m.ym(mid, 'hit', url)
}
