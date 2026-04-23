import { apiFetch } from '../api/http'
import type { ShowcasePayload } from '../types/showcase'

export type { ShowcasePayload } from '../types/showcase'

export async function fetchShowcase(): Promise<ShowcasePayload> {
  return apiFetch<ShowcasePayload>('/showcase/')
}

export async function fetchCategoryList() {
  return apiFetch<{ id: number; name: string; slug: string }[]>('/categories/')
}
