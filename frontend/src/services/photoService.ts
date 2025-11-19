import type { Photo, PhotoFilters, PhotoListResponse } from '../data/photos'
import { filterPhotos, getPhotoById, getSimilarPhotos as getSimilarPhotosData, paginatePhotos } from '../data/photos'

// Интерфейсы для API (готовность к интеграции с бэкендом)
export interface ApiPhotoParams {
  category?: string
  search?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  min_price?: number
  max_price?: number
  page?: number
  limit?: number
}

export interface ApiPhotoResponse {
  photos: Photo[]
  total: number
  page: number
  limit: number
  has_more: boolean
}

// Симуляция задержки API
const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

/**
 * Получить список фотографий с фильтрами и пагинацией
 * @param params - Параметры фильтрации и пагинации
 * @returns Promise с ответом API
 */
export async function getPhotos(params: ApiPhotoParams = {}): Promise<PhotoListResponse> {
  await delay(300) // Симуляция сетевой задержки

  // Преобразуем параметры API в формат для фильтрации
  const filters: PhotoFilters = {
    category: params.category,
    search: params.search,
    orientation: params.orientation,
    minPrice: params.min_price,
    maxPrice: params.max_price,
  }

  const page = params.page || 1
  const limit = params.limit || 12

  // Фильтруем фото
  const filtered = filterPhotos(filters)

  // Пагинируем результат
  return paginatePhotos(filtered, page, limit)
}

/**
 * Получить детальную информацию о фотографии
 * @param id - ID фотографии
 * @returns Promise с данными фотографии или null
 */
export async function getPhoto(id: string): Promise<Photo | null> {
  await delay(200)

  const photo = getPhotoById(id)
  return photo || null
}

/**
 * Получить похожие фотографии
 * @param id - ID фотографии
 * @param category - Категория для поиска похожих
 * @param limit - Максимальное количество похожих фото
 * @returns Promise со списком похожих фотографий
 */
export async function getSimilarPhotos(
  id: string,
  category: string,
  limit: number = 6
): Promise<Photo[]> {
  await delay(250)

  return getSimilarPhotosData(id, category, limit)
}

/**
 * Преобразовать параметры из URL query в формат API
 */
export function paramsFromQuery(query: Record<string, any>): ApiPhotoParams {
  const params: ApiPhotoParams = {}

  const category = query.category
  if (category && typeof category === 'string') {
    params.category = category
  }

  const search = query.search
  if (search && typeof search === 'string') {
    params.search = search
  }

  const orientation = query.orientation
  if (orientation && typeof orientation === 'string') {
    if (['landscape', 'portrait', 'square'].includes(orientation)) {
      params.orientation = orientation as 'landscape' | 'portrait' | 'square'
    }
  }

  const minPrice = query.min_price
  if (minPrice && typeof minPrice === 'string') {
    const parsed = parseInt(minPrice, 10)
    if (!isNaN(parsed)) {
      params.min_price = parsed
    }
  }

  const maxPrice = query.max_price
  if (maxPrice && typeof maxPrice === 'string') {
    const parsed = parseInt(maxPrice, 10)
    if (!isNaN(parsed)) {
      params.max_price = parsed
    }
  }

  const page = query.page
  if (page && typeof page === 'string') {
    const parsed = parseInt(page, 10)
    if (!isNaN(parsed) && parsed > 0) {
      params.page = parsed
    }
  }

  const limit = query.limit
  if (limit && typeof limit === 'string') {
    const parsed = parseInt(limit, 10)
    if (!isNaN(parsed) && parsed > 0) {
      params.limit = parsed
    }
  }

  return params
}

/**
 * Преобразовать параметры API в URL query строку
 */
export function paramsToQuery(params: ApiPhotoParams): string {
  const queryParams = new URLSearchParams()

  if (params.category) queryParams.set('category', params.category)
  if (params.search) queryParams.set('search', params.search)
  if (params.orientation) queryParams.set('orientation', params.orientation)
  if (params.min_price !== undefined) queryParams.set('min_price', params.min_price.toString())
  if (params.max_price !== undefined) queryParams.set('max_price', params.max_price.toString())
  if (params.page && params.page > 1) queryParams.set('page', params.page.toString())
  if (params.limit && params.limit !== 12) queryParams.set('limit', params.limit.toString())

  return queryParams.toString()
}

