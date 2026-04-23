import { apiFetch } from '../api/http'

export interface User {
  id: string | number
  email: string
  displayName: string
  role: 'admin' | 'buyer' | 'author'
  avatar?: string | null
  username?: string
}

export interface RegisterInput {
  email: string
  password: string
  displayName: string
}

interface TokenPair {
  access: string
  refresh: string
}

interface RegisterResponse extends TokenPair {
  user: User
}

const USER_STORAGE_KEY = 'fototochka_user'
const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const auth = {
  async login(identifier: string, password: string): Promise<User> {
    const data = await apiFetch<TokenPair>('/auth/token/', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    })

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)

    return await this.fetchMe()
  },

  async register(input: RegisterInput): Promise<User> {
    const data = await apiFetch<RegisterResponse>('/auth/register/', {
      method: 'POST',
      body: JSON.stringify({
        email: input.email,
        password: input.password,
        displayName: input.displayName,
      }),
    })

    localStorage.setItem(ACCESS_TOKEN_KEY, data.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(data.user))
    return data.user
  },

  async fetchMe(): Promise<User> {
    const user = await apiFetch<User>('/auth/me/')
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user))
    return user
  },

  logout(): void {
    localStorage.removeItem(USER_STORAGE_KEY)
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(USER_STORAGE_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return localStorage.getItem(ACCESS_TOKEN_KEY) !== null
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  },
}
