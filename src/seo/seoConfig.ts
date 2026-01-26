import type { RouteLocationNormalized } from 'vue-router'
import defaultOgImage from '../assets/images/strategy-workshop.jpg'

type SeoMeta = {
  title: string
  description: string
  canonical?: string
  robots?: string
  keywords?: string[]
  ogImage?: string
}

const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/+$/, '') ||
  'https://phototochka.local'

const DEFAULT_SEO: SeoMeta = {
  title: 'ФотоТочка — маркетплейс стоковых фотографий и лицензий',
  description:
    'Маркетплейс качественных стоковых фотографий с прозрачными лицензиями, подписками и аналитикой для авторов и бизнеса.',
  canonical: '/',
  robots: 'index,follow',
  keywords: [
    'стоковые фото',
    'фотобанк',
    'лицензии на изображения',
    'каталог фотографий',
    'подписка на контент',
  ],
  ogImage: defaultOgImage,
}

const SEO_BY_ROUTE: Record<string, Partial<SeoMeta>> = {
  home: {
    title: 'ФотоТочка — площадка стоковых фото для бизнеса и авторов',
    description:
      'Главная страница: подборки, поиск, доверительные метрики, подписка и витрина новинок. Быстрый старт для покупателей и авторов.',
    canonical: '/',
  },
  catalog: {
    title: 'Каталог стоковых фотографий | ФотоТочка',
    description:
      'Каталог с фильтрами по категориям, ориентации и тегам. Экспорт лицензий и сохранённые фильтры для быстрого отбора.',
    canonical: '/catalog',
  },
  'catalog-photos': {
    title: 'Лента фотографий с фильтрами и избранным | ФотоТочка',
    description:
      'Бесконечная лента фотографий с тегами, избранным, сохранением фильтров и быстрым переходом к деталям.',
    canonical: '/catalog/photos',
  },
  'photo-detail': {
    title: 'Детальная карточка фото и похожие работы | ФотоТочка',
    description:
      'Карточка фото с тегами, похожими работами и ссылкой на следующее фото — поможет увеличить глубину просмотра.',
  },
  blog: {
    title: 'Блог ФотоТочки — советы по контенту и лицензированию',
    description:
      'Статьи и подборки о визуальном контенте, лицензировании и продвижении авторов на маркетплейсе ФотоТочка.',
    canonical: '/blog',
  },
  help: {
    title: 'Помощь и ответы на вопросы | ФотоТочка',
    description:
      'FAQ по оплатам, лицензиям, загрузке и использованию стоковых фотографий. Быстрые ответы без обращения в поддержку.',
    canonical: '/help',
  },
  about: {
    title: 'О проекте ФотоТочка — команда и миссия',
    description:
      'Информация о команде и миссии ФотоТочки, прозрачности лицензий и подходе к качеству визуального контента.',
    canonical: '/about',
  },
  login: {
    title: 'Вход в аккаунт ФотоТочка',
    description:
      'Авторизация покупателей и авторов. Страница закрыта от индексации поисковыми системами.',
    canonical: '/login',
    robots: 'noindex,nofollow',
  },
  register: {
    title: 'Регистрация в ФотоТочке',
    description:
      'Создайте аккаунт, чтобы покупать стоковые фото, вести избранное и подписки. Страница закрыта от индексации.',
    canonical: '/register',
    robots: 'noindex,nofollow',
  },
  'photographer-dashboard': {
    title: 'Кабинет автора — аналитика и загрузки | ФотоТочка',
    description:
      'Панель автора с аналитикой, загрузкой фото и управлением лицензиями. Страница не предназначена для индексации.',
    canonical: '/photographer',
    robots: 'noindex,nofollow',
  },
  'photographer-photos': {
    title: 'Фото автора — управление и публикации | ФотоТочка',
    description: 'Личный раздел автора. Запрещён для индексации.',
    canonical: '/photographer/photos',
    robots: 'noindex,nofollow',
  },
  'photographer-upload': {
    title: 'Загрузка фотографий — ФотоТочка',
    description: 'Рабочая форма загрузки. Страница закрыта от индексации.',
    canonical: '/photographer/photos/upload',
    robots: 'noindex,nofollow',
  },
  'photographer-analytics': {
    title: 'Аналитика автора — просмотры и продажи | ФотоТочка',
    description: 'Раздел аналитики автора. Индексация отключена.',
    canonical: '/photographer/analytics',
    robots: 'noindex,nofollow',
  },
  'photographer-settings': {
    title: 'Настройки профиля автора — ФотоТочка',
    description: 'Настройки профиля и уведомлений. Страница закрыта для поисковиков.',
    canonical: '/photographer/settings',
    robots: 'noindex,nofollow',
  },
  admin: {
    title: 'Администрирование ФотоТочки',
    description: 'Панель администратора. Доступ и индексация запрещены.',
    canonical: '/admin',
    robots: 'noindex,nofollow',
  },
}

const canonicalUrl = (path?: string) => {
  const normalised = path?.startsWith('/') ? path : `/${path ?? ''}`
  return new URL(normalised, SITE_URL).toString()
}

const upsertMeta = (name: string, content?: string) => {
  const selector = `meta[name="${name}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    if (tag) tag.remove()
    return
  }

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', name)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const upsertPropertyMeta = (property: string, content?: string) => {
  const selector = `meta[property="${property}"]`
  let tag = document.head.querySelector<HTMLMetaElement>(selector)

  if (!content) {
    if (tag) tag.remove()
    return
  }

  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('property', property)
    document.head.appendChild(tag)
  }

  tag.setAttribute('content', content)
}

const ensureCanonical = (href: string) => {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', href)
}

export const applySeo = (to: RouteLocationNormalized) => {
  if (typeof document === 'undefined') return

  const override = SEO_BY_ROUTE[to.name as string] ?? {}
  const seo: SeoMeta = {
    ...DEFAULT_SEO,
    ...override,
  }

  const canonical = canonicalUrl(seo.canonical ?? to.path)

  document.title = seo.title
  upsertMeta('description', seo.description)
  upsertMeta('robots', seo.robots ?? 'index,follow')
  upsertMeta('keywords', seo.keywords?.join(', '))

  upsertPropertyMeta('og:title', seo.title)
  upsertPropertyMeta('og:description', seo.description)
  upsertPropertyMeta('og:type', 'website')
  upsertPropertyMeta('og:url', canonical)
  upsertPropertyMeta('og:image', seo.ogImage ?? DEFAULT_SEO.ogImage)

  upsertPropertyMeta('twitter:card', 'summary_large_image')
  upsertPropertyMeta('twitter:title', seo.title)
  upsertPropertyMeta('twitter:description', seo.description)
  upsertPropertyMeta('twitter:image', seo.ogImage ?? DEFAULT_SEO.ogImage)

  ensureCanonical(canonical)

  // Отправка события в Яндекс.Метрику при смене роута
  if (typeof (window as any).ym === 'function') {
    (window as any).ym(106463869, 'hit', canonical)
  }
}

