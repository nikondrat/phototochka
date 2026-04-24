import { apiFetch } from '../api/http'

export interface BlogPost {
  id: number
  title: string
  slug: string
  content: string
  coverImage: string | null
  author: {
    id: string
    displayName: string
    avatar: string | null
  }
  createdAt: string
  updatedAt: string
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await apiFetch<any>('/blog/posts/')
  return data.results || data
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  return await apiFetch<BlogPost>(`/blog/posts/${slug}/`)
}
