const getBaseUrl = () => {
  // В разработке используем относительные пути, которые проксируются Vite
  return '/api'
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

  // Токен будем добавлять на этапе В (Auth)
  const token = localStorage.getItem('access_token')
  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw {
      status: response.status,
      message: errorData.message || 'Произошла ошибка при запросе к API',
      data: errorData
    }
  }

  // Если это DELETE или пустой ответ
  if (response.status === 204) return {} as T

  return response.json()
}
