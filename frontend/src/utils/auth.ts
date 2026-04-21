export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'author'
}

const STORAGE_KEY = 'fototochka_auth'

const demoEmail = () => import.meta.env.VITE_DEMO_ADMIN_EMAIL?.trim() ?? ''
const demoPassword = () => import.meta.env.VITE_DEMO_ADMIN_PASSWORD?.trim() ?? ''
const demoDisplayName = () =>
  import.meta.env.VITE_DEMO_ADMIN_DISPLAY_NAME?.trim() || 'Администратор'

export const auth = {
  login(email: string, password: string): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const expectedEmail = demoEmail()
        const expectedPassword = demoPassword()

        if (!expectedEmail || !expectedPassword) {
          reject(
            new Error(
              'Демо-вход не настроен: задайте VITE_DEMO_ADMIN_EMAIL и VITE_DEMO_ADMIN_PASSWORD в .env (см. .env.example)',
            ),
          )
          return
        }

        if (email === expectedEmail && password === expectedPassword) {
          const user: User = {
            id: '1',
            email: expectedEmail,
            name: demoDisplayName(),
            role: 'admin',
          }
          localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
          resolve(user)
        } else {
          reject(new Error('Неверный email или пароль'))
        }
      }, 500)
    })
  },

  logout(): void {
    localStorage.removeItem(STORAGE_KEY)
  },

  getCurrentUser(): User | null {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return null
    try {
      return JSON.parse(stored) as User
    } catch {
      return null
    }
  },

  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null
  },

  isAdmin(): boolean {
    const user = this.getCurrentUser()
    return user?.role === 'admin'
  },
}

