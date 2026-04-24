const getBaseUrl = () => {
  const raw = import.meta.env.VITE_API_BASE_PATH
  if (typeof raw === 'string' && raw.trim() !== '') {
    return raw.replace(/\/+$/, '')
  }
  return '/api'
}

let isRefreshing = false
let refreshSubscribers: { resolve: (token: string) => void; reject: (err: any) => void }[] = []

const subscribeTokenRefresh = (resolve: (token: string) => void, reject: (err: any) => void) => {
  refreshSubscribers.push({ resolve, reject })
}

const onRefreshed = (token: string) => {
  refreshSubscribers.forEach((sub) => sub.resolve(token))
  refreshSubscribers = []
}

const onRefreshError = (err: any) => {
  refreshSubscribers.forEach((sub) => sub.reject(err))
  refreshSubscribers = []
}

export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = endpoint.startsWith('http') 
    ? endpoint 
    : `${getBaseUrl()}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`

  const headers = new Headers(options.headers || {})
  
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json')
  }
  
  if (options.body && !(options.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const lang = localStorage.getItem('ft_lang') || 'ru'
  headers.set('Accept-Language', lang)

  const token = localStorage.getItem('access_token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  // Handle Token Refresh
  if (response.status === 401 && localStorage.getItem('refresh_token') && !endpoint.includes('/auth/token/')) {
    if (!isRefreshing) {
      isRefreshing = true
      const refreshToken = localStorage.getItem('refresh_token')
      
      try {
        const refreshRes = await fetch(`${getBaseUrl()}/auth/token/refresh/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh: refreshToken }),
        })

        if (refreshRes.ok) {
          const { access } = await refreshRes.json()
          localStorage.setItem('access_token', access)
          isRefreshing = false
          onRefreshed(access)
        } else {
          // Refresh failed
          localStorage.removeItem('access_token')
          localStorage.removeItem('refresh_token')
          localStorage.removeItem('fototochka_user')
          isRefreshing = false
          const err = new Error('Session expired')
          onRefreshError(err)
          window.location.href = '/login'
          throw err
        }
      } catch (err) {
        isRefreshing = false
        onRefreshError(err)
        throw err
      }
    }

    return new Promise((resolve, reject) => {
      subscribeTokenRefresh(
        (token) => {
          headers.set('Authorization', `Bearer ${token}`)
          resolve(apiFetch(endpoint, options))
        },
        (err) => {
          reject(err)
        }
      )
    })
  }

  if (!response.ok) {
    const errorData = (await response.json().catch(() => ({}))) as Record<string, unknown>
    const detail = errorData.detail
    const msgFromDetail =
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail) && detail[0]
          ? String(detail[0])
          : typeof errorData.message === 'string'
            ? errorData.message
            : 'Произошла ошибка при запросе к API'
    throw {
      status: response.status,
      message: msgFromDetail,
      data: errorData
    }
  }

  if (response.status === 204) return {} as T

  return response.json()
}
