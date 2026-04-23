import { apiFetch } from '../api/http'
import type { Photo, PhotoListResponse } from '../data/photos'

export interface ApiPhotoParams {
  category?: string
  search?: string
  orientation?: 'landscape' | 'portrait' | 'square'
  min_price?: number
  max_price?: number
  page?: number
  limit?: number
}

/**
 * Получить список фотографий с фильтрами и пагинацией
 */
export async function getPhotos(params: ApiPhotoParams = {}): Promise<PhotoListResponse> {
  const query = new URLSearchParams()
  
  if (params.category) query.set('category__slug', params.category)
  if (params.search) query.set('search', params.search)
  if (params.orientation) query.set('orientation', params.orientation)
  if (params.page) query.set('page', params.page.toString())
  if (params.limit) query.set('limit', params.limit.toString())

  const data = await apiFetch<any>(`/photos/?${query.toString()}`)
  
  // Маппинг DRF пагинации в формат фронтенда
  return {
    photos: data.results,
    total: data.count,
    page: params.page || 1,
    limit: params.limit || 12,
    hasMore: !!data.next
  }
}

/**
 * Получить детальную информацию о фотографии
 */
export async function getPhoto(publicId: string): Promise<Photo | null> {
  try {
    return await apiFetch<Photo>(`/photos/${publicId}/`)
  } catch (error: any) {
    if (error.status === 404) return null
    throw error
  }
}

/**
 * Получить похожие фотографии
 */
export async function getSimilarPhotos(
  publicId: string,
  category: string,
  limit: number = 6
): Promise<Photo[]> {
  // Пока бэкенд не имеет отдельного эндпоинта для похожих, 
  // используем фильтрацию по категории
  const data = await getPhotos({ category, limit })
  return data.photos
    .filter((p) => (p.publicId ?? p.id) !== publicId)
    .slice(0, limit)
}

// Утилиты для параметров остаются прежними
export function paramsFromQuery(query: Record<string, any>): ApiPhotoParams {
  const params: ApiPhotoParams = {}
  if (query.category) params.category = String(query.category)
  if (query.search) params.search = String(query.search)
  if (query.orientation) params.orientation = query.orientation as any
  if (query.page) params.page = parseInt(String(query.page), 10)
  return params
}

export function paramsToQuery(params: ApiPhotoParams): string {
  const q = new URLSearchParams()
  if (params.category) q.set('category', params.category)
  if (params.search) q.set('search', params.search)
  if (params.orientation) q.set('orientation', params.orientation)
  if (params.page && params.page > 1) q.set('page', params.page.toString())
  return q.toString()
}
