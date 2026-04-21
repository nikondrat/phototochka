import { apiFetch } from '../api/http'

export interface AdminStats {
  totalPhotos: number
  totalAuthors: number
  totalViews: number
  totalSales: number
  revenue: number
  recentActivity: any[]
}

export const adminService = {
  async getStats(): Promise<AdminStats> {
    return await apiFetch<AdminStats>('/admin/stats/')
  },

  async getPhotos(page = 1): Promise<any> {
    return await apiFetch(`/admin/photos/?page=${page}`)
  },

  async getAuthors(): Promise<any> {
    return await apiFetch('/admin/authors/')
  },

  async getCategories(): Promise<any> {
    return await apiFetch('/admin/categories/')
  }
}
