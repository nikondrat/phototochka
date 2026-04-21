const getBaseUrl = () => {
  return '/api'
}

let isRefreshing = false
let refreshSubscribers: ((token: string) => void)[] = []

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb)
}

const onRefreshed = (token: string) => {
  refreshSubscribers.map((cb) => cb(token))
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
          window.location.href = '/login'
          throw new Error('Session expired')
        }
      } catch (err) {
        isRefreshing = false
        throw err
      }
    }

    return new Promise((resolve) => {
      subscribeTokenRefresh((token) => {
        headers.set('Authorization', `Bearer ${token}`)
        resolve(fetch(url, { ...options, headers }).then(res => res.json()))
      })
    })
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      message: errorData.message || 'Произошла ошибка при запросе к API',
      data: errorData
    }
  }

  if (response.status === 204) return {} as T

  return response.json()
}
