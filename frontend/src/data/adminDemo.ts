/**
 * Статичные демо-данные для экранов админки (не прод-путь витрины).
 */
import alpineLake from '../assets/images/alpine-lake.jpg'
import aerialLandscape from '../assets/images/aerial-landscape.jpg'
import creativeDesk from '../assets/images/creative-desk.jpg'
import creativePortrait from '../assets/images/creative-portrait-1.jpg'
import dawnTrails from '../assets/images/dawn-trails.jpg'
import santoriniSunset from '../assets/images/santorini-sunset.jpg'
import skylineOverlook from '../assets/images/skyline-overlook.jpg'
import strategyWorkshop from '../assets/images/strategy-workshop.jpg'
import streetStyle from '../assets/images/street-style.jpg'
import techInstallation from '../assets/images/tech-installation.jpg'
import valleyOverlook from '../assets/images/valley-overlook.jpg'
import wildlifeStallion from '../assets/images/wildlife-stallion.jpg'
import type { AuthorCard, ShowcasePhotoCard } from '../types/showcase'

export const popularPhotos: ShowcasePhotoCard[] = [
  {
    id: 'popular-1',
    publicId: 'popular-1',
    title: 'Горное утро',
    category: 'Природа',
    orientation: 'landscape',
    imageUrl: alpineLake,
    tags: ['озеро', 'рассвет'],
  },
  {
    id: 'popular-2',
    publicId: 'popular-2',
    title: 'Вершины над облаками',
    category: 'Путешествия',
    orientation: 'portrait',
    imageUrl: valleyOverlook,
    tags: ['панорама', 'горы'],
  },
  {
    id: 'popular-3',
    publicId: 'popular-3',
    title: 'Террасы сверху',
    category: 'Ландшафты',
    orientation: 'landscape',
    imageUrl: aerialLandscape,
    tags: ['вид сверху', 'геометрия'],
  },
  {
    id: 'popular-4',
    publicId: 'popular-4',
    title: 'Сияние Санторини',
    category: 'Город',
    orientation: 'portrait',
    imageUrl: santoriniSunset,
    tags: ['эгейские купола', 'сумерки'],
  },
]

export const newPhotos: ShowcasePhotoCard[] = [
  {
    id: 'new-1',
    publicId: 'new-1',
    title: 'Световые арки',
    category: 'Технологии',
    orientation: 'portrait',
    imageUrl: techInstallation,
    tags: ['неон', 'инсталляция'],
  },
  {
    id: 'new-2',
    publicId: 'new-2',
    title: 'План на неделю',
    category: 'Лайфстайл',
    orientation: 'portrait',
    imageUrl: creativeDesk,
    tags: ['планирование', 'flatlay'],
  },
  {
    id: 'new-3',
    publicId: 'new-3',
    title: 'Галоп свободы',
    category: 'Животные',
    orientation: 'portrait',
    imageUrl: wildlifeStallion,
    tags: ['конь', 'динамика'],
  },
  {
    id: 'new-4',
    publicId: 'new-4',
    title: 'Командный брифинг',
    category: 'Люди',
    orientation: 'portrait',
    imageUrl: strategyWorkshop,
    tags: ['совещание', 'команда'],
  },
  {
    id: 'new-5',
    publicId: 'new-5',
    title: 'Туманная тропа',
    category: 'Природа',
    orientation: 'portrait',
    imageUrl: dawnTrails,
    tags: ['лес', 'утро'],
  },
  {
    id: 'new-6',
    publicId: 'new-6',
    title: 'Огни большого города',
    category: 'Город',
    orientation: 'portrait',
    imageUrl: skylineOverlook,
    tags: ['ночь', 'урбанистика'],
  },
]

export const adminCategoryNames = [
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
    name: 'Марина Колосова',
    specialty: 'Портреты и lifestyle',
    avatarUrl: creativePortrait,
    photosCount: 128,
    rating: 4.9,
  },
  {
    id: 'author-2',
    name: 'Алексей Дёмин',
    specialty: 'Уличная фотография',
    avatarUrl: streetStyle,
    photosCount: 96,
    rating: 4.8,
  },
  {
    id: 'author-3',
    name: 'Студия PlanLab',
    specialty: 'Командные репортажи',
    avatarUrl: strategyWorkshop,
    photosCount: 74,
    rating: 4.8,
  },
]
