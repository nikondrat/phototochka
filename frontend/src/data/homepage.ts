export interface PhotoCard {
  id: string
  title: string
  category: string
  imageUrl: string
  orientation: 'landscape' | 'portrait'
  tags?: string[]
  price?: string
}

export interface AuthorCard {
  id: string
  name: string
  specialty: string
  avatarUrl: string
  photosCount: number
  rating: number
}

export interface BenefitItem {
  id: string
  title: string
  description: string
}

const unsplash = (id: string, width = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`

export const popularPhotos: PhotoCard[] = [
  {
    id: 'popular-1',
    title: 'Гордость леса',
    category: 'Природа',
    orientation: 'portrait',
    imageUrl: unsplash('photo-1500534314209-a25ddb2bd429', 640),
    tags: ['лес', 'рассвет'],
  },
  {
    id: 'popular-2',
    title: 'Городские линии',
    category: 'Город',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1469474968028-56623f02e42e'),
    tags: ['архитектура', 'ночь'],
  },
  {
    id: 'popular-3',
    title: 'Свежий взгляд',
    category: 'Люди',
    orientation: 'portrait',
    imageUrl: unsplash('photo-1521572267360-ee0c2909d518', 640),
    tags: ['портрет', 'естественный свет'],
  },
  {
    id: 'popular-4',
    title: 'Неоновые идеи',
    category: 'Технологии',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1518770660439-4636190af475'),
    tags: ['гаджеты', 'инновации'],
  },
]

export const newPhotos: PhotoCard[] = [
  {
    id: 'new-1',
    title: 'Сочные цитрусы',
    category: 'Еда и напитки',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1498837167922-ddd27525d352'),
    tags: ['кулинария', 'студия'],
  },
  {
    id: 'new-2',
    title: 'Городской шторм',
    category: 'Город',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1505739773366-8732e854ad81'),
    tags: ['архитектура', 'дождь'],
  },
  {
    id: 'new-3',
    title: 'Этюд в розовых тонах',
    category: 'Абстракции',
    orientation: 'portrait',
    imageUrl: unsplash('photo-1526498460520-4c246339dccb', 640),
    tags: ['паттерн', 'микро'],
  },
  {
    id: 'new-4',
    title: 'Утренний кофе',
    category: 'Еда и напитки',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1495474472287-4d71bcdd2085'),
    tags: ['напитки', 'атмосфера'],
  },
  {
    id: 'new-5',
    title: 'В горном тумане',
    category: 'Природа',
    orientation: 'landscape',
    imageUrl: unsplash('photo-1500530855697-b586d89ba3ee'),
    tags: ['горы', 'туман'],
  },
  {
    id: 'new-6',
    title: 'Мощь технологий',
    category: 'Технологии',
    orientation: 'portrait',
    imageUrl: unsplash('photo-1517048676732-d65bc937f952', 640),
    tags: ['компьютеры', 'свет'],
  },
]

export const categories = [
  'Природа',
  'Животные',
  'Люди',
  'Город',
  'Еда и напитки',
  'Технологии',
  'Абстракции',
]

export const authors: AuthorCard[] = [
  {
    id: 'author-1',
    name: 'Анна Соколова',
    specialty: 'Природа и путешествия',
    avatarUrl: unsplash('photo-1524504388940-b1c1722653e1', 320),
    photosCount: 128,
    rating: 4.9,
  },
  {
    id: 'author-2',
    name: 'Илья Комаров',
    specialty: 'Город и архитектура',
    avatarUrl: unsplash('photo-1544723795-3fb6469f5b39', 320),
    photosCount: 96,
    rating: 4.8,
  },
  {
    id: 'author-3',
    name: 'Мария Ветрова',
    specialty: 'Портреты и репортаж',
    avatarUrl: unsplash('photo-1521572163474-6864f9cf17ab', 320),
    photosCount: 142,
    rating: 4.7,
  },
]

export const benefits: BenefitItem[] = [
  {
    id: 'benefit-1',
    title: 'Прозрачные лицензии',
    description:
      'Понятные типы лицензий и рекомендации по коммерческому использованию контента.',
  },
  {
    id: 'benefit-2',
    title: 'Имитация платежей',
    description:
      'Безопасное тестирование сценариев покупок — без привязки реальных платежных систем.',
  },
  {
    id: 'benefit-3',
    title: 'Хранение в облаке',
    description:
      'Быстрая загрузка изображений, оптимизация качества и защита авторских прав.',
  },
]
