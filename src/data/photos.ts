import alpineLake from '../assets/images/alpine-lake.jpg'
import aerialLandscape from '../assets/images/aerial-landscape.jpg'
import creativeDesk from '../assets/images/creative-desk.jpg'
import creativePortrait from '../assets/images/creative-portrait-1.jpg'
import dawnTrails from '../assets/images/dawn-trails.jpg'
import industrialGrid from '../assets/images/industrial-grid.jpg'
import santoriniSunset from '../assets/images/santorini-sunset.jpg'
import skylineOverlook from '../assets/images/skyline-overlook.jpg'
import strategyWorkshop from '../assets/images/strategy-workshop.jpg'
import streetStyle from '../assets/images/street-style.jpg'
import techInstallation from '../assets/images/tech-installation.jpg'
import urbanLab from '../assets/images/urban-lab.jpg'
import valleyOverlook from '../assets/images/valley-overlook.jpg'
import wildlifeStallion from '../assets/images/wildlife-stallion.jpg'

export interface LicenseType {
  id: string
  name: string
  description: string
  price: number
}

export interface Photo {
  id: string
  title: string
  description?: string
  category: string
  imageUrl: string
  thumbnailUrl?: string
  orientation: 'landscape' | 'portrait' | 'square'
  tags: string[]
  price: number
  licenseTypes: LicenseType[]
  author: {
    id: string
    name: string
    avatarUrl?: string
  }
  dimensions?: {
    width: number
    height: number
  }
  uploadedAt: string
  views?: number
  downloads?: number
}

export interface PhotoFilters {
  category?: string
  search?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  minPrice?: number
  maxPrice?: number
  page?: number
  limit?: number
}

export interface PhotoListResponse {
  photos: Photo[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

// Типы лицензий
const licenseTypes: Record<string, LicenseType[]> = {
  editorial: [
    {
      id: 'editorial-basic',
      name: 'Редакционная',
      description: 'Для использования в СМИ, блогах и редакционных материалах',
      price: 500,
    },
    {
      id: 'editorial-extended',
      name: 'Расширенная редакционная',
      description: 'Расширенные права для печатных и онлайн публикаций',
      price: 1200,
    },
  ],
  commercial: [
    {
      id: 'commercial-standard',
      name: 'Коммерческая',
      description: 'Для рекламы, сайтов, соцсетей и маркетинговых материалов',
      price: 2500,
    },
    {
      id: 'commercial-extended',
      name: 'Расширенная коммерческая',
      description: 'Для OOH, крупных рекламных кампаний и брендинга',
      price: 5000,
    },
  ],
} as const

const editorialLicenses: LicenseType[] = licenseTypes.editorial || []
const commercialLicenses: LicenseType[] = licenseTypes.commercial || []

// Авторы
const authors = {
  'author-1': {
    id: 'author-1',
    name: 'Марина Колосова',
    avatarUrl: creativePortrait,
  },
  'author-2': {
    id: 'author-2',
    name: 'Алексей Дёмин',
    avatarUrl: streetStyle,
  },
  'author-3': {
    id: 'author-3',
    name: 'Студия PlanLab',
    avatarUrl: strategyWorkshop,
  },
  'author-4': {
    id: 'author-4',
    name: 'Дмитрий Лесной',
  },
}

// Все фотографии с расширенными данными
const allPhotos: Photo[] = [
  {
    id: 'photo-1',
    title: 'Горное утро',
    description:
      'Спокойное озеро в горах на рассвете. Идеально подходит для пейзажных коллекций и природных тем.',
    category: 'Природа',
    imageUrl: alpineLake,
    orientation: 'landscape',
    tags: ['озеро', 'рассвет', 'горы', 'природа', 'пейзаж'],
    price: 1500,
    licenseTypes: commercialLicenses,
    author: authors['author-1'],
    dimensions: { width: 4000, height: 2667 },
    uploadedAt: '2024-12-15T10:30:00Z',
    views: 1245,
    downloads: 23,
  },
  {
    id: 'photo-2',
    title: 'Вершины над облаками',
    description:
      'Панорамный вид на горные вершины, возвышающиеся над облаками. Захватывающий дух пейзаж.',
    category: 'Путешествия',
    imageUrl: valleyOverlook,
    orientation: 'portrait',
    tags: ['панорама', 'горы', 'облака', 'путешествия', 'высота'],
    price: 1800,
    licenseTypes: commercialLicenses,
    author: authors['author-1'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-10T14:20:00Z',
    views: 892,
    downloads: 15,
  },
  {
    id: 'photo-3',
    title: 'Террасы сверху',
    description:
      'Геометрические террасы, снятые с высоты птичьего полета. Абстрактные формы и ритмы.',
    category: 'Ландшафты',
    imageUrl: aerialLandscape,
    orientation: 'landscape',
    tags: ['вид сверху', 'геометрия', 'террасы', 'абстракция', 'ландшафт'],
    price: 2000,
    licenseTypes: [...editorialLicenses, ...commercialLicenses],
    author: authors['author-2'],
    dimensions: { width: 4000, height: 2667 },
    uploadedAt: '2024-12-08T09:15:00Z',
    views: 1567,
    downloads: 31,
  },
  {
    id: 'photo-4',
    title: 'Сияние Санторини',
    description:
      'Традиционные купола церквей Санторини на закате. Средиземноморская эстетика и тепло.',
    category: 'Город',
    imageUrl: santoriniSunset,
    orientation: 'portrait',
    tags: ['эгейские купола', 'сумерки', 'Санторини', 'архитектура', 'закат'],
    price: 2200,
    licenseTypes: commercialLicenses,
    author: authors['author-2'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-05T18:45:00Z',
    views: 2103,
    downloads: 42,
  },
  {
    id: 'photo-5',
    title: 'Световые арки',
    description:
      'Современная световая инсталляция в технологичном пространстве. Футуристическая эстетика.',
    category: 'Технологии',
    imageUrl: techInstallation,
    orientation: 'portrait',
    tags: ['неон', 'инсталляция', 'технологии', 'свет', 'современное искусство'],
    price: 1750,
    licenseTypes: commercialLicenses,
    author: authors['author-3'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-20T11:00:00Z',
    views: 987,
    downloads: 18,
  },
  {
    id: 'photo-6',
    title: 'План на неделю',
    description:
      'Минималистичный flatlay с планингом, канцелярией и растениями. Лайфстайл и продуктивность.',
    category: 'Лайфстайл',
    imageUrl: creativeDesk,
    orientation: 'portrait',
    tags: ['планирование', 'flatlay', 'минимализм', 'офис', 'продуктивность'],
    price: 1400,
    licenseTypes: [...editorialLicenses, ...commercialLicenses],
    author: authors['author-1'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-18T16:30:00Z',
    views: 1456,
    downloads: 28,
  },
  {
    id: 'photo-7',
    title: 'Галоп свободы',
    description:
      'Динамичный кадр коня в движении. Энергия, движение и природная сила.',
    category: 'Животные',
    imageUrl: wildlifeStallion,
    orientation: 'portrait',
    tags: ['конь', 'динамика', 'животные', 'природа', 'движение'],
    price: 1900,
    licenseTypes: commercialLicenses,
    author: authors['author-4'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-12T13:20:00Z',
    views: 1123,
    downloads: 21,
  },
  {
    id: 'photo-8',
    title: 'Командный брифинг',
    description:
      'Деловое совещание в современном офисе. Бизнес, команда и сотрудничество.',
    category: 'Люди',
    imageUrl: strategyWorkshop,
    orientation: 'portrait',
    tags: ['совещание', 'команда', 'бизнес', 'офис', 'люди'],
    price: 2100,
    licenseTypes: [...editorialLicenses, ...commercialLicenses],
    author: authors['author-3'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-07T10:10:00Z',
    views: 1345,
    downloads: 35,
  },
  {
    id: 'photo-9',
    title: 'Туманная тропа',
    description:
      'Загадочная лесная тропа в утреннем тумане. Атмосфера и настроение.',
    category: 'Природа',
    imageUrl: dawnTrails,
    orientation: 'portrait',
    tags: ['лес', 'утро', 'туман', 'тропа', 'природа'],
    price: 1600,
    licenseTypes: commercialLicenses,
    author: authors['author-1'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-14T07:30:00Z',
    views: 1023,
    downloads: 19,
  },
  {
    id: 'photo-10',
    title: 'Огни большого города',
    description:
      'Ночной пейзаж мегаполиса с огнями небоскребов. Урбанистическая эстетика.',
    category: 'Город',
    imageUrl: skylineOverlook,
    orientation: 'portrait',
    tags: ['ночь', 'урбанистика', 'город', 'небоскребы', 'свет'],
    price: 2300,
    licenseTypes: commercialLicenses,
    author: authors['author-2'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-12-03T20:00:00Z',
    views: 1789,
    downloads: 38,
  },
  {
    id: 'photo-11',
    title: 'Промышленная сетка',
    description:
      'Геометрические формы промышленной архитектуры. Минимализм и структура.',
    category: 'Город',
    imageUrl: industrialGrid,
    orientation: 'landscape',
    tags: ['промышленность', 'геометрия', 'архитектура', 'структура', 'город'],
    price: 1700,
    licenseTypes: [...editorialLicenses, ...commercialLicenses],
    author: authors['author-2'],
    dimensions: { width: 4000, height: 2667 },
    uploadedAt: '2024-12-01T15:45:00Z',
    views: 923,
    downloads: 16,
  },
  {
    id: 'photo-12',
    title: 'Урбан лаборатория',
    description:
      'Современное городское пространство с элементами уличного искусства и архитектуры.',
    category: 'Город',
    imageUrl: urbanLab,
    orientation: 'landscape',
    tags: ['город', 'уличное искусство', 'современное', 'архитектура', 'креатив'],
    price: 1850,
    licenseTypes: commercialLicenses,
    author: authors['author-3'],
    dimensions: { width: 4000, height: 2667 },
    uploadedAt: '2024-11-28T12:20:00Z',
    views: 1156,
    downloads: 24,
  },
  {
    id: 'photo-13',
    title: 'Уличный стиль',
    description:
      'Живая уличная фотография с людьми. Документальный стиль и аутентичность.',
    category: 'Люди',
    imageUrl: streetStyle,
    orientation: 'square',
    tags: ['улица', 'люди', 'документальная', 'реальность', 'город'],
    price: 1550,
    licenseTypes: editorialLicenses,
    author: authors['author-2'],
    dimensions: { width: 3000, height: 3000 },
    uploadedAt: '2024-11-25T14:00:00Z',
    views: 856,
    downloads: 12,
  },
  {
    id: 'photo-14',
    title: 'Портрет творца',
    description:
      'Портретная фотография в естественном свете. Чистота и глубина образа.',
    category: 'Люди',
    imageUrl: creativePortrait,
    orientation: 'portrait',
    tags: ['портрет', 'люди', 'естественный свет', 'профиль', 'творчество'],
    price: 1950,
    licenseTypes: [...editorialLicenses, ...commercialLicenses],
    author: authors['author-1'],
    dimensions: { width: 2667, height: 4000 },
    uploadedAt: '2024-11-22T11:30:00Z',
    views: 1432,
    downloads: 29,
  },
]

// Функции для работы с данными (подготовка к API)

export function filterPhotos(filters: PhotoFilters): Photo[] {
  let filtered = [...allPhotos]

  if (filters.category) {
    filtered = filtered.filter((photo) => photo.category === filters.category)
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(
      (photo) =>
        photo.title.toLowerCase().includes(searchLower) ||
        photo.description?.toLowerCase().includes(searchLower) ||
        photo.tags.some((tag) => tag.toLowerCase().includes(searchLower))
    )
  }

  if (filters.orientation) {
    filtered = filtered.filter((photo) => photo.orientation === filters.orientation)
  }

  if (filters.minPrice !== undefined) {
    filtered = filtered.filter((photo) => photo.price >= filters.minPrice!)
  }

  if (filters.maxPrice !== undefined) {
    filtered = filtered.filter((photo) => photo.price <= filters.maxPrice!)
  }

  return filtered
}

export function getPhotoById(id: string): Photo | undefined {
  return allPhotos.find((photo) => photo.id === id)
}

export function getSimilarPhotos(
  photoId: string,
  category: string,
  limit: number = 6
): Photo[] {
  const photo = getPhotoById(photoId)
  if (!photo) return []

  return allPhotos
    .filter((p) => p.id !== photoId && (p.category === category || p.tags.some((tag) => photo.tags.includes(tag))))
    .slice(0, limit)
}

export function paginatePhotos(
  photos: Photo[],
  page: number = 1,
  limit: number = 12
): PhotoListResponse {
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPhotos = photos.slice(startIndex, endIndex)

  return {
    photos: paginatedPhotos,
    total: photos.length,
    page,
    limit,
    hasMore: endIndex < photos.length,
  }
}

// Экспорт всех фото для использования в компонентах
export { allPhotos }

