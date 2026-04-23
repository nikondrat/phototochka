import { apiFetch } from '../api/http'

/** Ответ GET/POST /api/author/photos/ (camelCase). */
export interface AuthorPhotoApi {
  id: string
  publicId: string
  title: string
  category: string
  imageUrl: string
  imageWebp?: string | null
  imageAvif?: string | null
  blurHash?: string | null
  views: number
  downloads: number
  price: number
  tags: string[]
  uploadedAt: string
}

export async function fetchAuthorPhotos(): Promise<AuthorPhotoApi[]> {
  return apiFetch<AuthorPhotoApi[]>('/author/photos/')
}

export interface UploadAuthorPhotoInput {
  title: string
  description: string
  categorySlug: string
  price: number
  tags: string[]
  file: File
  blurHash?: string
}

/** POST /api/author/photos/ (multipart). */
export async function uploadAuthorPhoto(
  input: UploadAuthorPhotoInput
): Promise<AuthorPhotoApi> {
  const form = new FormData()
  form.set('title', input.title)
  form.set('description', input.description)
  form.set('category_slug', input.categorySlug)
  form.set('price', String(input.price))
  form.set('tags', input.tags.length ? input.tags.join(',') : '')
  form.set('license_types', JSON.stringify(['personal', 'commercial']))
  form.set('image', input.file, input.file.name)
  if (input.blurHash) {
    form.set('blur_hash', input.blurHash)
  }
  return apiFetch<AuthorPhotoApi>('/author/photos/', { method: 'POST', body: form })
}

function formatDay(iso: string): string {
  try {
    return new Date(iso).toISOString().slice(0, 10)
  } catch {
    return ''
  }
}

/** Формат для `PhotoCard` в кабинете автора. */
export function mapAuthorPhotoToCard(p: AuthorPhotoApi) {
  return {
    id: p.publicId,
    title: p.title,
    category: p.category,
    imageUrl: p.imageUrl,
    imageWebp: p.imageWebp,
    imageAvif: p.imageAvif,
    blurHash: p.blurHash,
    views: p.views ?? 0,
    downloads: p.downloads ?? 0,
    earnings: p.price ?? 0,
    status: 'published' as const,
    uploadedAt: formatDay(p.uploadedAt),
    tags: p.tags ?? [],
  }
}
