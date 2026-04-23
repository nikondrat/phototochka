/** Витрина главной: согласовано с GET /api/showcase/ (camelCase). */

export interface ShowcasePhotoCard {
  /** Дублирует publicId там, где ожидается устаревшее поле id (например админ-макеты). */
  id?: string
  /** publicId — стабильный ключ и сегмент URL. */
  publicId: string
  title: string
  category: string
  imageUrl: string
  orientation: 'landscape' | 'portrait' | 'square'
  tags?: string[]
  price?: number
}

export interface CategoryItem {
  id: number
  name: string
  slug: string
}

export interface AuthorCard {
  id: string
  name: string
  specialty: string
  avatarUrl: string | null
  photosCount: number
  rating: number
}

export interface BenefitItem {
  id: string
  title: string
  description: string
}

export interface ShowcasePayload {
  heroPhotos: ShowcasePhotoCard[]
  newPhotos: ShowcasePhotoCard[]
  categories: CategoryItem[]
  authors: AuthorCard[]
  benefits: BenefitItem[]
}
